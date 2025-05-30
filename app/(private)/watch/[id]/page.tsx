import VideoPlayer from "@/app/components/VideoPlayer";
import { getVideoContentDetail } from "./action";
import { Metadata } from "next";

import { unstable_cache as nextCache } from "next/cache";
import { authWithUserSession } from "@/app/lib/server/auth";
import { redirect } from "next/navigation";

const getCachedVideoContent = nextCache(
  async (id, userToken) => await getVideoContentDetail(id, userToken),
  ["video_detail"],
  { revalidate: 3600, tags: ["video"] },
); // 3600 -> 1hour

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 3000);
  });
  const { id } = await params;

  // await getWatchMetadata();
  return {
    title: "watch",
    openGraph: {}, // 페이지 설명
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const userSession = await authWithUserSession();
  if (!userSession.user) {
    redirect("/log-in");
  }
  const videoContent = await getCachedVideoContent(id, userSession.user.token);
  if (!videoContent) {
    return null;
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
