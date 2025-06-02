import VideoPlayer from "@/app/components/VideoPlayer";
import { getMetadata, getVideoContentDetail } from "./action";
import { Metadata } from "next";

import { unstable_cache as nextCache } from "next/cache";
import { authWithUserSession } from "@/app/lib/server/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { isBotRequest } from "@/app/lib/server/isBot";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const metadata = await getMetadata(id);
  return metadata;
}

const getCachedVideoContent = nextCache(
  async (id, userToken) => await getVideoContentDetail(id, userToken),
  ["video_detail"],
  { revalidate: 3600, tags: ["video"] },
); // 3600 -> 1hour

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
  const videoContent = await getCachedVideoContent(id, userSession.user.token);
  if (!videoContent) {
    redirect("/log-in");
  }

  return (
    <div>
      {/* // FIXME: 이부분 seires => 반응형으로 movie 등.. */}
      <VideoPlayer
        goBackLink={
          videoContent.series?.id ? `/series/${videoContent.series.id}` : `/`
        }
        videoContent={videoContent}
      />
    </div>
  );
}
