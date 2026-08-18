import React, {
  useMemo,
  useState,
} from "react";

import {
  CheckCircle2,
  ShieldCheck,
  Clock,
  User,
} from "lucide-react";

import {
  Mitigation,
  MitigationStatus,
  useProject,
} from "../context/ProjectContext";

export const MitigationAdvisorPage: React.FC =
  () => {
    const {
      mitigations,
      updateMitigationStatus,
      addToast,
    } = useProject();

    const [
      severityFilter,
      setSeverityFilter,
    ] = useState<
      "ALL" | Mitigation["severity"]
    >("ALL");

    const [
      statusFilter,
      setStatusFilter,
    ] = useState<
      "ALL" | MitigationStatus
    >("ALL");

    const filteredMitigations =
      useMemo(
        () => {
          return mitigations.filter(
            (
              mitigation: Mitigation
            ) => {
              const severityMatches =
                severityFilter ===
                  "ALL" ||
                mitigation.severity ===
                  severityFilter;

              const statusMatches =
                statusFilter ===
                  "ALL" ||
                mitigation.status ===
                  statusFilter;

              return (
                severityMatches &&
                statusMatches
              );
            }
          );
        },
        [
          mitigations,
          severityFilter,
          statusFilter,
        ]
      );

    function changeStatus(
      mitigation: Mitigation,
      status: MitigationStatus
    ) {
      updateMitigationStatus(
        mitigation.id,
        status
      );

      addToast(
        `Mitigation status updated to ${status}.`,
        "success"
      );
    }

    return (
      <div className="space-y-6">
        {/* HEADER */}

        <div>
          <h1 className="flex items-center gap-2 text-3xl font-extrabold text-slate-900 dark:text-white">
            <ShieldCheck className="h-7 w-7 text-emerald-500" />

            Mitigation Advisor
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Recommended actions for reducing identified DPR risks.
          </p>
        </div>

        {/* FILTERS */}

        <div className="flex flex-wrap gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#0c1427]">
          <select
            value={
              severityFilter
            }
            onChange={(
              event
            ) =>
              setSeverityFilter(
                event.target
                  .value as
                  | "ALL"
                  | Mitigation["severity"]
              )
            }
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          >
            <option value="ALL">
              All Severities
            </option>

            <option value="critical">
              Critical
            </option>

            <option value="high">
              High
            </option>

            <option value="medium">
              Medium
            </option>

            <option value="low">
              Low
            </option>
          </select>

          <select
            value={
              statusFilter
            }
            onChange={(
              event
            ) =>
              setStatusFilter(
                event.target
                  .value as
                  | "ALL"
                  | MitigationStatus
              )
            }
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          >
            <option value="ALL">
              All Statuses
            </option>

            <option value="Proposed">
              Proposed
            </option>

            <option value="Accepted">
              Accepted
            </option>

            <option value="In Progress">
              In Progress
            </option>

            <option value="Completed">
              Completed
            </option>

            <option value="Rejected">
              Rejected
            </option>
          </select>

          <span className="ml-auto self-center text-xs text-slate-500">
            Showing{" "}
            {
              filteredMitigations.length
            }{" "}
            of{" "}
            {
              mitigations.length
            }
          </span>
        </div>

        {/* CARDS */}

        <div className="space-y-4">
          {filteredMitigations.map(
            (
              rec: Mitigation,
              index: number
            ) => (
              <div
                key={
                  rec.id
                }
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#0c1427]"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-bold uppercase text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        #{index + 1}
                      </span>

                      <span className="rounded-md bg-cyan-50 px-2 py-1 text-[11px] font-bold text-cyan-700 dark:bg-cyan-950/30 dark:text-cyan-300">
                        {
                          rec.category
                        }
                      </span>

                      <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-bold uppercase text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {
                          rec.severity
                        }
                      </span>
                    </div>

                    <h2 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">
                      {
                        rec.riskTitle
                      }
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                      {
                        rec.recommendation
                      }
                    </p>
                  </div>

                  <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {
                      rec.status
                    }
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
                  <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-500" />

                      <span className="text-xs font-bold uppercase text-slate-500">
                        Action
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                      {
                        rec.action
                      }
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-cyan-500" />

                      <span className="text-xs font-bold uppercase text-slate-500">
                        Owner
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                      {
                        rec.owner
                      }
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-amber-500" />

                      <span className="text-xs font-bold uppercase text-slate-500">
                        Timeline
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                      {
                        rec.timeline
                      }
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      changeStatus(
                        rec,
                        "Accepted"
                      )
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />

                    Accept
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      changeStatus(
                        rec,
                        "In Progress"
                      )
                    }
                    className="rounded-lg border border-cyan-300 px-3 py-2 text-xs font-bold text-cyan-700 hover:bg-cyan-50 dark:border-cyan-800 dark:text-cyan-300 dark:hover:bg-cyan-950/30"
                  >
                    Start Mitigation
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      changeStatus(
                        rec,
                        "Completed"
                      )
                    }
                    className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
                  >
                    Mark Completed
                  </button>
                </div>
              </div>
            )
          )}

          {filteredMitigations.length ===
            0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-700">
              <ShieldCheck className="mx-auto h-10 w-10 text-slate-400" />

              <p className="mt-3 font-bold text-slate-700 dark:text-slate-300">
                No mitigation recommendations available.
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Analyze a DPR to generate recommendations.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

export default MitigationAdvisorPage;