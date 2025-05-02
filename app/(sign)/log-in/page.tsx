import { getUserSession } from "@/app/lib/server/session";
import { login } from "./action";

export default async function Page() {
  await getUserSession();
  return (
    <div className="dark flex h-dvh items-center justify-center scheme-dark">
      <form action={login} className="flex flex-col items-center gap-2">
        <h3 className="text-lg font-semibold">Streemo</h3>
        <input
          type="text"
          name="email"
          placeholder="email"
          className="rounded-sm bg-white px-3 py-1.5 text-sm text-black"
        />
        <button className="w-full cursor-pointer rounded-sm bg-indigo-600 px-3 py-1.5 text-white transition-colors hover:bg-indigo-600/80">
          sign in
        </button>
      </form>
    </div>
  );
}
