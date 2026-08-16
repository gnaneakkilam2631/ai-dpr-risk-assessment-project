import React from "react";

interface User {
  id?: number;
  name?: string;
  email?: string;
}

function getUser(): User | null {
  try {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      return null;
    }

    return JSON.parse(storedUser) as User;
  } catch (error) {
    console.error("Unable to read user:", error);
    return null;
  }
}

function getInitial(name?: string) {
  return name?.charAt(0)?.toUpperCase() || "U";
}

export function ProfilePage() {
  const user = getUser();

  const name = user?.name || "User";
  const email = user?.email || "user@example.com";
  const id = user?.id ?? "—";
  const initial = getInitial(name);

  return (
    <div className="space-y-6">

      {/* ================= PAGE HEADER ================= */}

      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <span>Home</span>
            <span>›</span>
            <span className="text-slate-300">Profile</span>
          </div>

          <h1 className="text-3xl font-bold text-white">
            Profile
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Manage your AI–DPR Guardian account information
          </p>
        </div>

        {/* Account status */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          <span className="text-xs font-medium text-emerald-400">
            ACTIVE ACCOUNT
          </span>
        </div>
      </div>


      {/* ================= PROFILE CARD ================= */}

      <div className="rounded-2xl border border-slate-800 bg-[#0c1424] shadow-2xl overflow-hidden">

        {/* Top profile section */}

        <div className="relative px-8 py-8 border-b border-slate-800">

          {/* subtle background glow */}

          <div className="absolute top-0 right-0 w-72 h-72 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex items-center gap-6">

            {/* Avatar */}

            <div className="relative">

              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white text-3xl font-bold shadow-[0_0_30px_rgba(37,99,235,0.25)]">
                {initial}
              </div>

              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#0c1424] flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              </div>

            </div>


            {/* User information */}

            <div>
              <h2 className="text-2xl font-bold text-white">
                {name}
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                {email}
              </p>

              <div className="flex items-center gap-2 mt-3">

                <span className="px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-xs text-blue-400">
                  Standard User
                </span>

                <span className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-xs text-slate-400">
                  ID #{id}
                </span>

              </div>
            </div>

          </div>
        </div>


        {/* ================= ACCOUNT INFORMATION ================= */}

        <div className="p-8">

          <div className="flex items-center gap-3 mb-6">

            <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-blue-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white">
                Account Information
              </h3>

              <p className="text-xs text-slate-500">
                Your registered account details
              </p>
            </div>

          </div>


          {/* Information grid */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Full Name */}

            <div className="rounded-xl border border-slate-800 bg-[#0a1120] p-5 hover:border-slate-700 transition-colors">

              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Full Name
                </span>

                <span className="text-xs text-emerald-400">
                  Verified
                </span>
              </div>

              <p className="text-base font-medium text-slate-200">
                {name}
              </p>

            </div>


            {/* Email */}

            <div className="rounded-xl border border-slate-800 bg-[#0a1120] p-5 hover:border-slate-700 transition-colors">

              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Email Address
                </span>

                <span className="text-xs text-emerald-400">
                  Verified
                </span>
              </div>

              <p className="text-base font-medium text-slate-200 break-all">
                {email}
              </p>

            </div>


            {/* User ID */}

            <div className="rounded-xl border border-slate-800 bg-[#0a1120] p-5 hover:border-slate-700 transition-colors">

              <div className="mb-3">
                <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  User ID
                </span>
              </div>

              <p className="text-base font-mono text-blue-400">
                #{id}
              </p>

            </div>


            {/* Account Type */}

            <div className="rounded-xl border border-slate-800 bg-[#0a1120] p-5 hover:border-slate-700 transition-colors">

              <div className="mb-3">
                <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Account Type
                </span>
              </div>

              <div className="flex items-center gap-2">

                <span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_6px_rgba(96,165,250,0.8)]" />

                <p className="text-base font-medium text-slate-200">
                  User
                </p>

              </div>

            </div>

          </div>


          {/* ================= SECURITY SECTION ================= */}

          <div className="mt-8 pt-6 border-t border-slate-800">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">

                  <svg
                    className="w-5 h-5 text-cyan-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 15v2"
                    />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 10V8a4 4 0 118 0v2"
                    />

                    <rect
                      x="5"
                      y="10"
                      width="14"
                      height="10"
                      rx="2"
                    />
                  </svg>

                </div>

                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Account Security
                  </h3>

                  <p className="text-xs text-slate-500">
                    Your account is protected by secure authentication
                  </p>
                </div>

              </div>


              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/5 border border-emerald-500/20">

                <span className="w-2 h-2 rounded-full bg-emerald-400" />

                <span className="text-xs font-medium text-emerald-400">
                  SECURE
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* ================= FOOTER INFO ================= */}

      <div className="flex items-center justify-between px-1">

        <p className="text-xs text-slate-600">
          AI–DPR Guardian • Risk Assessment Platform
        </p>

        <p className="text-xs text-slate-600">
          Account ID: {id}
        </p>

      </div>

    </div>
  );
}