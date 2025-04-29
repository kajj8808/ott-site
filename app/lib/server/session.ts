import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

import "server-only";

interface SessionContent {
  id?: number;
}

export async function getUserSession() {
  const cookie = await cookies();

  return await getIronSession<SessionContent>(cookie, {
    cookieName: "user-session",
    password: process.env.SESSION_PASSWORD!,
  });
}
