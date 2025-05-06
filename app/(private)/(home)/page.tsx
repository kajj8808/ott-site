import {
  getAllSeries,
  getNowPlayingSeries,
  getSeriesIncludingDb,
} from "./action";

import SeriesList from "../../components/SeriesList";
import { notFound } from "next/navigation";

import { unstable_cache as nextCache } from "next/cache";
import Header from "@/app/components/Header";

const getCachedSeries = nextCache(
  async () => {
    const nowPlayingSeries = await getNowPlayingSeries();
    const dbSeries = await getSeriesIncludingDb();
    const allSeires = await getAllSeries();
    return { nowPlayingSeries, dbSeries, allSeires };
  },
  ["series"],
  { revalidate: 520, tags: ["home"] },
); // 3600 -> 1hour

export default async function Home() {
  const { dbSeries, nowPlayingSeries, allSeires } = await getCachedSeries();

  if (!nowPlayingSeries || !dbSeries || !allSeires) {
    return notFound();
  }

  return (
    <div>
      <Header />
      <div className="mt-20 flex flex-col items-center gap-5 px-8 pb-5 sm:items-start">
        <SeriesList title="Now Playing" seriesList={nowPlayingSeries} />
        <SeriesList title="BD" seriesList={dbSeries} />
        <SeriesList title="ALL" seriesList={allSeires} />
        <footer className="bg-background fixed right-0 bottom-0 m-2 flex flex-col items-center rounded-sm p-3">
          <h4 className="text-sm text-neutral-600">BETA</h4>
        </footer>
      </div>
    </div>
  );
}
