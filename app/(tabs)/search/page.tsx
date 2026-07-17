import { Metadata } from "next";
import { redirect } from "next/navigation";

import Header from "@/app/components/Header";
import ContentsList from "@/app/components/ContentList";
import WatchingList from "@/app/components/WatchingList";
import { authWithUserSession } from "@/app/lib/server/auth";
import { searchCatalog } from "./action";

export const metadata: Metadata = {
  title: "search",
  description: "streemo search",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const userSession = await authWithUserSession();
  if (!userSession.user) {
    redirect("/");
  }

  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const results = query ? await searchCatalog({ query, limit: 12 }) : null;

  const series =
    results?.series
      .map((item) => ({
        id: item.id,
        title: item.title,
        thumbnail: item.backdropPath ?? item.posterPath ?? null,
      }))
      .filter((item) => !!item.thumbnail) ?? [];

  const movies =
    results?.movies
      .map((item) => ({
        id: item.id,
        title: item.title,
        thumbnail: item.posterPath ?? item.backdropPath ?? null,
      }))
      .filter((item) => !!item.thumbnail) ?? [];

  const contents =
    results?.contents
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
      ) ?? [];

  const hasResults =
    series.length > 0 || movies.length > 0 || contents.length > 0;

  return (
    <div>
      <Header />
      <main className="mt-20 flex flex-col gap-8 px-4 pb-8 sm:px-8">
        <div>
          <p className="text-sm text-white/55">Search</p>
          <h1 className="text-2xl font-semibold">
            {query ? `"${query}"` : "Find something to watch"}
          </h1>
                  </div>

        {query && !hasResults ? (
          <p className="text-sm text-white/60">검색 결과가 없습니다.</p>
        ) : null}

        {series.length ? (
          <ContentsList
            subtitle="Search Results"
            title="Series"
            contents={series}
            contentType="EPISODE"
          />
        ) : null}

        {movies.length ? (
          <ContentsList
            subtitle="Search Results"
            title="Movies"
            contents={movies}
            contentType="MOVIE"
          />
        ) : null}

        {contents.length ? (
          <WatchingList
            subtitle="Search Results"
            title="Episodes"
            contents={contents}
          />
        ) : null}
      </main>
    </div>
  );
}
