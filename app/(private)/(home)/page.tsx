import {
  getAllSeries,
  getMovies,
  getNowPlayingSeries,
  getUserWatingProgress,
} from "./action";

import { notFound } from "next/navigation";

import { unstable_cache as nextCache } from "next/cache";
import Header from "@/app/components/Header";
import { authWithUserSession } from "@/app/lib/server/auth";
import WatchingList from "@/app/components/WatchingList";
import ContentsList from "@/app/components/ContentList";

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
    const allSeires = await getAllSeries();
    const allMovies = await getMovies();
    return { nowPlayingSeries, allSeires, allMovies };
  },
  ["series"],
  { revalidate: 520, tags: ["home", "contents"] },
); // 3600 -> 1hour

export default async function Home() {
  const { nowPlayingSeries, allSeires, allMovies } = await getCachedContents();
  const userSession = await authWithUserSession();
  const user = userSession.user;
  getMovies();
  if (!nowPlayingSeries || !allSeires || !allMovies || !user) {
    return notFound();
  }
  const watchingContents = await getCachedUserWatchProgress(user.token);

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
          contents={nowPlayingSeries}
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
          title="ALL"
          contents={allSeires}
          contentType="EPISODE"
        />

        <footer className="bg-background fixed right-0 bottom-0 m-2 flex flex-col items-center rounded-sm p-3">
          <h4 className="text-sm text-neutral-600">BETA</h4>
        </footer>
      </div>
    </div>
  );
}
