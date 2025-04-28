"use server";

import { getUserSession } from "@/app/lib/server/session";
import { redirect } from "next/navigation";
import { z } from "zod";

export interface User {
  id: number;
  email: string;
}

interface UserResponse {
  ok: boolean;
  user: User;
}

const formSchema = z.object({
  email: z.string().email(),
});

export async function login(formData: FormData) {
  const data = {
    email: formData.get("email"),
  };
  const result = formSchema.safeParse(data);
  if (!result.success) {
    // return { errors: result.error.flatten() };
  } else {
    const json = (await (
      await fetch(
        `${process.env.NEXT_PUBLIC_MEDIA_SERVER_URL}/api/user/log-in`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(result.data),
        }
      )
    ).json()) as UserResponse;

    if (json.user) {
      const cookie = await getUserSession();
      cookie.id = json.user.id;
      await cookie.save();
      return redirect("/");
    }
  }
}
