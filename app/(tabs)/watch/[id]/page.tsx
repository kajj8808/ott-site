import { getMetadata, getWatchContent } from "./action";
import { Metadata } from "next";

/* import { unstable_cache as nextCache } from "next/cache";
 */
import { authWithUserSession } from "@/app/lib/server/auth";
import { redirect } from "next/navigation";
import { isBotRequest } from "@/app/lib/server/isBot";
import VideoPlayer from "@/app/components/VideoPlayer";
import { getUserSeriesPersonalized } from "../../series/[id]/action";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const metadata = await getMetadata(id);
  return metadata;
}

/* const getCachedVideoContent = nextCache(
  async (id, userToken) => await getVideoContentDetail(id, userToken),
  ["video_detail"],
  { revalidate: 3600, tags: ["video"] },
); // 3600 -> 1hour */

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const isBot = await isBotRequest();
  if (isBot) {
    return;
  }

  const { id } = await params;
  const userSession = await authWithUserSession();
  if (!userSession.user) {
    redirect("/log-in");
  }

  const watchContent = await getWatchContent({
    contentId: id,
    userToken: userSession.user.auth.accessToken,
  });

  let seriesSeasons:
    | Awaited<ReturnType<typeof getUserSeriesPersonalized>>["seasons"]
    | undefined;

  const seriesId = watchContent.videoContent.series?.id;

  if (seriesId) {
    try {
      const seriesData = await getUserSeriesPersonalized({
        seriesId,
        userToken: userSession.user.auth.accessToken,
        expand: "seasonContexts",
      });
      seriesSeasons = seriesData.seasons;
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      {/* // FIXME: 이부분 seires => 반응형으로 movie 등.. */}

      <VideoPlayer
        goBackLink={
          watchContent.videoContent.series?.id
            ? `/series/${watchContent.videoContent.series.id}`
            : `/`
        }
        watchContent={watchContent}
        seriesSeasons={seriesSeasons}
      />
    </div>
  );
}
