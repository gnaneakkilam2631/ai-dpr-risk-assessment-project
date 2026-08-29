import React, {
  useEffect,
  useState,
} from "react";

import {
  CheckCircle2,
  Clock,
  ShieldCheck,
  User,
} from "lucide-react";

import {
  useProject,
} from "../context/useProject";

import type {
  Mitigation,
  MitigationStatus,
} from "../context/ProjectContextBase";


export const MitigationAdvisorPage:
  React.FC =
  () => {

    const {
      mitigations,
      updateMitigationStatus,
      addToast,
      analyzeActiveProject,
    } =
      useProject();


    const [
      severityFilter,
      setSeverityFilter,
    ] =
      useState<
        "ALL" | Mitigation["severity"]
      >(
        "ALL"
      );


    const [
      statusFilter,
      setStatusFilter,
    ] =
      useState<
        "ALL" | MitigationStatus
      >(
        "ALL"
      );


    useEffect(
      () => {

        void analyzeActiveProject();

      },
      [
        analyzeActiveProject,
      ]
    );


    const filtered =
      mitigations.filter(
        (
          item
        ) =>
          (
            severityFilter ===
              "ALL" ||
            item.severity ===
              severityFilter
          ) &&
          (
            statusFilter ===
              "ALL" ||
            item.status ===
              statusFilter
          )
      );


    function changeStatus(
      item: Mitigation,
      status: MitigationStatus
    ) {

      updateMitigationStatus(
        item.id,
        status
      );


      addToast(
        `Mitigation status updated to ${status}.`,
        "success"
      );
    }


    return (
      <div className="space-y-6">

        <div>

          <div className="flex items-center gap-2">

            <ShieldCheck className="h-7 w-7 text-emerald-400" />

            <h1 className="text-3xl font-extrabold text-white">
              Mitigation Advisor
            </h1>

          </div>


          <p className="mt-2 text-sm text-slate-400">
            Recommended actions based on the risks actually identified in the uploaded DPR.
          </p>

        </div>


        <div className="flex flex-wrap gap-3 rounded-xl border border-slate-800 bg-[#0c1427] p-4">

          <select
            value={
              severityFilter
            }
            onChange={(
              event
            ) =>
              setSeverityFilter(
                event.target.value as
                  | "ALL"
                  | Mitigation["severity"]
              )
            }
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
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
                event.target.value as
                  | "ALL"
                  | MitigationStatus
              )
            }
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
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

          </select>

        </div>


        {filtered.length ===
        0 ? (

          <div className="rounded-2xl border border-dashed border-slate-700 p-12 text-center">

            <ShieldCheck className="mx-auto h-10 w-10 text-slate-500" />

            <p className="mt-3 font-bold text-white">
              No mitigation recommendations.
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Analyze a DPR first.
            </p>

          </div>

        ) : (

          <div className="space-y-4">

            {filtered.map(
              (
                item
              ) => (

                <div
                  key={
                    item.id
                  }
                  className="rounded-2xl border border-slate-800 bg-[#0c1427] p-5"
                >

                  <div className="flex justify-between gap-4">

                    <div>

                      <span className="text-xs font-bold uppercase text-red-400">
                        {
                          item.severity
                        }
                      </span>

                      <h2 className="mt-2 text-lg font-bold text-white">
                        {
                          item.riskTitle
                        }
                      </h2>

                      <p className="mt-2 text-sm text-slate-400">
                        {
                          item.recommendation
                        }
                      </p>

                    </div>


                    <span className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-slate-300">
                      {
                        item.status
                      }
                    </span>

                  </div>


                  <div className="mt-5 grid gap-3 md:grid-cols-3">

                    <Info
                      icon={
                        <ShieldCheck className="h-4 w-4 text-emerald-400" />
                      }
                      label="Action"
                      value={
                        item.action
                      }
                    />


                    <Info
                      icon={
                        <User className="h-4 w-4 text-cyan-400" />
                      }
                      label="Owner"
                      value={
                        item.owner
                      }
                    />


                    <Info
                      icon={
                        <Clock className="h-4 w-4 text-amber-400" />
                      }
                      label="Timeline"
                      value={
                        item.timeline
                      }
                    />

                  </div>


                  <div className="mt-4 flex flex-wrap gap-2">

                    <button
                      type="button"
                      onClick={() =>
                        changeStatus(
                          item,
                          "Accepted"
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white"
                    >

                      <CheckCircle2 className="h-4 w-4" />

                      Accept

                    </button>


                    <button
                      type="button"
                      onClick={() =>
                        changeStatus(
                          item,
                          "In Progress"
                        )
                      }
                      className="rounded-lg border border-cyan-700 px-3 py-2 text-xs font-bold text-cyan-300"
                    >
                      Start Mitigation
                    </button>


                    <button
                      type="button"
                      onClick={() =>
                        changeStatus(
                          item,
                          "Completed"
                        )
                      }
                      className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-bold text-slate-300"
                    >
                      Mark Completed
                    </button>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>
    );
  };


function Info({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-900/60 p-4">

      <div className="flex items-center gap-2">

        {icon}

        <span className="text-xs font-bold uppercase text-slate-500">
          {label}
        </span>

      </div>


      <p className="mt-2 text-sm text-slate-300">
        {value}
      </p>

    </div>
  );
}


export default MitigationAdvisorPage;