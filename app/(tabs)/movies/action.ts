"use server";

import { z } from "zod";

const CatalogMoviesResponseSchema = z.object({
  ok: z.literal(true),
  data: z.object({
    items: z.array(
      z.object({
        id: z.number(),
        title: z.string(),
        overview: z.string().nullable().optional(),
        posterPath: z.string().nullable().optional(),
        backdropPath: z.string().nullable().optional(),
        updatedAt: z.string().optional(),
        content: z
          .object({
            updatedAt: z.string(),
          })
          .nullable()
          .optional(),
      }),
    ),
    page: z.number(),
    limit: z.number(),
    total: z.number(),
  }),
});

export async function getCatalogMovies({
  page = 1,
  limit = 32,
  sort = "latest",
  query,
}: {
  page?: number;
  limit?: number;
  sort?: "latest" | "release";
  query?: string;
}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sort,
  });

  if (query) {
    params.set("q", query);
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/catalog/movies?${params.toString()}`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error("영화 목록을 불러오지 못했습니다.");
  }

  const json = await response.json();
  const parsed = CatalogMoviesResponseSchema.safeParse(json);

  if (!parsed.success) {
    throw new Error("영화 응답 형식이 올바르지 않습니다.");
  }

  return parsed.data.data;
}
