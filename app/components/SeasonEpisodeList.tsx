"use client";

import Image from "next/image";
import Link from "next/link";
import { Season } from "../series/[id]/action";
import { ChangeEvent, useEffect, useState } from "react";

export default function SeasonEpisodeList({ seasons }: { seasons: Season[] }) {
  const [season, setSeason] = useState<Season | undefined>(undefined);

  useEffect(() => {
    if (seasons.length > 0) {
      const sortedSeasons = seasons.sort((a, b) => {
        const aDate = new Date(a.updated_at);
        const bDate = new Date(b.updated_at);
        if (aDate > bDate) {
          return -1;
        }
        if (aDate < bDate) {
          return 1;
        }
        return 0;
      });

      setSeason(sortedSeasons[0]);
    }
  }, [seasons]);

  const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    seasons.forEach((season) => {
      if (season.name === e.target.value) {
        setSeason(season);
      }
    });
  };

  return (
    <>
      <div className="flex justify-between pb-3 font-medium text-base sm:text-lg px-3">
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
        {season?.episodes.map((episode) => (
          <Link
            key={episode.video_content_id}
            className="grid grid-cols-12 py-3 gap-3 border-b border-white/20 hover:bg-white/20 transition-colors cursor-pointer px-2 nth-[1]:border-t"
            href={`/watch/${episode.video_content_id}`}
          >
            <div className="col-span-3 rounded-md overflow-hidden">
              <Image
                src={episode.still_path}
                alt={episode.video_content_id + ""}
                width={256}
                height={144}
              />
            </div>
            <div className="w-full col-span-9 flex flex-col h-full pt-1.5 sm:pt-2 gap-1 sm:gap-2">
              <div className="flex justify-between font-semibold text-sm smLtext-base">
                <h5>{episode.name}</h5>
                <h5>{episode.runtime}분</h5>
              </div>
              <p className="text-sm opacity-90 text-pretty line-clamp-1 sm:line-clamp-2">
                {episode.overview}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
