import Link from "next/link";
import { Metadata } from "next";
import { redirect } from "next/navigation";

import Header from "@/app/components/Header";
import ContentsList from "@/app/components/ContentList";
import { authWithUserSession } from "@/app/lib/server/auth";
import { getCatalogSeries } from "./action";

export const metadata: Metadata = {
  title: "series",
  description: "streemo series catalog",
};

const STATUS_FILTERS = [
  { label: "All", value: "" },
  { label: "Ongoing", value: "ONGOING" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Upcoming", value: "UPCOMING" },
];

export default async function SeriesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string; q?: string }>;
}) {
  const userSession = await authWithUserSession();
  if (!userSession.user) {
    redirect("/");
  }

  const params = await searchParams;
  const page = Math.max(Number(params.page ?? "1") || 1, 1);
  const status = params.status ?? "";
  const query = params.q?.trim() ?? "";

  const series = await getCatalogSeries({
    page,
    limit: 32,
    status: status || undefined,
    query: query || undefined,
  });

  const contents = series.items
    .map((item) => ({
      id: item.id,
      title: item.title,
      thumbnail: item.backdropPath ?? item.posterPath ?? null,
      updatedAt: item.updatedAt ? new Date(item.updatedAt) : undefined,
    }))
    .filter((item) => !!item.thumbnail);

  const hasPrev = series.page > 1;
  const hasNext = series.page * series.limit < series.total;

  const filterHref = (value: string) => {
    const next = new URLSearchParams();
    if (value) {
      next.set("status", value);
    }
    if (query) {
      next.set("q", query);
    }
    return `/series${next.toString() ? `?${next.toString()}` : ""}`;
  };

  const pageHref = (nextPage: number) => {
    const next = new URLSearchParams();
    next.set("page", String(nextPage));
    if (status) {
      next.set("status", status);
    }
    if (query) {
      next.set("q", query);
    }
    return `/series?${next.toString()}`;
  };

  return (
    <div>
      <Header />
      <main className="mt-20 flex flex-col gap-6 px-4 pb-8 sm:px-8">
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-sm text-white/55">Catalog</p>
            <h1 className="text-2xl font-semibold">Series</h1>
          </div>
          <nav className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map((filter) => {
              const active = filter.value === status;
              return (
                <Link
                  key={filter.value || "all"}
                  href={filterHref(filter.value)}
                  className={`rounded-sm border px-3 py-1.5 text-sm transition-colors ${
                    active
                      ? "border-white bg-white text-black"
                      : "border-white/15 text-white/75 hover:border-white/40 hover:text-white"
                  }`}
                >
                  {filter.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <ContentsList
          subtitle={`${series.total} titles`}
          title={status ? `${status} Series` : "All Series"}
          contents={contents}
          contentType="EPISODE"
        />

        <div className="flex items-center justify-center gap-3">
          {hasPrev ? (
            <Link
              href={pageHref(series.page - 1)}
              className="rounded-sm border border-white/15 px-3 py-1.5 text-sm hover:border-white/40"
            >
              Previous
            </Link>
          ) : null}
          <span className="text-sm text-white/60">Page {series.page}</span>
          {hasNext ? (
            <Link
              href={pageHref(series.page + 1)}
              className="rounded-sm border border-white/15 px-3 py-1.5 text-sm hover:border-white/40"
            >
              Next
            </Link>
          ) : null}
        </div>
      </main>
    </div>
  );
}
