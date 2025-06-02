import Header from "@/app/components/Header";
import { getUserSession } from "@/app/lib/server/session";
import { daysAgo } from "@/app/utils/libs";
import { getMetadata, getMovieDetial } from "./action";
import { notFound } from "next/navigation";
import Image from "next/image";
import { PlayIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Metadata } from "next";
import { headers } from "next/headers";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const metadata = await getMetadata(id);
  return metadata;
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const userAgent = (await headers()).get("user-agent");
  const isDiscordBot = userAgent?.includes(
    "Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)",
  );

  if (isDiscordBot) {
    return (
      <div>
        <h3>Hello Discord Bot!</h3>
      </div>
    );
  }

  const { id } = await params;
  const userSession = await getUserSession();

  if (!userSession.user) {
    return notFound();
  }

  const movie = await getMovieDetial(id, userSession.user.token);

  if (!movie) {
    return notFound();
  }

  return (
    <div>
      <Header />
      <div className="mt-20 flex justify-center">
        <div className="w-full max-w-4xl">
          <div className="relative aspect-video">
            <Image src={movie.backdrop_path} fill alt={movie.title} />
            <div className="to-background absolute top-0 left-0 h-full w-full bg-gradient-to-b from-transparent via-transparent"></div>
            <div className="absolute bottom-3">
              <h3 className="pl-3 text-2xl font-semibold sm:text-3xl">
                {movie.title}
              </h3>
            </div>
          </div>
          <div className="flex flex-col gap-3 px-3 pb-5">
            <span className="line-clamp-2 text-sm">{movie.overview}</span>
            <p className="text-sm">{daysAgo(movie.updated_at)} 업데이트</p>
          </div>
          <div className="px-3">
            <Link
              href={`/watch/${movie.video_content_id}`}
              className="inline-block"
            >
              <button className="hover:text-background flex cursor-pointer items-center gap-1 rounded-md border px-8 py-2 transition-colors hover:bg-white">
                <PlayIcon className="size-8" />
                <span className="">Play</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
