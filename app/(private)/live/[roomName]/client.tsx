"use client";

import useLiveVideoSync from "@/app/hooks/useLiveVideoSync";
import { getVideoUrl } from "@/app/utils/libs";
import { useEffect, useRef } from "react";

export default function LiveClient({ roomName }: { roomName: string }) {
  const {
    isConnected,
    joinRoom,
    isPlaying,
    currentTime,
    timeUpdate,
    playVideo,
    pauseVideo,
  } = useLiveVideoSync();

  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (roomName) {
      joinRoom(roomName);
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    console.log(isPlaying);
    if (video) {
      if (isPlaying) {
        video.play();
      } else {
        video.pause();
      }
    }
  }, [isPlaying]);

  return (
    <div>
      <p>live {isConnected ? "🙌" : "😒"}</p>
      <div className="flex gap-2">
        <button onClick={playVideo} className="cursor-pointer">
          play
        </button>
        <button onClick={pauseVideo} className="cursor-pointer">
          pause
        </button>
      </div>
      <video
        ref={videoRef}
        crossOrigin="anonymous"
        className="aspect-video"
        controls
        autoPlay
        muted
      >
        <source src={getVideoUrl(1747320332680 + "")} type="video/mp4" />
      </video>
    </div>
  );
}
