import { daysAgo } from "@/app/utils/libs";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getSeriesDetail } from "./action";
import SeasonEpisodeList from "@/app/components/SeasonEpisodeList";

import { unstable_cache as nextCache } from "next/cache";

const getCachedSeriesDetail = nextCache(
  async (id) => await getSeriesDetail(id),
  ["series_detail"],
  { revalidate: 520, tags: ["series"] }
); // 3600 -> 1hour

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const seires = await getCachedSeriesDetail(id);

  if (!seires) {
    return notFound();
  }

  return (
    <div className="flex justify-center">
      <div className="max-w-4xl w-full">
        <div className="relative aspect-video">
          <Image src={seires.backdrop_path} fill alt={seires.title} />
          <div className="bg-gradient-to-b from-transparent via-transparent to-background w-full h-full absolute left-0 top-0"></div>
          <div className="absolute bottom-3">
            <h3 className="font-semibold text-2xl sm:text-3xl pl-3">
              {seires.title}
            </h3>
          </div>
        </div>
        <div className="px-3 pb-5 flex flex-col gap-3">
          <span className="line-clamp-2 text-sm">{seires.overview}</span>
          <p className="text-sm">{daysAgo(seires.updated_at)} 업데이트</p>
        </div>
        <SeasonEpisodeList seasons={seires.season} />
      </div>
    </div>
  );
}
