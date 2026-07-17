import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { authWithUserSession } from "@/app/lib/server/auth";
import { isBotRequest } from "@/app/lib/server/isBot";

import Header from "@/app/components/Header";
import ContentsList from "@/app/components/ContentList";
import { getHomeBundle, getLatestMovies } from "./action";
import { redirect } from "next/navigation";
import WatchingList from "@/app/components/WatchingList";

export const metadata: Metadata = {
  title: "home",
  description: "streemo home page",
};

type HomeBundle = Awaited<ReturnType<typeof getHomeBundle>>;
type SeriesCard = HomeBundle["series"]["items"][number];
type ContentCard = HomeBundle["latest"]["items"][number];
type RecommendationRail = NonNullable<
  HomeBundle["recommendationRails"]
>["rails"][number];
type ContentRail = Extract<RecommendationRail, { kind: "CONTENT" }>;
type SeriesRail = Extract<RecommendationRail, { kind: "SERIES" }>;
type SeriesListItem = SeriesCard & {
  updatedAt?: string;
};

function toSeriesList(items: SeriesListItem[]) {
  const uniqueItems = Array.from(
    new Map(items.map((item) => [item.id, item])).values(),
  ).slice(0, 7);

  return uniqueItems
    .map((item) => ({
      id: item.id,
      title: item.title,
      thumbnail: item.backdropPath ?? item.posterPath ?? null,
      updatedAt: item.updatedAt ? new Date(item.updatedAt) : undefined,
    }))
    .filter((item) => !!item.thumbnail);
}

function toWatchingList(items: ContentCard[]) {
  const uniqueItems = Array.from(
    new Map(items.map((item) => [item.id, item])).values(),
  ).slice(0, 7);

  return uniqueItems
    .map((item) => ({
      id: item.id,
      title: item.title ?? "Untitled",
      backdrop_path: item.thumbnail,
      current_time: 0,
      total_duration: null,
      type: item.type,
      watched_at: item.updatedAt,
      series_id: item.seriesId,
      movie_id: item.movieId,
    }))
    .filter(
      (
        item,
      ): item is Omit<typeof item, "backdrop_path"> & {
        backdrop_path: string;
      } => !!item.backdrop_path,
    );
}

function isContentRail(rail: RecommendationRail): rail is ContentRail {
  return rail.kind === "CONTENT";
}

