import React, {
  useMemo,
  useState,
} from "react";

import {
  AlertCircle,
  Check,
  CheckCircle2,
  Filter,
  RotateCcw,
  Scale,
  Sparkles,
} from "lucide-react";

import {
  useProject,
} from "../context/useProject";

import type {
  Contradiction,
  RiskSeverity,
} from "../context/ProjectContextBase";


export const ContradictionsPage:
  React.FC =
  () => {

    const {
      contradictions,
      riskAssessment,
      markContradictionReviewed,
    } =
      useProject();


    const [
      severityFilter,
      setSeverityFilter,
    ] =
      useState<
        "ALL" | RiskSeverity
      >(
        "ALL"
      );


    const [
      statusFilter,
      setStatusFilter,
    ] =
      useState<
        "ALL" |
        "REVIEWED" |
        "UNREVIEWED"
      >(
        "ALL"
      );


    const reviewedCount =
      contradictions.filter(
        (
          item
        ) =>
          item.reviewed
      ).length;


    const filtered =
      useMemo(
        () =>
          contradictions.filter(
            (
              item
            ) => {

              const severityMatches =
                severityFilter ===
                  "ALL" ||
                item.severity ===
                  severityFilter;


              const statusMatches =
                statusFilter ===
                  "ALL"
                  ? true
                  : statusFilter ===
                    "REVIEWED"
                  ? item.reviewed
                  : !item.reviewed;


              return (
                severityMatches &&
                statusMatches
              );
            }
          ),
        [
          contradictions,
          severityFilter,
          statusFilter,
        ]
      );


    return (
      <div className="space-y-6">

        <div>

          <div className="flex items-center gap-2">

            <Scale className="h-7 w-7 text-amber-400" />

            <h1 className="text-3xl font-extrabold text-white">
              Consistency & Contradiction Analysis
            </h1>

          </div>


          <p className="mt-2 text-sm text-slate-400">
            Contradictions are kept separate from general
            DPR risk findings.
          </p>

        </div>


        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

          <Card
            label="Total Risks"
            value={
              riskAssessment.riskCount
            }
          />


          <Card
            label="Contradictions"
            value={
              contradictions.length
            }
          />


          <Card
            label="Reviewed"
            value={
              reviewedCount
            }
          />


          <Card
            label="Pending"
            value={
              Math.max(
                0,
                contradictions.length -
                  reviewedCount
              )
            }
          />

        </div>


        <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">

          <div className="flex gap-3">

            <Sparkles className="h-5 w-5 text-cyan-400" />

            <div>

              <p className="text-sm font-bold text-cyan-300">
                Risk count is not contradiction count
              </p>

              <p className="mt-1 text-xs text-slate-400">

                This project currently has{" "}
                <strong className="text-white">
                  {
                    riskAssessment.riskCount
                  }
                </strong>{" "}
                identified risks and{" "}
                <strong className="text-white">
                  {
                    contradictions.length
                  }
                </strong>{" "}
                actual contradiction findings.

              </p>

            </div>

          </div>

        </div>


        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-800 bg-[#0c1427] p-3">

          <Filter className="h-4 w-4 text-slate-500" />


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
                  | RiskSeverity
              )
            }
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white"
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
                  | "REVIEWED"
                  | "UNREVIEWED"
              )
            }
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white"
          >

            <option value="ALL">
              All Statuses
            </option>

            <option value="REVIEWED">
              Reviewed
            </option>

            <option value="UNREVIEWED">
              Pending
            </option>

          </select>

        </div>


        {filtered.length ===
        0 ? (

          <div className="rounded-2xl border border-dashed border-slate-700 p-12 text-center">

            <Scale className="mx-auto h-10 w-10 text-slate-500" />

            <p className="mt-3 text-lg font-bold text-white">
              No contradictions detected
            </p>

            <p className="mt-2 text-sm text-slate-500">
              General DPR risks are shown in DPR Analysis;
              only actual consistency conflicts belong here.
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

                  <div className="flex items-center justify-between">

                    <span className="text-xs font-bold uppercase text-amber-400">
                      {
                        item.severity
                      }
                    </span>


                    {item.reviewed && (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">

                        <CheckCircle2 className="h-4 w-4" />

                        Reviewed

                      </span>
                    )}

                  </div>


                  <h2 className="mt-3 font-bold text-white">
                    {
                      item.title
                    }
                  </h2>


                  <div className="mt-4 grid gap-4 md:grid-cols-2">

                    <Section
                      title={
                        item.sectionA.title
                      }
                      text={
                        item.sectionA.text
                      }
                      page={
                        item.sectionA.page
                      }
                    />


                    <Section
                      title={
                        item.sectionB.title
                      }
                      text={
                        item.sectionB.text
                      }
                      page={
                        item.sectionB.page
                      }
                    />

                  </div>


                  <div className="mt-4 rounded-xl bg-slate-900/70 p-4">

                    <div className="flex gap-2">

                      <AlertCircle className="h-4 w-4 text-amber-400" />

                      <p className="text-xs text-slate-400">

                        {
                          item.aiFinding
                        }

                      </p>

                    </div>

                  </div>


                  <div className="mt-4 flex justify-end">

                    {item.reviewed ? (

                      <button
                        type="button"
                        onClick={() =>
                          markContradictionReviewed(
                            item.id,
                            false
                          )
                        }
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs font-bold text-white"
                      >

                        <RotateCcw className="h-4 w-4" />

                        Reopen

                      </button>

                    ) : (

                      <button
                        type="button"
                        onClick={() =>
                          markContradictionReviewed(
                            item.id,
                            true
                          )
                        }
                        className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white"
                      >

                        <Check className="h-4 w-4" />

                        Mark Reviewed

                      </button>

                    )}

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>
    );
  };


function Card({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-[#0c1427] p-4">

      <p className="text-xs font-bold uppercase text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-3xl font-extrabold text-white">
        {value}
      </p>

    </div>
  );
}


function Section({
  title,
  text,
  page,
}: {
  title: string;
  text: string;
  page: number;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">

      <div className="flex justify-between">

        <span className="text-xs font-bold text-cyan-400">
          {title}
        </span>

        <span className="text-xs text-slate-500">
          Page {page}
        </span>

      </div>


      <p className="mt-3 text-xs italic leading-6 text-slate-400">
        "{text}"
      </p>

    </div>
  );
}


export default ContradictionsPage;