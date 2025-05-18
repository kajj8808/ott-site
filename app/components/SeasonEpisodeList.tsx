"use client";

import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";
import { Episode, Season } from "../(private)/series/[id]/action";

export default function SeasonEpisodeList({
  seasons,
  lastWatchedProgress,
}: {
  seasons: Season[];
  lastWatchedProgress?: { video_content_id: number };
}) {
  const [season, setSeason] = useState<Season | undefined>(undefined);
  const [sortedEpisodes, setSortedEpisodes] = useState<Episode[]>([]);

  useEffect(() => {
    if (seasons.length > 0) {
      const sortedSeasons = seasons.sort((a, b) => {
        const aDate = new Date(a.season_number);
        const bDate = new Date(b.season_number);
        if (aDate > bDate) {
          return 1;
        }
        if (aDate < bDate) {
          return -1;
        }
        return 0;
      });

      if (lastWatchedProgress) {
        const lastWatchedSeason = sortedSeasons.find((season) => {
          return season.episodes.find(
            (episode) =>
              episode.video_content_id === lastWatchedProgress.video_content_id,
          );
        });
        setSeason(lastWatchedSeason);
      } else {
        setSeason(sortedSeasons[0]);
      }
    }
  }, [seasons, lastWatchedProgress]);

  useEffect(() => {
    if (season?.episodes) {
      const sortedEpisodes = season.episodes.sort((a, b) => {
        return a.episode_number - b.episode_number;
      });
      setSortedEpisodes(sortedEpisodes);
    }
  }, [season]);

  const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    seasons.forEach((season) => {
      if (season.name === e.target.value) {
        setSeason(season);
      }
    });
  };

  return (
    <>
      <div className="flex justify-between px-3 pb-3 text-base font-medium sm:text-lg">
        <p>{season?.source_type}</p>
        {seasons.length < 2 ? (
          <p>{season?.name}</p>
        ) : (
          <select
            value={season?.name}
            onChange={onSelectChange}
            className="bg-background"
          >
            {seasons.map((season) => (
              <option key={season.name}>{season.name}</option>
            ))}
          </select>
        )}
      </div>
      <div className="flex flex-col px-3">
        {sortedEpisodes.map((episode) => (
          <Link
            key={episode.video_content_id}
            className="grid cursor-pointer grid-cols-12 gap-3 border-b border-white/20 px-2 py-3 transition-colors hover:bg-white/20 nth-[1]:border-t"
            href={`/watch/${episode.video_content_id}`}
          >
            <div className="relative col-span-3 overflow-hidden rounded-md">
              <Image
                src={episode.still_path}
                alt={episode.video_content_id + ""}
                width={256}
                height={144}
              />
              {episode.user_watch_progress[0] ? (
                <div className="absolute bottom-0 left-0 h-1 w-full">
                  <div className="h-full bg-neutral-500" />
                  <div
                    className="absolute top-0 z-30 h-full bg-indigo-600"
                    style={{
                      width: `${((+episode.user_watch_progress[0].current_time * 100) / +episode.user_watch_progress[0].total_duration).toFixed(0)}%`,
                    }}
                  />
                </div>
              ) : null}
            </div>
            <div className="col-span-9 flex h-full w-full flex-col gap-1 pt-1.5 sm:gap-2 sm:pt-2">
              <div className="flex justify-between text-sm font-semibold sm:text-base">
                <h5>
                  {episode.episode_number}.
                  {episode.name.length > 18
                    ? `${episode.name.slice(0, 18)}...`
                    : episode.name}
                </h5>
                <h5>{episode.runtime}분</h5>
              </div>
              <p className="line-clamp-1 text-sm text-pretty opacity-90 sm:line-clamp-2">
                {episode.overview}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
