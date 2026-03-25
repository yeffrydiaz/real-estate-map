"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";

interface FormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignUpPage() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
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
                Create an account
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Join thousands of home buyers and sellers
              </p>
            </div>

            {submitted ? (
              <div className="text-center py-4">
                <div className="text-3xl mb-2">🎉</div>
                <p className="text-gray-800 font-semibold">
                  Welcome, {form.name}!
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Your account has been created.
                </p>
                <Link
                  href="/"
                  className="mt-4 inline-block text-sm text-emerald-600 hover:underline"
                >
                  ← Explore the map
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Jane Doe"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
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
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    required
                    minLength={8}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
                {error && (
                  <p className="text-xs text-red-600">{error}</p>
                )}
                <button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
                >
                  Create Account
                </button>
              </form>
            )}

            <p className="text-center text-xs text-gray-500 mt-5">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="text-emerald-600 font-medium hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
