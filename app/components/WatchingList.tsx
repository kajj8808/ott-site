import Link from "next/link";
import Image from "next/image";
import ContentTitle from "./ContentTitle";

interface Content {
  id: number;
  backdrop_path: string;
  title: string;
  watched_at: string;
  series_id: number;
  movie_id: number;
  total_duration: string;
  current_time: string;
  type: "MOVIE" | "EPISODE";
}

export default function WatchingList({
  contents,
  title,
  subtitle,
}: {
  contents: Content[];
  title: string;
  subtitle: string;
}) {
  return (
    <div className="w-full">
      <ContentTitle title={title} subtitle={subtitle} />
      <div className="mt-2 grid grid-cols-[repeat(auto-fill,minmax(min(310px,100%),1fr))] gap-2 overflow-hidden sm:mt-3">
        {contents?.map((content) => (
          <Link
            href={`/watch/${content.id}`}
            key={content.id}
            className="group relative cursor-pointer py-1"
          >
            <div className="relative overflow-hidden rounded-sm">
              <Image
                src={content.backdrop_path}
                width={320}
                height={240}
                alt={content.title}
                className="w-full overflow-hidden transition-all group-hover:scale-110"
              />
              <div className="absolute top-0 h-full w-full bg-gradient-to-b from-black/50 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 flex h-full w-full items-end bg-gradient-to-t from-black/50 via-transparent to-transparent">
                <h5 className="line-clamp-1 p-2 text-sm">
                  {content.title.length > 18
                    ? content.title.slice(0, 18) + "..."
                    : content.title}
                </h5>
              </div>
            </div>
            <div className="relative mx-auto mt-2 w-3/4 overflow-hidden">
              <div className="h-1 rounded-xs bg-neutral-700"></div>
              <div
                className="absolute top-0 z-30 h-1 rounded-xs bg-indigo-600"
                style={{
                  width: `${((+content.current_time * 100) / +content.total_duration).toFixed(0)}%`,
                }}
              ></div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
