import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

import "server-only";

interface SessionContent {
  id?: number;
}

export async function getUserSession() {
  const co = await cookies();
  return getIronSession<SessionContent>(co, {
    cookieName: "user-session",
    password: "6Y}83z22},~>yR:8:Ly/%6BL|L=H?<i+",
  });
}
