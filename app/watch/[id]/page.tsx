import VideoPlayer from "@/app/components/VideoPlayer";
import { getVideoContentDetail } from "./action";
import { Metadata } from "next";
import Link from "next/link";

import { unstable_cache as nextCache } from "next/cache";

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
    <div className="flex h-dvh items-center w-full -mt-20 relative">
      <div className="flex justify-center w-full relative">
        <VideoPlayer
          watchId={result.watch_id}
          subtitleId={result.subtitle_id}
        />
      </div>
      {result.next_episode ? (
        <Link
          href={`/watch/${result.next_episode.video_content_id}`}
          className="absolute z-40 bottom-8 right-8 font-semibold text-sm border px-3 py-1.5 rounded-md hover:bg-white/20 transition-colors cursor-pointer"
        >
          다음화
        </Link>
      ) : null}
    </div>
  );
}
