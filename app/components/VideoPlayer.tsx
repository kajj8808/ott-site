"use client";

import {
  updateWatchRecord,
  VideoContent,
} from "../(private)/watch/[id]/action";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { cls, getSubtitleUrl, getVideoUrl } from "../utils/libs";

interface VideoPlayerProps {
  goBackLink: string;
  videoContent: VideoContent;
}

export default function VideoPlayer({
  goBackLink,
  videoContent,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isHover, setIsHover] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const onMouseMove = () => {
    setIsHover(true);
    setTimeout(() => setIsHover(false), 3000);
  };

  /** user가 영상을 시청하고 있을 때 작동하는 함수 */
  const userWatchProgress = () => {
    const video = videoRef.current;
    if (video && !video.paused) {
      updateWatchRecord({
        watchId: videoContent.watch_id,
        duration: video.duration,
        currentTime: video.currentTime,
      });
    }
  };

  useEffect(() => {
    const video = videoRef.current;

    if (video) {
      if (videoContent.user_progress?.current_time) {
        video.currentTime = videoContent.user_progress.current_time;
      }
      video.volume = 0.25;
      video.play();

      // init
      video.addEventListener("loadedmetadata", () => {
        setDuration(video.duration);
      });

      video.addEventListener("timeupdate", () => {
        setCurrentTime(video.currentTime);
      });

      // 1분에 한번 watch에 관련된 함수 실행.
      const interval = setInterval(() => {
        userWatchProgress();
      }, 1000 * 60);

      return () => {
        clearInterval(interval);
      };
    }
  }, []);

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
          >
            <source src={getVideoUrl(videoContent.watch_id)} type="video/mp4" />
            <track
              default
              srcLang="한국어"
              src={getSubtitleUrl(videoContent.subtitle_id)}
            />
          </video>
        </div>
      </div>
      <div
        className={cls(
          "fixed bottom-0 flex h-24 w-full items-center justify-center border-white/20 transition-opacity group-hover:opacity-100",
          isHover ? "opacity-100" : "opacity-0",
        )}
      >
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
            {videoContent.season
              ? `${videoContent.season?.name} ${videoContent.episode?.episode_number}화 ${videoContent.episode?.name}`
              : "movie!!!!"}
          </span>
        </div>
        {videoContent.next_episode ? (
          <Link
            href={`/watch/${videoContent.next_episode.video_content_id}`}
            className="bg-background absolute top-7 right-8 z-40 cursor-pointer rounded-md border px-3 py-1.5 text-sm font-semibold transition-colors hover:bg-white/20"
            onClick={userWatchProgress}
          >
            다음화
          </Link>
        ) : null}
      </div>
    </div>
  );
}
