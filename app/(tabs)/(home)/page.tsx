import { Metadata } from "next";
import { notFound } from "next/navigation";
import { unstable_cache as nextCache } from "next/cache";

import { authWithUserSession } from "@/app/lib/server/auth";
import { isBotRequest } from "@/app/lib/server/isBot";

import Header from "@/app/components/Header";
import WatchingList from "@/app/components/WatchingList";
import ContentsList from "@/app/components/ContentList";

import {
  getAllSeries,
  getMovies,
  getNowPlayingSeries,
  getSeriesIncludingDb,
  getUserWatingProgress,
} from "./action";

export const metadata: Metadata = {
  title: "home",
  description: "streemo home page",
};

const getCachedUserWatchProgress = nextCache(
  async (userToken) => {
    const userWatingProgrss = await getUserWatingProgress(userToken);
    return userWatingProgrss;
  },
  ["watch_progress"],
  { revalidate: 3600, tags: ["home", "watch_progress"] },
);

const getCachedContents = nextCache(
  async () => {
    const nowPlayingSeries = await getNowPlayingSeries();
    const allSeries = await getAllSeries();
    const allMovies = await getMovies();
    const dbSeries = await getSeriesIncludingDb();
    return { nowPlayingSeries, allSeries, allMovies, dbSeries };
  },
  ["series"],
  { revalidate: 520, tags: ["home", "contents"] },
); // 3600 -> 1hour

export default async function Home() {
  const isBot = await isBotRequest();
  if (isBot) {
    return null;
  }

  const userSession = await authWithUserSession();
  const user = userSession.user;

  const { nowPlayingSeries, allSeries, allMovies, dbSeries } =
    await getCachedContents();

  getMovies();
  if (!nowPlayingSeries || !allSeries || !allMovies || !user || !dbSeries) {
    return notFound();
  }
  const watchingContents = await getCachedUserWatchProgress(user.token);

  const nowPlayingContents =
    nowPlayingSeries
      ?.map((episode) => {
        if (!episode.series) {
          return null;
        }
        return {
          ...episode.series,
          seasonName: episode.season?.name ?? undefined,
          episodeNumber: episode.episode_number,
          updatedAt: new Date(episode.updated_at),
        };
      })
      .filter((s): s is NonNullable<typeof s> => !!s) ?? [];

  const dbSeiresContents = dbSeries;

  return (
    <div>
      <Header />
      <div className="mt-16 flex flex-col items-center gap-5 px-8 pb-5 sm:mt-20 sm:items-start">
        {watchingContents[0] ? (
          <WatchingList
            title={`Continue Wathing for ${user.email}`}
            subtitle="Contents"
            contents={watchingContents}
          />
        ) : null}

        <ContentsList
          subtitle="Series"
          title="Now Playing"
          contents={nowPlayingContents}
          contentType="EPISODE"
        />

        <ContentsList
          subtitle="Movies"
          title="ALL"
          contents={allMovies}
          contentType="MOVIE"
        />

        <ContentsList
          subtitle="Series"
          title="DB Include"
          contents={dbSeiresContents}
          contentType="EPISODE"
        />

        <ContentsList
          subtitle="Series"
          title="ALL"
          contents={allSeries || []}
          contentType="EPISODE"
        />

        <footer className="bg-background fixed right-0 bottom-0 m-2 flex flex-col items-center rounded-sm p-3">
          <h4 className="text-sm text-neutral-600">0.1.6 BETA</h4>
        </footer>
      </div>
    </div>
  );
}
