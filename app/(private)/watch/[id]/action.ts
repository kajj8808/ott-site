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

  episode?: { episode_number: number; name: string };
  season?: { id: number; name: string };

  series?: {
    id: number;
    title: string;
    status: string;
    season?: VideoContentSeason[];
  };
  user_progress?: {
    current_time: number;
    total_duration: number;
  };
  next_episode?: Episode | null;

  movie?: {
    title: string;
    id: boolean;
  };
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

export interface VideoContentSeason {
  id: number;
  name: string;
  season_number: number;
  updated_at: string;
  episodes?: VideoContentEpisode[];
}

export interface VideoContentEpisode {
  id: number;
  name: string;
  overview: string;
  runtime: number;
  update_at: string;
  still_path: string;
  episode_number: number;
  video_content_id: number;
  user_watch_progress?: {
    total_duration: number;
    current_time: number;
  }[];
}

export interface Series {
  id: number;
  title: string;
}

interface VideoResponse {
  ok: boolean;
  result: VideoContent;
}

export async function getVideoContentDetail(
  contentId: string,
  userToken: string,
) {
  const json = (await (
    await fetch(
      `${process.env.NEXT_PUBLIC_MEDIA_SERVER_URL}/api/videos/${contentId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      },
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

export async function getWatchMetadata(watchId: string) {}
