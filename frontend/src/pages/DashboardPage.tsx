import React, {
  useEffect,
} from "react";

import {
  Activity,
  AlertTriangle,
  BarChart3,
  FileText,
  IndianRupee,
  ShieldCheck,
} from "lucide-react";

import {
  useProject,
} from "../context/useProject";


export const DashboardPage:
  React.FC =
  () => {

    const {
      activeProject,
      refreshProjects,
      analyzeActiveProject,
      healthScore,
      riskAssessment,
      contradictions,
      criticalFindings,
      loadingAnalysis,
      analysisError,
    } =
      useProject();


    useEffect(
      () => {

        void refreshProjects();

      },
      [
        refreshProjects,
      ]
    );


    useEffect(
      () => {

        if (
          activeProject.id >
          0
        ) {

          void analyzeActiveProject();
        }

      },
      [
        activeProject.id,
        analyzeActiveProject,
      ]
    );


    return (
      <div className="space-y-6">

        <div>

          <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-400">
            Intelligence Overview
          </p>

          <h1 className="mt-1 text-3xl font-extrabold text-white">
            Dashboard
          </h1>

          <p className="mt-2 text-sm text-slate-400">

            Welcome back. Here is your project risk intelligence overview.

          </p>


          <p className="mt-2 text-xs text-slate-500">

            Active Project:

            <span className="ml-1 font-bold text-cyan-400">
              {
                activeProject.name
              }
            </span>

          </p>

        </div>


        <div className="rounded-2xl border border-slate-800 bg-[#0b1220] p-6">

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

            <div>

              <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Active Workspace
              </p>

              <h2 className="mt-1 text-xl font-extrabold text-white">
                {
                  activeProject.name
                }
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                DPR risk and quality intelligence
              </p>

            </div>


            {loadingAnalysis && (
              <span className="rounded-lg bg-cyan-500/10 px-3 py-2 text-xs font-bold text-cyan-400">
                ANALYZING DPR...
              </span>
            )}

          </div>

        </div>


        {analysisError && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4">

            <div className="flex gap-2">

              <AlertTriangle className="h-5 w-5 text-red-400" />

              <p className="text-sm text-red-300">
                {analysisError}
              </p>

            </div>

          </div>
        )}


        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

          <SummaryCard
            label="DPR Health"
            value={`${healthScore.overall}/100`}
            icon={
              <Activity className="h-5 w-5" />
            }
          />


          <SummaryCard
            label="Risk Level"
            value={
              riskAssessment.overallRisk.toUpperCase()
            }
            icon={
              <AlertTriangle className="h-5 w-5" />
            }
          />


          <SummaryCard
            label="Risks Detected"
            value={
              String(
                riskAssessment.riskCount
              )
            }
            icon={
              <ShieldCheck className="h-5 w-5" />
            }
          />


          <SummaryCard
            label="Contradictions"
            value={
              String(
                contradictions.length
              )
            }
            icon={
              <FileText className="h-5 w-5" />
            }
          />

        </div>


        <div className="grid gap-6 lg:grid-cols-2">

          <div className="rounded-2xl border border-slate-800 bg-[#0b1220] p-6">

            <div className="flex items-center gap-2">

              <BarChart3 className="h-5 w-5 text-cyan-400" />

              <h2 className="text-lg font-bold text-white">
                Multi-Dimensional Risk Assessment
              </h2>

            </div>


            <div className="mt-5 space-y-4">

              <RiskBar
                label="Cost Risk"
                value={
                  riskAssessment.dimensions.costRisk
                }
              />

              <RiskBar
                label="Schedule Risk"
                value={
                  riskAssessment.dimensions.scheduleRisk
                }
              />

              <RiskBar
                label="Technical Risk"
                value={
                  riskAssessment.dimensions.technicalRisk
                }
              />

              <RiskBar
                label="Financial Risk"
                value={
                  riskAssessment.dimensions.financialRisk
                }
              />

              <RiskBar
                label="Environmental Risk"
                value={
                  riskAssessment.dimensions.environmentalRisk
                }
              />

              <RiskBar
                label="Compliance Risk"
                value={
                  riskAssessment.dimensions.complianceRisk
                }
              />

            </div>

          </div>


          <div className="rounded-2xl border border-slate-800 bg-[#0b1220] p-6">

            <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Project Cost
            </p>

            <h2 className="mt-1 text-lg font-bold text-white">
              DPR Cost Intelligence
            </h2>


            <div className="mt-5 grid gap-4 md:grid-cols-2">

              <div className="rounded-xl bg-slate-900/70 p-4">

                <div className="flex items-center gap-2">

                  <IndianRupee className="h-4 w-4 text-emerald-400" />

                  <span className="text-xs text-slate-500">
                    Project Cost
                  </span>

                </div>


                <p className="mt-2 text-2xl font-extrabold text-white">

                  {activeProject.totalCostCr > 0
                    ? `₹${activeProject.totalCostCr} Cr`
                    : "See DPR Analysis"}

                </p>

              </div>


              <div className="rounded-xl bg-slate-900/70 p-4">

                <span className="text-xs text-slate-500">
                  Duration
                </span>

                <p className="mt-2 text-2xl font-extrabold text-white">

                  {activeProject.durationMonths > 0
                    ? `${activeProject.durationMonths} Months`
                    : "From DPR"}

                </p>

              </div>

            </div>


            <div className="mt-5 rounded-xl border border-slate-800 bg-slate-900/50 p-4">

              <p className="text-xs text-slate-500">
                Critical Findings
              </p>

              <p className="mt-2 text-3xl font-extrabold text-red-400">
                {
                  criticalFindings.length
                }
              </p>

            </div>

          </div>

        </div>

      </div>
    );
  };


function SummaryCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0b1220] p-5">

      <div className="flex items-center justify-between">

        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {label}
        </p>

        <div className="text-cyan-400">
          {icon}
        </div>

      </div>


      <p className="mt-3 text-3xl font-extrabold text-white">
        {value}
      </p>

    </div>
  );
}


function RiskBar({
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
    <div>

      <div className="flex justify-between">

        <span className="text-sm text-slate-300">
          {label}
        </span>

        <span className="text-sm font-bold text-cyan-400">
          {safe}%
        </span>

      </div>


      <div className="mt-2 h-2 rounded-full bg-slate-800">

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


export default DashboardPage;