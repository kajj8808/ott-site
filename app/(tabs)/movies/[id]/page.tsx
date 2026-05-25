import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import Header from "@/app/components/Header";
import { authWithUserSession } from "@/app/lib/server/auth";
import { isBotRequest } from "@/app/lib/server/isBot";
import { daysAgo } from "@/app/utils/libs";
import { getMetadata, getMovieDetail } from "./action";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return getMetadata(id);
}

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
  if (!userSession.user) {
    return notFound();
  }

  const { id } = await params;
  if (isNaN(+id)) {
    return notFound();
  }

  const movie = await getMovieDetail(id);
  if (!movie) {
    return notFound();
  }

  const image = movie.backdropPath ?? movie.posterPath;

  return (
    <div>
      <Header />
      <main className="mt-20 flex justify-center px-4 pb-8 sm:px-8">
        <div className="w-full max-w-5xl">
          {image ? (
            <div className="relative aspect-video overflow-hidden rounded-sm">
              <Image
                src={image}
                fill
                alt={movie.title}
                className="object-cover"
              />
              <div className="to-background absolute inset-0 bg-gradient-to-t from-black/90 via-black/10" />
              <div className="absolute right-4 bottom-4 left-4">
                <p className="text-sm font-semibold text-white/65">Movie</p>
                <h1 className="text-3xl font-semibold sm:text-5xl">
                  {movie.title}
                </h1>
              </div>
            </div>
          ) : null}

          <div className="flex flex-col gap-4 py-5">
            {movie.overview ? (
              <p className="max-w-3xl text-sm leading-6 text-white/75">
                {movie.overview}
              </p>
            ) : null}
            <div className="flex flex-wrap gap-3 text-sm text-white/55">
              {movie.runtime ? <span>{movie.runtime} min</span> : null}
              {movie.releaseDate ? <span>{movie.releaseDate}</span> : null}
              {movie.content?.updatedAt ? (
                <span>{daysAgo(movie.content.updatedAt)} 업데이트</span>
              ) : null}
            </div>
            {movie.content?.id ? (
              <Link
                href={`/watch/${movie.content.id}`}
                className="w-fit rounded-sm bg-white px-5 py-2 text-sm font-semibold text-black transition-colors hover:bg-white/80"
              >
                Play
              </Link>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}
