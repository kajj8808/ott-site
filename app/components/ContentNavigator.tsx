"use client";

import { useEffect, useState } from "react";
import {
  VideoContent,
  VideoContentSeason,
} from "../(private)/watch/[id]/action";
import { cls } from "../utils/libs";
import Link from "next/link";

export default function ContentNavigator({
  videoContent,
}: {
  videoContent: VideoContent;
}) {
  const [playingSeason, setPlayingSeason] = useState<
    VideoContentSeason | undefined
  >(undefined);

  useEffect(() => {
    const season = videoContent.series?.season?.find(
      (season) => videoContent.season?.id === season.id,
    );
    setPlayingSeason(season);
  }, [videoContent]);

  return (
    <div className="bg-background p-2">
      <h5>{playingSeason?.name}</h5>
      <ul className="flex flex-col">
        {playingSeason?.episodes?.map((episode) => (
          <Link
            href={`/watch/${episode.video_content_id}`}
            key={episode.id}
            className={cls(
              "grid max-w-md cursor-pointer grid-cols-12 gap-1.5 rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-white/20",
              episode.episode_number === videoContent.episode?.episode_number
                ? "bg-indigo-600"
                : "",
            )}
          >
            <div className="col-span-7 flex gap-1">
              <p>{episode.episode_number}</p>
              <span>{episode.name}</span>
            </div>
            {episode.user_watch_progress?.length ? (
              <div className="col-span-5 flex w-full items-center">
                <div className="relative h-1 w-full bg-white">
                  <div
                    className="absolute top-0 left-0 h-1 bg-indigo-600"
                    style={{
                      width: `${
                        (episode.user_watch_progress[0]?.current_time * 100) /
                        episode.user_watch_progress![0]?.total_duration
                      }%`,
                    }}
                  />
                </div>
              </div>
            ) : null}
          </Link>
        ))}
      </ul>
      {/*  <h5>{videoContent.series?.title}</h5>
      <ul>
        {videoContent.series?.season?.map((season) => (
          <li key={season.id}>
            <h6>{season.name}</h6>
            {season.episodes?.map((episode) => (
              <li key={episode.id}>{episode.name}</li>
            ))}
          </li>
        ))}
      </ul> */}
    </div>
  );
}
