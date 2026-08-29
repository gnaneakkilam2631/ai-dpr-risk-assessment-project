import React, {
  useEffect,
} from "react";

import {
  AlertTriangle,
  Download,
  FileText,
  ShieldCheck,
} from "lucide-react";

import {
  useProject,
} from "../context/useProject";


export const ReportsPage:
  React.FC =
  () => {

    const {
      activeProject,
      healthScore,
      riskAssessment,
      contradictions,
      mitigations,
      analyzeActiveProject,
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


    function exportReport() {

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
            type:
              "application/json",
          }
        );


      const url =
        URL.createObjectURL(
          blob
        );


      const link =
        document.createElement(
          "a"
        );


      link.href =
        url;


      link.download =
        `${activeProject.name || "DPR"}-risk-report.json`;


      link.click();


      URL.revokeObjectURL(
        url
      );
    }


    return (
      <div className="space-y-6">

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

          <div>

            <div className="flex items-center gap-2">

              <FileText className="h-7 w-7 text-cyan-400" />

              <h1 className="text-3xl font-extrabold text-white">
                DPR Assessment Report
              </h1>

            </div>

            <p className="mt-2 text-sm text-slate-400">
              Consolidated project risk and mitigation report.
            </p>

          </div>


          <button
            type="button"
            onClick={
              exportReport
            }
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-3 text-sm font-bold text-white"
          >

            <Download className="h-4 w-4" />

            Export Report

          </button>

        </div>


        <div className="rounded-2xl border border-slate-800 bg-[#0c1427] p-5">

          <p className="text-xs uppercase text-slate-500">
            Project
          </p>

          <h2 className="mt-1 text-xl font-extrabold text-white">
            {
              activeProject.name
            }
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {
              activeProject.description ||
              "No description available."
            }
          </p>

        </div>


        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

          <ReportCard
            label="Health"
            value={`${healthScore.overall}/100`}
          />


          <ReportCard
            label="Risk Score"
            value={`${riskAssessment.riskScore}/100`}
          />


          <ReportCard
            label="Risks"
            value={
              String(
                riskAssessment.riskCount
              )
            }
          />


          <ReportCard
            label="Contradictions"
            value={
              String(
                contradictions.length
              )
            }
          />

        </div>


        <div className="rounded-2xl border border-slate-800 bg-[#0c1427] p-5">

          <div className="flex items-center gap-2">

            <ShieldCheck className="h-5 w-5 text-emerald-400" />

            <h2 className="font-bold text-white">
              Priority Mitigations
            </h2>

          </div>


          <div className="mt-4 space-y-3">

            {mitigations.slice(
              0,
              5
            ).map(
              (
                item
              ) => (

                <div
                  key={
                    item.id
                  }
                  className="rounded-xl border border-slate-800 p-4"
                >

                  <div className="flex justify-between gap-3">

                    <div>

                      <p className="text-xs uppercase text-slate-500">
                        {
                          item.category
                        }
                      </p>

                      <h3 className="mt-1 font-bold text-white">
                        {
                          item.riskTitle
                        }
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {
                          item.action
                        }
                      </p>

                    </div>


                    <span className="text-xs font-bold text-slate-400">
                      {
                        item.status
                      }
                    </span>

                  </div>

                </div>

              )
            )}


            {mitigations.length ===
              0 && (

              <div className="rounded-xl border border-dashed border-slate-700 p-8 text-center">

                <AlertTriangle className="mx-auto h-8 w-8 text-slate-500" />

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


function ReportCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-[#0c1427] p-5">

      <p className="text-xs uppercase text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-3xl font-extrabold text-white">
        {value}
      </p>

    </div>
  );
}


export default ReportsPage;