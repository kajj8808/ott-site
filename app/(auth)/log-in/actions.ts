"use server";

import { getUserSession } from "@/app/lib/session";
import { redirect } from "next/navigation";
import { z } from "zod";
import { is } from "zod/locales";

const formSchema = z.object({
  email: z.email({ message: "올바른 이메일 형식이 아닙니다." }),
});

const loginResponseSchema = z.object({
  ok: z.boolean(),
  data: z.object({
    user: z.object({
      id: z.number(),
      email: z.string(),
      role: z.string(),
      isAdmin: z.boolean(),
      createdAt: z.string(),
      updatedAt: z.string(),
    }),
    auth: z.object({
      tokenType: z.string(),
      accessToken: z.string(),
      expiresIn: z.number(),
    }),
  }),
});

interface LoginActionResult {
  message: string;
  errors: string[];
}

export async function loginAction(
  _: unknown,
  formData: FormData,
): Promise<LoginActionResult> {
  const { success, data, error } = formSchema.safeParse({
    email: formData.get("email")?.toString().trim(),
  });

  if (!success) {
    return {
      message: "입력값을 확인해주세요.",
      errors: z.flattenError(error).fieldErrors.email!,
    };
  }

  let isSuccess = false;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/auth/login`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );

    if (!response.ok) {
      return { message: "로그인에 실패하였습니다.", errors: [] };
    }

    const json = await response.json();
    const loginResult = loginResponseSchema.safeParse(json);

    if (
      loginResult.success &&
      loginResult.data.ok &&
      loginResult.data.data.user
    ) {
      const userSession = await getUserSession();

      userSession.user = loginResult.data.data.user;
      userSession.accessToken = loginResult.data.data.auth.accessToken;

      userSession.user = loginResult.data.data.user;
      userSession.accessToken = loginResult.data.data.auth.accessToken;

      await userSession.save();

      isSuccess = true;
    } else {
      return { message: "서버 응답 형식이 올바르지 않습니다.", errors: [] };
    }
  } catch (_) {
    return {
      message: `서버와 통신 중 에러가 발생했습니다.`,
      errors: [],
    };
  }

  if (isSuccess) {
    redirect("/");
  }

  return { message: "알 수 없는 오류가 발생했습니다.", errors: [] };
}
