import { login } from "./action";

import { getUserSession } from "@/app/lib/server/session";
import { redirect } from "next/navigation";

import SignButton from "@/app/components/SignButton";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
};

export default async function Page() {
  const session = await getUserSession();
  if (session.user?.token) {
    redirect("/");
  }
  return (
    <div className="dark flex h-dvh items-center justify-center scheme-dark">
      <form
        action={login}
        className="flex w-full max-w-xs flex-col items-center gap-2"
      >
        <h3 className="text-lg font-semibold">Streemo</h3>
        <input
          type="text"
          name="email"
          placeholder="email"
          className="w-full rounded-sm bg-white px-4 py-3 text-sm font-semibold text-black"
        />
        <SignButton />
      </form>
    </div>
  );
}
