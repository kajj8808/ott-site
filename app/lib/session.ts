import "server-only";

import { cookies } from "next/headers";

import { getIronSession, SessionOptions } from "iron-session";
import { z } from "zod";

export const sessionSchema = z.object({
  user: z
    .object({
      id: z.number(),
      email: z.email(),
      role: z.string(),
      isAdmin: z.boolean(),
    })
    .optional(),
  accessToken: z.string().optional(),
  isLoggedIn: z.boolean().default(false),
});

export type SessionContent = z.infer<typeof sessionSchema>;

export const sessionOptions: SessionOptions = {
  cookieName: "site_session",
  password: process.env.SESSION_PASSWORD as string,
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 1209600,
  },
};

export async function getUserSession() {
  const cookie = await cookies();
  const ironSession = await getIronSession<SessionContent>(
    cookie,
    sessionOptions,
  );

  // undifind 방지
  if (!ironSession.isLoggedIn) {
    ironSession.isLoggedIn = false;
  }

  return ironSession;
}
