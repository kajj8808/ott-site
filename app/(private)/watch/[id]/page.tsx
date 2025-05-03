import VideoPlayer from "@/app/components/VideoPlayer";
import { getVideoContentDetail } from "./action";
import { Metadata } from "next";

import { unstable_cache as nextCache } from "next/cache";

export const metadata: Metadata = {
  title: "",
  description: "",
};

const getCachedVideoContent = nextCache(
  async (id) => await getVideoContentDetail(id),
  ["video_detail"],
  { revalidate: 3600, tags: ["video"] },
); // 3600 -> 1hour

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getCachedVideoContent(id);

  if (!result) {
    return null;
  }

  return (
    <div>
      {/* // FIXME: 이부분 seires => 반응형으로 movie 등.. */}
      <VideoPlayer
        title={`${result.season?.name} ${result.episode?.episode_number}화
        ${result.episode?.name}`}
        goBackLink={result.series?.id ? `/series/${result.series.id}` : "/"}
        subtitleId={result.subtitle_id}
        watchId={result.watch_id}
        nextEpisode={result.next_episode}
      />
    </div>
  );
}
