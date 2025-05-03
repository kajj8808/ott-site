"use client";

import type { Episode } from "../(private)/watch/[id]/action";

import Link from "next/link";
import React from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

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
  const onMouseMove = () => {};
  return (
    <div
      className="relative flex h-dvh w-full items-center"
      onMouseMove={onMouseMove}
    >
      <Link
        href={goBackLink}
        className="fixed top-10 left-8 z-40 opacity-0 transition-opacity"
      >
        <ArrowLeftIcon className="w-10" />
      </Link>
      <div className="relative flex max-h-dvh w-full justify-center">
        {children}
      </div>
      <div className="fixed bottom-0 flex h-24 w-full items-center justify-center border-t border-white/20 opacity-0 transition-opacity">
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
