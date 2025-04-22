import VideoPlayer from "@/app/components/VideoPlayer";
import { getVideoContentDetail } from "./action";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "",
  description: "",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getVideoContentDetail(id);

  if (!result) {
    return null;
  }

  return (
    <div className="flex h-dvh items-center w-full">
      <div className="flex justify-center w-full">
        <VideoPlayer
          watchId={result.watch_id}
          subtitleId={result.subtitle_id}
        />
      </div>
    </div>
  );
}
