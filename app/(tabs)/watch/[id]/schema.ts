import { z } from "zod";
export const WatchContentContextResponseSchema = z.object({
  ok: z.literal(true),
  data: z.object({
    content: z.object({
      id: z.number().nullable(),
      watchId: z.string().nullable(),
      watchUrl: z.string().nullable(),
      subtitleId: z.string().nullable(),
      type: z.enum(["EPISODE", "MOVIE"]).nullable(),
      seriesId: z.number().nullable(),
      seasonId: z.number().nullable(),
      episodeId: z.number().nullable(),
      movieId: z.number().nullable(),
    }),
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
      progress: z
        .object({
          videoContentId: z.number().nullable(),
          currentTime: z.number(),
          totalDuration: z.number().nullable(),
          status: z.enum(["WATCHING", "COMPLETED", "DROPPED"]).nullable(),
          updatedAt: z.string().nullable(),
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
    series: z
      .object({ id: z.number().nullable(), title: z.string().nullable() })
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
      .object({ id: z.number().nullable(), title: z.string().nullable() })
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
