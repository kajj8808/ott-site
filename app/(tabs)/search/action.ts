"use server";

import { z } from "zod";

const SeriesSchema = z.object({
  id: z.number(),
  title: z.string(),
  overview: z.string().nullable().optional(),
  posterPath: z.string().nullable().optional(),
  backdropPath: z.string().nullable().optional(),
  status: z.string().optional(),
});

const MovieSchema = z.object({
  id: z.number(),
  title: z.string(),
  posterPath: z.string().nullable().optional(),
  backdropPath: z.string().nullable().optional(),
});

const ContentSchema = z.object({
  id: z.number(),
  type: z.enum(["EPISODE", "MOVIE", "SPECIAL"]),
  title: z.string().nullable(),
  thumbnail: z.string().nullable(),
  seriesId: z.number().nullable(),
  movieId: z.number().nullable(),
  updatedAt: z.string(),
});

const SearchResponseSchema = z.object({
  ok: z.literal(true),
  data: z.object({
    query: z.string(),
    series: z.array(SeriesSchema),
    seasons: z.array(z.unknown()),
    movies: z.array(MovieSchema),
    contents: z.array(ContentSchema),
  }),
});

export async function searchCatalog({
  query,
  limit = 12,
}: {
  query: string;
  limit?: number;
}) {
  const params = new URLSearchParams({
    q: query,
    limit: String(limit),
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/search?${params.toString()}`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error("검색 결과를 불러오지 못했습니다.");
  }

  const json = await response.json();
  const parsed = SearchResponseSchema.safeParse(json);

  if (!parsed.success) {
    throw new Error("검색 응답 형식이 올바르지 않습니다.");
  }

  return parsed.data.data;
}
