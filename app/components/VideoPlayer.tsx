"use client";

import { useEffect, useRef } from "react";
import { getSubtitleUrl, getVideoUrl } from "../utils/libs";

interface VideoPlayerProps {
  watchId: string;
  subtitleId: string | null;
}
export default function VideoPlayer({ watchId, subtitleId }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    if (videoRef.current) {
      console.log(videoRef.current);
    }
  }, []);
  return (
    <div className="flex justify-center w-full">
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
  );
}
