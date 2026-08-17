import React from "react";

export function DashboardPage() {
  const userString = localStorage.getItem("user");

  let user: {
    id?: number;
    name?: string;
    email?: string;
  } | null = null;

  try {
    user = userString ? JSON.parse(userString) : null;
  } catch {
    user = null;
  }

  const riskData = [
    { name: "Cost Risk", value: 73 },
    { name: "Schedule Risk", value: 81 },
    { name: "Technical Risk", value: 42 },
    { name: "Financial Risk", value: 67 },
    { name: "Environmental", value: 59 },
    { name: "Compliance", value: 28 },
  ];

  const contradictionData = [5, 8, 6, 11, 9, 14, 12, 14, 10, 14, 13, 14];

  return (
    <div className="min-h-full space-y-6 pb-10">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">

        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]" />

            <span className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
              Intelligence Overview
            </span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-400 md:text-base">
            Welcome back,{" "}
            <span className="font-semibold text-slate-200">
              {user?.name || "Guardian User"}
            </span>
            . Here's your DPR intelligence overview.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-[#0b1220] px-4 py-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.7)]" />

          <span className="text-xs font-semibold text-slate-400">
            AI ENGINE ONLINE
          </span>
        </div>

      </div>


      {/* =====================================================
          AUTHENTICATION / USER CARD
      ===================================================== */}

      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[#0b1220] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">

        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative">

          <div className="mb-5 flex items-center justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-400">
                Workspace Identity
              </p>

              <h2 className="mt-1 text-xl font-bold text-white">
                Authentication Successful
              </h2>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-emerald-400"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>

          </div>

          <div className="grid gap-5 md:grid-cols-3">

            <UserInfo
              label="IDENTITY"
              value={user?.name || "Guardian User"}
            />

            <UserInfo
              label="EMAIL"
              value={user?.email || "Not available"}
            />

            <UserInfo
              label="STATUS"
              value="Authenticated"
              success
            />

          </div>

        </div>
      </div>


      {/* =====================================================
          KPI CARDS
      ===================================================== */}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        <MetricCard
          title="DPR Health"
          value="82"
          suffix="/100"
          subtitle="Overall document quality"
          icon={<HealthIcon />}
          accent="cyan"
          progress={82}
        />

        <MetricCard
          title="Risk Level"
          value="HIGH"
          subtitle="Requires mitigation"
          icon={<RiskIcon />}
          accent="red"
          progress={78}
        />

        <MetricCard
          title="Contradictions"
          value="14"
          subtitle="Cross-chapter conflicts"
          icon={<WarningIcon />}
          accent="amber"
          progress={70}
        />

        <MetricCard
          title="Critical Findings"
          value="6"
          subtitle="Require immediate review"
          icon={<AlertIcon />}
          accent="purple"
          progress={60}
        />

      </div>


      {/* =====================================================
          MAIN ANALYTICS ROW
      ===================================================== */}

      <div className="grid gap-6 xl:grid-cols-[1.6fr_0.9fr]">

        {/* =================================================
            RISK DIMENSION CHART
        ================================================= */}

        <div className="rounded-2xl border border-slate-800 bg-[#0b1220] p-6">

          <div className="mb-7 flex items-start justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-400">
                Risk Analytics
              </p>

              <h2 className="mt-1 text-xl font-bold text-white">
                Multi-Dimensional Risk Assessment
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                AI-evaluated risk exposure across DPR dimensions
              </p>
            </div>

            <div className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2">
              <span className="text-xs font-semibold text-slate-400">
                LIVE ANALYSIS
              </span>
            </div>

          </div>

          <div className="space-y-5">

            {riskData.map((item) => (
              <RiskBar
                key={item.name}
                name={item.name}
                value={item.value}
              />
            ))}

          </div>

        </div>


        {/* =================================================
            HEALTH GAUGE
        ================================================= */}

        <div className="rounded-2xl border border-slate-800 bg-[#0b1220] p-6">

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-400">
              DPR Quality
            </p>

            <h2 className="mt-1 text-xl font-bold text-white">
              Health Score
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Overall AI appraisal quality
            </p>
          </div>


          <div className="flex flex-col items-center justify-center py-8">

            <div
              className="relative flex h-52 w-52 items-center justify-center rounded-full"
              style={{
                background:
                  "conic-gradient(#22d3ee 0deg 295deg, #1e293b 295deg 360deg)",
              }}
            >

              <div className="absolute inset-[12px] flex flex-col items-center justify-center rounded-full border border-slate-800 bg-[#0b1220]">

                <span className="text-5xl font-extrabold tracking-tight text-white">
                  82
                </span>

                <span className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  out of 100
                </span>

              </div>

            </div>

            <div className="mt-6 flex items-center gap-2">

              <span className="h-2 w-2 rounded-full bg-emerald-400" />

              <span className="text-sm font-semibold text-emerald-400">
                GOOD DOCUMENT HEALTH
              </span>

            </div>

          </div>


          <div className="grid grid-cols-3 gap-2">

            <SmallStat
              label="Completeness"
              value="91%"
            />

            <SmallStat
              label="Consistency"
              value="76%"
            />

            <SmallStat
              label="Compliance"
              value="84%"
            />

          </div>

        </div>

      </div>


      {/* =====================================================
          CONTRADICTION TREND + RISK DISTRIBUTION
      ===================================================== */}

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">

        {/* CONTRADICTION TREND */}

        <div className="rounded-2xl border border-slate-800 bg-[#0b1220] p-6">

          <div className="mb-6 flex items-start justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-400">
                Detection History
              </p>

              <h2 className="mt-1 text-xl font-bold text-white">
                Contradiction Activity
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                AI-detected inconsistencies across document analysis
              </p>
            </div>

            <div className="text-right">

              <p className="text-2xl font-bold text-white">
                14
              </p>

              <p className="text-xs text-slate-500">
                Current findings
              </p>

            </div>

          </div>


          <div className="relative h-56 w-full">

            {/* GRID */}

            <div className="absolute inset-0 flex flex-col justify-between">

              {[20, 15, 10, 5, 0].map((value) => (
                <div
                  key={value}
                  className="flex items-center gap-3"
                >
                  <span className="w-5 text-[10px] text-slate-600">
                    {value}
                  </span>

                  <div className="h-px flex-1 bg-slate-800" />
                </div>
              ))}

            </div>


            {/* SVG GRAPH */}

            <svg
              viewBox="0 0 700 220"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full overflow-visible pl-7"
            >

              <defs>

                <linearGradient
                  id="lineGradient"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="0"
                >
                  <stop
                    offset="0%"
                    stopColor="#3b82f6"
                  />

                  <stop
                    offset="100%"
                    stopColor="#22d3ee"
                  />
                </linearGradient>

                <linearGradient
                  id="areaGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#22d3ee"
                    stopOpacity="0.25"
                  />

                  <stop
                    offset="100%"
                    stopColor="#22d3ee"
                    stopOpacity="0"
                  />
                </linearGradient>

              </defs>


              <path
                d="M0 165 L64 132 L127 148 L191 99 L255 115 L318 66 L382 82 L445 66 L509 99 L573 66 L636 82 L700 66 L700 220 L0 220 Z"
                fill="url(#areaGradient)"
              />


              <path
                d="M0 165 L64 132 L127 148 L191 99 L255 115 L318 66 L382 82 L445 66 L509 99 L573 66 L636 82 L700 66"
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />


              {[
                [0, 165],
                [64, 132],
                [127, 148],
                [191, 99],
                [255, 115],
                [318, 66],
                [382, 82],
                [445, 66],
                [509, 99],
                [573, 66],
                [636, 82],
                [700, 66],
              ].map(([cx, cy], index) => (
                <circle
                  key={index}
                  cx={cx}
                  cy={cy}
                  r="5"
                  fill="#0b1220"
                  stroke="#22d3ee"
                  strokeWidth="3"
                />
              ))}

            </svg>

          </div>


          <div className="mt-4 flex justify-between pl-8 text-[10px] uppercase tracking-wider text-slate-600">

            <span>JAN</span>
            <span>FEB</span>
            <span>MAR</span>
            <span>APR</span>
            <span>MAY</span>
            <span>JUN</span>
            <span>JUL</span>
            <span>AUG</span>

          </div>

        </div>


        {/* RISK DISTRIBUTION */}

        <div className="rounded-2xl border border-slate-800 bg-[#0b1220] p-6">

          <div className="mb-5">

            <p className="text-xs font-bold uppercase tracking-[0.18em] text-purple-400">
              Risk Intelligence
            </p>

            <h2 className="mt-1 text-xl font-bold text-white">
              Risk Distribution
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Current severity classification
            </p>

          </div>


          <div className="flex items-center justify-center py-4">

            <div
              className="relative h-44 w-44 rounded-full"
              style={{
                background:
                  "conic-gradient(#ef4444 0deg 125deg, #f59e0b 125deg 235deg, #22c55e 235deg 310deg, #64748b 310deg 360deg)",
              }}
            >

              <div className="absolute inset-8 flex flex-col items-center justify-center rounded-full bg-[#0b1220]">

                <span className="text-3xl font-extrabold text-white">
                  14
                </span>

                <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                  Findings
                </span>

              </div>

            </div>

          </div>


          <div className="mt-4 space-y-3">

            <Legend
              color="bg-red-500"
              label="Critical"
              value="5"
            />

            <Legend
              color="bg-amber-400"
              label="High"
              value="4"
            />

            <Legend
              color="bg-emerald-400"
              label="Medium"
              value="3"
            />

            <Legend
              color="bg-slate-500"
              label="Low"
              value="2"
            />

          </div>

        </div>

      </div>


      {/* =====================================================
          AI FINDINGS
      ===================================================== */}

      <div className="rounded-2xl border border-slate-800 bg-[#0b1220] p-6">

        <div className="mb-6 flex items-center justify-between">

          <div>

            <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-400">
              AI Priority Queue
            </p>

            <h2 className="mt-1 text-xl font-bold text-white">
              Critical Findings
            </h2>

          </div>

          <span className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-400">
            6 REQUIRES ACTION
          </span>

        </div>


        <div className="grid gap-3 md:grid-cols-3">

          <FindingCard
            severity="CRITICAL"
            title="Budget Contradiction"
            description="₹14.6 Cr variance detected between Executive Summary and BoQ Table 7.4."
          />

          <FindingCard
            severity="HIGH"
            title="Schedule Conflict"
            description="Road surfacing overlaps with the identified peak monsoon execution window."
          />

          <FindingCard
            severity="HIGH"
            title="Environmental Clearance"
            description="Required clearance evidence is missing from the submitted DPR documentation."
          />

        </div>

      </div>

    </div>
  );
}


