"use client";
import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";

export default function useLiveVideoSync() {
  const [isConnected, setIsConnected] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);

  // FIXME: 임시 username 이후 수정
  const [username, setUsername] = useState<null | string>(null);

  const [error, setError] = useState<string | null>(null);

  const socketRef = useRef<Socket>(null);

  const joinRoom = (roomName: string, userName: string) => {
    setUsername("123");
    socketRef.current?.emit("joinRoom", roomName, userName);
  };

  const timeUpdate = (time: number, username: string) => {
    socketRef.current?.emit("timeUpdate", time, username);
  };

  const pauseVideo = () => {
    setIsPlaying(false);
    socketRef.current?.emit("pause");
  };

  const playVideo = () => {
    setIsPlaying(true);
    socketRef.current?.emit("play");
  };

  useEffect(() => {
    socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_SERVER_URL);

    socketRef.current.on("connect", () => {
      setIsConnected(true);
      console.log("server connect!");
    });

    socketRef.current.on("welcome", () => {});

    socketRef.current.on("timeUpdate", (time, sendUser) => {
      console.log(sendUser + " " + username + " time update");
      if (sendUser !== username) {
        setCurrentTime(time);
      }
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
    username,
    joinRoom,
    timeUpdate,
    pauseVideo,
    playVideo,
  };
}
