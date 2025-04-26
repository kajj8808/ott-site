import Link from "next/link";
import Image from "next/image";
import { Series } from "../(private)/(home)/action";

export default function SeriesList({
  seriesList,
  title,
}: {
  seriesList: Series[];
  title: string;
}) {
  return (
    <div className="w-full">
      <div>
        <h4 className="text-xs text-neutral-600">Series</h4>
        <h3 className="font-semibold text-xl">{title}</h3>
      </div>
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-1">
        {seriesList?.map((series) => (
          <Link
            href={`/series/${series.id}`}
            key={series.id}
            className="relative cursor-pointer group"
          >
            <Image
              src={series.backdrop_path}
              width={320}
              height={240}
              alt={series.title}
              className="overflow-hidden rounded-sm w-full"
            />
            <h5 className="text-sm absolute bottom-2/12 pl-2 pr-12 py-2 rounded-tr-3xl rounded-br-2xl group-hover:opacity-100 opacity-0 transition-opacity ease-in-out bg-gradient-to-r from-black via-black">
              {series.title}
            </h5>
          </Link>
        ))}
      </div>
    </div>
  );
}
