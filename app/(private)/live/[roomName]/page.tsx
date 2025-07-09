import { authWithUserSession } from "@/app/lib/server/auth";
import LiveClient from "./client";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ roomName: string }>;
}) {
  const { roomName } = await params;

  const { user } = await authWithUserSession();
  if (!user) {
    return redirect("/log-in");
  }

  return (
    <div>
      <LiveClient roomName={roomName} userName={user.email} />
    </div>
  );
}
