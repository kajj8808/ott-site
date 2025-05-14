import { daysAgo } from "@/app/utils/libs";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getSeriesDetail } from "./action";
import SeasonEpisodeList from "@/app/components/SeasonEpisodeList";

import { unstable_cache as nextCache } from "next/cache";
import Header from "@/app/components/Header";
import { getUserSession } from "@/app/lib/server/session";

const getCachedSeriesDetail = nextCache(
  async (id, userToken) => await getSeriesDetail(id, userToken),
  ["series_detail"],
  { revalidate: 520, tags: ["series"] },
); // 3600 -> 1hour

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const userSession = await getUserSession();
  const userToken = userSession.user?.token;

  const seires = await getCachedSeriesDetail(id, userToken);

  if (!seires) {
    return notFound();
  }

  return (
    <div>
      <Header />
      <div className="mt-20 flex justify-center">
        <div className="w-full max-w-4xl">
          <div className="relative aspect-video">
            <Image src={seires.backdrop_path} fill alt={seires.title} />
            <div className="to-background absolute top-0 left-0 h-full w-full bg-gradient-to-b from-transparent via-transparent"></div>
            <div className="absolute bottom-3">
              <h3 className="pl-3 text-2xl font-semibold sm:text-3xl">
                {seires.title}
              </h3>
            </div>
          </div>
          <div className="flex flex-col gap-3 px-3 pb-5">
            <span className="line-clamp-2 text-sm">{seires.overview}</span>
            <p className="text-sm">{daysAgo(seires.updated_at)} 업데이트</p>
          </div>
          <SeasonEpisodeList seasons={seires.season} />
        </div>
      </div>
    </div>
  );
}
