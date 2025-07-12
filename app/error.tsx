"use client";

import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  const restartServer = async () => {
    setIsLoading(true);
    const json = await (
      await fetch(
        `${process.env.NEXT_PUBLIC_MEDIA_SERVER_URL}/api/server/restart`,
        {
          method: "GET",
        },
      )
    ).json();

    if (json.ok) {
      redirect("/");
    }
  };

  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center gap-3">
      <h3 className="text-2xl font-bold">Server Error</h3>
      <button
        className="hover:text-background cursor-pointer rounded-sm border px-2 py-1.5 text-sm transition-colors hover:bg-white disabled:animate-pulse disabled:cursor-none"
        onClick={restartServer}
        disabled={isLoading}
      >
        Restart Server
      </button>
    </div>
  );
}
