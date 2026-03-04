import Image from "next/image";
import { notFound } from "next/navigation";

import { authWithUserSession } from "@/app/lib/server/auth";
import { isBotRequest } from "@/app/lib/server/isBot";

import { daysAgo } from "@/app/utils/libs";

import Header from "@/app/components/Header";
import SeasonEpisodeList from "@/app/components/SeasonEpisodeList";

import { getUserSeriesPersonalized } from "./action";
/* export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const metadata = await getMetadata(id);

  return metadata;
}
 */

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const isBot = await isBotRequest();
  if (isBot) {
    return;
  }

  const userSession = await authWithUserSession();
  const user = userSession.user;
  if (!user) {
    notFound();
  }
  const { id: seriesId } = await params;

  if (isNaN(+seriesId)) {
    return notFound();
  }

  const seriesData = await getUserSeriesPersonalized({
    seriesId: +seriesId,
    userToken: user.auth.accessToken,
    expand: "seasonContexts",
  });

  if (!seriesData || !seriesData.series) {
    return notFound();
  }

  return (
    <div>
      <Header />
      <div className="mt-20 flex justify-center">
        <div className="w-full max-w-4xl">
          <div className="relative aspect-video">
            <Image
              src={seriesData.series.backdropPath!}
              fill
              alt={seriesData.series.title}
            />
            <div className="to-background absolute top-0 left-0 h-full w-full bg-gradient-to-b from-transparent via-transparent"></div>
            <div className="absolute bottom-3">
              <h3 className="pl-3 text-2xl font-semibold sm:text-3xl">
                {seriesData.series.title}
              </h3>
            </div>
          </div>
          <div className="flex flex-col gap-3 px-3 pb-5">
            <span className="line-clamp-2 text-sm">
              {seriesData.series.overview}
            </span>
            {seriesData.series.updatedAt ? (
              <p className="text-sm">
                {daysAgo(seriesData.series.updatedAt)} 업데이트
              </p>
            ) : null}
          </div>
          <SeasonEpisodeList
            seasons={seriesData.seasons}
            lastPlayedSeason={seriesData.lastPlayedSeason}
            selectedSeason={seriesData.selectedSeason}
          />
        </div>
      </div>
    </div>
  );
}
