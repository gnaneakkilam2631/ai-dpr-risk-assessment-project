import React, {
  useMemo,
  useState,
} from "react";

import {
  AlertTriangle,
  ShieldAlert,
  Target,
  Activity,
} from "lucide-react";

import {
  RiskItem,
  RiskSeverity,
  useProject,
} from "../context/ProjectContext";

function severityColor(
  severity: RiskSeverity
): string {
  switch (severity) {
    case "critical":
      return "text-red-400";

    case "high":
      return "text-orange-400";

    case "medium":
      return "text-amber-400";

    default:
      return "text-emerald-400";
  }
}

function severityDot(
  severity: RiskSeverity
): string {
  switch (severity) {
    case "critical":
      return "bg-red-500";

    case "high":
      return "bg-orange-500";

    case "medium":
      return "bg-amber-500";

    default:
      return "bg-emerald-500";
  }
}

function getRiskScore(
  risk: RiskItem
): number {
  if (
    Number.isFinite(
      Number(risk.riskScore)
    )
  ) {
    return Number(
      risk.riskScore
    );
  }

  return Number(
    (
      (Number(
        risk.probability
      ) /
        100) *
      (Number(
        risk.impactScore
      ) /
        10)
    ).toFixed(2)
  );
}

export const RiskIntelligencePage: React.FC =
  () => {
    const {
      riskAssessment,
      criticalFindings,
    } =
      useProject();

    const risks =
      riskAssessment.risks;

    const [
      selectedRisk,
      setSelectedRisk,
    ] =
      useState<RiskItem | null>(
        risks[0] || null
      );

    const highestRisk =
      useMemo(() => {
        if (
          risks.length === 0
        ) {
          return null;
        }

        return [
          ...risks,
        ].sort(
          (a, b) =>
            getRiskScore(
              b
            ) -
            getRiskScore(
              a
            )
        )[0];
      }, [risks]);

    if (
      selectedRisk === null &&
      highestRisk
    ) {
      setSelectedRisk(
        highestRisk
      );
    }

    return (
      <div className="space-y-6">
        {/* HEADER */}

        <div>
          <h1 className="flex items-center gap-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            <Activity className="h-7 w-7 text-cyan-500" />

            Risk Intelligence
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Probability-impact assessment of identified DPR risks.
          </p>
        </div>

        {/* SUMMARY */}

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950/20">
            <p className="text-xs font-bold uppercase tracking-wider text-red-600">
              Critical
            </p>

            <p className="mt-2 text-3xl font-extrabold text-red-700 dark:text-red-400">
              {
                risks.filter(
                  (r) =>
                    r.severity ===
                    "critical"
                ).length
              }
            </p>
          </div>

          <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5 dark:border-orange-900 dark:bg-orange-950/20">
            <p className="text-xs font-bold uppercase tracking-wider text-orange-600">
              High
            </p>

            <p className="mt-2 text-3xl font-extrabold text-orange-700 dark:text-orange-400">
              {
                risks.filter(
                  (r) =>
                    r.severity ===
                    "high"
                ).length
              }
            </p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900 dark:bg-amber-950/20">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-600">
              Medium
            </p>

            <p className="mt-2 text-3xl font-extrabold text-amber-700 dark:text-amber-400">
              {
                risks.filter(
                  (r) =>
                    r.severity ===
                    "medium"
                ).length
              }
            </p>
          </div>

          <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-5 dark:border-cyan-900 dark:bg-cyan-950/20">
            <p className="text-xs font-bold uppercase tracking-wider text-cyan-600">
              Overall Score
            </p>

            <p className="mt-2 text-3xl font-extrabold text-cyan-700 dark:text-cyan-400">
              {
                riskAssessment.riskScore
              }
            </p>
          </div>
        </div>

        {/* MAIN */}

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* RISK MATRIX */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#0c1427] lg:col-span-2">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900 dark:text-white">
                  Probability / Impact Matrix
                </h2>

                <p className="text-xs text-slate-500">
                  Click a risk to inspect details.
                </p>
              </div>

              <Target className="h-5 w-5 text-cyan-500" />
            </div>

            <div className="relative h-[420px] rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-950">
              {/* AXES */}

              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-500">
                Probability →
              </div>

              <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 text-xs font-bold text-slate-500">
                Impact →
              </div>

              {/* GRID */}

              <div className="absolute inset-8 grid grid-cols-4 grid-rows-4">
                {Array.from(
                  {
                    length: 16,
                  }
                ).map(
                  (_, index) => (
                    <div
                      key={
                        index
                      }
                      className="border border-slate-200/70 dark:border-slate-800"
                    />
                  )
                )}
              </div>

              {/* RISK POINTS */}

              {risks.map(
                (risk) => {
                  const x =
                    Math.max(
                      5,
                      Math.min(
                        95,
                        Number(
                          risk.xPos ||
                            risk.probability ||
                            0
                        )
                      )
                    );

                  const y =
                    Math.max(
                      5,
                      Math.min(
                        95,
                        100 -
                          Number(
                            risk.yPos ||
                              risk.impactScore ||
                              0
                          )
                      )
                    );

                  const selected =
                    selectedRisk?.id ===
                    risk.id;

                  return (
                    <button
                      type="button"
                      key={
                        risk.id
                      }
                      onClick={() =>
                        setSelectedRisk(
                          risk
                        )
                      }
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                      }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 ${
                        selected
                          ? "z-20 scale-125"
                          : "z-10"
                      }`}
                    >
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-white shadow-lg ${severityDot(
                          risk.severity
                        )}`}
                      >
                        <span className="text-[10px] font-black text-white">
                          {risk.id}
                        </span>
                      </span>
                    </button>
                  );
                }
              )}

              {risks.length ===
                0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <ShieldAlert className="mx-auto h-10 w-10 text-slate-400" />

                    <p className="mt-2 text-sm font-semibold text-slate-500">
                      No risk findings available.
                    </p>

                    <p className="text-xs text-slate-400">
                      Upload and analyze a DPR first.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SELECTED RISK */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#0c1427]">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-red-500" />

              <h2 className="font-bold text-slate-900 dark:text-white">
                Risk Detail
              </h2>
            </div>

            {selectedRisk ? (
              <div className="mt-5 space-y-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${severityDot(
                        selectedRisk.severity
                      )}`}
                    />

                    <span
                      className={`text-xs font-bold uppercase ${severityColor(
                        selectedRisk.severity
                      )}`}
                    >
                      {
                        selectedRisk.severity
                      }
                    </span>
                  </div>

                  <h3 className="mt-2 text-lg font-extrabold text-slate-900 dark:text-white">
                    {
                      selectedRisk.title
                    }
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {
                      selectedRisk.description
                    }
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900">
                    <p className="text-[11px] text-slate-500">
                      Probability
                    </p>

                    <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                      {
                        selectedRisk.probability
                      }
                      %
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900">
                    <p className="text-[11px] text-slate-500">
                      Impact
                    </p>

                    <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                      {
                        selectedRisk.impactScore
                      }
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-4 dark:border-cyan-900 dark:bg-cyan-950/20">
                  <p className="text-xs font-bold uppercase text-cyan-700 dark:text-cyan-300">
                    Risk Score
                  </p>

                  <p className="mt-1 text-3xl font-extrabold text-cyan-700 dark:text-cyan-400">
                    {getRiskScore(
                      selectedRisk
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Recommended Action
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                    {
                      selectedRisk.recommendation
                    }
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center">
                <AlertTriangle className="mx-auto h-10 w-10 text-slate-400" />

                <p className="mt-2 text-sm text-slate-500">
                  Select a risk from the matrix.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* FINDINGS */}

        {criticalFindings.length >
          0 && (
          <div>
            <h2 className="mb-3 text-lg font-bold text-slate-900 dark:text-white">
              Priority Findings
            </h2>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {criticalFindings.map(
                (
                  risk
                ) => (
                  <button
                    type="button"
                    key={
                      risk.id
                    }
                    onClick={() =>
                      setSelectedRisk(
                        risk
                      )
                    }
                    className="rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-cyan-400 dark:border-slate-800 dark:bg-[#0c1427]"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${severityDot(
                          risk.severity
                        )}`}
                      />

                      <span className="text-xs font-bold uppercase text-slate-500">
                        {
                          risk.severity
                        }
                      </span>
                    </div>

                    <p className="mt-2 font-bold text-slate-900 dark:text-white">
                      {
                        risk.title
                      }
                    </p>
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

export default RiskIntelligencePage;