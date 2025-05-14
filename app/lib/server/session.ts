"use server";

import { User } from "@/app/(sign)/log-in/action";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

import "server-only";

interface SessionContent {
  user?: User;
}

export async function getUserSession() {
  const cookie = await cookies();

  return await getIronSession<SessionContent>(cookie, {
    cookieName: "user-session",
    password: process.env.SESSION_PASSWORD!,
  });
}
