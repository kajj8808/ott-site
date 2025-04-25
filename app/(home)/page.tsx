import Image from "next/image";
import { getNowPlayingSeries } from "./action";
import Link from "next/link";

export default async function Home() {
  const seiresList = await getNowPlayingSeries();

  return (
    <div className="px-8 flex flex-col items-center sm:items-start">
      <div className="flex justify-between w-full">
        <div>
          <h4 className="text-xs text-neutral-600">Series</h4>
          <h3 className="font-semibold text-xl">Now Playing</h3>
        </div>
        <div className="flex flex-col items-end">
          <h4 className="text-sm text-neutral-600">BETA Version</h4>
          <h4 className="text-sm text-neutral-600">next : 15.3.0</h4>
        </div>
      </div>
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 mt-5">
        {seiresList?.map((series) => (
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
              className="overflow-hidden rounded-md w-full"
            />
            <h5 className="text-sm absolute bottom-2/12 pl-2 pr-12 py-2 rounded-tr-3xl rounded-br-2xl group-hover:opacity-100 opacity-0 transition-opacity ease-in-out bg-gradient-to-r from-black via-black">
              {series.title}
            </h5>
          </Link>
        ))}
      </section>
      <div></div>
    </div>
  );
}
