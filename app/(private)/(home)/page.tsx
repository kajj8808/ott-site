import {
  getAllSeries,
  getNowPlayingSeries,
  getSeriesIncludingDb,
} from "./action";

import SeriesList from "../../components/SeriesList";
import { notFound } from "next/navigation";

import { unstable_cache as nextCache } from "next/cache";
import { authWithUserSession } from "@/app/lib/server/auth";
import Header from "@/app/components/Header";

const getCachedSeries = nextCache(
  async () => {
    const nowPlayingSeries = await getNowPlayingSeries();
    const dbSeries = await getSeriesIncludingDb();
    const allSeires = await getAllSeries();
    return { nowPlayingSeries, dbSeries, allSeires };
  },
  ["series"],
  { revalidate: 520, tags: ["home"] }
); // 3600 -> 1hour

export default async function Home() {
  await authWithUserSession();

  const { dbSeries, nowPlayingSeries, allSeires } = await getCachedSeries();

  if (!nowPlayingSeries || !dbSeries || !allSeires) {
    return notFound();
  }

  return (
    <div>
      <Header />
      <div className="px-8 pb-5 flex flex-col items-center sm:items-start gap-5 mt-20">
        <SeriesList title="Now Playing" seriesList={nowPlayingSeries} />
        <SeriesList title="BD" seriesList={dbSeries} />
        <SeriesList title="ALL" seriesList={allSeires} />
        <footer className="right-0 bottom-0 fixed flex flex-col items-center m-2 p-3 bg-background rounded-md">
          <h4 className="text-sm text-neutral-600">BETA Version</h4>
          <h4 className="text-sm text-neutral-600">next : 15.3.0</h4>
        </footer>
      </div>
    </div>
  );
}
