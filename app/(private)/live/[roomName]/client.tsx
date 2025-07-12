"use client";

import useLiveVideoSync from "@/app/hooks/useLiveVideoSync";

import { useEffect, useRef, useState } from "react";

export default function LiveClient({
  roomName,
  userName,
}: {
  roomName: string;
  userName: string;
}) {
  const { isConnected, joinRoom } = useLiveVideoSync();

  // const [isSeekingFromRemote, setIsSeekingFromRemote] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (roomName) {
      joinRoom(roomName, userName);
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      //
      const seekingVideo = () => {
        console.log("seeking video time!", video.currentTime);
      };
      video.volume = 0.2;
      video.addEventListener("seek", seekingVideo);
      return () => {
        video.removeEventListener("seek", seekingVideo);
      };
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

      <button
        onClick={() => {
          const video = videoRef.current;
          if (video) {
            video.currentTime = video.currentTime + 1000;
          }
        }}
      >
        seeking test
      </button>
    </div>
  );
}
