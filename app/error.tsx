"use client";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.log(error.stack);
  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center gap-3">
      <h3 className="text-2xl font-bold">Server Error</h3>
      <p className="text-center text-white/65">{error.message}</p>
      <button
        className="cursor-pointer rounded bg-white/10 px-4 py-2 text-sm text-white/80 transition-colors hover:bg-white/20"
        onClick={() => location.reload()}
      >
        Try Again
      </button>
    </div>
  );
}
