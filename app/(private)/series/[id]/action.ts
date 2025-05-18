"use server";

import { destroyUserSession } from "@/app/lib/server/auth";
import { redirect } from "next/navigation";

export interface Episode {
  overview: string;
  name: string;
  episode_number: number;
  video_content_id: number;
  still_path: string;
  runtime: number;
  updated_at: string;
  user_watch_progress: {
    current_time: number;
    total_duration: number;
  }[];
}
export interface Season {
  name: string;
  season_number: number;
  episodes: Episode[];
  source_type: string;
  updated_at: string;
}
interface SeriesResponse {
  ok: boolean;
  series: {
    title: string;
    overview: string;
    backdrop_path: string;
    updated_at: string;
    season: Season[];
  };
  lastWatchedProgress?: {
    video_content_id: number;
  };
}
export async function getSeriesDetail(seriesId: string, userToken: string) {
  if (!userToken) {
    await destroyUserSession();
    redirect("/log-in");
  }
  const json = (await (
    await fetch(
      `${process.env.NEXT_PUBLIC_MEDIA_SERVER_URL}/api/series/${seriesId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      },
    )
  ).json()) as SeriesResponse;

  if (json.ok) {
    return {
      series: json.series,
      lastWatchedProgress: json.lastWatchedProgress,
    };
  }
}
