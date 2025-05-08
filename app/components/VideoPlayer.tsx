"use client";

import type { Episode } from "../(private)/watch/[id]/action";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import {
  ArrowLeftIcon,
  ArrowsPointingOutIcon,
  ForwardIcon,
  PlayIcon,
  WifiIcon,
} from "@heroicons/react/24/outline";
import { cls, getSubtitleUrl, getVideoUrl } from "../utils/libs";
import { PauseIcon } from "@heroicons/react/24/outline";
import { ArrowsPointingInIcon } from "@heroicons/react/24/solid";

interface VideoPlayerProps {
  goBackLink: string;
  nextEpisode: Episode | null;
  title: string;

  watchId: string;
  subtitleId: string | null;
}

export default function VideoPlayer({
  goBackLink,
  nextEpisode,
  title,
  watchId,
  subtitleId,
}: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [isHover, setIsHover] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const onMouseMove = () => {
    setIsHover(true);
    setTimeout(() => setIsHover(false), 3000);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying((prev) => !prev);
    }
  };

  const toggleFullScreen = () => {
    if (isFullScreen) {
      document.exitFullscreen();
    } else {
      containerRef.current?.requestFullscreen();
    }

    setIsFullScreen((prev) => !prev);
  };

  const progressBarMoveHandler = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    const progressBar = event.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const x = event.clientX - rect.x;
    const precent = x / rect.width;
    const newTime = duration * precent;

    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime || 0);
    };

    const handleLoadedMetaData = () => {
      setDuration(video.duration || 0);
    };

    const handelSeeking = () => {
      setIsLoading(true);
    };

    const handelCanPlay = () => {
      setIsLoading(false);
    };

    video.volume = 0.25;
    video.addEventListener("loadedmetadata", handleLoadedMetaData);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("seeking", handelSeeking); // video 재생 위치 변경
    video.addEventListener("canplay", handelCanPlay); // video 로딩이 완료시시
    video.play();

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetaData);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("seeking", handelSeeking);
      video.removeEventListener("canplay", handelCanPlay);
    };
  }, []);

  return (
    <div
      className="group relative flex h-dvh w-full items-center"
      onMouseDown={onMouseMove}
      ref={containerRef}
    >
      <Link
        href={goBackLink}
        className={cls(
          "fixed top-10 left-8 z-40 rounded-md p-1.5 transition-opacity group-hover:opacity-100 hover:bg-white/20",
          isHover ? "opacity-100" : "opacity-0",
        )}
      >
        <ArrowLeftIcon className="w-10" />
      </Link>
      <div
        className="absolute top-0 left-0 z-30 h-dvh w-full"
        onClick={togglePlay}
      ></div>
      <div className="relative flex max-h-dvh w-full justify-center">
        <div className="flex w-full justify-center">
          <video
            ref={videoRef}
            crossOrigin="anonymous"
            className="aspect-video w-full"
          >
            <source src={getVideoUrl(watchId)} type="video/mp4" />
            <track default srcLang="한국어" src={getSubtitleUrl(subtitleId)} />
          </video>
        </div>
      </div>
      <div
        className={cls(
          "fixed bottom-0 z-40 flex h-24 w-full items-center transition-opacity select-none group-hover:opacity-100 lg:h-28",
          isHover ? "opacity-100" : "opacity-0",
        )}
      >
        {/* progress bar start */}
        <div
          className="absolute -top-0 h-1 w-full cursor-pointer transition-all hover:-top-0.5 hover:h-2"
          onClick={progressBarMoveHandler}
          onDragEnd={progressBarMoveHandler}
        >
          {/*  <input
            type="range"
            defaultValue={0}
            min={0}
            max={1000}
            className="bg-background w-full"
          /> */}
          <div className="absolute h-full w-full bg-white/30"></div>
          <div
            className="absolute h-full rounded-r-md bg-white transition-all"
            style={{
              width: `${(currentTime / duration) * 100}%`,
            }}
          ></div>
        </div>
        {/* progress bar end */}
        {/* status bar start */}
        <div className="grid w-full grid-cols-3 px-9">
          <div className="flex items-center">
            <div className="rounded-md p-1.5 hover:bg-white/20">
              {isPlaying ? (
                <PauseIcon
                  className="size-8 cursor-pointer"
                  onClick={togglePlay}
                />
              ) : (
                <PlayIcon
                  className="size-8 cursor-pointer"
                  onClick={togglePlay}
                />
              )}
            </div>
          </div>
          <div className="flex w-full items-center justify-center select-none">
            <span className="line-clamp-1 lg:text-lg">{title}</span>
          </div>

          <div className="flex items-center justify-end gap-1">
            {nextEpisode && (
              <Link
                href={`/watch/${nextEpisode.video_content_id}`}
                className="bg-background cursor-pointer rounded-md px-3 py-1.5 text-sm font-semibold transition-colors hover:bg-white/20"
              >
                <ForwardIcon className="size-8" />
              </Link>
            )}
            <div className="rounded-md p-1.5 hover:bg-white/20">
              {isFullScreen ? (
                <ArrowsPointingInIcon
                  className="size-7 cursor-pointer"
                  onClick={toggleFullScreen}
                />
              ) : (
                <ArrowsPointingOutIcon
                  className="size-7 cursor-pointer"
                  onClick={toggleFullScreen}
                />
              )}
            </div>
          </div>
        </div>
        {/* status bar end */}
        {/* TODO: 시간 얼마 안남았을 경우 뜨게.. */}
        {/*  {nextEpisode ? (
          <Link
            href={`/watch/${nextEpisode.video_content_id}`}
            className="bg-background absolute -top-12 right-8 z-40 cursor-pointer rounded-md border px-3 py-1.5 text-sm font-semibold transition-colors hover:bg-white/20"
          >
            다음화
          </Link>
        ) : null} */}
      </div>
      {/* Loading... start*/}
      {isLoading && (
        <div className="absolute top-0 left-0 flex h-full w-full items-center justify-center bg-black/60">
          <WifiIcon className="size-10 animate-pulse" />
        </div>
      )}

      {/* Loading... end*/}
    </div>
  );
}
