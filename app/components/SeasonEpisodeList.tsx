"use client";

import Image from "next/image";
import Link from "next/link";

import { ChangeEvent, useEffect, useState } from "react";

import type { SeriesPersonalizedResponse } from "@/app/(tabs)/series/[id]/schema";

type SeriesData = SeriesPersonalizedResponse["data"];
type SeasonRecord = SeriesData["seasons"][number];
type SelectedSeasonRecord = NonNullable<SeriesData["selectedSeason"]>;

export type Episode = SeasonRecord["episodes"][number];

export interface SeasonCommon {
  id: SeasonRecord["id"];
  seasonNumber: SeasonRecord["seasonNumber"];
  name: SeasonRecord["name"];
  episodes: Episode[];
}

export interface Season extends SeasonCommon {
  seasonName?: SeasonRecord["seasonName"];
  airDate?: SeasonRecord["airDate"];
  episodeCount?: SeasonRecord["episodeCount"];
  posterPath?: SeasonRecord["posterPath"];
  userProgress?: SeasonRecord["userProgress"];
  resume?: SeasonRecord["resume"];
}

export type LastPlayedSeason = NonNullable<SeriesData["lastPlayedSeason"]>;

export interface SelectedSeason extends SeasonCommon {
  posterPath: SelectedSeasonRecord["posterPath"];
}

interface SeasonEpisodeListProps {
  seasons: Season[];
  lastPlayedSeason: LastPlayedSeason | null;
  selectedSeason: SelectedSeason | null;
}

export default function SeasonEpisodeList({
  seasons,
  lastPlayedSeason,
  selectedSeason,
}: SeasonEpisodeListProps) {
  const [season, setSeason] = useState<Season | undefined>(() => {
    if (selectedSeason) {
      return {
        id: selectedSeason.id,
        seasonNumber: selectedSeason.seasonNumber,
        name: selectedSeason.name,
        seasonName: selectedSeason.name,
        airDate: null,
        episodes: selectedSeason.episodes,
      };
    }
    if (lastPlayedSeason?.id == null) {
      return seasons[0];
    }
    return (
      seasons.find((item) => item.id === lastPlayedSeason.id) ?? seasons[0]
    );
  });

  useEffect(() => {
    if (selectedSeason) {
      setSeason({
        id: selectedSeason.id,
        seasonNumber: selectedSeason.seasonNumber,
        name: selectedSeason.name,
        seasonName: selectedSeason.name,
        airDate: null,
        episodes: selectedSeason.episodes,
      });
      return;
    }
    if (lastPlayedSeason?.id == null) {
      setSeason(seasons[0]);
      return;
    }
    setSeason(
      seasons.find((item) => item.id === lastPlayedSeason.id) ?? seasons[0],
    );
  }, [lastPlayedSeason?.id, selectedSeason, seasons]);

  const onSelectChange = async (event: ChangeEvent<HTMLSelectElement>) => {
    const nextSeason = seasons.find((s) => String(s.id) === event.target.value);
    if (nextSeason) {
      setSeason(nextSeason);
    }
  };

  return (
    <>
      <div className="flex justify-between px-3 pb-3 text-base font-medium sm:text-lg">
        <p>{`Season ${season?.seasonNumber ?? ""}`}</p>
        {seasons.length < 2 ? (
          <p>{season?.name}</p>
        ) : (
          <select
            value={season?.id ?? ""}
            className="bg-background"
            onChange={onSelectChange}
          >
            {seasons.map((season) => (
              <option
                key={
                  season.id ??
                  `season-${season.seasonNumber ?? season.name ?? "unknown"}`
                }
                value={season.id ?? ""}
              >
                {season.name}
              </option>
            ))}
          </select>
        )}
      </div>
      <div className="flex flex-col px-3">
        {season?.episodes?.map((episode) => (
          <Link
            key={episode.id ?? `${episode.episodeNumber}-${episode.name}`}
            className="grid cursor-pointer grid-cols-12 gap-3 border-b border-white/20 px-2 py-3 transition-colors hover:bg-white/20 nth-[1]:border-t"
            href={episode.content?.id ? `/watch/${episode.content.id}` : "#"}
          >
            <div className="relative col-span-3 overflow-hidden rounded-md">
              {episode.stillPath ? (
                <Image
                  src={episode.stillPath}
                  alt={`${episode.id ?? "episode"}`}
                  width={256}
                  height={144}
                />
              ) : (
                <div className="aspect-video w-full bg-white/10" />
              )}
              {episode.progress && episode.progress.totalDuration ? (
                <div className="absolute bottom-0 left-0 h-1 w-full">
                  <div className="h-full bg-neutral-500" />
                  <div
                    className="absolute top-0 z-30 h-full bg-indigo-600"
                    style={{
                      width: `${(
                        (episode.progress.currentTime * 100) /
                        episode.progress.totalDuration
                      ).toFixed(0)}%`,
                    }}
                  />
                </div>
              ) : null}
            </div>
            <div className="col-span-9 flex h-full w-full flex-col gap-1 pt-1.5 sm:gap-2 sm:pt-2">
              <div className="flex justify-between text-sm font-semibold sm:text-base">
                <h5>
                  {episode.episodeNumber}.
                  {episode.name
                    ? episode.name.length > 18
                      ? `${episode.name.slice(0, 18)}...`
                      : episode.name
                    : ""}
                </h5>
                <h5>{episode.runtime ?? "-"}분</h5>
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
