import React, {
  useEffect,
  useState,
} from "react";

import {
  Activity,
  AlertTriangle,
  ShieldAlert,
  Target,
} from "lucide-react";

import {
  useProject,
} from "../context/useProject";

import type {
  RiskItem,
} from "../context/ProjectContextBase";


export const RiskIntelligencePage:
  React.FC =
  () => {

    const {
      riskAssessment,
      criticalFindings,
      analyzeActiveProject,
    } =
      useProject();


    const [
      selectedRisk,
      setSelectedRisk,
    ] =
      useState<RiskItem | null>(
        null
      );


    useEffect(
      () => {

        void analyzeActiveProject();

      },
      [
        analyzeActiveProject,
      ]
    );


    useEffect(
      () => {

        if (
          riskAssessment.risks.length >
          0
        ) {

          setSelectedRisk(
            riskAssessment.risks[0]
          );

        } else {

          setSelectedRisk(
            null
          );
        }

      },
      [
        riskAssessment.risks,
      ]
    );


    return (
      <div className="space-y-6">

        <div>

          <div className="flex items-center gap-2">

            <Activity className="h-7 w-7 text-cyan-400" />

            <h1 className="text-3xl font-extrabold text-white">
              Risk Intelligence
            </h1>

          </div>


          <p className="mt-2 text-sm text-slate-400">
            Probability-impact view of risks identified from the DPR.
          </p>

        </div>


        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

          <Card
            label="Critical"
            value={
              riskAssessment.risks.filter(
                (
                  risk
                ) =>
                  risk.severity ===
                  "critical"
              ).length
            }
          />


          <Card
            label="High"
            value={
              riskAssessment.risks.filter(
                (
                  risk
                ) =>
                  risk.severity ===
                  "high"
              ).length
            }
          />


          <Card
            label="Medium"
            value={
              riskAssessment.risks.filter(
                (
                  risk
                ) =>
                  risk.severity ===
                  "medium"
              ).length
            }
          />


          <Card
            label="Risk Score"
            value={
              riskAssessment.riskScore
            }
          />

        </div>


        <div className="grid gap-6 lg:grid-cols-2">

          <div className="rounded-2xl border border-slate-800 bg-[#0c1427] p-6">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="font-bold text-white">
                  Probability / Impact
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Each point represents an actual DPR finding.
                </p>

              </div>


              <Target className="h-5 w-5 text-cyan-400" />

            </div>


            <div className="relative mt-5 h-[400px] rounded-xl border border-slate-700 bg-slate-950">

              <div className="absolute inset-8 grid grid-cols-4 grid-rows-4">

                {Array.from(
                  {
                    length: 16,
                  }
                ).map(
                  (
                    _,
                    index
                  ) => (
                    <div
                      key={
                        index
                      }
                      className="border border-slate-800"
                    />
                  )
                )}

              </div>


              {riskAssessment.risks.map(
                (
                  risk
                ) => {

                  const x =
                    Math.max(
                      5,
                      Math.min(
                        95,
                        risk.probability
                      )
                    );


                  const y =
                    Math.max(
                      5,
                      Math.min(
                        95,
                        100 -
                          risk.impactScore
                      )
                    );


                  return (
                    <button
                      key={
                        risk.id
                      }
                      type="button"
                      onClick={() =>
                        setSelectedRisk(
                          risk
                        )
                      }
                      style={{
                        left:
                          `${x}%`,
                        top:
                          `${y}%`,
                      }}
                      className="absolute -translate-x-1/2 -translate-y-1/2"
                    >

                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white">
                        {
                          risk.id
                        }
                      </span>

                    </button>
                  );
                }
              )}


              <span className="absolute bottom-2 left-1/2 text-xs text-slate-500">
                Probability →
              </span>

              <span className="absolute left-2 top-1/2 -rotate-90 text-xs text-slate-500">
                Impact →
              </span>

            </div>

          </div>


          <div className="rounded-2xl border border-slate-800 bg-[#0c1427] p-6">

            <div className="flex items-center gap-2">

              <ShieldAlert className="h-5 w-5 text-red-400" />

              <h2 className="font-bold text-white">
                Selected Risk
              </h2>

            </div>


            {selectedRisk ? (

              <div className="mt-5">

                <span className="text-xs font-bold uppercase text-red-400">
                  {
                    selectedRisk.severity
                  }
                </span>


                <h3 className="mt-2 text-xl font-extrabold text-white">
                  {
                    selectedRisk.title
                  }
                </h3>


                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {
                    selectedRisk.description
                  }
                </p>


                <div className="mt-5 grid grid-cols-2 gap-3">

                  <div className="rounded-xl bg-slate-900 p-4">

                    <p className="text-xs text-slate-500">
                      Probability
                    </p>

                    <p className="mt-1 text-2xl font-bold text-white">
                      {
                        selectedRisk.probability
                      }%
                    </p>

                  </div>


                  <div className="rounded-xl bg-slate-900 p-4">

                    <p className="text-xs text-slate-500">
                      Impact
                    </p>

                    <p className="mt-1 text-2xl font-bold text-white">
                      {
                        selectedRisk.impactScore
                      }
                    </p>

                  </div>

                </div>


                <div className="mt-5 rounded-xl bg-cyan-500/10 p-4">

                  <p className="text-xs text-cyan-400">
                    Risk Score
                  </p>

                  <p className="mt-1 text-3xl font-extrabold text-cyan-300">
                    {
                      selectedRisk.riskScore
                    }
                  </p>

                </div>


                <div className="mt-5">

                  <p className="text-xs font-bold uppercase text-slate-500">
                    Recommended Action
                  </p>

                  <p className="mt-2 text-sm text-slate-300">
                    {
                      selectedRisk.recommendation
                    }
                  </p>

                </div>

              </div>

            ) : (

              <div className="py-12 text-center">

                <AlertTriangle className="mx-auto h-10 w-10 text-slate-500" />

                <p className="mt-3 text-sm text-slate-500">
                  No risk selected.
                </p>

              </div>

            )}

          </div>

        </div>


        {criticalFindings.length > 0 && (

          <div>

            <h2 className="mb-3 text-lg font-bold text-white">
              Priority Findings
            </h2>


            <div className="grid gap-3 md:grid-cols-2">

              {criticalFindings.map(
                (
                  risk
                ) => (

                  <button
                    key={
                      risk.id
                    }
                    type="button"
                    onClick={() =>
                      setSelectedRisk(
                        risk
                      )
                    }
                    className="rounded-xl border border-slate-800 bg-[#0c1427] p-4 text-left"
                  >

                    <span className="text-xs font-bold uppercase text-red-400">
                      {
                        risk.severity
                      }
                    </span>

                    <p className="mt-2 font-bold text-white">
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


function Card({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-[#0c1427] p-4">

      <p className="text-xs uppercase text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-3xl font-extrabold text-white">
        {value}
      </p>

    </div>
  );
}


export default RiskIntelligencePage;