"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";

interface FormState {
  email: string;
  password: string;
}

export default function SignInPage() {
  const [form, setForm] = useState<FormState>({ email: "", password: "" });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      <Header />

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="text-center mb-6">
              <span className="text-4xl">🏡</span>
              <h1 className="text-xl font-bold text-gray-900 mt-2">
                Welcome back
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Sign in to your account
              </p>
            </div>

            {submitted ? (
              <div className="text-center py-4">
                <div className="text-3xl mb-2">✅</div>
                <p className="text-gray-800 font-semibold">Signed in!</p>
                <p className="text-sm text-gray-500 mt-1">
                  Welcome back, {form.email}
                </p>
                <Link
                  href="/"
                  className="mt-4 inline-block text-sm text-emerald-600 hover:underline"
                >
                  ← Go to map
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-gray-700">
                      Password
                    </label>
                    <button
                    type="button"
                    className="text-xs text-emerald-600 hover:underline"
                  >
                    Forgot password?
                  </button>
                  </div>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
                >
                  Sign In
                </button>
              </form>
            )}

            <p className="text-center text-xs text-gray-500 mt-5">
              Don&apos;t have an account?{" "}
              <Link
                href="/sign-up"
                className="text-emerald-600 font-medium hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
