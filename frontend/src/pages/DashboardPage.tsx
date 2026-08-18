import React from "react";
import { useProject } from "../context/ProjectContext";

export function DashboardPage() {
  // ============================================================
  // USER
  // ============================================================

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

  if (!user) {
    const userId = localStorage.getItem("user_id");
    const userName = localStorage.getItem("user_name");
    const userEmail = localStorage.getItem("user_email");

    if (userId || userName || userEmail) {
      user = {
        id: userId ? Number(userId) : undefined,
        name: userName || undefined,
        email: userEmail || undefined,
      };
    }
  }

  // ============================================================
  // PROJECT CONTEXT
  // ============================================================

  const {
    activeProject,
    healthScore,
    riskAssessment,
    criticalFindings,
    contradictions,
    loadingAnalysis,
    analysisError,
    analyzeActiveProject,
  } = useProject();

  // ============================================================
  // SAFE DATA
  // ============================================================

  const overallHealth = Math.round(
    Number(healthScore?.overall ?? 0)
  );

  const riskScore = Math.round(
    Number(riskAssessment?.riskScore ?? 0)
  );

  const risks = Array.isArray(riskAssessment?.risks)
    ? riskAssessment.risks
    : [];

  const findings = Array.isArray(criticalFindings)
    ? criticalFindings
    : [];

  const contradictionList = Array.isArray(contradictions)
    ? contradictions
    : [];

  // ============================================================
  // RISK DIMENSIONS
  // ============================================================

  const dimensions = riskAssessment?.dimensions ?? {
    costRisk: 0,
    scheduleRisk: 0,
    technicalRisk: 0,
    financialRisk: 0,
    environmentalRisk: 0,
    complianceRisk: 0,
  };

  const riskData = [
    {
      name: "Cost Risk",
      value: Number(dimensions.costRisk ?? 0),
    },
    {
      name: "Schedule Risk",
      value: Number(dimensions.scheduleRisk ?? 0),
    },
    {
      name: "Technical Risk",
      value: Number(dimensions.technicalRisk ?? 0),
    },
    {
      name: "Financial Risk",
      value: Number(dimensions.financialRisk ?? 0),
    },
    {
      name: "Environmental Risk",
      value: Number(dimensions.environmentalRisk ?? 0),
    },
    {
      name: "Compliance Risk",
      value: Number(dimensions.complianceRisk ?? 0),
    },
  ];

  // ============================================================
  // HEALTH DIMENSIONS
  // ============================================================

  function getDimensionScore(
    searchTerms: string[]
  ): number {
    const details = healthScore?.dimensionDetails ?? [];

    const found = details.find((dimension: any) => {
      const name = String(
        dimension?.name ?? ""
      ).toLowerCase();

      return searchTerms.some((term) =>
        name.includes(term.toLowerCase())
      );
    });

    return Math.round(
      Number(found?.score ?? 0)
    );
  }

  const completeness = getDimensionScore([
    "completeness",
  ]);

  const consistency = getDimensionScore([
    "consistency",
    "conformance",
  ]);

  const compliance = getDimensionScore([
    "compliance",
  ]);

  // ============================================================
  // COUNTS
  // ============================================================

  const contradictionCount =
    contradictionList.length;

  const criticalFindingCount =
    findings.length;

  const riskCount =
    Number(riskAssessment?.riskCount ?? risks.length);

  // ============================================================
  // RISK LEVEL
  // ============================================================

  let riskLevel = "LOW";

  if (riskScore >= 80) {
    riskLevel = "CRITICAL";
  } else if (riskScore >= 60) {
    riskLevel = "HIGH";
  } else if (riskScore >= 35) {
    riskLevel = "MEDIUM";
  }

  // ============================================================
  // HEALTH GAUGE
  // ============================================================

  const healthDegrees =
    Math.max(
      0,
      Math.min(100, overallHealth)
    ) * 3.6;

  // ============================================================
  // ACTIVE PROJECT
  // ============================================================

  const projectName =
    activeProject?.name &&
    activeProject.id > 0
      ? activeProject.name
      : "No project selected";

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <div className="min-h-full space-y-6 pb-10">

      {/* ======================================================
          HEADER
      ====================================================== */}

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

          <p className="mt-2 text-xs text-slate-500">
            Active Project:{" "}
            <span className="font-semibold text-cyan-400">
              {projectName}
            </span>
          </p>

        </div>

        <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-[#0b1220] px-4 py-2">

          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.7)]" />

          <span className="text-xs font-semibold text-slate-400">
            AI ENGINE ONLINE
          </span>

        </div>

      </div>


      {/* ======================================================
          ANALYSIS ERROR
      ====================================================== */}

      {analysisError && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">

          <p className="text-sm font-semibold text-red-400">
            Analysis Error
          </p>

          <p className="mt-1 text-sm text-red-300">
            {analysisError}
          </p>

        </div>
      )}


      {/* ======================================================
          PROJECT STATUS
      ====================================================== */}

      <div className="rounded-2xl border border-slate-800 bg-[#0b1220] p-6">

        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

          <div>

            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-400">
              Active Workspace
            </p>

            <h2 className="mt-1 text-xl font-bold text-white">
              {projectName}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              DPR risk and quality intelligence
            </p>

          </div>

          <button
            type="button"
            onClick={() => analyzeActiveProject()}
            disabled={
              loadingAnalysis ||
              !activeProject ||
              activeProject.id <= 0
            }
            className="rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-5 py-3 text-sm font-bold text-cyan-400 transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loadingAnalysis
              ? "ANALYZING..."
              : "RUN DPR ANALYSIS"}
          </button>

        </div>

      </div>


      {/* ======================================================
          KPI CARDS
      ====================================================== */}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        <MetricCard
          title="DPR Health"
          value={String(overallHealth)}
          suffix="/100"
          subtitle="Overall document quality"
          icon={<HealthIcon />}
          accent="cyan"
          progress={overallHealth}
        />

        <MetricCard
          title="Risk Level"
          value={riskLevel}
          subtitle={`${riskCount} risks detected`}
          icon={<RiskIcon />}
          accent="red"
          progress={riskScore}
        />

        <MetricCard
          title="Contradictions"
          value={String(contradictionCount)}
          subtitle="Detected inconsistencies"
          icon={<WarningIcon />}
          accent="amber"
          progress={Math.min(
            contradictionCount * 10,
            100
          )}
        />

        <MetricCard
          title="Critical Findings"
          value={String(criticalFindingCount)}
          subtitle="High / critical findings"
          icon={<AlertIcon />}
          accent="purple"
          progress={Math.min(
            criticalFindingCount * 15,
            100
          )}
        />

      </div>


      {/* ======================================================
          RISK + HEALTH
      ====================================================== */}

      <div className="grid gap-6 xl:grid-cols-[1.6fr_0.9fr]">

        {/* RISK DIMENSIONS */}

        <div className="rounded-2xl border border-slate-800 bg-[#0b1220] p-6">

          <div className="mb-7">

            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-400">
              Risk Analytics
            </p>

            <h2 className="mt-1 text-xl font-bold text-white">
              Multi-Dimensional Risk Assessment
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Current risk exposure across DPR dimensions
            </p>

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


        {/* HEALTH */}

        <div className="rounded-2xl border border-slate-800 bg-[#0b1220] p-6">

          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-400">
            DPR Quality
          </p>

          <h2 className="mt-1 text-xl font-bold text-white">
            Health Score
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Overall AI appraisal quality
          </p>


          <div className="flex flex-col items-center justify-center py-8">

            <div
              className="relative flex h-52 w-52 items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(
                  #22d3ee 0deg ${healthDegrees}deg,
                  #1e293b ${healthDegrees}deg 360deg
                )`,
              }}
            >

              <div className="absolute inset-[12px] flex flex-col items-center justify-center rounded-full border border-slate-800 bg-[#0b1220]">

                <span className="text-5xl font-extrabold text-white">
                  {overallHealth}
                </span>

                <span className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  out of 100
                </span>

              </div>

            </div>

            <div className="mt-6">

              <span
                className={`text-sm font-semibold ${
                  overallHealth >= 75
                    ? "text-emerald-400"
                    : overallHealth >= 50
                    ? "text-amber-400"
                    : "text-red-400"
                }`}
              >
                {healthScore?.statusText ||
                  "DOCUMENT HEALTH"}
              </span>

            </div>

          </div>


          <div className="grid grid-cols-3 gap-2">

            <SmallStat
              label="Completeness"
              value={`${completeness}%`}
            />

            <SmallStat
              label="Consistency"
              value={`${consistency}%`}
            />

            <SmallStat
              label="Compliance"
              value={`${compliance}%`}
            />

          </div>

        </div>

      </div>


      {/* ======================================================
          CONTRADICTIONS + RISK DISTRIBUTION
      ====================================================== */}

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">

        {/* CONTRADICTIONS */}

        <div className="rounded-2xl border border-slate-800 bg-[#0b1220] p-6">

          <div className="mb-6 flex items-start justify-between">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-400">
                Detection
              </p>

              <h2 className="mt-1 text-xl font-bold text-white">
                Contradiction Activity
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                AI-detected inconsistencies in the current DPR
              </p>

            </div>

            <div className="text-right">

              <p className="text-2xl font-bold text-white">
                {contradictionCount}
              </p>

              <p className="text-xs text-slate-500">
                Findings
              </p>

            </div>

          </div>


          {contradictionCount === 0 ? (
            <div className="flex h-56 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/30">

              <div className="text-center">

                <p className="text-sm font-semibold text-slate-300">
                  No contradictions detected
                </p>

                <p className="mt-1 text-xs text-slate-600">
                  Run DPR analysis to generate contradiction findings.
                </p>

              </div>

            </div>
          ) : (
            <div className="space-y-3">

              {contradictionList
                .slice(0, 5)
                .map((item: any) => (

                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-800 bg-slate-900/40 p-4"
                  >

                    <div className="flex items-center justify-between">

                      <span className="text-xs font-bold uppercase text-amber-400">
                        {item.severity || "MEDIUM"}
                      </span>

                      <span className="text-xs text-slate-600">
                        {item.category || "Risk"}
                      </span>

                    </div>

                    <h3 className="mt-2 text-sm font-bold text-slate-200">
                      {item.title || "Contradiction detected"}
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      {item.aiFinding ||
                        item.impactDescription ||
                        "Potential inconsistency identified by the analysis engine."}
                    </p>

                  </div>

                ))}

            </div>
          )}

        </div>


        {/* RISK DISTRIBUTION */}

        <div className="rounded-2xl border border-slate-800 bg-[#0b1220] p-6">

          <p className="text-xs font-bold uppercase tracking-[0.18em] text-purple-400">
            Risk Intelligence
          </p>

          <h2 className="mt-1 text-xl font-bold text-white">
            Risk Distribution
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Current severity classification
          </p>


          <div className="mt-6 space-y-4">

            <SeverityRow
              label="Critical"
              value={getSeverityCount(
                risks,
                "critical"
              )}
              color="bg-red-500"
            />

            <SeverityRow
              label="High"
              value={getSeverityCount(
                risks,
                "high"
              )}
              color="bg-orange-400"
            />

            <SeverityRow
              label="Medium"
              value={getSeverityCount(
                risks,
                "medium"
              )}
              color="bg-amber-400"
            />

            <SeverityRow
              label="Low"
              value={getSeverityCount(
                risks,
                "low"
              )}
              color="bg-emerald-400"
            />

          </div>

        </div>

      </div>


      {/* ======================================================
          FINDINGS
      ====================================================== */}

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
            {criticalFindingCount} FINDINGS
          </span>

        </div>


        <div className="grid gap-3 md:grid-cols-3">

          {findings.length > 0 ? (

            findings
              .slice(0, 3)
              .map(
                (
                  finding: any,
                  index: number
                ) => (

                  <FindingCard
                    key={
                      finding?.id ??
                      index
                    }
                    severity={String(
                      finding?.severity ||
                        "HIGH"
                    ).toUpperCase()}
                    title={
                      finding?.title ||
                      finding?.name ||
                      "AI Finding"
                    }
                    description={
                      finding?.description ||
                      finding?.message ||
                      finding?.recommendation ||
                      "AI identified a potential issue requiring review."
                    }
                  />

                )
              )

          ) : (

            <div className="md:col-span-3 rounded-xl border border-slate-800 bg-slate-900/40 p-6 text-center">

              <p className="text-sm font-semibold text-slate-400">
                No critical findings available.
              </p>

              <p className="mt-1 text-xs text-slate-600">
                Upload a DPR and run analysis to populate this section.
              </p>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}


/* ============================================================
   HELPERS
============================================================ */

function getSeverityCount(
  findings: any[],
  severity: string
): number {
  if (!Array.isArray(findings)) {
    return 0;
  }

  return findings.filter(
    (finding) =>
      String(
        finding?.severity ?? ""
      ).toLowerCase() ===
      severity.toLowerCase()
  ).length;
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
  accent:
    | "cyan"
    | "red"
    | "amber"
    | "purple";
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

  const colors =
    accentClasses[accent];

  const safeProgress = Math.max(
    0,
    Math.min(
      100,
      Number(progress) || 0
    )
  );

  return (
    <div
      className={`rounded-2xl border ${colors.border} bg-[#0b1220] p-5 transition hover:-translate-y-1`}
    >

      <div className="flex items-start justify-between">

        <div>

          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </p>

          <div className="mt-3 flex items-baseline gap-1">

            <span
              className={`text-3xl font-extrabold ${colors.text}`}
            >
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
          style={{
            width: `${safeProgress}%`,
          }}
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

  const safeValue = Math.max(
    0,
    Math.min(
      100,
      Number(value) || 0
    )
  );

  let barColor = "bg-emerald-400";
  let textColor = "text-emerald-400";

  if (safeValue >= 70) {
    barColor = "bg-red-400";
    textColor = "text-red-400";
  } else if (safeValue >= 50) {
    barColor = "bg-amber-400";
    textColor = "text-amber-400";
  }

  return (
    <div>

      <div className="mb-2 flex items-center justify-between">

        <span className="text-sm font-medium text-slate-300">
          {name}
        </span>

        <span
          className={`text-sm font-bold ${textColor}`}
        >
          {safeValue}%
        </span>

      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-800">

        <div
          className={`h-full rounded-full ${barColor} transition-all duration-700`}
          style={{
            width: `${safeValue}%`,
          }}
        />

      </div>

    </div>
  );
}


/* ============================================================
   SEVERITY ROW
============================================================ */

function SeverityRow({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {

  return (
    <div className="flex items-center justify-between">

      <div className="flex items-center gap-3">

        <span
          className={`h-2.5 w-2.5 rounded-full ${color}`}
        />

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

  const severityLower =
    severity.toLowerCase();

  const color =
    severityLower === "critical"
      ? "text-red-400"
      : severityLower === "high"
      ? "text-orange-400"
      : severityLower === "medium"
      ? "text-amber-400"
      : "text-emerald-400";

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">

      <div className="mb-3 flex items-center gap-2">

        <span
          className={`h-2 w-2 rounded-full ${
            severityLower === "critical"
              ? "bg-red-400"
              : severityLower === "high"
              ? "bg-orange-400"
              : severityLower === "medium"
              ? "bg-amber-400"
              : "bg-emerald-400"
          }`}
        />

        <span
          className={`text-[10px] font-bold tracking-wider ${color}`}
        >
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
      <circle
        cx="12"
        cy="12"
        r="9"
      />

      <path d="M12 7v5" />

      <path d="M12 16h.01" />

    </svg>
  );
}