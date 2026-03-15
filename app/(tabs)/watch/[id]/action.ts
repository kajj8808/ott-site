"use server";

import { getUserSession } from "@/app/lib/server/session";
import { Metadata } from "next";
import { WatchContentContextResponseSchema } from "./schema";

export async function getWatchContent({
  contentId,
  userToken,
}: {
  contentId: string;
  userToken: string;
}) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/me/watch/${contentId}/context`,
    {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      "시청 컨텐츠 개인화 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.",
    );
  }

  const json = await response.json();
  const parsed = WatchContentContextResponseSchema.safeParse(json);

  if (!parsed.success) {
    throw new Error(
      "서버 응답 형식이 올바르지 않습니다. 잠시 후 다시 시도해주세요.",
    );
  }

  return parsed.data.data;
}

export async function updateWatchRecord({
  videoContentId,
  currentTime,
  duration,
}: {
  videoContentId: number;
  currentTime: number;
  duration: number;
}) {
  const userSession = await getUserSession();
  const user = userSession.user;

  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/me/watch-records`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.auth.accessToken}`,
      },
      body: JSON.stringify({
        videoContentId,
        currentTime,
        duration,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(
      "시청 기록을 저장하지 못했습니다. 잠시 후 다시 시도해주세요.",
    );
  }
}

interface OpenGraphResult {
  ok: boolean;
  result: {
    episode?: {
      name: string;
      still_path: string;
      series: {
        title: string;
      };
      season: {
        name: string;
      };
    };
    movie?: {
      title: string;
      backdrop_path: string;
    };
  };
}

export async function getMetadata(videoContentId: string) {
  const json = (await (
    await fetch(
      `${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/videos/${videoContentId}/open-graph`,
    )
  ).json()) as OpenGraphResult;

  let metadata: Metadata = {
    title: "VideoContent Error",
    description: "Bad Request",
  };

  if (json.ok) {
    if (json.result.movie) {
      metadata = {
        title: json.result.movie.title,
        description: `극장판 ${json.result.movie.title}`,
        openGraph: {
          title: json.result.movie.title,
          images: json.result.movie.backdrop_path,
        },
      };
    }
    if (json.result.episode) {
      metadata = {
        title: `${json.result.episode.name} - ${json.result.episode.series.title} ${json.result.episode.season.name}`,
        description: "",
        openGraph: {
          title: `${json.result.episode.name} - ${json.result.episode.series.title} ${json.result.episode.season.name}`,
          description: "",
          images: json.result.episode.still_path,
        },
      };
    }
  }

  return metadata;
}
