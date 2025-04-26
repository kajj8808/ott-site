import { getNowPlayingSeries, getSeriesIncludingDb } from "./action";

import SeriesList from "../../components/SeriesList";
import { notFound } from "next/navigation";

import { unstable_cache as nextCache } from "next/cache";
import { authWithUserSession } from "@/app/lib/server/auth";

const getCachedSeries = nextCache(
  async () => {
    const nowPlayingSeries = await getNowPlayingSeries();
    const dbSeries = await getSeriesIncludingDb();
    return { nowPlayingSeries, dbSeries };
  },
  ["series"],
  { revalidate: 520, tags: ["home"] }
); // 3600 -> 1hour

export default async function Home() {
  const userSession = authWithUserSession();

  const { dbSeries, nowPlayingSeries } = await getCachedSeries();

  if (!nowPlayingSeries || !dbSeries) {
    return notFound();
  }

  return (
    <div className="px-8 flex flex-col items-center sm:items-start gap-5">
      <SeriesList title="Now Playing" seriesList={nowPlayingSeries} />
      <SeriesList title="DB" seriesList={dbSeries} />
      <footer className="right-0 bottom-0 fixed flex flex-col items-center p-5 ">
        <h4 className="text-sm text-neutral-600">BETA Version</h4>
        <h4 className="text-sm text-neutral-600">next : 15.3.0</h4>
      </footer>
    </div>
  );
}
