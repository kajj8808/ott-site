"use client";

import type { Episode } from "../(private)/watch/[id]/action";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { cls, getSubtitleUrl, getVideoUrl } from "../utils/libs";

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
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isHover, setIsHover] = useState(true);
  const onMouseMove = () => {
    setIsHover(true);
    setTimeout(() => setIsHover(false), 3000);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = 0.25;
    }
  }, []);

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
      <div className="relative flex max-h-dvh w-full justify-center">
        <div className="flex w-full justify-center">
          <video
            ref={videoRef}
            crossOrigin="anonymous"
            className="aspect-video"
            controls
          >
            <source src={getVideoUrl(watchId)} type="video/mp4" />
            <track default srcLang="한국어" src={getSubtitleUrl(subtitleId)} />
          </video>
        </div>
      </div>
      <div
        className={cls(
          "fixed bottom-0 flex h-24 w-full items-center justify-center border-t border-white/20 transition-opacity group-hover:opacity-100",
          isHover ? "opacity-100" : "opacity-0",
        )}
      >
        <div className="absolute -top-3 w-full">
          {/*  <input
            type="range"
            defaultValue={0}
            min={0}
            max={1000}
            className="bg-background w-full"
          /> */}
        </div>
        <div>
          <span>{title}</span>
        </div>
        {nextEpisode ? (
          <Link
            href={`/watch/${nextEpisode.video_content_id}`}
            className="bg-background absolute top-7 right-8 z-40 cursor-pointer rounded-md border px-3 py-1.5 text-sm font-semibold transition-colors hover:bg-white/20"
          >
            다음화
          </Link>
        ) : null}
      </div>
    </div>
  );
}