/* ============================================================
   USER INFO
============================================================ */

function UserInfo({
  label,
  value,
  success = false,
}: {
  label: string;
  value: string;
  success?: boolean;
}) {
  return (
    <div>

      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>

      <p
        className={`mt-1 text-sm font-semibold ${
          success ? "text-emerald-400" : "text-slate-200"
        }`}
      >
        {value}
      </p>

    </div>
  );
}


/* ============================================================
   METRIC CARD
============================================================ */

function MetricCard({
  title,
  value,
  suffix,
  subtitle,
  icon,
  accent,
  progress,
}: {
  title: string;
  value: string;
  suffix?: string;
  subtitle: string;
  icon: React.ReactNode;
  accent: "cyan" | "red" | "amber" | "purple";
  progress: number;
}) {
  const accentClasses = {
    cyan: {
      text: "text-cyan-400",
      bg: "bg-cyan-400",
      border: "border-cyan-400/20",
    },
    red: {
      text: "text-red-400",
      bg: "bg-red-400",
      border: "border-red-400/20",
    },
    amber: {
      text: "text-amber-400",
      bg: "bg-amber-400",
      border: "border-amber-400/20",
    },
    purple: {
      text: "text-purple-400",
      bg: "bg-purple-400",
      border: "border-purple-400/20",
    },
  };

  const colors = accentClasses[accent];

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border ${colors.border} bg-[#0b1220] p-5 transition duration-300 hover:-translate-y-1 hover:border-slate-600 hover:shadow-[0_15px_40px_rgba(0,0,0,0.3)]`}
    >

      <div className="flex items-start justify-between">

        <div>

          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </p>

          <div className="mt-3 flex items-baseline gap-1">

            <span className={`text-3xl font-extrabold ${colors.text}`}>
              {value}
            </span>

            {suffix && (
              <span className="text-sm font-semibold text-slate-600">
                {suffix}
              </span>
            )}

          </div>

          <p className="mt-1 text-xs text-slate-500">
            {subtitle}
          </p>

        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl border ${colors.border} bg-slate-900 ${colors.text}`}
        >
          {icon}
        </div>

      </div>


      <div className="mt-5 h-1 overflow-hidden rounded-full bg-slate-800">

        <div
          className={`h-full rounded-full ${colors.bg}`}
          style={{ width: `${progress}%` }}
        />

      </div>

    </div>
  );
}


/* ============================================================
   RISK BAR
============================================================ */

function RiskBar({
  name,
  value,
}: {
  name: string;
  value: number;
}) {
  let barColor = "bg-emerald-400";
  let textColor = "text-emerald-400";

  if (value >= 70) {
    barColor = "bg-red-400";
    textColor = "text-red-400";
  } else if (value >= 50) {
    barColor = "bg-amber-400";
    textColor = "text-amber-400";
  }

  return (
    <div>

      <div className="mb-2 flex items-center justify-between">

        <span className="text-sm font-medium text-slate-300">
          {name}
        </span>

        <span className={`text-sm font-bold ${textColor}`}>
          {value}%
        </span>

      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-800">

        <div
          className={`h-full rounded-full ${barColor} transition-all duration-700`}
          style={{ width: `${value}%` }}
        />

      </div>

    </div>
  );
}


/* ============================================================
   SMALL STAT
============================================================ */

function SmallStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3 text-center">

      <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-600">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold text-slate-200">
        {value}
      </p>

    </div>
  );
}


/* ============================================================
   LEGEND
============================================================ */

function Legend({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between">

      <div className="flex items-center gap-3">

        <span className={`h-2.5 w-2.5 rounded-full ${color}`} />

        <span className="text-sm text-slate-400">
          {label}
        </span>

      </div>

      <span className="text-sm font-bold text-slate-200">
        {value}
      </span>

    </div>
  );
}


/* ============================================================
   FINDING CARD
============================================================ */

function FindingCard({
  severity,
  title,
  description,
}: {
  severity: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 transition hover:border-slate-700">

      <div className="mb-3 flex items-center gap-2">

        <span className="h-2 w-2 rounded-full bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.8)]" />

        <span className="text-[10px] font-bold tracking-wider text-red-400">
          {severity}
        </span>

      </div>

      <h3 className="font-bold text-slate-200">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
      </p>

    </div>
  );
}


/* ============================================================
   ICONS
============================================================ */

function HealthIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M3 12h4l2-7 4 14 2-7h6" />
    </svg>
  );
}


function RiskIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M12 3 21 19H3L12 3Z" />
      <path d="M12 9v4" />
      <path d="M12 16h.01" />
    </svg>
  );
}


function WarningIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M4 5h16v14H4z" />
      <path d="M8 9h8" />
      <path d="M8 13h5" />
    </svg>
  );
}


function AlertIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5" />
      <path d="M12 16h.01" />
    </svg>
  );
}