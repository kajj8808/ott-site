import Image from "next/image";
import db from "../../../prisma/client";
import { timeAgo } from "@/lib/utiles";

async function getSeriesList() {
  const seriesList = await db.series.findMany({
    take: 9,
    orderBy: {
      updated_at: "desc",
    },
  });
  return seriesList;
}

async function getLatestEpisodes() {
  const episodes = await db.episode.findMany({
    take: 4,
    orderBy: {
      updated_at: "desc",
    },
    distinct: ["series_id"],
    include: {
      series: {
        select: {
          id: true,
          title: true,
          poster_path: true,
          backdrop_path: true,
        },
      },
      season: {
        select: {
          name: true,
        },
      },
    },
  });
  return episodes;
}

export default async function Home() {
  const seriesList = await getSeriesList();
  const episodes = await getLatestEpisodes();
  return (
    <section className="p-8 mx-auto">
      <div>
        <h2 className="text-xs opacity-70">Series</h2>
        <h3 className="font-semibold text-xl">최근 업데이트 된 애니메이션</h3>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(310px,100%),1fr))] gap-2 mt-4 overflow-hidden">
        {episodes.map((episode) => (
          <div
            key={episode.id}
            className="rounded-md flex flex-col gap-1 relative group cursor-pointer"
          >
            <div className="overflow-hidden rounded-md">
              <Image
                width={320}
                height={160}
                src={episode.series?.backdrop_path!}
                alt={`${episode.series?.title}-backdrop`}
                className="w-full group-hover:scale-110 transition-transform"
              />
            </div>
            <div className="text-shadow-current absolute bottom-0 p-2 w-full z-50">
              <span className="text-sm font-semibold">
                {episode.series?.title}
              </span>
              <div className="flex justify-between">
                <span className="text-xs opacity-70">
                  {episode.season?.name} {episode.episode_number}화
                </span>
                <span className="text-xs opacity-70">
                  {timeAgo(episode.updated_at)} 업데이트
                </span>
              </div>
            </div>
            <div className="absolute bottom-0 flex h-full w-full items-end bg-gradient-to-t from-black/90 via-transparent to-transparent blur-xl" />
          </div>
        ))}
      </div>
    </section>
  );
}
