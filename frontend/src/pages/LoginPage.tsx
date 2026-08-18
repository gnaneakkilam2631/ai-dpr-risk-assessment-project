import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail,
  Lock,
  LogIn,
  Eye,
  EyeOff,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";

const API_URL = "http://127.0.0.1:8000";

type User = {
  id: number;
  name: string;
  email: string;
};

type LoginResponse = {
  message?: string;
  detail?: string;
  access_token?: string;
  token_type?: string;
  user?: User;
};

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [error, setError] = useState("");

  // =========================================================
  // SAVE LOGIN INFORMATION
  // =========================================================

  function saveAuthentication(data: LoginResponse) {
    if (!data.access_token) {
      throw new Error(
        "Login succeeded but no access token was returned."
      );
    }

    if (!data.user) {
      throw new Error(
        "Login succeeded but user information was not returned."
      );
    }

    if (!data.user.id) {
      throw new Error(
        "Login succeeded but user ID was not returned."
      );
    }

    // -------------------------------------------------------
    // ACCESS TOKEN
    // -------------------------------------------------------

    localStorage.setItem(
      "access_token",
      data.access_token
    );

    localStorage.setItem(
      "token_type",
      data.token_type || "bearer"
    );

    // -------------------------------------------------------
    // USER OBJECT
    //
    // DashboardPage uses:
    // localStorage.getItem("user")
    // -------------------------------------------------------

    localStorage.setItem(
      "user",
      JSON.stringify({
        id: data.user.id,
        name: data.user.name || "",
        email: data.user.email || "",
      })
    );

    // -------------------------------------------------------
    // INDIVIDUAL USER VALUES
    // -------------------------------------------------------

    localStorage.setItem(
      "user_id",
      String(data.user.id)
    );

    localStorage.setItem(
      "user_name",
      data.user.name || ""
    );

    localStorage.setItem(
      "user_email",
      data.user.email || ""
    );

    // -------------------------------------------------------
    // CLEAR PREVIOUS PROJECT DATA
    // -------------------------------------------------------

    localStorage.removeItem(
      "active_project_id"
    );

    localStorage.removeItem(
      "active_document_id"
    );

    localStorage.removeItem(
      "active_document_name"
    );

    localStorage.removeItem(
      "active_risk_analysis"
    );

    console.log(
      "===================================="
    );

    console.log("LOGIN SUCCESS");

    console.log(
      "User ID:",
      data.user.id
    );

    console.log(
      "User Name:",
      data.user.name
    );

    console.log(
      "User Email:",
      data.user.email
    );

    console.log(
      "===================================="
    );

    // -------------------------------------------------------
    // DASHBOARD
    // -------------------------------------------------------

    navigate("/dashboard");
  }

  // =========================================================
  // NORMAL EMAIL/PASSWORD LOGIN
  // =========================================================

  async function handleLogin(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    // -------------------------------------------------------
    // VALIDATION
    // -------------------------------------------------------

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      // -----------------------------------------------------
      // LOGIN API
      // -----------------------------------------------------

      const response = await fetch(
        `${API_URL}/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },

          body: JSON.stringify({
            email: email.trim(),
            password: password,
          }),
        }
      );

      // -----------------------------------------------------
      // READ RESPONSE SAFELY
      // -----------------------------------------------------

      let data: LoginResponse;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "The server returned an invalid response."
        );
      }

      console.log(
        "LOGIN RESPONSE:",
        data
      );

      // -----------------------------------------------------
      // HANDLE ERROR
      // -----------------------------------------------------

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "Invalid email or password."
        );
      }

      // -----------------------------------------------------
      // SAVE LOGIN
      // -----------------------------------------------------

      saveAuthentication(data);

    } catch (err) {
      console.error(
        "LOGIN ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Login failed. Please try again."
      );

    } finally {
      setLoading(false);
    }
  }

  // =========================================================
  // GOOGLE LOGIN
  // =========================================================

  async function handleGoogleLogin(
    credential: string
  ) {
    setError("");

    try {
      setGoogleLoading(true);

      console.log(
        "GOOGLE LOGIN STARTED"
      );

      // -----------------------------------------------------
      // SEND GOOGLE CREDENTIAL TO BACKEND
      // -----------------------------------------------------

      const response = await fetch(
        `${API_URL}/auth/google`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },

          body: JSON.stringify({
            credential: credential,
          }),
        }
      );

      // -----------------------------------------------------
      // READ RESPONSE
      // -----------------------------------------------------

      let data: LoginResponse;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "The server returned an invalid response."
        );
      }

      console.log(
        "GOOGLE LOGIN RESPONSE:",
        data
      );

      // -----------------------------------------------------
      // HANDLE ERROR
      // -----------------------------------------------------

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "Google login failed."
        );
      }

      // -----------------------------------------------------
      // SAVE AUTHENTICATION
      // -----------------------------------------------------

      saveAuthentication(data);

    } catch (err) {
      console.error(
        "GOOGLE LOGIN ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Google login failed. Please try again."
      );

    } finally {
      setGoogleLoading(false);
    }
  }

  // =========================================================
  // GOOGLE LOGIN ERROR
  // =========================================================

  function handleGoogleError() {
    console.error(
      "Google Login Failed"
    );

    setError(
      "Google sign-in was cancelled or failed. Please try again."
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-8 text-center">

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
            AI-DPR Guardian
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-white">
            Welcome Back
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Sign in to access your DPR risk assessment
            dashboard.
          </p>

        </div>


        {/* =================================================
            LOGIN CARD
        ================================================= */}

        <div className="rounded-2xl border border-slate-800 bg-[#0b1220] p-6 shadow-2xl">

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >

            {/* =============================================
                EMAIL
            ============================================= */}

            <div>

              <label
                htmlFor="email"
                className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500"
              >
                Email
              </label>

              <div className="relative">

                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError("");
                  }}
                  placeholder="Enter your email"
                  autoComplete="email"
                  disabled={
                    loading ||
                    googleLoading
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3 pl-12 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                />

              </div>

            </div>


            {/* =============================================
                PASSWORD
            ============================================= */}

            <div>

              <div className="mb-2 flex items-center justify-between">

                <label
                  htmlFor="password"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-500"
                >
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300"
                >
                  Forgot password?
                </Link>

              </div>

              <div className="relative">

                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError("");
                  }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={
                    loading ||
                    googleLoading
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3 pl-12 pr-12 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (previous) => !previous
                    )
                  }
                  disabled={
                    loading ||
                    googleLoading
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >

                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}

                </button>

              </div>

            </div>


            {/* =============================================
                ERROR MESSAGE
            ============================================= */}

            {error && (
              <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4">

                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />

                <p className="text-sm text-red-300">
                  {error}
                </p>

              </div>
            )}


            {/* =============================================
                LOGIN BUTTON
            ============================================= */}

            <button
              type="submit"
              disabled={
                loading ||
                googleLoading
              }
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
            >

              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  Sign In
                </>
              )}

            </button>

          </form>


          {/* =================================================
              GOOGLE LOGIN
          ================================================= */}

          <div className="my-6 flex items-center gap-3">

            <div className="h-px flex-1 bg-slate-800" />

            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              OR
            </span>

            <div className="h-px flex-1 bg-slate-800" />

          </div>


          <div className="flex justify-center">

            {googleLoading ? (

              <div className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 text-sm font-semibold text-slate-400">

                <Loader2 className="h-5 w-5 animate-spin" />

                Signing in with Google...

              </div>

            ) : (

              <div className="w-full">

                <GoogleLogin
                  onSuccess={(credentialResponse) => {

                    if (
                      !credentialResponse.credential
                    ) {
                      setError(
                        "Google did not return a valid credential."
                      );

                      return;
                    }

                    handleGoogleLogin(
                      credentialResponse.credential
                    );
                  }}

                  onError={
                    handleGoogleError
                  }

                  useOneTap={false}

                  theme="filled_black"

                  size="large"

                  text="continue_with"

                  shape="rectangular"

                  width="100%"
                />

              </div>

            )}

          </div>


          {/* =================================================
              REGISTER
          ================================================= */}

          <div className="mt-6 border-t border-slate-800 pt-6 text-center">

            <p className="text-sm text-slate-500">
              Don't have an account?
            </p>

            <Link
              to="/register"
              className="mt-1 inline-block text-sm font-bold text-cyan-400 hover:text-cyan-300"
            >
              Create an account
            </Link>

          </div>

        </div>


        {/* =================================================
            FOOTER
        ================================================= */}

        <p className="mt-6 text-center text-xs text-slate-600">
          AI-DPR Guardian • DPR Intelligence & Risk Assessment
        </p>

      </div>

    </div>
  );
};

export default LoginPage;