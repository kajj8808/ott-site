import Link from "next/link";
import Image from "next/image";
import ContentTitle from "./ContentTitle";
import { timeAgo } from "../utils/libs";

interface ContentList {
  id: number;
  title: string;
  backdrop_path: string | null;
  seasonName?: string;
  updatedAt?: Date;
  episodeNumber?: number;
}

export default function ContentsList({
  contents,
  title,
  subtitle,
  contentType,
}: {
  contents: ContentList[];
  title: string;
  subtitle: string;
  contentType: "MOVIE" | "EPISODE";
}) {
  return (
    <section className="mx-auto w-full">
      <ContentTitle title={title} subtitle={subtitle} />
      <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(min(310px,100%),1fr))] gap-2 overflow-hidden">
        {contents?.map((content) => (
          <Link
            href={
              contentType === "EPISODE"
                ? `/series/${content.id}`
                : `/movies/${content.id}`
            }
            key={content.id}
            className="group relative flex cursor-pointer flex-col gap-1 rounded-md"
          >
            <div className="overflow-hidden rounded-md">
              <Image
                width={320}
                height={160}
                src={content.backdrop_path!}
                alt={`${content.title}-backdrop`}
                className="w-full transition-transform group-hover:scale-110"
              />
            </div>
            <div className="absolute bottom-0 z-50 w-full p-2 text-shadow-current">
              <span className="text-sm font-semibold">{content.title}</span>
              <div className="flex justify-between">
                {content.seasonName && content.episodeNumber && (
                  <span className="text-xs opacity-70">
                    {content.seasonName} {content.episodeNumber}화
                  </span>
                )}

                {content.updatedAt && (
                  <span className="text-xs opacity-70">
                    {timeAgo(content.updatedAt)} 업데이트
                  </span>
                )}
              </div>
            </div>
            <div className="absolute bottom-0 flex h-full w-full items-end bg-gradient-to-t from-black/90 via-transparent to-transparent blur-xl" />
          </Link>
        ))}
      </div>
    </section>
  );
}
