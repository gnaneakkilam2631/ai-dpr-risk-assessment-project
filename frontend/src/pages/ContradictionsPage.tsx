import React, {
  useMemo,
  useState,
} from "react";

import {
  Scale,
  CheckCircle2,
  AlertCircle,
  FileSearch,
  Filter,
  Check,
  RotateCcw,
  Sparkles,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import {
  Contradiction,
  RiskSeverity,
  useProject,
} from "../context/ProjectContext";

import { RiskBadge } from "../components/common/RiskBadge";

export const ContradictionsPage: React.FC =
  () => {
    const {
      contradictions,
      markContradictionReviewed,
      setActiveEvidenceTarget,
    } =
      useProject();

    const navigate =
      useNavigate();

    const [
      categoryFilter,
      setCategoryFilter,
    ] =
      useState<string>(
        "ALL"
      );

    const [
      severityFilter,
      setSeverityFilter,
    ] =
      useState<
        "ALL" | RiskSeverity
      >("ALL");

    const [
      statusFilter,
      setStatusFilter,
    ] =
      useState<
        "ALL" |
        "UNREVIEWED" |
        "REVIEWED"
      >("ALL");

    const criticalCount =
      contradictions.filter(
        (
          item: Contradiction
        ) =>
          item.severity ===
          "critical"
      ).length;

    const highCount =
      contradictions.filter(
        (
          item: Contradiction
        ) =>
          item.severity ===
          "high"
      ).length;

    const mediumCount =
      contradictions.filter(
        (
          item: Contradiction
        ) =>
          item.severity ===
          "medium"
      ).length;

    const lowCount =
      contradictions.filter(
        (
          item: Contradiction
        ) =>
          item.severity ===
          "low"
      ).length;

    const reviewedCount =
      contradictions.filter(
        (
          item: Contradiction
        ) =>
          item.reviewed
      ).length;

    const filteredContradictions =
      useMemo(
        () =>
          contradictions.filter(
            (
              item: Contradiction
            ) => {
              const matchesCategory =
                categoryFilter ===
                  "ALL" ||
                item.category ===
                  categoryFilter;

              const matchesSeverity =
                severityFilter ===
                  "ALL" ||
                item.severity ===
                  severityFilter;

              const matchesStatus =
                statusFilter ===
                  "ALL"
                  ? true
                  : statusFilter ===
                    "REVIEWED"
                  ? item.reviewed
                  : !item.reviewed;

              return (
                matchesCategory &&
                matchesSeverity &&
                matchesStatus
              );
            }
          ),
        [
          contradictions,
          categoryFilter,
          severityFilter,
          statusFilter,
        ]
      );

    function handleOpenEvidence(
      pageNumber: number,
      section: string,
      title: string
    ) {
      setActiveEvidenceTarget({
        page: pageNumber,
        section,
        title,
      });

      navigate(
        "/evidence"
      );
    }

    return (
      <div className="space-y-6">
        {/* HEADER */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="flex items-center gap-2.5 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              <Scale className="h-7 w-7 text-amber-500" />

              Consistency & Contradiction Analysis
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Cross-chapter validation identifying conflicting costs, schedules, dimensions, and quantities.
            </p>
          </div>

          <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            Audit Status:{" "}
            <strong>
              {reviewedCount} of{" "}
              {
                contradictions.length
              }{" "}
              Reviewed
            </strong>
          </span>
        </div>

        {/* COUNTERS */}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label:
                "Critical",
              value:
                criticalCount,
              className:
                "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/20 dark:text-red-400",
            },
            {
              label:
                "High",
              value:
                highCount,
              className:
                "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900 dark:bg-orange-950/20 dark:text-orange-400",
            },
            {
              label:
                "Medium",
              value:
                mediumCount,
              className:
                "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-400",
            },
            {
              label:
                "Low",
              value:
                lowCount,
              className:
                "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/20 dark:text-emerald-400",
            },
          ].map(
            (
              card
            ) => (
              <div
                key={
                  card.label
                }
                className={`rounded-xl border p-4 ${card.className}`}
              >
                <p className="text-xs font-bold uppercase tracking-wider">
                  {
                    card.label
                  }
                </p>

                <p className="mt-2 text-2xl font-extrabold">
                  {
                    card.value
                  }
                </p>
              </div>
            )
          )}
        </div>

        {/* FILTERS */}

        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-[#0c1427]">
          <span className="mr-1 flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-500">
            <Filter className="h-3.5 w-3.5" />
            Filters
          </span>

          <select
            value={
              categoryFilter
            }
            onChange={(
              event
            ) =>
              setCategoryFilter(
                event.target
                  .value
              )
            }
            className="h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          >
            <option value="ALL">
              All Categories
            </option>

            <option value="Financial">
              Financial
            </option>

            <option value="Timeline">
              Timeline
            </option>

            <option value="Material & Quantities">
              Material & Quantities
            </option>

            <option value="Statutory Approvals">
              Statutory Approvals
            </option>

            <option value="Beneficiaries">
              Beneficiaries
            </option>
          </select>

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
                  | RiskSeverity
              )
            }
            className="h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-white"
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

          <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 dark:border-slate-700 dark:bg-slate-900">
            {(
              [
                "ALL",
                "UNREVIEWED",
                "REVIEWED",
              ] as const
            ).map(
              (
                status
              ) => (
                <button
                  type="button"
                  key={
                    status
                  }
                  onClick={() =>
                    setStatusFilter(
                      status
                    )
                  }
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold ${
                    statusFilter ===
                    status
                      ? "bg-white text-slate-900 shadow dark:bg-slate-800 dark:text-white"
                      : "text-slate-500"
                  }`}
                >
                  {status ===
                  "ALL"
                    ? `All (${contradictions.length})`
                    : status ===
                      "REVIEWED"
                    ? `Reviewed (${reviewedCount})`
                    : `Pending (${contradictions.length - reviewedCount})`}
                </button>
              )
            )}
          </div>
        </div>

        {/* FINDINGS */}

        <div className="space-y-4">
          {filteredContradictions.map(
            (
              item: Contradiction
            ) => (
              <div
                key={
                  item.id
                }
                className={`rounded-2xl border p-5 ${
                  item.reviewed
                    ? "border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/20"
                    : "border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0c1427]"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
                  <div className="flex flex-wrap items-center gap-2">
                    <RiskBadge
                      severity={
                        item.severity
                      }
                      size="sm"
                      showPulse={
                        item.severity ===
                          "critical" &&
                        !item.reviewed
                      }
                    />

                    <span className="rounded bg-slate-100 px-2 py-1 text-xs font-bold uppercase text-slate-500 dark:bg-slate-800">
                      {
                        item.category
                      }
                    </span>

                    {item.financialImpactCr !==
                      undefined && (
                      <span className="rounded border border-rose-200 bg-rose-50 px-2 py-1 text-xs font-bold text-rose-600 dark:border-rose-900 dark:bg-red-950/30 dark:text-rose-400">
                        Variance: ₹
                        {
                          item.financialImpactCr
                        }{" "}
                        Cr
                      </span>
                    )}
                  </div>

                  {item.reviewed && (
                    <div className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                      <CheckCircle2 className="h-4 w-4" />

                      Reviewed
                    </div>
                  )}
                </div>

                <h2 className="mt-4 font-bold text-slate-900 dark:text-white">
                  {
                    item.title
                  }
                </h2>

                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-blue-200 bg-blue-50/30 p-4 dark:border-blue-900/40 dark:bg-blue-950/20">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-blue-700 dark:text-blue-300">
                        {
                          item.sectionA
                            .sectionNumber
                        }
                        :{" "}
                        {
                          item.sectionA
                            .title
                        }
                      </span>

                      <span className="text-slate-400">
                        Page{" "}
                        {
                          item.sectionA
                            .page
                        }
                      </span>
                    </div>

                    <p className="mt-3 rounded-lg bg-white p-3 text-xs italic leading-6 text-slate-700 dark:bg-slate-900 dark:text-slate-300">
                      "
                      {
                        item.sectionA
                          .text
                      }
                      "
                    </p>
                  </div>

                  <div className="rounded-xl border border-red-200 bg-red-50/30 p-4 dark:border-red-900/40 dark:bg-red-950/20">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-red-700 dark:text-red-300">
                        {
                          item.sectionB
                            .sectionNumber
                        }
                        :{" "}
                        {
                          item.sectionB
                            .title
                        }
                      </span>

                      <span className="text-slate-400">
                        Page{" "}
                        {
                          item.sectionB
                            .page
                        }
                      </span>
                    </div>

                    <p className="mt-3 rounded-lg bg-white p-3 text-xs italic leading-6 text-slate-700 dark:bg-slate-900 dark:text-slate-300">
                      "
                      {
                        item.sectionB
                          .text
                      }
                      "
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
                  <div className="flex gap-2 text-xs">
                    <Sparkles className="h-4 w-4 shrink-0 text-cyan-500" />

                    <div>
                      <strong className="text-slate-900 dark:text-white">
                        AI Finding:{" "}
                      </strong>

                      <span className="text-slate-600 dark:text-slate-400">
                        {
                          item.aiFinding
                        }
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex gap-2 border-t border-slate-200 pt-3 text-xs dark:border-slate-800">
                    <AlertCircle className="h-4 w-4 shrink-0 text-amber-500" />

                    <div>
                      <strong className="text-slate-900 dark:text-white">
                        Impact:{" "}
                      </strong>

                      <span className="text-slate-600 dark:text-slate-400">
                        {
                          item.impactDescription
                        }
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      handleOpenEvidence(
                        item.sectionB.page,
                        item.sectionB.sectionNumber,
                        item.title
                      )
                    }
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-600 dark:text-cyan-400"
                  >
                    <FileSearch className="h-4 w-4" />

                    View Evidence
                  </button>

                  {item.reviewed ? (
                    <button
                      type="button"
                      onClick={() =>
                        markContradictionReviewed(
                          item.id,
                          false
                        )
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold text-slate-600 dark:border-slate-700 dark:text-slate-300"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />

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
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white"
                    >
                      <Check className="h-3.5 w-3.5" />

                      Mark Reviewed
                    </button>
                  )}
                </div>
              </div>
            )
          )}

          {filteredContradictions.length ===
            0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-700">
              <Scale className="mx-auto h-10 w-10 text-slate-400" />

              <p className="mt-3 font-bold text-slate-600 dark:text-slate-300">
                No contradiction findings.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

export default ContradictionsPage;