import { z } from "zod";

const ContentTypeSchema = z.enum(["EPISODE", "MOVIE", "SPECIAL"]);

export const ContentCardSchema = z.object({
  id: z.number(),
  watchId: z.string(),
  type: ContentTypeSchema,
  title: z.string().nullable(),
  subtitle: z.string().nullable().optional(),
  thumbnail: z.string().nullable(),
  watchUrl: z.string().nullable().optional(),
  streamPath: z.string().nullable().optional(),
  subtitlePath: z.string().nullable().optional(),
  seriesId: z.number().nullable(),
  seasonId: z.number().nullable().optional(),
  episodeId: z.number().nullable().optional(),
  episodeNumber: z.number().nullable().optional(),
  movieId: z.number().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const SeriesCardSchema = z.object({
  id: z.number(),
  title: z.string(),
  overview: z.string().nullable().optional(),
  posterPath: z.string().nullable().optional(),
  backdropPath: z.string().nullable().optional(),
  status: z.string().optional(),
  updatedAt: z.string().optional(),
});

const ScoredContentSchema = z.object({
  score: z.number(),
  content: ContentCardSchema,
});

const LatestSeriesItemSchema = z.object({
  series: SeriesCardSchema,
  latestContent: ContentCardSchema.pick({
    id: true,
    watchId: true,
    type: true,
    createdAt: true,
    updatedAt: true,
  }),
});

const NewSeasonItemSchema = z.object({
  series: SeriesCardSchema,
  id: z.number(),
  name: z.string().nullable(),
  seasonNumber: z.number().nullable(),
  posterPath: z.string().nullable().optional(),
  airDate: z.string().nullable().optional(),
  createdAt: z.string().optional(),
  episodeCount: z.number(),
});

const CurrentlyAiringItemSchema = z.object({
  series: SeriesCardSchema,
  currentSeason: z.unknown().nullable().optional(),
  latestContent: ContentCardSchema.pick({
    id: true,
    watchId: true,
    type: true,
    createdAt: true,
    updatedAt: true,
  })
    .nullable()
    .optional(),
  quarterMatch: z.unknown().optional(),
});

const SimilarSeriesRailsSchema = z.object({
  rails: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      items: z.array(SeriesCardSchema),
      total: z.number(),
    }),
  ),
  totalRails: z.number(),
});

const RecommendationRailSchema = z.discriminatedUnion("kind", [
  z.object({
    id: z.string(),
    title: z.string(),
    kind: z.literal("CONTENT"),
    items: z.array(ScoredContentSchema),
    total: z.number(),
  }),
  z.object({
    id: z.string(),
    title: z.string(),
    kind: z.literal("SERIES"),
    items: z.array(
      z.object({
        score: z.number(),
        series: SeriesCardSchema,
        latestContent: ContentCardSchema.pick({
          id: true,
          watchId: true,
          type: true,
          createdAt: true,
          updatedAt: true,
        }),
      }),
    ),
    total: z.number(),
  }),
  z.object({
    id: z.string(),
    title: z.string(),
    kind: z.literal("WATCH_RECORD"),
    items: z.array(z.any()), // using any to avoid defining the whole ContinueWatchingItemSchema here for simplicity
    total: z.number(),
  }),
]);

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

export const HomeBundleResponseSchema = z.object({
  ok: z.literal(true),
  data: z.object({
    userId: z.number(),
    latest: z.object({
      items: z.array(ContentCardSchema),
      total: z.number(),
    }),
    continueWatching: ContinueWatchingResponseSchema.shape.data,
    recommendations: z.object({
      items: z.array(ScoredContentSchema),
      total: z.number(),
      basedOnHistoryCount: z.number(),
      preferredSeriesIds: z.array(z.number()),
    }),
    series: z.object({
      items: z.array(SeriesCardSchema),
      total: z.number(),
    }),
    recommendationRails: z
      .object({
        rails: z.array(RecommendationRailSchema),
        totalRails: z.number(),
        algorithmVersion: z.string().optional(),
      })
      .nullable(),
    trending: z.object({
      items: z.array(ScoredContentSchema),
      total: z.number(),
      windowDays: z.number(),
    }),
    newSeason: z.object({
      items: z.array(NewSeasonItemSchema),
      total: z.number(),
      windowDays: z.number(),
    }),
    latestSeries: z.object({
      items: z.array(LatestSeriesItemSchema),
      total: z.number(),
    }),
    currentlyAiring: z.object({
      items: z.array(CurrentlyAiringItemSchema),
      total: z.number(),
      quarter: z.object({
        year: z.number(),
        quarter: z.number(),
        startAt: z.string(),
        endAt: z.string(),
      }),
      quarterMatched: z.number(),
    }),
    similarSeries: SimilarSeriesRailsSchema.nullable(),
  }),
});

export type HomeBundleResponse = z.infer<typeof HomeBundleResponseSchema>;

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

export const HomeTrendingResponseSchema = z.object({
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
    windowDays: z.number(),
    fallback: z.boolean(),
  }),
});

export type HomeTrendingResponse = z.infer<typeof HomeTrendingResponseSchema>;
