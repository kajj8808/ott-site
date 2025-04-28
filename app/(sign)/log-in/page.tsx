import { getUserSession } from "@/app/lib/server/session";
import { login } from "./action";

export default async function Page() {
  const user = await getUserSession();
  console.log(user);
  return (
    <div className="flex justify-center items-center h-dvh">
      <form action={login} className="flex flex-col gap-2 items-center">
        <h3 className="font-semibold text-lg">Streemo</h3>
        <input
          type="text"
          name="email"
          placeholder="email"
          className="bg-white text-black px-3 py-1.5 rounded-md text-sm"
          value={"1745760324425@admin.com"}
        />
        <button className="bg-purple-500 hover:bg-purple-500/80 text-white px-3 py-1.5 rounded-md transition-colors cursor-pointer w-full">
          sign in
        </button>
      </form>
    </div>
  );
}
