import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { redirect } from "next/navigation";

import Header from "@/app/components/Header";
import ContentsList from "@/app/components/ContentList";
import { authWithUserSession } from "@/app/lib/server/auth";
import { getCatalogMovies } from "./action";
import { cls } from "@/app/utils/libs";

export const metadata: Metadata = {
  title: "movies",
  description: "streemo movies catalog",
};

const SORT_FILTERS = [
  { label: "Latest", value: "latest" },
  { label: "Release", value: "release" },
] as const;

export default async function MoviesPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    sort?: "latest" | "release";
    q?: string;
  }>;
}) {
  const userSession = await authWithUserSession();
  if (!userSession.user) {
    redirect("/");
  }

  const params = await searchParams;
  const page = Math.max(Number(params.page ?? "1") || 1, 1);
  const sort = params.sort === "release" ? "release" : "latest";
  const query = params.q?.trim() ?? "";

  const movies = await getCatalogMovies({
    page,
    limit: 32,
    sort,
    query: query || undefined,
  });

  const contents = movies.items
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

  const hasPrev = movies.page > 1;
  const hasNext = movies.items.length === movies.limit;

  const sortHref = (value: "latest" | "release") => {
    const next = new URLSearchParams({ sort: value });
    if (query) {
      next.set("q", query);
    }
    return `/movies?${next.toString()}`;
  };

  const pageHref = (nextPage: number) => {
    const next = new URLSearchParams({
      page: String(nextPage),
      sort,
    });
    if (query) {
      next.set("q", query);
    }
    return `/movies?${next.toString()}`;
  };

  return (
    <div>
      <Header />
      <main className="mt-20 flex flex-col gap-6 px-4 pb-8 sm:px-8">
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-sm text-white/55">Catalog</p>
            <h1 className="text-2xl font-semibold">Movies</h1>
          </div>
          <nav className="flex flex-wrap gap-2">
            {SORT_FILTERS.map((filter) => {
              const active = filter.value === sort;
              return (
                <Link
                  key={filter.value}
                  href={sortHref(filter.value)}
                  className={cls(
                    "rounded-sm border px-3 py-1.5 text-sm transition-colors",
                    active
                      ? "border-white bg-white text-black"
                      : "border-white/15 text-white/75 hover:border-white/40 hover:text-white",
                  )}
                >
                  {filter.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <ContentsList
          subtitle={`${movies.total} titles`}
          title={sort === "release" ? "By Release" : "Latest Movies"}
          contents={contents}
          contentType="MOVIE"
        />

        
        <div className="flex items-center justify-center gap-2 mt-8">
            {hasPrev ? (
              <Link
                href={pageHref(movies.page - 1)}
                className="rounded-md border border-white/20 px-3 py-1.5 text-sm transition-colors hover:bg-white/10"
              >
                Prev
              </Link>
            ) : (
              <span className="rounded-md border border-white/10 px-3 py-1.5 text-sm text-white/30 cursor-not-allowed">
                Prev
              </span>
            )}
            
            <div className="flex items-center gap-1 mx-2">
              {Array.from({ length: Math.ceil(movies.total / movies.limit) })
                .map((_, i) => i + 1)
                .filter(p => p === 1 || p === Math.ceil(movies.total / movies.limit) || Math.abs(p - movies.page) <= 2)
                .map((p, i, arr) => (
                  <React.Fragment key={p}>
                    {i > 0 && arr[i - 1] !== p - 1 && (
                      <span className="px-2 text-white/50">...</span>
                    )}
                    <Link
                      href={pageHref(p)}
                      className={`flex size-8 items-center justify-center rounded-md text-sm transition-colors ${
                        p === movies.page
                          ? "bg-white text-black font-semibold"
                          : "hover:bg-white/10 text-white/70"
                      }`}
                    >
                      {p}
                    </Link>
                  </React.Fragment>
                ))}
            </div>

            {hasNext ? (
              <Link
                href={pageHref(movies.page + 1)}
                className="rounded-md border border-white/20 px-3 py-1.5 text-sm transition-colors hover:bg-white/10"
              >
                Next
              </Link>
            ) : (
              <span className="rounded-md border border-white/10 px-3 py-1.5 text-sm text-white/30 cursor-not-allowed">
                Next
              </span>
            )}
          </div>

      </main>
    </div>
  );
}
