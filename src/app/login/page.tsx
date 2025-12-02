"use client";

import { useActionState } from "react";
import { authenticate } from "./action";

export default function LoginPage() {
  // Hook to connect the form with the Server Action
  const [errorMessage, dispatch] = useActionState(authenticate, undefined);

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-lg border border-gray-100">
        {/* Header Section */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Bets Core
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access your dashboard
          </p>
        </div>

        {/* Login Form */}
        <form action={dispatch} className="mt-8 space-y-6">
          <div className="-space-y-px rounded-md shadow-sm">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full rounded-t-md border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                placeholder="Email address"
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full rounded-b-md border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                placeholder="Password"
              />
            </div>
          </div>

          {/* Error Message Display */}
          {errorMessage && (
            <div
              className="flex items-center space-x-2 rounded-md bg-red-50 p-3 text-sm text-red-600"
              aria-live="polite"
            >
              <p>{errorMessage}</p>
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
