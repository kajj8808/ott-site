"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Link from "next/link";
import { motion } from "motion/react";

import { MagnifyingGlassIcon, PowerIcon } from "@heroicons/react/24/outline";

import { destroyUserSession } from "../lib/server/auth";

export default function Header() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const keyword = query.trim();
    if (!keyword) {
      return;
    }

    router.push(`/search?q=${encodeURIComponent(keyword)}`);
  };

  return (
    <header className="fixed top-0 z-100 flex w-full items-center justify-between gap-4 px-4 py-4 backdrop-blur-sm sm:px-8">
      <div className="flex items-center gap-5">
        <h3 className="text-base font-semibold text-white sm:text-lg">
          <Link href={"/"}>Streemo</Link>
        </h3>
        <nav className="flex items-center gap-4 text-sm font-medium text-white/75">
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
        {isSearchOpen ? (
          <motion.form
            onSubmit={handleSearch}
            className="w-full max-w-64"
            layoutId="search-box"
          >
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search"
              className="bg-background/70 w-full rounded-2xl border border-white/15 px-3 py-1.5 text-sm transition-colors outline-none placeholder:text-white/40 focus:border-white/40"
            />
          </motion.form>
        ) : (
          <motion.div className="flex h-8.5 items-center" layoutId="search-box">
            <MagnifyingGlassIcon
              className="size-5 cursor-pointer"
              onClick={() => setIsSearchOpen(true)}
            />
          </motion.div>
        )}
        <PowerIcon
          onClick={destroyUserSession}
          className="size-5 cursor-pointer transition-colors hover:text-red-500"
        />
      </div>
    </header>
  );
}
