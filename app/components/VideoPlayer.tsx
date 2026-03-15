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
import { updateWatchRecord } from "../(tabs)/watch/[id]/action";

type WatchVideoContent = WatchContentContextResponse["data"];

interface VideoPlayerProps {
  goBackLink: string;
  watchContent: WatchVideoContent;
}

export default function VideoPlayer({
  goBackLink,
  watchContent,
}: VideoPlayerProps) {
  const [, startWatchProgressSyncTransition] = useTransition();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const contentNavigatorRef = useRef<HTMLDivElement | null>(null);
  const [isHover, setIsHover] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

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

  const handleWatchProgressSyncClick = () => {
    void tryRequestWatchProgressSync();
  };

  const handleNextEpisodeClick = () => {
    void tryRequestWatchProgressSync();
  };

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

      // 1분에 한번 watch에 관련된 함수 실행.
      const interval = setInterval(() => {
        void tryRequestWatchProgressSync();
      }, 1000 * 60);

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
          {/*       {showContentNavigator && (
            <div className="bg-background absolute right-0 bottom-12 z-40 max-h-80 w-80 overflow-y-auto rounded-md border border-neutral-700">
              <ContentNavigator videoContent={videoContent} />
            </div>
          )} */}
          {/* {watchContent.videoContent.movie === null && (
            <button
              onClick={() => setShowContentNavigator((prev) => !prev)}
              className="bg-background cursor-pointer rounded-md border px-3 py-1.5 text-sm font-semibold transition-colors hover:bg-white/20"
            >
              🔮
            </button>
          )} */}
          <button
            onClick={handleWatchProgressSyncClick}
            className="cursor-pointer"
          >
            update record test?
          </button>

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
