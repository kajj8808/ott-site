"use client";

import useLiveVideoSync from "@/app/hooks/useLiveVideoSync";
import { getVideoUrl } from "@/app/utils/libs";
import { useEffect, useRef } from "react";

export default function LiveClient({
  roomName,
  userName,
}: {
  roomName: string;
  userName: string;
}) {
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
      // joinRoom(roomName, userName);
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      //video.addEventListener("")
    }
  }, []);

  return (
    <div>
      <p>
        live {isConnected ? "🙌 server connect!" : "😒 server is not ready?"}
      </p>

      <video ref={videoRef} controls crossOrigin="anonymous" autoPlay>
        <source src="https://kajj8808.com:8443/media/video/1752049479794" />
      </video>
    </div>
  );
}
