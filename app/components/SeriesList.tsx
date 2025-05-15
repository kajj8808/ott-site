import Link from "next/link";
import Image from "next/image";
import { Series } from "../(private)/(home)/action";
import ContentTitle from "./ContentTitle";

export default function SeriesList({
  seriesList,
  title,
  subtitle,
}: {
  seriesList: Series[];
  title: string;
  subtitle: string;
}) {
  return (
    <div className="w-full">
      <ContentTitle title={title} subtitle={subtitle} />
      <div className="mt-2 grid grid-cols-2 gap-1 sm:mt-3 sm:grid-cols-3 xl:grid-cols-[repeat(auto-fill,minmax(320px,1fr))]">
        {seriesList?.map((series) => (
          <Link
            href={`/series/${series.id}`}
            key={series.id}
            className="group relative cursor-pointer overflow-hidden rounded-sm"
          >
            <div className="relative">
              <Image
                src={series.backdrop_path}
                width={320}
                height={240}
                alt={series.title}
                className="w-full transition-all group-hover:scale-110"
              />
              {/* <h5 className="absolute bottom-0 z-40 pb-3 pl-2 text-sm sm:pb-5 sm:pl-4 sm:text-base sm:font-semibold">
                {series.title}
              </h5> */}
            </div>
            <div className="absolute top-0 left-0 z-30 h-full w-full">
              <div className="to-background/50 h-full bg-gradient-to-b from-transparent via-transparent"></div>
              <div className="to-background/50 absolute top-0 left-0 h-full w-full bg-gradient-to-t from-transparent via-transparent"></div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
