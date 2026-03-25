"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";

const STEPS = [
  {
    icon: "📋",
    title: "List Your Property",
    description:
      "Provide details about your home — address, photos, and key features — to create a compelling listing.",
  },
  {
    icon: "📣",
    title: "Reach Buyers",
    description:
      "Your listing goes live on our interactive map, putting your property in front of thousands of active buyers.",
  },
  {
    icon: "💬",
    title: "Connect & Negotiate",
    description:
      "Receive inquiries directly, schedule showings, and negotiate offers — all from one place.",
  },
  {
    icon: "🤝",
    title: "Close the Deal",
    description:
      "Get support through every step of the closing process and celebrate a successful sale.",
  },
];

interface FormState {
  name: string;
  email: string;
  phone: string;
  address: string;
  message: string;
}

export default function SellPage() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    address: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white py-16 px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Sell Your Home with Confidence
        </h1>
        <p className="text-emerald-100 max-w-xl mx-auto text-base md:text-lg">
          List on the most interactive property map in Miami and connect with
          serious buyers faster.
        </p>
        <button
          type="button"
          onClick={() =>
            document
              .getElementById("contact")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="mt-6 inline-block bg-white text-emerald-700 font-semibold px-6 py-3 rounded-xl shadow hover:bg-emerald-50 transition-colors"
        >
          Get a Free Home Valuation
        </button>
      </section>

      {/* Steps */}
      <section className="max-w-4xl mx-auto w-full px-4 py-12">
        <h2 className="text-xl font-bold text-gray-900 text-center mb-8">
          How It Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 text-center"
            >
              <div className="text-3xl mb-3">{step.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">
                {step.title}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Form */}
      <section
        id="contact"
        className="max-w-xl mx-auto w-full px-4 pb-16"
      >
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            Request a Free Valuation
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Fill out the form and an agent will reach out within 24 hours.
          </p>

          {submitted ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">🎉</div>
              <p className="text-gray-800 font-semibold">
                Thanks, {form.name}!
              </p>
              <p className="text-sm text-gray-500 mt-1">
                We&apos;ll be in touch at {form.email} soon.
              </p>
              <Link
                href="/"
                className="mt-5 inline-block text-sm text-emerald-600 hover:underline"
              >
                ← Back to map
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  label="Full Name"
                  name="name"
                  type="text"
                  placeholder="Jane Doe"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
                <Field
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="jane@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <Field
                label="Phone (optional)"
                name="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={form.phone}
                onChange={handleChange}
              />
              <Field
                label="Property Address"
                name="address"
                type="text"
                placeholder="123 Ocean Dr, Miami, FL"
                value={form.address}
                onChange={handleChange}
                required
              />
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Additional Notes (optional)
                </label>
                <textarea
                  name="message"
                  rows={3}
                  placeholder="Tell us more about your property…"
                  value={form.message}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
              >
                Request Valuation
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

interface FieldProps {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

function Field({
  label,
  name,
  type,
  placeholder,
  value,
  onChange,
  required,
}: FieldProps) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
      />
    </div>
  );
}
