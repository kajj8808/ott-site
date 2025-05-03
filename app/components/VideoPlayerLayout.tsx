"use client";

import type { Episode } from "../(private)/watch/[id]/action";

import Link from "next/link";
import React, { useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { cls } from "../utils/libs";

interface VideoPlayerLayoutProps {
  children: React.ReactNode;
  goBackLink: string;
  nextEpisode: Episode | null;
  title: string;
}

export default function VideoPlayerLayout({
  children,
  goBackLink,
  nextEpisode,
  title,
}: VideoPlayerLayoutProps) {
  const [isHover, setIsHover] = useState(false);
  const onMouseMove = () => {
    setIsHover(true);
    setTimeout(() => setIsHover(false), 2000);
  };
  return (
    <div
      className="relative flex h-dvh w-full items-center"
      onMouseMove={onMouseMove}
    >
      <Link
        href={goBackLink}
        className={cls(
          "fixed top-10 left-8 z-40 transition-opacity",
          isHover ? "opacity-100" : "opacity-0",
        )}
      >
        <ArrowLeftIcon className="w-10" />
      </Link>
      <div className="relative flex max-h-dvh w-full justify-center">
        {children}
      </div>
      <div
        className={cls(
          "fixed bottom-0 flex h-24 w-full items-center justify-center border-t border-white/20 transition-opacity",
          isHover ? "opacity-100" : "opacity-0",
        )}
      >
        {nextEpisode ? (
          <Link
            href={`/watch/${nextEpisode.video_content_id}`}
            className="bg-background absolute top-7 right-8 z-40 cursor-pointer rounded-md border px-3 py-1.5 text-sm font-semibold transition-colors hover:bg-white/20"
          >
            다음화
          </Link>
        ) : null}
        <div>
          <span>{title}</span>
        </div>
      </div>
    </div>
  );
}
