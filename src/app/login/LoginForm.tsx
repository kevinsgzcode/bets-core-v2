"use client";

import { useActionState } from "react";
import { authenticate } from "./action";
import { signIn } from "next-auth/react";

export default function LoginForm() {
  const [errorMessage, dispatch] = useActionState(authenticate, undefined);
  const isDev = process.env.NODE_ENV === "development";

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-lg border border-gray-100">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Bets Core
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We’ll send you a secure sign-in link
          </p>
        </div>

        <form action={dispatch} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm">
            <input
              name="email"
              type="email"
              required
              placeholder="Email address"
              className="block w-full rounded-md border px-3 py-2"
            />
          </div>

          {errorMessage && (
            <p className="text-sm text-red-600">{errorMessage}</p>
          )}

          <button className="w-full rounded-md bg-blue-600 py-2 text-white">
            Send magic link
          </button>

          {isDev && (
            <button
              type="button"
              onClick={() => signIn("credentials", { callbackUrl: "/" })}
              className="w-full rouded-md bg-gray-900 py-2 text-white mt-3"
            >
              Dev login
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
