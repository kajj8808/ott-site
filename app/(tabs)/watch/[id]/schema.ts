import { z } from "zod";

export const WatchContentContextResponseSchema = z.object({
  ok: z.literal(true),
  data: z.object({
    videoContent: z.object({
      id: z.number().nullable(),
      watchId: z.string().nullable(),
      watchUrl: z.string().nullable(),
      subtitleId: z.string().nullable(),
      type: z.enum(["EPISODE", "MOVIE"]).nullable(),
      series: z
        .object({
          id: z.number().nullable(),
          title: z.string().nullable(),
        })
        .nullable(),
      season: z
        .object({
          id: z.number().nullable(),
          seasonNumber: z.number().nullable(),
          name: z.string().nullable(),
        })
        .nullable(),
      episode: z
        .object({
          id: z.number().nullable(),
          episodeNumber: z.number().nullable(),
          name: z.string().nullable(),
        })
        .nullable(),
      movie: z
        .object({
          id: z.number().nullable(),
          title: z.string().nullable(),
        })
        .nullable(),
    }),
    progress: z
      .object({
        videoContentId: z.number().nullable(),
        currentTime: z.number(),
        totalDuration: z.number().nullable(),
        status: z.enum(["WATCHING", "COMPLETED", "DROPPED"]).nullable(),
        updatedAt: z.string().nullable(),
      })
      .nullable(),
    navigation: z
      .object({
        currentEpisodeNumber: z.number().int().nullable().optional(),
        previous: z
          .object({
            id: z.number().int().nullable().optional(),
            videoContentId: z.number().int().nullable().optional(),
            watchId: z.string().nullable().optional(),
            streamPath: z.string().nullable().optional(),
            episodeNumber: z.number().int().nullable().optional(),
            name: z.string().nullable().optional(),
            stillPath: z.string().nullable().optional(),
            runtime: z.number().int().nullable().optional(),
            isCurrent: z.boolean().optional(),
          })
          .nullable()
          .optional(),
        next: z
          .object({
            id: z.number().int().nullable().optional(),
            videoContentId: z.number().int().nullable().optional(),
            watchId: z.string().nullable().optional(),
            streamPath: z.string().nullable().optional(),
            episodeNumber: z.number().int().nullable().optional(),
            name: z.string().nullable().optional(),
            stillPath: z.string().nullable().optional(),
            runtime: z.number().int().nullable().optional(),
            isCurrent: z.boolean().optional(),
          })
          .nullable()
          .optional(),
        seasonEpisodes: z
          .array(
            z.object({
              id: z.number().int().nullable().optional(),
              videoContentId: z.number().int().nullable().optional(),
              watchId: z.string().nullable().optional(),
              streamPath: z.string().nullable().optional(),
              episodeNumber: z.number().int().nullable().optional(),
              name: z.string().nullable().optional(),
              stillPath: z.string().nullable().optional(),
              runtime: z.number().int().nullable().optional(),
              isCurrent: z.boolean().optional(),
            }),
          )
          .optional(),
      })
      .nullable(),
    nextEpisode: z
      .object({
        seasonId: z.number().nullable(),
        seasonNumber: z.number().nullable(),
        seasonName: z.string().nullable(),
        episodeId: z.number().nullable(),
        episodeNumber: z.number().nullable(),
        episodeName: z.string().nullable(),
        content: z
          .object({
            id: z.number().nullable(),
            watchId: z.string().nullable(),
            watchUrl: z.string().nullable(),
            subtitleId: z.string().nullable(),
            type: z.string().nullable(),
          })
          .nullable(),
      })
      .nullable(),
  }),
});

export type WatchContentContextResponse = z.infer<
  typeof WatchContentContextResponseSchema
>;

export const WatchRecordSaveResponseSchema = z.object({
  ok: z.boolean(),
  data: z.object({
    item: z.object({
      userId: z.number(),
      videoContentId: z.number(),
      currentTime: z.number(),
      status: z.string(),
    }),
  }),
});

export type WatchRecordSaveResponse = z.infer<
  typeof WatchRecordSaveResponseSchema
>;
