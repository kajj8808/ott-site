"use client";
import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";

export default function useLiveVideoSync() {
  const [isConnected, setIsConnected] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);

  const [error, setError] = useState<string | null>(null);

  const socketRef = useRef<Socket>(null);

  const joinRoom = (roomName: string) => {
    socketRef.current?.emit("joinRoom", roomName);
  };

  const timeUpdate = (time: number) => {
    socketRef.current?.emit("timeUpdate", time);
  };

  const pauseVideo = () => {
    socketRef.current?.emit("pause");
  };

  const playVideo = () => {
    socketRef.current?.emit("play");
  };

  useEffect(() => {
    socketRef.current = io("wss://");

    socketRef.current.on("connect", () => {
      setIsConnected(true);
      console.log("server connect!");
    });

    socketRef.current.on("timeUpdate", (time) => {
      console.log("server emit video time: ", time);
      setCurrentTime(time);
    });

    socketRef.current.on("pause", () => {
      console.log("server emit video paused");
      setIsPlaying(false);
    });

    socketRef.current.on("play", () => {
      console.log("server emit video palaying!");
      setIsPlaying(true);
    });

    socketRef.current.on("error", (error) => {
      setError(error);
      console.error(`socket error: ${error}`);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        console.log("socket cleanup!");
      }
    };
  }, []);

  return {
    socket: socketRef.current,
    isPlaying,
    isConnected,
    currentTime,
    error,
    joinRoom,
    timeUpdate,
    pauseVideo,
    playVideo,
  };
}
