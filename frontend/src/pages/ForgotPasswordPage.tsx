import React, { FormEvent, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to process your request."
        );
      }

      setMessage(
        data.message ||
          "If an account exists for this email, a password reset link has been sent."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="guardian-login min-h-screen bg-[#060d19] text-white">
      <div className="guardian-grid" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-5 py-10">
        <div className="w-full max-w-[480px]">

          {/* BRAND */}
          <div className="mb-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-[0_0_30px_rgba(37,99,235,0.35)]">
              <ShieldIcon />
            </div>

            <h1 className="mt-5 text-3xl font-extrabold tracking-tight">
              AI–DPR Guardian
            </h1>

            <p className="mt-1 text-sm text-cyan-300">
              Quality & Risk Intelligence Platform
            </p>
          </div>

          {/* CARD */}
          <div className="rounded-2xl border border-slate-700/70 bg-[#0d1729]/95 p-6 shadow-[0_25px_80px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:p-8">

            <div className="mb-7">
              <h2 className="text-2xl font-bold">
                Forgot your password?
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Enter your registered email address and we’ll send you
                a secure password reset link.
              </p>
            </div>

            <form onSubmit={handleSubmit}>

              <label className="mb-2 block text-sm font-semibold text-slate-200">
                Email Address
              </label>

              <div className="mb-5 flex h-12 items-center rounded-xl border border-slate-700 bg-[#0b1526] px-3 transition focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-400/10">
                <MailIcon />

                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="your.email@gmail.com"
                  className="ml-3 w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
                  autoComplete="email"
                />
              </div>

              {error && (
                <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              {message && (
                <div className="mb-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm leading-5 text-emerald-300">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-sm font-bold text-white shadow-[0_8px_25px_rgba(37,99,235,0.25)] transition hover:from-blue-500 hover:to-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="text-sm font-semibold text-cyan-400 transition hover:text-cyan-300"
              >
                ← Back to Sign In
              </Link>
            </div>

          </div>

          <p className="mt-5 text-center text-xs text-slate-600">
            Team Nexus • AI–DPR Guardian
          </p>

        </div>
      </div>
    </div>
  );
}

function ShieldIcon() {
  return (
    <svg
      width="27"
      height="27"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="1.8"
    >
      <path d="M12 3 20 6v5c0 5.5-3.5 8.8-8 10-4.5-1.2-8-4.5-8-10V6l8-3Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="shrink-0 text-slate-500"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}
