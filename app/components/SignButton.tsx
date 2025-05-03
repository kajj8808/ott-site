"use client";

import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useFormStatus } from "react-dom";

export default function SignButton() {
  const { pending } = useFormStatus();
  return (
    <button
      className="flex w-full cursor-pointer justify-center rounded-sm bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-600/80 disabled:animate-pulse"
      disabled={pending}
    >
      {pending ? <ArrowPathIcon className="size-5 animate-spin" /> : "sign in"}
    </button>
  );
}
