"use client";

import { useFormStatus } from "react-dom";
import { loginAction } from "./actions";
import { useActionState } from "react";

export default function LoginPage() {
  const { pending } = useFormStatus();
  const [state, formAction] = useActionState(loginAction, {
    errors: [],
    message: "",
  });

  return (
    <div className="bg-zinc-50 w-full h-dvh flex justify-center items-center">
      <form
        action={formAction}
        className="flex flex-col gap-4 w-xs items-center"
      >
        <h2 className="font-semibold text-2xl tracking-tight">Streemo</h2>
        <div className="flex flex-col gap-3 w-full">
          <input
            type="email"
            name="email"
            id="email"
            required
            placeholder="Email Adress"
            className="border py-2 px-3 rounded-md border-black/10 shadow-xs text-sm"
          />

          <button
            className="bg-black text-white p-2 rounded-md cursor-pointer font-semibold hover:bg-black/80 transition-colors"
            disabled={pending}
          >
            {pending ? "Loading.." : "로그인"}
          </button>
          {state.message && (
            <p className="text-red-600 text-sm pl-2">{state.message}</p>
          )}
        </div>
      </form>
    </div>
  );
}
