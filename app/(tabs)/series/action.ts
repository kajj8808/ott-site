"use server";

import { z } from "zod";

const CatalogSeriesResponseSchema = z.object({
  ok: z.literal(true),
  data: z.object({
    items: z.array(
      z.object({
        id: z.number(),
        title: z.string(),
        overview: z.string().nullable().optional(),
        posterPath: z.string().nullable().optional(),
        backdropPath: z.string().nullable().optional(),
        status: z.string().optional(),
        updatedAt: z.string().optional(),
      }),
    ),
    page: z.number(),
    limit: z.number(),
    total: z.number(),
  }),
});

export async function getCatalogSeries({
  page = 1,
  limit = 32,
  status,
  query,
}: {
  page?: number;
  limit?: number;
  status?: string;
  query?: string;
}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (status) {
    params.set("status", status);
  }

  if (query) {
    params.set("q", query);
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/catalog/series?${params.toString()}`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error("시리즈 목록을 불러오지 못했습니다.");
  }

  const json = await response.json();
  const parsed = CatalogSeriesResponseSchema.safeParse(json);

  if (!parsed.success) {
    throw new Error("시리즈 응답 형식이 올바르지 않습니다.");
  }

  return parsed.data.data;
}
