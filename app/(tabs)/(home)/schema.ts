import { z } from "zod";

export const HomeLatestResponseSchema = z.object({
  ok: z.boolean(),
  data: z.object({
    items: z.array(
      z.object({
        id: z.number(),
        watchId: z.string(),
        type: z.string(),
        title: z.string(),
        thumbnail: z.string(),
        streamPath: z.string(),
      }),
    ),
    total: z.number(),
    filter: z.object({
      type: z.string(),
    }),
  }),
});

export type HomeLatestResponse = z.infer<typeof HomeLatestResponseSchema>;

export const HomeLatestSeriesResponseSchema = z.object({
  ok: z.boolean(),
  data: z.object({
    items: z.array(
      z.object({
        series: z.object({
          id: z.number(),
          title: z.string(),
          posterPath: z.string(),
          backdropPath: z.string(),
          status: z.string(),
          updatedAt: z.string(),
        }),
        latestContent: z.object({
          id: z.number(),
          watchId: z.string(),
          type: z.string(),
          createdAt: z.string(),
          updatedAt: z.string(),
        }),
      }),
    ),
    total: z.number(),
    limit: z.number(),
  }),
});

export type HomeLatestSeriesResponse = z.infer<
  typeof HomeLatestSeriesResponseSchema
>;
export const ContinueWatchingResponseSchema = z.object({
  ok: z.literal(true),
  data: z.object({
    items: z.array(
      z.object({
        id: z.number(),
        userId: z.number(),
        videoContentId: z.number(),
        currentTime: z.number(),
        totalDuration: z.number().nullable(),
        status: z.enum(["WATCHING", "COMPLETED", "DROPPED"]),
        updatedAt: z.string(),
        content: z.object({
          id: z.number(),
          watchId: z.string(),
          type: z.enum(["EPISODE", "MOVIE", "SPECIAL"]),
          title: z.string(),
          subtitle: z.string().nullable(),
          thumbnail: z.string().nullable(),
          watchUrl: z.string().nullable(),
          seriesId: z.number().nullable(),
          seasonId: z.number().nullable(),
          episodeId: z.number().nullable(),
          movieId: z.number().nullable(),
          createdAt: z.string(),
          updatedAt: z.string(),
        }),
      }),
    ),
    total: z.number(),
  }),
});

export type ContinueWatchingResponse = z.infer<
  typeof ContinueWatchingResponseSchema
>;
export const RecommendationsResponseSchema = z.object({
  ok: z.boolean(),
  data: z.object({
    items: z.array(
      z.object({
        score: z.number(),
        content: z.object({
          id: z.number(),
        }),
      }),
    ),
    total: z.number(),
    basedOnHistoryCount: z.number(),
    preferredSeriesIds: z.array(z.number()),
  }),
});

export type RecommendationsResponse = z.infer<
  typeof RecommendationsResponseSchema
>;

export const SeriesRecommendationsResponseSchema = z.object({
  ok: z.boolean(),
  data: z.object({
    items: z.array(
      z.object({
        score: z.number(),
        series: z.object({
          id: z.number(),
          title: z.string(),
          posterPath: z.string(),
          backdropPath: z.string(),
          status: z.string(),
          updatedAt: z.string(),
        }),
        latestContent: z.object({
          id: z.number(),
          watchId: z.string(),
          type: z.string(),
          createdAt: z.string(),
          updatedAt: z.string(),
        }),
      }),
    ),
    total: z.number(),
    basedOnHistoryCount: z.number(),
    preferredSeriesIds: z.array(z.number()),
  }),
});

export type SeriesRecommendationsResponse = z.infer<
  typeof SeriesRecommendationsResponseSchema
>;
