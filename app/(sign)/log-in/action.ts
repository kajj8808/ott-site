"use server";

import { getUserSession } from "@/app/lib/server/session";
import { redirect } from "next/navigation";
import { z } from "zod";

/* export interface User {
  email: string;
  avatar: string | null;
  membership: {
    id: number;
    type: string;
    started_at: string;
    expires_at: string | null;
  };
  token: string;
} */

interface Auth {
  tokenType: string;
  accessToken: string;
  expiresIn: number;
}

interface UserProfile {
  id: number;
  email: string;
  role: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User extends UserProfile {
  auth: Auth;
}

interface UserResponse {
  ok: boolean;
  data: {
    user: UserProfile;
    auth: Auth;
  };
}

const formSchema = z.object({
  email: z.string().email(),
});

export async function login(formData: FormData) {
  const data = {
    email: formData.get("email")?.toString().trim(),
  };
  const result = formSchema.safeParse(data);
  if (!result.success) {
    // return { errors: result.error.flatten() };
  } else {
    const json = (await (
      await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(result.data),
      })
    ).json()) as UserResponse;

    if (json.ok && json.data.user) {
      const userSession = await getUserSession();
      userSession.user = {
        ...json.data.user,
        auth: json.data.auth,
      };

      await userSession.save();
      return redirect("/");
    }
  }
}
