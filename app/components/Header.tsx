"use client";

import Link from "next/link";
import { destroyUserSession } from "../lib/server/auth";

export default function Header() {
  return (
    <header className="fixed top-0 z-30 flex w-full justify-between px-8 py-5 backdrop-blur-sm">
      <h3 className="text-base font-semibold text-white sm:text-lg">
        <Link href={"/"}>Streemo </Link>
      </h3>
      <button
        onClick={destroyUserSession}
        className="cursor-pointer text-sm font-semibold"
      >
        Log out
      </button>
    </header>
  );
}
