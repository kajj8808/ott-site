"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { destroyUserSession } from "../lib/server/auth";

export default function Header() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const keyword = query.trim();
    if (!keyword) {
      return;
    }

    router.push(`/search?q=${encodeURIComponent(keyword)}`);
  };

  return (
    <header className="fixed top-0 z-[100] flex w-full items-center justify-between gap-4 px-4 py-4 backdrop-blur-sm sm:px-8">
      <div className="flex items-center gap-5">
        <h3 className="text-base font-semibold text-white sm:text-lg">
          <Link href={"/"}>Streemo</Link>
        </h3>
        <nav className="hidden items-center gap-4 text-sm font-medium text-white/75 sm:flex">
          <Link href="/" className="transition-colors hover:text-white">
            Home
          </Link>
          <Link href="/series" className="transition-colors hover:text-white">
            Series
          </Link>
          <Link href="/movies" className="transition-colors hover:text-white">
            Movies
          </Link>
        </nav>
      </div>

      <div className="flex min-w-0 flex-1 items-center justify-end gap-3">
        <form onSubmit={handleSearch} className="w-full max-w-64">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search"
            className="bg-background/70 w-full rounded-sm border border-white/15 px-3 py-1.5 text-sm transition-colors outline-none placeholder:text-white/40 focus:border-white/40"
          />
        </form>
        <button
          onClick={destroyUserSession}
          className="shrink-0 cursor-pointer text-sm font-semibold"
        >
          Log out
        </button>
      </div>
    </header>
  );
}
