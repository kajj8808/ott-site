import Link from "next/link";
import Image from "next/image";

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

export default function ContentsList({
  contents,
  title,
}: {
  contents: Content[];
  title: string;
}) {
  return (
    <div className="w-full">
      <div>
        <h4 className="text-xs text-neutral-600">Contents</h4>
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-[repeat(auto-fill,minmax(320px,1fr))]">
        {contents?.map((content) => (
          <Link
            href={`/watch/${content.id}`}
            key={content.id}
            className="group relative cursor-pointer"
          >
            <Image
              src={content.backdrop_path}
              width={320}
              height={240}
              alt={content.title}
              className="w-full overflow-hidden rounded-sm"
            />
            <h5 className="absolute bottom-2/12 rounded-tr-3xl rounded-br-2xl bg-gradient-to-r from-black via-black py-2 pr-12 pl-2 text-sm opacity-0 transition-opacity ease-in-out group-hover:opacity-100">
              {content.title}
            </h5>
            <div className="relative mt-2 overflow-hidden px-16">
              <div className="h-1 rounded-xs bg-neutral-700"></div>
              <div
                className="absolute top-0 z-30 h-1 rounded-xs bg-red-600"
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
