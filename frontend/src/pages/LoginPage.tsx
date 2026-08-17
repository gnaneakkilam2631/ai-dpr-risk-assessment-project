import React, { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

const API_URL = "http://127.0.0.1:8000";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================================
  // SAVE AUTHENTICATION DATA
  // ==========================================================

  const saveAuthentication = (data: {
    access_token: string;
    token_type?: string;
    user?: {
      id: number;
      name: string;
      email: string;
    };
  }) => {
    if (!data.access_token) {
      throw new Error("Backend did not return an access token.");
    }

    localStorage.setItem(
      "access_token",
      data.access_token
    );

    localStorage.setItem(
      "token_type",
      data.token_type || "bearer"
    );

    if (data.user) {
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );
    }

    if (remember) {
      sessionStorage.removeItem("session_only");
    } else {
      sessionStorage.setItem("session_only", "true");
    }
  };

  // ==========================================================
  // NORMAL LOGIN
  // ==========================================================

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Invalid email or password."
        );
      }

      saveAuthentication(data);

      // Make sure authentication is actually stored
      const token = localStorage.getItem(
        "access_token"
      );

      if (!token) {
        throw new Error(
          "Login succeeded, but authentication token was not stored."
        );
      }

      navigate("/dashboard", {
        replace: true,
      });
    } catch (err) {
      console.error("Login error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // GOOGLE LOGIN
  // ==========================================================

  const handleGoogleSuccess = async (
    credential: string
  ) => {
    setError("");
    setGoogleLoading(true);

    try {
      console.log("Google credential received.");

      const response = await fetch(
        `${API_URL}/auth/google`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            credential,
          }),
        }
      );

      const data = await response.json();

      console.log("Google backend response:", data);

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Google authentication failed."
        );
      }

      // ------------------------------------------------------
      // SAVE BACKEND JWT
      // ------------------------------------------------------

      saveAuthentication(data);

      // ------------------------------------------------------
      // VERIFY TOKEN WAS STORED
      // ------------------------------------------------------

      const token = localStorage.getItem(
        "access_token"
      );

      if (!token) {
        throw new Error(
          "Google login succeeded, but the access token was not stored."
        );
      }

      console.log(
        "Authentication token stored successfully."
      );

      console.log(
        "Redirecting to dashboard..."
      );

      // ------------------------------------------------------
      // GO TO DASHBOARD
      // ------------------------------------------------------

      navigate("/dashboard", {
        replace: true,
      });

    } catch (err) {
      console.error(
        "Google authentication error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Google authentication failed."
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  // ==========================================================
  // GOOGLE ERROR
  // ==========================================================

  const handleGoogleError = () => {
    console.error("Google Sign-In failed.");

    setError(
      "Google Sign-In was cancelled or failed. Please try again."
    );

    setGoogleLoading(false);
  };

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="guardian-login min-h-screen bg-[#060d19] text-white">

      {/* ======================================================
          BACKGROUND
          ====================================================== */}

      <div className="guardian-grid" />

      <div className="relative z-10 min-h-screen grid grid-cols-1 lg:grid-cols-[1.08fr_0.92fr]">

        {/* ====================================================
            LEFT SIDE
            ==================================================== */}

        <section className="relative flex flex-col justify-between px-6 py-8 sm:px-10 lg:px-12 xl:px-16">

          {/* BRAND */}

          <div>

            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/5 px-4 py-2 text-xs font-semibold tracking-wide text-cyan-300">

              <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]" />

              NATIONAL INFRASTRUCTURE APPRAISAL ENGINE

            </div>

            {/* LOGO */}

            <div className="mt-7 flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-[0_0_30px_rgba(37,99,235,0.35)]">

                <ShieldIcon />

              </div>

              <div>

                <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                  AI–DPR{" "}
                  <span className="text-white">
                    Guardian
                  </span>
                </h1>

                <p className="mt-0.5 text-sm font-medium text-cyan-300">
                  Quality & Risk Intelligence Platform
                </p>

              </div>

            </div>

          </div>

          {/* CENTER CONTENT */}

          <div className="my-14 max-w-3xl lg:my-0">

            <div className="mb-5 h-px w-20 bg-gradient-to-r from-cyan-400 to-transparent" />

            <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl xl:text-[44px]">

              Automated Quality Audits,

              <br />

              Cross-Chapter Contradiction Detection

              <br />

              & Multi-Dimensional Risk Intelligence

            </h2>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">

              Engineered for Ministry of Road Transport &
              Highways, NITI Aayog, Central Public Works
              Department, and State Infrastructure Corporations.

            </p>

            {/* FEATURE CARDS */}

            <div className="mt-8 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">

              <FeatureCard
                icon={<SparklesIcon />}
                title="8–Stage AI Appraisal Pipeline"
                description="Evaluates completeness, BoQ rates, IRC standards, and environmental clearances."
                color="cyan"
              />

              <FeatureCard
                icon={<LayersIcon />}
                title="Grounded Evidence Citations"
                description="Every contradiction and risk item is tied to specific pages and chapters."
                color="emerald"
              />

            </div>

          </div>

          {/* FOOTER */}

          <div className="hidden text-xs text-slate-600 lg:block">
            AI–DPR Guardian • Secure Infrastructure Intelligence
          </div>

        </section>

        {/* ====================================================
            RIGHT SIDE
            ==================================================== */}

        <section className="flex items-center justify-center border-l border-slate-800/80 px-5 py-8 sm:px-8 lg:px-10">

          <div className="w-full max-w-[505px]">

            {/* LOGIN CARD */}

            <div className="rounded-2xl border border-slate-700/70 bg-[#0d1729]/95 p-6 shadow-[0_25px_80px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:p-8">

              {/* TABS */}

              <div className="mb-7 grid grid-cols-2 rounded-xl border border-slate-700/80 bg-[#0a1322] p-1">

                <button
                  type="button"
                  className="rounded-lg bg-[#1d2a40] px-4 py-3 text-sm font-semibold text-white shadow-sm"
                >
                  Sign In
                </button>

                <Link
                  to="/register"
                  className="flex items-center justify-center rounded-lg px-4 py-3 text-sm font-semibold text-slate-400 transition hover:bg-slate-800/70 hover:text-white"
                >
                  Create Account
                </Link>

              </div>

              {/* TITLE */}

              <div className="mb-7">

                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Sign in to workspace
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Access project evaluations and risk intelligence
                </p>

              </div>

              {/* =================================================
                  LOGIN FORM
                  ================================================= */}

              <form onSubmit={handleSubmit}>

                {/* EMAIL */}

                <label className="mb-2 block text-sm font-semibold text-slate-200">
                  Official Email
                </label>

                <div className="group mb-5 flex h-11 items-center rounded-xl border border-slate-700 bg-[#0b1526] px-3 transition focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-400/10">

                  <MailIcon />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="official.email@gov.in"
                    className="ml-3 w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
                    autoComplete="email"
                  />

                </div>

                {/* PASSWORD */}

                <div className="mb-2 flex items-center justify-between">

                  <label className="block text-sm font-semibold text-slate-200">
                    Passcode
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-cyan-400 transition hover:text-cyan-300"
                  >
                    Forgot?
                  </Link>

                </div>

                <div className="mb-4 flex h-11 items-center rounded-xl border border-slate-700 bg-[#0b1526] px-3 transition focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-400/10">

                  <LockIcon />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Enter your passcode"
                    className="ml-3 w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="ml-2 rounded-md p-1 text-slate-500 transition hover:text-cyan-300"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    <EyeIcon />
                  </button>

                </div>

                {/* REMEMBER */}

                <label className="mb-5 flex cursor-pointer items-center gap-2 text-sm text-slate-400">

                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) =>
                      setRemember(
                        e.target.checked
                      )
                    }
                    className="h-4 w-4 rounded border-slate-600 bg-slate-800 accent-blue-500"
                  />

                  Persist appraisal session

                </label>

                {/* ERROR */}

                {error && (
                  <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                {/* LOGIN BUTTON */}

                <button
                  type="submit"
                  disabled={loading || googleLoading}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-sm font-bold text-white shadow-[0_8px_25px_rgba(37,99,235,0.25)] transition hover:from-blue-500 hover:to-cyan-500 hover:shadow-[0_8px_30px_rgba(6,182,212,0.25)] disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {loading
                    ? "Signing in..."
                    : "Sign In to Guardian"}

                  {!loading && <ArrowIcon />}

                </button>

              </form>

              {/* =================================================
                  GOOGLE SIGN IN
                  ================================================= */}

              <div className="my-5 flex items-center gap-3">

                <div className="h-px flex-1 bg-slate-800" />

                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  OR SINGLE SIGN-ON
                </span>

                <div className="h-px flex-1 bg-slate-800" />

              </div>

              {googleLoading ? (
                <div className="flex h-11 w-full items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-sm text-slate-300">
                  Authenticating with Google...
                </div>
              ) : (
                <div className="flex w-full justify-center">

                  <GoogleLogin
                    onSuccess={(credentialResponse) => {
                      if (
                        credentialResponse.credential
                      ) {
                        handleGoogleSuccess(
                          credentialResponse.credential
                        );
                      } else {
                        setError(
                          "Google did not return a valid credential."
                        );
                      }
                    }}
                    onError={handleGoogleError}
                    useOneTap={false}
                    theme="filled_black"
                    size="large"
                    text="continue_with"
                    shape="rectangular"
                    width="400"
                  />

                </div>
              )}

              {/* TEAM NEXUS */}

              <div className="mt-6 rounded-xl border border-slate-700/80 bg-[#091323] p-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                    <ShieldIcon />
                  </div>

                  <div>

                    <p className="text-sm font-bold text-slate-200">
                      Team Nexus
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500">
                      Secure Infrastructure Intelligence
                    </p>

                  </div>

                </div>

              </div>

            </div>

            <p className="mt-4 text-center text-[11px] text-slate-600">
              Protected infrastructure intelligence workspace
            </p>

          </div>

        </section>

      </div>

    </div>
  );
}

