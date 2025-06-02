"use server";

import { Metadata } from "next";

interface MoiveResponse {
  ok: boolean;
  result: {
    id: number;
    video_content_id: number;
    title: string;
    overview: string;
    backdrop_path: string;
    created_at: string;
    updated_at: string;
  };
}

export async function getMovieDetial(id: string, userToken: string) {
  const json = (await (
    await fetch(`${process.env.NEXT_PUBLIC_MEDIA_SERVER_URL}/api/movie/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    })
  ).json()) as MoiveResponse;

  if (!json.ok) {
    return null;
  }

  return json.result;
}

interface OpenGraphResult {
  ok: boolean;
  result: {
    title: string;
    backdrop_path: string;
  };
}

export async function getMetadata(movieId: string): Promise<Metadata> {
  const json = (await (
    await fetch(
      `${process.env.NEXT_PUBLIC_MEDIA_SERVER_URL}/api/movie/${movieId}/open-graph`,
    )
  ).json()) as OpenGraphResult;

  if (json.ok) {
    return {
      title: json.result.title,
      description: "",
      openGraph: {
        title: `${json.result.title}`,
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
