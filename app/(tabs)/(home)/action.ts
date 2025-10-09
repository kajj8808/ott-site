"use server";
import { redirect } from "next/navigation";

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
      `${process.env.NEXT_PUBLIC_MEDIA_SERVER_URL}/api/series/now_playing`,
    )
  ).json()) as EpisodeResponse;

  if (!json.ok) {
    return null;
  }

  return json.result;
}

export async function getSeriesIncludingDb() {
  const json = (await (
    await fetch(`${process.env.NEXT_PUBLIC_MEDIA_SERVER_URL}/api/series/bd`)
  ).json()) as EpisodeResponse;

  if (!json.ok) {
    return null;
  }

  return json.result;
}

export async function getAllSeries() {
  const json = (await (
    await fetch(`${process.env.NEXT_PUBLIC_MEDIA_SERVER_URL}/api/series/all`)
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
      `${process.env.NEXT_PUBLIC_MEDIA_SERVER_URL}/api/user/watch-progress`,
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
    await fetch(`${process.env.NEXT_PUBLIC_MEDIA_SERVER_URL}/api/movie/all`)
  ).json()) as MovieResponse;
  if (json.ok) {
    return json.movies;
  }
}