// ============================================================
// FEATURE CARD
// ============================================================

function FeatureCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "cyan" | "emerald";
}) {
  return (
    <div className="rounded-xl border border-slate-700/70 bg-[#0b1424]/80 p-4 backdrop-blur-sm">

      <div
        className={`mb-2 flex items-center gap-2 ${
          color === "cyan"
            ? "text-cyan-400"
            : "text-emerald-400"
        }`}
      >

        {icon}

        <span className="text-sm font-bold">
          {title}
        </span>

      </div>

      <p className="text-xs leading-5 text-slate-400">
        {description}
      </p>

    </div>
  );
}

// ============================================================
// ICONS
// ============================================================

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
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
      />

      <path d="m3 7 9 6 9-6" />
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
      <rect
        x="4"
        y="10"
        width="16"
        height="11"
        rx="2"
      />

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

      <circle
        cx="12"
        cy="12"
        r="2.5"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="m12 3-1.4 4.6L6 9l4.6 1.4L12 15l1.4-4.6L18 9l-4.6-1.4L12 3Z" />

      <path d="m19 14-.7 2.3L16 17l2.3.7L19 20l.7-2.3L22 17l-2.3-.7L19 14Z" />
    </svg>
  );
}

function LayersIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 12 9 5 9-5" />
      <path d="m3 16 9 5 9-5" />
    </svg>
  );
}