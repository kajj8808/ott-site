"use server";

import {
  SeriesPersonalizedResponseSchema,
  SeriesSeasonContextResponseSchema,
} from "./schema";

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

export async function getMetadata(seriesId: string) {
  const json = (await (
    await fetch(
      `${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/series/${seriesId}/open-graph`,
    )
  ).json()) as OpenGraphResult;

  if (json.ok) {
    return {
      title: json.result.title,
      description: json.result.title,
      openGraph: {
        title: `${json.result.title} - ${json.result._count.episodes}개의 에피소드`,
        description: "",
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

export async function getUserSeriesPersonalized({
  seriesId,
  userToken,
  expand,
}: {
  seriesId: number;
  userToken: string;
  expand?: "seasonContexts";
}) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/me/series/${seriesId}/personalized${expand ? `?expand=${expand}` : ""}`,
    {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      "시리즈 개인화 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.",
    );
  }

  const json = await response.json();
  const parsed = SeriesPersonalizedResponseSchema.safeParse(json);

  if (!parsed.success) {
    throw new Error(
      "서버 응답 형식이 올바르지 않습니다. 잠시 후 다시 시도해주세요.",
    );
  }

  return parsed.data.data;
}

export async function getUserSeasonPersonalized({
  seasonId,
  userToken,
}: {
  seasonId: number;
  userToken: string;
}) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/me/seasons/${seasonId}/context`,
    {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
      next: {
        revalidate: 60,
        tags: [`season-${seasonId}-context:${userToken}:${seasonId}`],
      },
      cache: "force-cache",
    },
  );

  if (!response.ok) {
    throw new Error(
      "시리즈 시즌 개인화 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.",
    );
  }

  const json = await response.json();
  const parsed = SeriesSeasonContextResponseSchema.safeParse(json);

  if (!parsed.success) {
    throw new Error(
      "서버 응답 형식이 올바르지 않습니다. 잠시 후 다시 시도해주세요.",
    );
  }

  return parsed.data.data;
}
