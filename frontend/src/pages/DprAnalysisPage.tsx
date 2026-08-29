import React, {
  useEffect,
} from "react";

import {
  AlertTriangle,
  BotMessageSquare,
  CheckCircle2,
  IndianRupee,
  RefreshCw,
  Scale,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useProject,
} from "../context/useProject";


export const DprAnalysisPage:
  React.FC =
  () => {

    const navigate =
      useNavigate();


    const {
      activeProject,
      analyzeActiveProject,
      loadingAnalysis,
      analysisError,
      healthScore,
      riskAssessment,
    } =
      useProject();


    useEffect(
      () => {

        void analyzeActiveProject();

      },
      [
        analyzeActiveProject,
      ]
    );


    if (
      loadingAnalysis
    ) {

      return (
        <div className="flex min-h-[500px] items-center justify-center">

          <div className="text-center">

            <RefreshCw className="mx-auto h-10 w-10 animate-spin text-cyan-400" />

            <p className="mt-4 text-sm font-bold text-white">
              Reading uploaded DPR...
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Extracting cost, duration and project risks.
            </p>

          </div>

        </div>
      );
    }


    if (
      analysisError
    ) {

      return (
        <div className="rounded-2xl border border-red-500/20 bg-[#0b1220] p-8 text-center">

          <AlertTriangle className="mx-auto h-10 w-10 text-red-400" />

          <h1 className="mt-4 text-xl font-bold text-white">
            DPR Analysis Unavailable
          </h1>

          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-400">
            {
              analysisError
            }
          </p>


          <button
            type="button"
            onClick={() =>
              void analyzeActiveProject()
            }
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white"
          >

            <RefreshCw className="h-4 w-4" />

            Retry

          </button>

        </div>
      );
    }


    const dimensions =
      riskAssessment.dimensions;


    return (
      <div className="space-y-6">

        <div className="rounded-2xl border border-slate-800 bg-[#0c1427] p-6">

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">

            <div>

              <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Live DPR Analysis
              </p>

              <h1 className="mt-2 text-3xl font-extrabold text-white">
                {
                  activeProject.name
                }
              </h1>

              <p className="mt-2 text-sm text-slate-400">
                Project risk, cost and DPR quality assessment.
              </p>

            </div>


            <div className="flex gap-2">

              <button
                type="button"
                onClick={() =>
                  void analyzeActiveProject()
                }
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-xs font-bold text-white"
              >

                <RefreshCw className="h-4 w-4" />

                Re-analyze

              </button>


              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/dpr-copilot"
                  )
                }
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-xs font-bold text-white"
              >

                <BotMessageSquare className="h-4 w-4" />

                Ask Copilot

              </button>

            </div>

          </div>


          <div className="mt-6 grid grid-cols-2 gap-5 border-t border-slate-800 pt-6 md:grid-cols-4">

            <Metric
              label="Project Capital Cost"
              value={
                activeProject.totalCostCr > 0
                  ? `₹${activeProject.totalCostCr} Cr`
                  : "From DPR"
              }
            />


            <Metric
              label="Approved Budget"
              value={
                activeProject.approvedBudgetCr > 0
                  ? `₹${activeProject.approvedBudgetCr} Cr`
                  : "Not detected"
              }
            />


            <Metric
              label="Duration"
              value={
                activeProject.durationMonths > 0
                  ? `${activeProject.durationMonths} Months`
                  : "From DPR"
              }
            />


            <Metric
              label="Risks Detected"
              value={
                String(
                  riskAssessment.riskCount
                )
              }
            />

          </div>

        </div>


        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">

          <div className="flex items-start gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">

              <IndianRupee className="h-6 w-6 text-emerald-400" />

            </div>


            <div>

              <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Cost Intelligence
              </p>

              <h2 className="mt-1 text-xl font-bold text-white">
                Project Cost Analysis
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                The cost is obtained from the uploaded DPR
                and/or the trained project-cost model.
              </p>

            </div>

          </div>


          <div className="mt-5 grid gap-4 md:grid-cols-3">

            <div className="rounded-xl bg-slate-900/60 p-4">

              <p className="text-xs text-slate-500">
                Project Cost
              </p>

              <p className="mt-2 text-2xl font-extrabold text-white">

                {activeProject.totalCostCr > 0
                  ? `₹${activeProject.totalCostCr} Cr`
                  : "See latest DPR response"}

              </p>

            </div>


            <div className="rounded-xl bg-slate-900/60 p-4">

              <p className="text-xs text-slate-500">
                Risk Reserve
              </p>

              <p className="mt-2 text-2xl font-extrabold text-amber-400">
                ₹
                {
                  (
                    (
                      activeProject.totalCostCr || 0
                    ) *
                    (
                      riskAssessment.riskScore >= 75
                        ? 0.12
                        : riskAssessment.riskScore >= 60
                        ? 0.08
                        : 0.05
                    )
                  ).toFixed(
                    2
                  )
                }{" "}
                Cr
              </p>

            </div>


            <div className="rounded-xl bg-slate-900/60 p-4">

              <p className="text-xs text-slate-500">
                Recommended Approval
              </p>

              <p className="mt-2 text-2xl font-extrabold text-emerald-400">

                ₹
                {
                  (
                    (
                      activeProject.totalCostCr || 0
                    ) *
                    (
                      1 +
                      (
                        riskAssessment.riskScore >= 75
                          ? 0.12
                          : riskAssessment.riskScore >= 60
                          ? 0.08
                          : 0.05
                      )
                    )
                  ).toFixed(
                    2
                  )
                }{" "}
                Cr

              </p>

            </div>

          </div>

        </div>


        <div className="grid gap-6 lg:grid-cols-2">

          <div className="rounded-2xl border border-slate-800 bg-[#0c1427] p-6">

            <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              DPR Health
            </p>

            <p className="mt-3 text-6xl font-black text-white">
              {
                healthScore.overall
              }
            </p>

            <p className="mt-1 text-xs text-slate-500">
              OUT OF 100
            </p>

            <p className="mt-4 text-lg font-bold text-cyan-400">
              {
                healthScore.statusText
              }
            </p>

          </div>


          <div className="rounded-2xl border border-slate-800 bg-[#0c1427] p-6">

            <p className="text-xs font-bold uppercase tracking-wider text-red-400">
              Overall Risk
            </p>

            <p className="mt-3 text-4xl font-black uppercase text-red-400">
              {
                riskAssessment.overallRisk
              }
            </p>

            <p className="mt-3 text-sm text-slate-400">
              Risk Score:
              {" "}
              <strong className="text-white">
                {
                  riskAssessment.riskScore
                }
              </strong>
              /100
            </p>

          </div>

        </div>


        <div className="rounded-2xl border border-slate-800 bg-[#0c1427] p-6">

          <h2 className="text-xl font-bold text-white">
            Risk Dimension Breakdown
          </h2>


          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">

            <Dimension
              label="Cost"
              value={
                dimensions.costRisk
              }
            />

            <Dimension
              label="Schedule"
              value={
                dimensions.scheduleRisk
              }
            />

            <Dimension
              label="Technical"
              value={
                dimensions.technicalRisk
              }
            />

            <Dimension
              label="Financial"
              value={
                dimensions.financialRisk
              }
            />

            <Dimension
              label="Environmental"
              value={
                dimensions.environmentalRisk
              }
            />

            <Dimension
              label="Compliance"
              value={
                dimensions.complianceRisk
              }
            />

          </div>

        </div>


        <div className="rounded-2xl border border-slate-800 bg-[#0c1427] p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-xs font-bold uppercase tracking-wider text-red-400">
                Risk Analysis
              </p>

              <h2 className="mt-1 text-xl font-bold text-white">
                Risks Detected
              </h2>

            </div>


            <span className="rounded-lg bg-red-500/10 px-3 py-2 text-xs font-bold text-red-400">
              {
                riskAssessment.risks.length
              }{" "}
              RISKS
            </span>

          </div>


          {riskAssessment.risks.length ===
          0 ? (

            <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">

              <div className="flex items-center gap-2">

                <CheckCircle2 className="h-5 w-5 text-emerald-400" />

                <p className="text-sm text-emerald-300">
                  No risk findings detected.
                </p>

              </div>

            </div>

          ) : (

            <div className="mt-5 grid gap-4 md:grid-cols-2">

              {riskAssessment.risks.map(
                (
                  risk
                ) => (

                  <div
                    key={
                      risk.id
                    }
                    className="rounded-xl border border-slate-800 bg-slate-900/60 p-5"
                  >

                    <div className="flex justify-between">

                      <span className="text-xs font-bold uppercase text-red-400">
                        {
                          risk.severity
                        }
                      </span>

                      <span className="text-xs text-slate-500">
                        {
                          risk.points
                        } points
                      </span>

                    </div>


                    <h3 className="mt-3 font-bold text-white">
                      {
                        risk.title
                      }
                    </h3>


                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {
                        risk.description
                      }
                    </p>


                    <p className="mt-3 text-xs leading-5 text-cyan-400">
                      Recommendation:
                      {" "}
                      <span className="text-slate-400">
                        {
                          risk.recommendation
                        }
                      </span>
                    </p>

                  </div>

                )
              )}

            </div>

          )}

        </div>


        <button
          type="button"
          onClick={() =>
            navigate(
              "/contradictions"
            )
          }
          className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-bold text-white"
        >

          <Scale className="h-4 w-4 text-amber-400" />

          View Contradictions

        </button>

      </div>
    );
  };


function Metric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>

      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-base font-bold text-white">
        {value}
      </p>

    </div>
  );
}


function Dimension({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  const safe =
    Math.max(
      0,
      Math.min(
        100,
        value
      )
    );


  return (
    <div className="rounded-xl bg-slate-900/60 p-4">

      <div className="flex justify-between">

        <span className="text-sm text-slate-300">
          {label}
        </span>

        <span className="font-bold text-cyan-400">
          {safe}%
        </span>

      </div>


      <div className="mt-3 h-2 rounded-full bg-slate-800">

        <div
          className="h-full rounded-full bg-cyan-500"
          style={{
            width:
              `${safe}%`,
          }}
        />

      </div>

    </div>
  );
}


export default DprAnalysisPage;