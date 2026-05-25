"use server";

import { Metadata } from "next";
import { z } from "zod";

const MovieDetailResponseSchema = z.object({
  ok: z.literal(true),
  data: z.object({
    movie: z.object({
      id: z.number(),
      title: z.string(),
      overview: z.string().nullable().optional(),
      posterPath: z.string().nullable().optional(),
      backdropPath: z.string().nullable().optional(),
      runtime: z.number().nullable().optional(),
      releaseDate: z.string().nullable().optional(),
      content: z
        .object({
          id: z.number(),
          updatedAt: z.string(),
        })
        .nullable()
        .optional(),
    }),
  }),
});

export async function getMovieDetail(movieId: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/catalog/movies/${movieId}`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    return null;
  }

  const json = await response.json();
  const parsed = MovieDetailResponseSchema.safeParse(json);

  if (!parsed.success) {
    return null;
  }

  return parsed.data.data.movie;
}

export async function getMetadata(movieId: string): Promise<Metadata> {
  const movie = await getMovieDetail(movieId);

  if (!movie) {
    return {
      title: "Movie Error",
      openGraph: { title: "Bad Request" },
    };
  }

  return {
    title: movie.title,
    description: movie.overview ?? movie.title,
    openGraph: {
      title: movie.title,
      images: movie.backdropPath ?? movie.posterPath ?? undefined,
    },
  };
}
