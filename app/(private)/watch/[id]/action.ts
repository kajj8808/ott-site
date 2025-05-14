"use server";

import { getUserSession } from "@/app/lib/server/session";
import { revalidateTag } from "next/cache";

export interface VideoContent {
  id: number;
  watch_id: string;
  subtitle_id: string | null;
  type: "EPISODE" | "MOVIE";
  opening_start: number | null;
  opening_end: number | null;
  ending_start: number | null;
  ending_end: number | null;

  created_at: string;
  updated_at: string;

  episode: Episode | null;
  movie: Movie | null;

  season: Season | null;
  series: Series | null;
  next_episode: Episode | null;
}

export interface Episode {
  id: number;
  season_id: number;
  series_id: number;
  video_content_id: number;
  episode_number: number;
  name: string;
  overview: string;
  still_path: string;
  runtime: number;

  created_at: string;
  updated_at: string;
}

export interface Movie {
  id: number;
  video_content_id: number;
  title: string;
  overview: string;

  backdrop_path: string | null;

  runtime: number | null;

  release_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Season {
  id: number;
  series_id: number;
  name: string;
}

export interface Series {
  id: number;
  title: string;
}

interface VideoResponse {
  ok: boolean;
  result: VideoContent;
}

export async function getVideoContentDetail(contentId: string) {
  const json = (await (
    await fetch(
      `${process.env.NEXT_PUBLIC_MEDIA_SERVER_URL}/api/videos/${contentId}`,
    )
  ).json()) as VideoResponse;

  if (json.ok) {
    return json.result;
  }
}

interface UpdateWatchRecordProps {
  watchId: string;
  duration: number;
  currentTime: number;
}
export async function updateWatchRecord({
  watchId,
  duration,
  currentTime,
}: UpdateWatchRecordProps) {
  const session = await getUserSession();
  if (!session.user) {
    return;
  }

  await fetch(
    `${process.env.NEXT_PUBLIC_MEDIA_SERVER_URL}/api/user/watch-record`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.user.token}`,
      },

      body: JSON.stringify({
        watchId,
        duration,
        currentTime,
      }),
    },
  );
  revalidateTag("watch_progress");
}
