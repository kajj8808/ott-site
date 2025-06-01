"use server";

import { destroyUserSession } from "@/app/lib/server/auth";
import { Metadata } from "next";
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

interface OpenGraphResult {
  ok: boolean;
  result: {
    title: string;
    backdrop_path: string;
    _count: {
      episodes: number;
    };
  };
}

export async function getMetadata(seriesId: string): Promise<Metadata> {
  const json = (await (
    await fetch(
      `${process.env.NEXT_PUBLIC_MEDIA_SERVER_URL}/api/series/${seriesId}/open-graph`,
    )
  ).json()) as OpenGraphResult;

  if (json.ok) {
    return {
      title: json.result.title,
      openGraph: {
        title: `${json.result.title} - ${json.result._count.episodes}개의 에피소드`,
        images: json.result.backdrop_path,
      }, // 페이지 설명
    };
  } else {
    return {
      title: "Series Error",
      openGraph: { title: "Bad Request" },
    };
  }
}
