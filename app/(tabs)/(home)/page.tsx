import { Metadata } from "next";

import { authWithUserSession } from "@/app/lib/server/auth";
import { isBotRequest } from "@/app/lib/server/isBot";

import Header from "@/app/components/Header";
import ContentsList from "@/app/components/ContentList";
import {
  getContinueWatching,
  getLatestSeries,
  getRecommendationsSeries,
} from "./action";
import { redirect } from "next/navigation";
import WatchingList from "@/app/components/WatchingList";

/* import {
  getAllSeries,
  getMovies,
  getNowPlayingSeries,
  getSeriesIncludingDb,
  getUserWatingProgress,
} from "./action"; */

export const metadata: Metadata = {
  title: "home",
  description: "streemo home page",
};

/* const getCachedUserWatchProgress = nextCache(
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
); // 3600 -> 1hour */

export default async function Home() {
  const isBot = await isBotRequest();
  if (isBot) {
    return null;
  }

  const userSession = await authWithUserSession();
  const user = userSession.user;

  if (!user) {
    redirect("/");
  }

  /*   const contents = await getLatestContents(32);
  console.log(contents.data);
 */
  /*   const watchRecords = await getUserWatchRecords(user?.id);
  console.log(watchRecords.data); */

  /*  const { nowPlayingSeries, allSeries, allMovies, dbSeries } =
    await getCachedContents(); */

  /* getMovies();
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

  const dbSeiresContents = dbSeries; */
  const latestSeries = await getLatestSeries({ limit: 4 });

  const continueWatching = await getContinueWatching({
    userToken: user.auth.accessToken,
    limit: 4,
  });

  const recommendations = await getRecommendationsSeries({
    userToken: user.auth.accessToken,
    limit: 4,
  });

  return (
    <div>
      <Header />
      <div className="mt-16 flex flex-col items-center gap-5 px-8 pb-5 sm:mt-20 sm:items-start">
        <WatchingList
          title={`Continue Wathing for ${user.email}`}
          subtitle="Contents"
          contents={continueWatching.items
            .filter((item) => !!item.content.thumbnail)
            .map((item) => ({
              id: item.videoContentId,
              title: item.content.title,
              backdrop_path: item.content.thumbnail!,
              current_time: item.currentTime,
              total_duration: item.totalDuration,
              type: item.content.type,
              watched_at: item.updatedAt,
              series_id: item.content.seriesId,
              movie_id:
                item.content.movieId ??
                (item.content.type === "MOVIE" ? item.content.id : null),
            }))}
        />
        {/*  {watchingContents[0] ? (
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
*/}
        <ContentsList
          subtitle="Series"
          title="Latest"
          contents={latestSeries.items.map((item) => ({
            id: item.series.id,
            title: item.series.title,
            thumbnail: item.series.backdropPath,
            updatedAt: new Date(item.series.updatedAt),
          }))}
          contentType="EPISODE"
        />

        <ContentsList
          subtitle="Series"
          title="Recommended"
          contents={recommendations.items.map((item) => ({
            id: item.series.id,
            title: item.series.title,
            thumbnail: item.series.backdropPath,
            updatedAt: new Date(item.series.updatedAt),
          }))}
          contentType="EPISODE"
        />
        <footer className="bg-background fixed right-0 bottom-0 m-2 flex flex-col items-center rounded-sm p-3">
          <h4 className="text-sm text-neutral-600">0.0.1 BETA</h4>
        </footer>
      </div>
    </div>
  );
}
