import VideoPlayer from "@/app/components/VideoPlayer";
import { getVideoContentDetail } from "./action";
import { Metadata } from "next";
import Link from "next/link";

import { unstable_cache as nextCache } from "next/cache";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export const metadata: Metadata = {
  title: "",
  description: "",
};

const getCachedVideoContent = nextCache(
  async (id) => await getVideoContentDetail(id),
  ["video_detail"],
  { revalidate: 3600, tags: ["video"] }
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
    <div className="flex h-dvh items-center w-full relative group">
      <Link
        // FIXME: 이부분 seires => 반응형으로 movie 등..
        href={`/series/${result.series?.id}`}
        className="fixed left-8 top-10 opacity-0 group-hover:opacity-100 z-40 transition-opacity"
      >
        <ArrowLeftIcon className="w-10" />
      </Link>
      <div className="flex justify-center w-full relative max-h-dvh">
        <VideoPlayer
          watchId={result.watch_id}
          subtitleId={result.subtitle_id}
        />
      </div>
      <div className="fixed bottom-0 w-full flex justify-center items-center h-24 border-t border-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
        {result.next_episode ? (
          <Link
            href={`/watch/${result.next_episode.video_content_id}`}
            className="absolute z-40 top-7 right-8 font-semibold text-sm border px-3 py-1.5 rounded-md hover:bg-white/20 transition-colors cursor-pointer bg-background"
          >
            다음화
          </Link>
        ) : null}
        <div>
          <span>
            {result.season?.name} {result.episode?.episode_number}화
            {result.episode?.name}
          </span>
        </div>
      </div>
    </div>
  );
}
