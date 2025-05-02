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
    <div className="group relative flex h-dvh w-full items-center">
      <Link
        // FIXME: 이부분 seires => 반응형으로 movie 등..
        href={`/series/${result.series?.id}`}
        className="fixed top-10 left-8 z-40 opacity-0 transition-opacity group-hover:opacity-100"
      >
        <ArrowLeftIcon className="w-10" />
      </Link>
      <div className="relative flex max-h-dvh w-full justify-center">
        <VideoPlayer
          watchId={result.watch_id}
          subtitleId={result.subtitle_id}
        />
      </div>
      <div className="fixed bottom-0 flex h-24 w-full items-center justify-center border-t border-white/20 opacity-0 transition-opacity group-hover:opacity-100">
        {result.next_episode ? (
          <Link
            href={`/watch/${result.next_episode.video_content_id}`}
            className="bg-background absolute top-7 right-8 z-40 cursor-pointer rounded-md border px-3 py-1.5 text-sm font-semibold transition-colors hover:bg-white/20"
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
