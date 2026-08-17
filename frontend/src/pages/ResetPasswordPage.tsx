import React, { FormEvent, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (!token) {
      setError(
        "This password reset link is invalid or incomplete."
      );
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must contain at least 8 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Unable to reset your password."
        );
      }

      setSuccess(true);

      setTimeout(() => {
        navigate("/login", {
          replace: true,
        });
      }, 2500);

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

            {success ? (

              /* SUCCESS */
              <div className="py-8 text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10">
                  <CheckIcon />
                </div>

                <h2 className="mt-5 text-2xl font-bold">
                  Password Updated
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Your password has been reset successfully.
                  You will be redirected to the sign-in page.
                </p>

                <Link
                  to="/login"
                  className="mt-6 inline-block text-sm font-semibold text-cyan-400 hover:text-cyan-300"
                >
                  Go to Sign In
                </Link>

              </div>

            ) : (

              <>
                {/* TITLE */}
                <div className="mb-7">

                  <h2 className="text-2xl font-bold">
                    Create new password
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Choose a strong password for your AI–DPR
                    Guardian account.
                  </p>

                </div>

                {!token && (
                  <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    Invalid password reset link.
                  </div>
                )}

                <form onSubmit={handleSubmit}>

                  {/* PASSWORD */}
                  <label className="mb-2 block text-sm font-semibold text-slate-200">
                    New Password
                  </label>

                  <div className="mb-5 flex h-12 items-center rounded-xl border border-slate-700 bg-[#0b1526] px-3 transition focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-400/10">

                    <LockIcon />

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      placeholder="Enter new password"
                      className="ml-3 w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
                      autoComplete="new-password"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                      className="ml-2 text-slate-500 hover:text-cyan-300"
                    >
                      <EyeIcon />
                    </button>

                  </div>

                  {/* CONFIRM */}
                  <label className="mb-2 block text-sm font-semibold text-slate-200">
                    Confirm Password
                  </label>

                  <div className="mb-5 flex h-12 items-center rounded-xl border border-slate-700 bg-[#0b1526] px-3 transition focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-400/10">

                    <LockIcon />

                    <input
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(
                          event.target.value
                        )
                      }
                      placeholder="Confirm new password"
                      className="ml-3 w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
                      autoComplete="new-password"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                      className="ml-2 text-slate-500 hover:text-cyan-300"
                    >
                      <EyeIcon />
                    </button>

                  </div>

                  {/* ERROR */}
                  {error && (
                    <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                      {error}
                    </div>
                  )}

                  {/* BUTTON */}
                  <button
                    type="submit"
                    disabled={loading || !token}
                    className="flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-sm font-bold text-white shadow-[0_8px_25px_rgba(37,99,235,0.25)] transition hover:from-blue-500 hover:to-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading
                      ? "Updating Password..."
                      : "Reset Password"}
                  </button>

                </form>

                <div className="mt-6 text-center">

                  <Link
                    to="/login"
                    className="text-sm font-semibold text-cyan-400 hover:text-cyan-300"
                  >
                    ← Back to Sign In
                  </Link>

                </div>
              </>
            )}

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

function LockIcon() {
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
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="text-emerald-400"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}