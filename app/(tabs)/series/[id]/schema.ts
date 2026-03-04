import { z } from "zod";

export const SeriesPersonalizedResponseSchema = z.object({
  ok: z.literal(true),
  data: z.object({
    series: z.object({
      id: z.number(),
      title: z.string(),
      overview: z.string().nullable(),
      description: z.string().nullable(),
      thumbnail: z.string().nullable(),
      posterPath: z.string().nullable(),
      backdropPath: z.string().nullable(),
      updatedAt: z.string().nullable(),
      updateAt: z.string().nullable(),
    }),
    seasons: z.array(
      z.object({
        id: z.number().nullable(),
        seasonNumber: z.number().nullable(),
        name: z.string().nullable(),
        seasonName: z.string().nullable(),
        airDate: z.string().nullable(),
        episodeCount: z.number(),
        posterPath: z.string().nullable(),
        episodes: z.array(
          z.object({
            id: z.number().nullable(),
            episodeNumber: z.number().nullable(),
            name: z.string().nullable(),
            overview: z.string().nullable(),
            stillPath: z.string().nullable(),
            runtime: z.number().nullable(),
            content: z
              .object({
                id: z.number().nullable(),
                watchId: z.string().nullable(),
                watchUrl: z.string().nullable(),
                subtitleId: z.string().nullable(),
                type: z.string().nullable(),
              })
              .nullable(),
            progress: z
              .object({
                currentTime: z.number(),
                totalDuration: z.number().nullable(),
                status: z.enum(["WATCHING", "COMPLETED", "DROPPED"]).nullable(),
                updatedAt: z.string().nullable(),
              })
              .nullable(),
          }),
        ),
        userProgress: z
          .object({
            selectedSeasonId: z.number().nullable(),
            totalItems: z.number(),
            watchingItems: z.number(),
            completedItems: z.number(),
            progressRatio: z.number(),
            lastUpdatedAt: z.string().nullable(),
          })
          .nullable(),
        resume: z
          .object({
            seasonId: z.number(),
            episodeId: z.number().nullable(),
            currentTime: z.number(),
          })
          .nullable(),
      }),
    ),
    lastPlayedSeason: z
      .object({
        id: z.number().nullable(),
        seasonNumber: z.number().nullable(),
        name: z.string().nullable(),
        episodeId: z.number().nullable(),
        currentTime: z.number(),
      })
      .nullable(),
    resume: z
      .object({
        seasonId: z.number(),
        episodeId: z.number().nullable(),
        currentTime: z.number(),
      })
      .nullable(),
    userProgress: z.object({
      selectedSeasonId: z.number().nullable(),
      totalItems: z.number(),
      watchingItems: z.number(),
      completedItems: z.number(),
      progressRatio: z.number(),
      lastUpdatedAt: z.string().nullable(),
    }),
    selectedSeason: z
      .object({
        id: z.number().nullable(),
        seasonNumber: z.number().nullable(),
        name: z.string().nullable(),
        posterPath: z.string().nullable(),
        episodes: z.array(
          z.object({
            id: z.number().nullable(),
            episodeNumber: z.number().nullable(),
            name: z.string().nullable(),
            overview: z.string().nullable(),
            stillPath: z.string().nullable(),
            runtime: z.number().nullable(),
            content: z
              .object({
                id: z.number().nullable(),
                watchId: z.string().nullable(),
                watchUrl: z.string().nullable(),
                subtitleId: z.string().nullable(),
                type: z.string().nullable(),
              })
              .nullable(),
            progress: z
              .object({
                currentTime: z.number(),
                totalDuration: z.number().nullable(),
                status: z.enum(["WATCHING", "COMPLETED", "DROPPED"]).nullable(),
                updatedAt: z.string().nullable(),
              })
              .nullable(),
          }),
        ),
      })
      .nullable(),
    seasonContextsTruncated: z.boolean(),
  }),
});

export type SeriesPersonalizedResponse = z.infer<
  typeof SeriesPersonalizedResponseSchema
>;

export const SeriesSeasonContextResponseSchema = z.object({
  ok: z.literal(true),
  data: z.object({
    seriesId: z.number(),
    seasonId: z.number(),
    lastPlayedSeason: z
      .object({
        id: z.number().nullable(),
        seasonNumber: z.number().nullable(),
        name: z.string().nullable(),
        episodeId: z.number().nullable(),
        currentTime: z.number(),
      })
      .nullable(),
    resume: z
      .object({
        seasonId: z.number(),
        episodeId: z.number().nullable(),
        currentTime: z.number(),
      })
      .nullable(),
    selectedSeason: z
      .object({
        id: z.number().nullable(),
        seasonNumber: z.number().nullable(),
        name: z.string().nullable(),
        posterPath: z.string().nullable(),
        episodes: z.array(
          z.object({
            id: z.number().nullable(),
            episodeNumber: z.number().nullable(),
            name: z.string().nullable(),
            overview: z.string().nullable(),
            stillPath: z.string().nullable(),
            runtime: z.number().nullable(),
            content: z
              .object({
                id: z.number().nullable(),
                watchId: z.string().nullable(),
                watchUrl: z.string().nullable(),
                subtitleId: z.string().nullable(),
                type: z.string().nullable(),
              })
              .nullable(),
            progress: z
              .object({
                currentTime: z.number(),
                totalDuration: z.number().nullable(),
                status: z.enum(["WATCHING", "COMPLETED", "DROPPED"]).nullable(),
                updatedAt: z.string().nullable(),
              })
              .nullable(),
          }),
        ),
      })
      .nullable(),
    userProgress: z.object({
      selectedSeasonId: z.number().nullable(),
      totalItems: z.number(),
      watchingItems: z.number(),
      completedItems: z.number(),
      progressRatio: z.number(),
      lastUpdatedAt: z.string().nullable(),
    }),
  }),
});

export type SeriesSeasonContextResponse = z.infer<
  typeof SeriesSeasonContextResponseSchema
>;