function isSeriesRail(rail: RecommendationRail): rail is SeriesRail {
  return rail.kind === "SERIES";
}

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

  const [home, latestMovies] = await Promise.all([
    getHomeBundle({
      userToken: user.auth.accessToken,
    }),
    getLatestMovies({ limit: 8 }),
  ]);
  const hero = home.currentlyAiring.items.find((item) => !!item.series.backdropPath)?.series;
  const movieContents = latestMovies.items
    .map((item) => ({
      id: item.id,
      title: item.title,
      thumbnail: item.posterPath ?? item.backdropPath ?? null,
      updatedAt: item.content?.updatedAt
        ? new Date(item.content.updatedAt)
        : item.updatedAt
          ? new Date(item.updatedAt)
          : undefined,
    }))
    .filter((item) => !!item.thumbnail);

  return (
    <div>
      <Header />
      <div className="flex flex-col items-center gap-6 pt-16 pb-8 sm:items-start">
        {hero?.backdropPath ? (
          <section className="relative h-[52vh] min-h-80 w-full overflow-hidden sm:h-[60vh] sm:min-h-105 lg:h-[68vh] lg:min-h-130">
            <Image
              src={hero.backdropPath}
              alt={hero.title}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10" />
            <div className="to-background absolute inset-x-0 bottom-0 h-36 bg-gradient-to-b from-transparent" />
            <div className="absolute right-4 bottom-8 left-4 flex max-w-2xl flex-col gap-3 sm:bottom-12 sm:left-8 sm:gap-4 lg:bottom-16">
              <p className="text-sm font-semibold text-white/65">
                Currently Airing
              </p>
              <h1 className="text-3xl font-bold sm:text-5xl lg:text-6xl">
                {hero.title}
              </h1>
              {hero.overview ? (
                <p className="line-clamp-2 max-w-xl text-sm leading-6 text-white/75 sm:line-clamp-3 sm:text-base">
                  {hero.overview}
                </p>
              ) : null}
              <Link
                href={`/series/${hero.id}`}
                className="w-fit rounded-sm bg-white px-5 py-2 text-sm font-semibold text-black transition-colors hover:bg-white/80"
              >
                View Series
              </Link>
            </div>
          </section>
        ) : null}

        <div className="flex w-full flex-col gap-6 px-4 sm:px-8">
          {home.continueWatching.items.length ? (
            <WatchingList
              title={`Continue Watching for ${user.email}`}
              subtitle="Contents"
              contents={home.continueWatching.items
                .filter((item) => !!item.content.thumbnail)
                .map((item) => ({
                  id: item.videoContentId,
                  title: item.content.title ?? "Untitled",
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
          ) : null}

          {home.recommendationRails?.rails
            .filter(isSeriesRail)
            .filter((rail) => rail.id === "for-you")
            .map((rail) => (
              <ContentsList
                key={rail.id}
                subtitle="Series"
                title={rail.title}
                contents={toSeriesList(
                  rail.items.map((item) => ({
                    ...item.series,
                    updatedAt:
                      item.latestContent.updatedAt ?? item.series.updatedAt,
                  })),
                )}
                contentType="EPISODE"
              />
            ))}

          <ContentsList
            subtitle="Series"
            title="Latest Series"
            contents={toSeriesList(
              home.latestSeries.items.map((item) => ({
                ...item.series,
                updatedAt:
                  item.latestContent.updatedAt ?? item.series.updatedAt,
              })),
            )}
            contentType="EPISODE"
          />

          <ContentsList
            subtitle={`Q${home.currentlyAiring.quarter.quarter} ${home.currentlyAiring.quarter.year}`}
            title="Currently Airing"
            contents={toSeriesList(
              home.currentlyAiring.items.map((item) => ({
                ...item.series,
                updatedAt:
                  item.latestContent?.updatedAt ?? item.series.updatedAt,
              })),
            )}
            contentType="EPISODE"
          />

          {home.similarSeries ? (
            <ContentsList
              subtitle="Series"
              title="Similar Series"
              contents={toSeriesList(
                home.similarSeries.rails.flatMap((rail) => rail.items),
              )}
              contentType="EPISODE"
            />
          ) : null}

          <ContentsList
            subtitle={`Last ${home.newSeason.windowDays} days`}
            title="New Seasons"
            contents={toSeriesList(
              home.newSeason.items.map((item) => ({
                ...item.series,
                updatedAt:
                  item.series.updatedAt ??
                  item.createdAt ??
                  item.airDate ??
                  undefined,
              })),
            )}
            contentType="EPISODE"
          />

          {home.recommendationRails?.rails
            .filter(isSeriesRail)
            .filter((rail) => rail.id !== "for-you")
            .map((rail) => (
              <ContentsList
                key={rail.id}
                subtitle="Series"
                title={rail.title}
                contents={toSeriesList(
                  rail.items.map((item) => ({
                    ...item.series,
                    updatedAt:
                      item.latestContent.updatedAt ?? item.series.updatedAt,
                  })),
                )}
                contentType="EPISODE"
              />
            ))}

          {movieContents.length ? (
            <ContentsList
              subtitle="Movies"
              title="Latest Movies"
              contents={movieContents}
              contentType="MOVIE"
            />
          ) : null}

          {home.recommendationRails?.rails
            .filter(isContentRail)
            .filter((rail) => rail.id !== "for-you")
            .map((rail) => (
              <WatchingList
                key={rail.id}
                subtitle="Episodes & Movies"
                title={rail.title}
                contents={toWatchingList(
                  rail.items.map((item) => item.content),
                )}
              />
            ))}
        </div>
        <footer className="bg-background fixed right-0 bottom-0 m-2 flex flex-col items-center rounded-sm p-3">
          <h4 className="text-sm text-neutral-600">1.0.0 BETA</h4>
        </footer>
      </div>
    </div>
  );
}
