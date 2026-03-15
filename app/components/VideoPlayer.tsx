"use client";

import Link from "next/link";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { cls, getSubtitleUrl, getVideoUrl } from "../utils/libs";
import type { WatchContentContextResponse } from "@/app/(tabs)/watch/[id]/schema";
import type { SeriesPersonalizedResponse } from "@/app/(tabs)/series/[id]/schema";
import { updateWatchRecord } from "../(tabs)/watch/[id]/action";

type WatchVideoContent = WatchContentContextResponse["data"];
type SeriesSeason = SeriesPersonalizedResponse["data"]["seasons"][number];

interface VideoPlayerProps {
  goBackLink: string;
  watchContent: WatchVideoContent;
  seriesSeasons?: SeriesSeason[];
}

export default function VideoPlayer({
  goBackLink,
  watchContent,
  seriesSeasons,
}: VideoPlayerProps) {
  const [, startWatchProgressSyncTransition] = useTransition();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const contentNavigatorRef = useRef<HTMLDivElement | null>(null);
  const [isHover, setIsHover] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedSeasonIndex, setSelectedSeasonIndex] = useState(0);

  const [showContentNavigator, setShowContentNavigator] = useState(false);

  const onMouseMove = () => {
    setIsHover(true);
    setTimeout(() => setIsHover(false), 3000);
  };

  const canRequestWatchProgressSync = useCallback(() => {
    const video = videoRef.current;
    const videoContentId = watchContent.videoContent.id;

    if (!video) {
      return false;
    }

    if (video.paused) {
      return false;
    }

    if (videoContentId === null) {
      return false;
    }

    if (!Number.isFinite(video.currentTime)) {
      return false;
    }

    if (!Number.isFinite(video.duration)) {
      return false;
    }

    return true;
  }, [watchContent.videoContent.id]);

  const tryRequestWatchProgressSync = useCallback(() => {
    if (!canRequestWatchProgressSync()) {
      return;
    }

    const video = videoRef.current;
    const videoContentId = watchContent.videoContent.id;

    if (!video) {
      return;
    }

    if (videoContentId === null) {
      return;
    }

    startWatchProgressSyncTransition(() => {
      void updateWatchRecord({
        videoContentId,
        currentTime: video.currentTime,
        duration: video.duration,
      }).catch((error) => {
        console.error(error);
      });
    });
  }, [
    canRequestWatchProgressSync,
    startWatchProgressSyncTransition,
    watchContent.videoContent.id,
  ]);

  const handleNextEpisodeClick = () => {
    void tryRequestWatchProgressSync();
  };

  useEffect(() => {
    if (!seriesSeasons?.length) {
      setSelectedSeasonIndex(0);
      return;
    }

    const currentSeasonId = watchContent.videoContent.season?.id;
    const currentSeasonIndex = seriesSeasons.findIndex(
      (season) => season.id === currentSeasonId,
    );

    setSelectedSeasonIndex(currentSeasonIndex >= 0 ? currentSeasonIndex : 0);
  }, [seriesSeasons, watchContent.videoContent.season?.id]);

  const seasonEpisodes = watchContent.navigation?.seasonEpisodes ?? [];
  const selectedSeason =
    seriesSeasons && seriesSeasons.length > 0
      ? seriesSeasons[
          Math.min(
            Math.max(selectedSeasonIndex, 0),
            Math.max(seriesSeasons.length - 1, 0),
          )
        ]
      : null;
  const selectedSeasonEpisodes = selectedSeason?.episodes ?? [];
  const isCurrentSeasonSelected =
    selectedSeason &&
    watchContent.videoContent.season?.id !== null &&
    selectedSeason.id === watchContent.videoContent.season?.id;
  const hasSeasonSelector = Boolean(seriesSeasons && seriesSeasons.length > 1);
  const formatSeasonLabel = (
    season: { seasonNumber: number | null; name: string | null } | null,
    fallbackIndex?: number,
  ) => {
    const seasonNumber =
      typeof season?.seasonNumber === "number"
        ? season.seasonNumber
        : typeof fallbackIndex === "number"
          ? fallbackIndex + 1
          : null;
    const seasonNumberLabel =
      typeof seasonNumber === "number" ? `시즌 ${seasonNumber}` : null;
    const seasonName = season?.name?.trim() || null;

    if (seasonNumberLabel && seasonName) {
      if (seasonName === seasonNumberLabel) {
        return seasonNumberLabel;
      }

      return `${seasonNumberLabel} ${seasonName}`;
    }

    if (seasonNumberLabel) {
      return seasonNumberLabel;
    }

    if (seasonName) {
      return seasonName;
    }

    return "시즌";
  };
  const currentEpisodeNumber =
    watchContent.navigation?.currentEpisodeNumber ??
    watchContent.videoContent.episode?.episodeNumber ??
    null;
  const currentEpisode = seasonEpisodes.find(
    (episode) => episode.episodeNumber === currentEpisodeNumber,
  );
  const currentEpisodeDuration =
    watchContent.progress?.totalDuration &&
    watchContent.progress.totalDuration > 0
      ? watchContent.progress.totalDuration
      : currentEpisode?.runtime && currentEpisode.runtime > 0
        ? currentEpisode.runtime * 60
        : null;
  const currentEpisodeProgressRatio =
    typeof watchContent.progress?.currentTime === "number" &&
    currentEpisodeDuration &&
    currentEpisodeDuration > 0
      ? Math.min(watchContent.progress.currentTime / currentEpisodeDuration, 1)
      : 0;
  const completedEpisodeCount = seasonEpisodes.filter((episode) => {
    if (
      typeof episode.episodeNumber !== "number" ||
      typeof currentEpisodeNumber !== "number"
    ) {
      return false;
    }

    return episode.episodeNumber < currentEpisodeNumber;
  }).length;
  const seasonProgressPercent = selectedSeason?.userProgress
    ? Math.round(selectedSeason.userProgress.progressRatio * 100)
    : seasonEpisodes.length > 0
      ? Math.round(
          Math.min(
            ((completedEpisodeCount + currentEpisodeProgressRatio) * 100) /
              seasonEpisodes.length,
            100,
          ),
        )
      : 0;

  useEffect(() => {
    const video = videoRef.current;

    if (video) {
      const startCurrentTime = watchContent.progress?.currentTime;
      if (
        typeof startCurrentTime === "number" &&
        Number.isFinite(startCurrentTime)
      ) {
        video.currentTime = startCurrentTime;
      }

      video.volume = 0.25;

      // init
      const handleLoadedMetadata = () => {
        setDuration(video.duration);
      };

      const handleTimeUpdate = () => {
        setCurrentTime(video.currentTime);
      };

      video.addEventListener("loadedmetadata", handleLoadedMetadata);
      video.addEventListener("timeupdate", handleTimeUpdate);

      // 30초에 한번 watch에 관련된 함수 실행.
      const interval = setInterval(() => {
        void tryRequestWatchProgressSync();
      }, 1000 * 30);

      return () => {
        clearInterval(interval);
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
        video.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }
  }, [watchContent, tryRequestWatchProgressSync]);

  useEffect(() => {
    if (!showContentNavigator) {
      return;
    }

    const onDocumentMouseDown = (event: MouseEvent) => {
      if (
        contentNavigatorRef.current &&
        !contentNavigatorRef.current.contains(event.target as Node)
      ) {
        setShowContentNavigator(false);
      }
    };

    const autoCloseTimer = setTimeout(() => {
      setShowContentNavigator(false);
    }, 10000);

    document.addEventListener("mousedown", onDocumentMouseDown);

    return () => {
      clearTimeout(autoCloseTimer);
      document.removeEventListener("mousedown", onDocumentMouseDown);
    };
  }, [showContentNavigator]);

  /* Case.1 다음화 클릭시 현재 재생 정보 기록 */
  /* Case.2 영상을 모두 보았을 경우 다음 화로 넘어가게. -> 이것도  똑같이. */
  /* Case 3. 그럼 중간에  30초? 10 초정도 간격으로 업데이트 사항 업데이트 .. */

  return (
    <div
      className="group relative flex h-dvh w-full items-center"
      onMouseDown={onMouseMove}
    >
      <Link
        href={goBackLink}
        className={cls(
          "fixed top-10 left-8 z-40 transition-opacity group-hover:opacity-100",
          isHover ? "opacity-100" : "opacity-0",
        )}
      >
        <ArrowLeftIcon className="w-10" />
      </Link>
      <div className="relative flex max-h-9/12 w-full justify-center">
        <div className="flex w-full justify-center">
          <video
            ref={videoRef}
            crossOrigin="anonymous"
            className="aspect-video"
            controls
            autoPlay
          >
            {watchContent.videoContent.watchId ? (
              <source
                src={getVideoUrl(watchContent.videoContent.watchId)}
                type="video/mp4"
              />
            ) : null}
            <track
              default
              srcLang="한국어"
              src={getSubtitleUrl(watchContent.videoContent.subtitleId)}
            />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      <div
        className={cls(
          "fixed bottom-0 flex h-24 w-full items-center justify-center border-white/20 transition-opacity group-hover:opacity-100",
          isHover ? "opacity-100" : "opacity-0",
        )}
      >
        {/* TODO: 여기 부분 이후 설정.  */}
        {/*  <div className="absolute top-7 left-8 hidden flex-2">
          <UserGroupIcon className="size-7" />
          <SparklesIcon className="size-7" />
        </div> */}

        <div className="absolute -top-0 w-full border-t border-neutral-700">
          <span className="hidden">
            {currentTime} / {duration}
          </span>

          {/*  <input
            type="range"
            defaultValue={0}
            min={0}
            max={1000}
            className="bg-background w-full"
          /> */}
          {/*           <div className="absolute h-1 w-full bg-white/30"></div>
          <div className="absolute h-1 w-1/3 rounded-r-md bg-white"></div> */}
        </div>
        <div>
          <span>
            {watchContent.videoContent.season
              ? `${watchContent.videoContent.season.name ?? ""} ${watchContent.videoContent.episode?.episodeNumber ?? ""}화 ${watchContent.videoContent.episode?.name ?? ""}`
              : `${watchContent.videoContent.movie?.title}`}
          </span>
        </div>

        <div
          ref={contentNavigatorRef}
          className="absolute top-7 right-8 z-40 flex gap-3"
        >
          {showContentNavigator && watchContent.videoContent.movie === null ? (
            <div className="bg-background absolute right-0 bottom-12 z-40 max-h-80 w-80 overflow-y-auto rounded-md border border-neutral-700 p-3">
              <div className="mb-3">
                <h5 className="text-sm font-semibold">
                  {formatSeasonLabel(
                    selectedSeason ?? watchContent.videoContent.season,
                  )}
                </h5>
                {hasSeasonSelector ? (
                  <select
                    value={selectedSeasonIndex}
                    className="bg-background mt-2 w-full rounded border border-neutral-700 px-2 py-1 text-xs"
                    onChange={(event) => {
                      const nextIndex = Number(event.target.value);
                      if (Number.isFinite(nextIndex)) {
                        setSelectedSeasonIndex(nextIndex);
                      }
                    }}
                  >
                    {seriesSeasons?.map((season, index) => (
                      <option
                        key={season.id ?? `season-${index}`}
                        value={index}
                      >
                        {formatSeasonLabel(season, index)}
                      </option>
                    ))}
                  </select>
                ) : null}
                <p className="mt-1 text-xs text-neutral-400">
                  시즌 진행률 {seasonProgressPercent}%
                </p>
                <div className="mt-2 h-1 w-full rounded bg-neutral-700">
                  <div
                    className="h-full rounded bg-indigo-600"
                    style={{ width: `${seasonProgressPercent}%` }}
                  />
                </div>
              </div>

              <ul className="flex flex-col gap-1.5">
                {selectedSeasonEpisodes.length > 0
                  ? selectedSeasonEpisodes.map((episode, index) => {
                      const watchId = episode.content?.id;
                      const isCurrentEpisode =
                        isCurrentSeasonSelected &&
                        typeof episode.episodeNumber === "number" &&
                        typeof currentEpisodeNumber === "number" &&
                        episode.episodeNumber === currentEpisodeNumber;

                      let episodeProgressPercent = 0;
                      if (episode.progress?.totalDuration) {
                        episodeProgressPercent = Math.round(
                          Math.min(
                            (episode.progress.currentTime * 100) /
                              episode.progress.totalDuration,
                            100,
                          ),
                        );
                      } else if (episode.progress?.status === "COMPLETED") {
                        episodeProgressPercent = 100;
                      } else if (isCurrentEpisode) {
                        episodeProgressPercent = Math.round(
                          currentEpisodeProgressRatio * 100,
                        );
                      }

                      return watchId ? (
                        <li key={watchId}>
                          <Link
                            href={`/watch/${watchId}`}
                            prefetch={false}
                            onClick={handleNextEpisodeClick}
                            className={cls(
                              "block rounded-sm border border-transparent px-2 py-1.5 transition-colors hover:bg-white/10",
                              isCurrentEpisode
                                ? "border-indigo-500/40 bg-indigo-500/10"
                                : "",
                            )}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex min-w-0 items-center gap-2">
                                <span className="w-5 text-xs text-neutral-400">
                                  {episode.episodeNumber ?? index + 1}
                                </span>
                                <span className="line-clamp-1 text-sm">
                                  {episode.name ?? "제목 없음"}
                                </span>
                              </div>
                              {episode.runtime ? (
                                <span className="text-xs text-neutral-400">
                                  {episode.runtime}분
                                </span>
                              ) : null}
                            </div>

                            <div className="mt-1 h-0.5 w-full rounded bg-neutral-700">
                              <div
                                className="h-full rounded bg-indigo-600"
                                style={{ width: `${episodeProgressPercent}%` }}
                              />
                            </div>
                          </Link>
                        </li>
                      ) : null;
                    })
                  : seasonEpisodes.map((episode) => {
                      const watchId = episode.videoContentId;
                      const isCurrentEpisode =
                        episode.isCurrent ??
                        (typeof episode.episodeNumber === "number" &&
                          typeof currentEpisodeNumber === "number" &&
                          episode.episodeNumber === currentEpisodeNumber);
                      const episodeProgressPercent = isCurrentEpisode
                        ? Math.round(currentEpisodeProgressRatio * 100)
                        : typeof episode.episodeNumber === "number" &&
                            typeof currentEpisodeNumber === "number" &&
                            episode.episodeNumber < currentEpisodeNumber
                          ? 100
                          : 0;

                      return watchId ? (
                        <li key={watchId}>
                          <Link
                            href={`/watch/${watchId}`}
                            prefetch={false}
                            onClick={handleNextEpisodeClick}
                            className={cls(
                              "block rounded-sm border border-transparent px-2 py-1.5 transition-colors hover:bg-white/10",
                              isCurrentEpisode
                                ? "border-indigo-500/40 bg-indigo-500/10"
                                : "",
                            )}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex min-w-0 items-center gap-2">
                                <span className="w-5 text-xs text-neutral-400">
                                  {episode.episodeNumber ?? "-"}
                                </span>
                                <span className="line-clamp-1 text-sm">
                                  {episode.name ?? "제목 없음"}
                                </span>
                              </div>
                              {episode.runtime ? (
                                <span className="text-xs text-neutral-400">
                                  {episode.runtime}분
                                </span>
                              ) : null}
                            </div>

                            <div className="mt-1 h-0.5 w-full rounded bg-neutral-700">
                              <div
                                className="h-full rounded bg-indigo-600"
                                style={{ width: `${episodeProgressPercent}%` }}
                              />
                            </div>
                          </Link>
                        </li>
                      ) : null;
                    })}
              </ul>
            </div>
          ) : null}
          {watchContent.videoContent.movie === null && (
            <button
              onClick={() => setShowContentNavigator((prev) => !prev)}
              className="bg-background cursor-pointer rounded-md border px-3 py-1.5 text-sm font-semibold transition-colors hover:bg-white/20"
            >
              🔮
            </button>
          )}

          {watchContent.nextEpisode?.content?.id ? (
            <Link
              href={`/watch/${watchContent.nextEpisode.content.id}`}
              prefetch={false}
              onClick={handleNextEpisodeClick}
              className="bg-background cursor-pointer rounded-md border px-3 py-1.5 text-sm font-semibold transition-colors hover:bg-white/20"
              /* onClick={userWatchProgress} */
            >
              다음화
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
