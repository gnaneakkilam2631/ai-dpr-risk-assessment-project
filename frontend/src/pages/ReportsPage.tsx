import React from "react";

import {
  FileText,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Download,
} from "lucide-react";

import {
  Mitigation,
  useProject,
} from "../context/ProjectContext";

export const ReportsPage: React.FC =
  () => {
    const {
      activeProject,
      healthScore,
      riskAssessment,
      contradictions,
      mitigations,
      addToast,
    } =
      useProject();

    function handleExport() {
      const report = {
        project:
          activeProject,

        health:
          healthScore,

        riskAssessment:
          riskAssessment,

        contradictions:
          contradictions,

        mitigations:
          mitigations,

        generatedAt:
          new Date().toISOString(),
      };

      const blob =
        new Blob(
          [
            JSON.stringify(
              report,
              null,
              2
            ),
          ],
          {
            type: "application/json",
          }
        );

      const url =
        URL.createObjectURL(
          blob
        );

      const anchor =
        document.createElement(
          "a"
        );

      anchor.href = url;

      anchor.download =
        `${activeProject.name || "DPR"}-risk-report.json`;

      anchor.click();

      URL.revokeObjectURL(
        url
      );

      addToast(
        "Report exported successfully.",
        "success"
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-3xl font-extrabold text-slate-900 dark:text-white">
              <FileText className="h-7 w-7 text-cyan-500" />

              DPR Assessment Report
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Consolidated project risk, health, contradiction and mitigation report.
            </p>
          </div>

          <button
            type="button"
            onClick={
              handleExport
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-cyan-700"
          >
            <Download className="h-4 w-4" />

            Export Report
          </button>
        </div>

        {/* PROJECT */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#0c1427]">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Project
          </p>

          <h2 className="mt-1 text-xl font-extrabold text-slate-900 dark:text-white">
            {
              activeProject.name
            }
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {
              activeProject.description ||
              "No project description available."
            }
          </p>
        </div>

        {/* SUMMARY */}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-5 dark:border-cyan-900 dark:bg-cyan-950/20">
            <p className="text-xs font-bold uppercase text-cyan-700 dark:text-cyan-300">
              Document Health
            </p>

            <p className="mt-2 text-3xl font-extrabold text-cyan-700 dark:text-cyan-400">
              {
                healthScore.overall
              }
            </p>
          </div>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950/20">
            <p className="text-xs font-bold uppercase text-red-700 dark:text-red-300">
              Risk Score
            </p>

            <p className="mt-2 text-3xl font-extrabold text-red-700 dark:text-red-400">
              {
                riskAssessment.riskScore
              }
            </p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900 dark:bg-amber-950/20">
            <p className="text-xs font-bold uppercase text-amber-700 dark:text-amber-300">
              Contradictions
            </p>

            <p className="mt-2 text-3xl font-extrabold text-amber-700 dark:text-amber-400">
              {
                contradictions.length
              }
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900 dark:bg-emerald-950/20">
            <p className="text-xs font-bold uppercase text-emerald-700 dark:text-emerald-300">
              Mitigations
            </p>

            <p className="mt-2 text-3xl font-extrabold text-emerald-700 dark:text-emerald-400">
              {
                mitigations.length
              }
            </p>
          </div>
        </div>

        {/* RISK DIMENSIONS */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#0c1427]">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-red-500" />

            <h2 className="font-bold text-slate-900 dark:text-white">
              Risk Dimensions
            </h2>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3">
            {Object.entries(
              riskAssessment.dimensions
            ).map(
              (
                [
                  name,
                  value,
                ]: [
                  string,
                  number
                ]
              ) => (
                <div
                  key={
                    name
                  }
                  className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900"
                >
                  <p className="text-xs font-bold uppercase text-slate-500">
                    {name.replace(
                      "Risk",
                      ""
                    )}
                  </p>

                  <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
                    {Math.round(
                      value
                    )}
                  </p>
                </div>
              )
            )}
          </div>
        </div>

        {/* MITIGATIONS */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#0c1427]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />

            <h2 className="font-bold text-slate-900 dark:text-white">
              Priority Mitigations
            </h2>
          </div>

          <div className="mt-4 space-y-3">
            {mitigations
              .slice(0, 5)
              .map(
                (
                  mitigation: Mitigation,
                  index: number
                ) => (
                  <div
                    key={
                      mitigation.id
                    }
                    className="rounded-xl border border-slate-200 p-4 dark:border-slate-800"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase text-slate-500">
                          Priority #
                          {
                            index +
                            1
                          }
                        </p>

                        <h3 className="mt-1 font-bold text-slate-900 dark:text-white">
                          {
                            mitigation.riskTitle
                          }
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          {
                            mitigation.action
                          }
                        </p>
                      </div>

                      <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {
                          mitigation.status
                        }
                      </span>
                    </div>
                  </div>
                )
              )}

            {mitigations.length ===
              0 && (
              <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
                <AlertTriangle className="mx-auto h-8 w-8 text-slate-400" />

                <p className="mt-2 text-sm text-slate-500">
                  No mitigation recommendations yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

export default ReportsPage;