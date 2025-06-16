"use client";

import useLiveVideoSync from "@/app/hooks/useLiveVideoSync";

export default function Page() {
  const { isConnected } = useLiveVideoSync();

  return (
    <div>
      live page <p>{isConnected ? "🙌" : "😒"}</p>
    </div>
  );
}
