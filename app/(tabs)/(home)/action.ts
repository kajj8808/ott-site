"use server";
import { redirect } from "next/navigation";
import {
  ContinueWatchingResponseSchema,
  HomeLatestResponseSchema,
  HomeLatestSeriesResponseSchema,
  SeriesRecommendationsResponseSchema,
} from "./schema";

export interface Episode {
  series: {
    id: number;
    title: string;
    backdrop_path: string | null;
    poster_path: string | null;
  } | null;
  season: {
    name: string | null;
  } | null;
  name: string | null;
  id: number;
  created_at: string;
  updated_at: string;
  video_content_id: number;
  series_id: number;
  season_id: number;
  overview: string | null;
  episode_number: number;
  still_path: string | null;
  runtime: number | null;
  is_korean_translated: boolean;
}

interface EpisodeResponse {
  ok: boolean;
  result: Episode[];
}

export interface Series {
  id: number;
  title: string;
  overview: string;
  logo: string | null;
  backdrop_path: string;
  updated_at: string;
}

interface SeriesResponse {
  ok: boolean;
  result: Series[];
}

export async function getNowPlayingSeries() {
  const json = (await (
    await fetch(
      `${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/series/now_playing`,
    )
  ).json()) as EpisodeResponse;

  if (!json.ok) {
    return null;
  }

  return json.result;
}

export async function getSeriesIncludingDb() {
  const json = (await (
    await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/series/bd`)
  ).json()) as {
    ok: boolean;
    result: {
      id: number;
      title: string;
      backdrop_path: string;
      logo: string | null;
      overview: string;
      updated_at: string;
    }[];
  };

  if (!json.ok) {
    return null;
  }

  return json.result;
}

export async function getAllSeries() {
  const json = (await (
    await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/series/all`)
  ).json()) as SeriesResponse;

  if (!json.ok) {
    return null;
  }

  return json.result;
}

export interface VideoContent {
  id: number;
  title: string;
  backdrop_path: string;
  overview: string;
  watched_at: string;
  series_id: number;
  movie_id: number;
  type: "MOVIE" | "EPISODE";
  total_duration: string;
  current_time: string;
}

interface VideoContentResponse {
  ok: boolean;
  contents: VideoContent[];
}

export async function getUserWatingProgress(userToken: string | undefined) {
  if (!userToken) {
    redirect("/log-in");
  }

  const json = (await (
    await fetch(
      `${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/user/watch-progress`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      },
    )
  ).json()) as VideoContentResponse;

  if (!json.ok) {
    return [];
  }

  return json.contents;
}

interface MovieResponse {
  ok: boolean;
  movies: {
    id: number;
    title: string;
    poster_path: string | null;
    backdrop_path: string | null;
  }[];
}
export async function getMovies() {
  const json = (await (
    await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/movie/all`)
  ).json()) as MovieResponse;
  if (json.ok) {
    return json.movies;
  }
}

/* interface UserWatchRecordResponse {
  items: {
    id: number;
    userId: number;
    videoContentId: number;
    content: unknown;
  };
}
export const getUserWatchRecords = async (userId: number) => {
  const json = await (
    await fetch(
      `${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/home/continue/${userId}?limit=4`,
    )
  ).json();

  return json;
}; */

export async function getLatestContents({
  limit,
  type,
}: {
  limit: number;
  type: "EPISODE" | "MOVIE" | "SPECIAL";
}) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/home/latest?limit=${limit}&type=${type}`,
  );

  if (!response.ok) {
    throw new Error(
      "최신 컨텐츠를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.",
    );
  }

  const json = await response.json();
  const parsed = HomeLatestResponseSchema.safeParse(json);

  if (!parsed.success) {
    throw new Error(
      "서버 응답 형식이 올바르지 않습니다. 잠시 후 다시 시도해주세요.",
    );
  }

  return parsed.data.data;
}

export async function getLatestSeries({ limit }: { limit: number }) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/home/latest-series?limit=${limit}`,
  );

  if (!response.ok) {
    throw new Error(
      "최신 시리즈를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.",
    );
  }

  const json = await response.json();
  const parsed = HomeLatestSeriesResponseSchema.safeParse(json);

  if (!parsed.success) {
    throw new Error(
      "서버 응답 형식이 올바르지 않습니다. 잠시 후 다시 시도해주세요.",
    );
  }

  return parsed.data.data;
}

export async function getContinueWatching({
  userToken,
  limit,
}: {
  userToken: string;
  limit: number;
}) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/me/continue-watching?limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      "계속 시청할 컨텐츠를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.",
    );
  }

  const json = await response.json();
  const parsed = ContinueWatchingResponseSchema.safeParse(json);

  if (!parsed.success) {
    throw new Error(
      "서버 응답 형식이 올바르지 않습니다. 잠시 후 다시 시도해주세요.",
    );
  }

  return parsed.data.data;
}

export async function getRecommendationsSeries({
  userToken,
  limit,
}: {
  userToken: string;
  limit: number;
}) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/me/recommendations/series?limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      "추천 컨텐츠를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.",
    );
  }

  const json = await response.json();
  const parsed = SeriesRecommendationsResponseSchema.safeParse(json);

  if (!parsed.success) {
    throw new Error(
      "서버 응답 형식이 올바르지 않습니다. 잠시 후 다시 시도해주세요.",
    );
  }

  return parsed.data.data;
}
