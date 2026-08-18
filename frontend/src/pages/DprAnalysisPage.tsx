import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileSearch,
  ArrowRight,
  Scale,
  SlidersHorizontal,
  BotMessageSquare,
  AlertTriangle,
  RefreshCw,
  IndianRupee,
} from "lucide-react";

import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from "recharts";

import { HealthScoreGauge } from "../components/common/HealthScoreGauge";
import { RiskBadge } from "../components/common/RiskBadge";


// ============================================================
// API
// ============================================================

const API_URL = "http://127.0.0.1:8000";


// ============================================================
// TYPES
// ============================================================

type BackendRisk = {
  category?: string;
  severity?: string;
  title?: string;
  description?: string;
  recommendation?: string;

  // Older/newer backend versions may contain these
  keywords?: string[];
  points?: number;
};

type BackendRiskAnalysis = {
  document_id?: number;
  project_id?: number;
  filename?: string;

  score?: number;
  overall_level?: string;
  risk_count?: number;

  risks?: BackendRisk[];
};


type Project = {
  id: number;
  name: string;
  description?: string;

  total_cost_cr?: number | null;
  approved_budget_cr?: number | null;
  duration_months?: number | null;

  location?: string | null;
  state?: string | null;
  sector?: string | null;
  implementing_agency?: string | null;
  beneficiaries_count?: number | null;
};


type Risk = {
  category: string;
  severity: string;
  title: string;
  description: string;
  recommendation: string;
  keywords: string[];
  points: number;
};


type AnalysisData = {
  project: Project | null;

  documentId: number;

  filename: string;

  capitalCost: number | null;

  approvedBudget: number | null;

  durationMonths: number | null;

  recommendedApproval: number | null;

  riskReserve: number;

  riskScore: number;

  overallRisk: string;

  dimensions: {
    costRisk: number;
    scheduleRisk: number;
    technicalRisk: number;
    financialRisk: number;
    environmentalRisk: number;
    complianceRisk: number;
  };

  risks: Risk[];
};


// ============================================================
// PAGE
// ============================================================

export const DprAnalysisPage: React.FC = () => {

  const navigate = useNavigate();

  const [analysis, setAnalysis] =
    useState<AnalysisData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    loadAnalysis();
  }, []);


  // ==========================================================
  // LOAD ANALYSIS
  // ==========================================================

  async function loadAnalysis() {

    setLoading(true);
    setError("");

    try {

      // ------------------------------------------------------
      // ACTIVE DOCUMENT
      // ------------------------------------------------------

      const documentIdString =
        localStorage.getItem("active_document_id");

      if (!documentIdString) {

        setError(
          "No DPR has been uploaded yet. Please upload a DPR first."
        );

        setLoading(false);

        return;
      }


      const documentId =
        Number(documentIdString);


      if (!Number.isFinite(documentId)) {

        throw new Error(
          "Invalid document ID."
        );
      }


      // ------------------------------------------------------
      // ACTIVE PROJECT
      // ------------------------------------------------------

      const projectIdString =
        localStorage.getItem("active_project_id");

      const projectId =
        projectIdString
          ? Number(projectIdString)
          : null;


      // ------------------------------------------------------
      // DOCUMENT NAME
      // ------------------------------------------------------

      const storedFilename =
        localStorage.getItem(
          "active_document_name"
        );


      // ======================================================
      // 1. GET DOCUMENT TEXT
      // ======================================================

      const textResponse =
        await fetch(
          `${API_URL}/documents/${documentId}/text`
        );


      const textData =
        await textResponse.json();


      if (!textResponse.ok) {

        throw new Error(
          textData.detail ||
            "Could not read uploaded DPR."
        );
      }


      const documentText =
        textData.text || "";


      // ======================================================
      // 2. GET BACKEND RISK ANALYSIS
      // ======================================================

      const riskResponse =
        await fetch(
          `${API_URL}/documents/${documentId}/risks`
        );


      const riskData =
        (await riskResponse.json()) as BackendRiskAnalysis;


      if (!riskResponse.ok) {

        throw new Error(
          (riskData as any).detail ||
            "Could not analyze DPR risks."
        );
      }


      // ======================================================
      // 3. GET PROJECT
      // ======================================================

      let project: Project | null = null;


      const userId =
        localStorage.getItem("user_id");


      /*
       * IMPORTANT:
       *
       * Your backend is currently using:
       *
       * GET /projects/?user_id=6
       *
       * Previously this page was sending:
       *
       * GET /projects/?token=...
       *
       * That is why project information was coming back
       * as null and the UI displayed "Not found".
       */

      if (userId) {

        const projectResponse =
          await fetch(
            `${API_URL}/projects/?user_id=${encodeURIComponent(
              userId
            )}`
          );


        if (projectResponse.ok) {

          const projects =
            await projectResponse.json();


          if (Array.isArray(projects)) {

            if (projectId !== null) {

              project =
                projects.find(
                  (item: Project) =>
                    Number(item.id) ===
                    Number(projectId)
                ) || null;

            }

          }

        }

      }


      // ======================================================
      // FALLBACK: TRY TOKEN
      // ======================================================

      /*
       * This fallback is useful if user_id is not stored
       * but your projects endpoint still supports token.
       */

      if (!project) {

        const token =
          localStorage.getItem("access_token");


        if (token) {

          try {

            const projectResponse =
              await fetch(
                `${API_URL}/projects/?token=${encodeURIComponent(
                  token
                )}`
              );


            if (projectResponse.ok) {

              const projects =
                await projectResponse.json();


              if (Array.isArray(projects)) {

                if (projectId !== null) {

                  project =
                    projects.find(
                      (item: Project) =>
                        Number(item.id) ===
                        Number(projectId)
                    ) || null;

                }

              }

            }

          } catch (projectError) {

            console.warn(
              "Token project lookup failed:",
              projectError
            );

          }

        }

      }


      // ======================================================
      // 4. EXTRACT VALUES FROM DPR
      // ======================================================

      /*
       * Project database values are preferred.
       *
       * If the project has:
       *
       * total_cost_cr
       * approved_budget_cr
       * duration_months
       *
       * we use those first.
       *
       * Otherwise we extract the values from the actual PDF.
       */

      const extractedCapitalCost =
        extractCapitalCost(documentText);


      const extractedApprovedBudget =
        extractApprovedBudget(documentText);


      const extractedDuration =
        extractDuration(documentText);


      const capitalCost =
        validNumber(
          project?.total_cost_cr
        )
          ? Number(project!.total_cost_cr)
          : extractedCapitalCost;


      const approvedBudget =
        validNumber(
          project?.approved_budget_cr
        )
          ? Number(project!.approved_budget_cr)
          : extractedApprovedBudget;


      const durationMonths =
        validNumber(
          project?.duration_months
        )
          ? Number(project!.duration_months)
          : extractedDuration;


      // ======================================================
      // 5. NORMALIZE BACKEND RISKS
      // ======================================================

      const risks =
        normalizeRisks(
          riskData.risks || []
        );


      // ======================================================
      // 6. RISK DIMENSIONS
      // ======================================================

      const dimensions =
        calculateRiskDimensions(
          documentText,
          risks,
          Number(riskData.score || 0)
        );


      // ======================================================
      // 7. USE BACKEND SCORE
      // ======================================================

      /*
       * VERY IMPORTANT:
       *
       * Do NOT recalculate the main score by averaging the
       * radar dimensions.
       *
       * Your FastAPI endpoint already returns:
       *
       * score
       *
       * So we use that value.
       *
       * This prevents:
       *
       * 51/100 -> 100/100
       */

      let riskScore =
        Number(riskData.score);


      if (
        !Number.isFinite(riskScore)
      ) {

        riskScore =
          calculateFallbackRiskScore(
            dimensions
          );

      }


      riskScore =
        Math.max(
          0,
          Math.min(
            100,
            Math.round(riskScore)
          )
        );


      // ======================================================
      // 8. OVERALL RISK
      // ======================================================

      const overallRisk =
        riskData.overall_level ||
        getRiskLevel(riskScore);


      // ======================================================
      // 9. RISK RESERVE
      // ======================================================

      const costRisk =
        dimensions.costRisk;


      let reservePercent =
        0.05;


      if (costRisk >= 80) {

        reservePercent =
          0.12;

      } else if (costRisk >= 70) {

        reservePercent =
          0.10;

      } else if (costRisk >= 60) {

        reservePercent =
          0.08;
      }


      const baseCost =
        capitalCost ??
        approvedBudget ??
        0;


      const riskReserve =
        baseCost > 0
          ? roundCr(
              baseCost *
              reservePercent
            )
          : 0;


      const recommendedApproval =
        baseCost > 0
          ? roundCr(
              baseCost +
              riskReserve
            )
          : null;


      // ======================================================
      // 10. FINAL ANALYSIS
      // ======================================================

      const filename =
        storedFilename ||
        riskData.filename ||
        "Uploaded DPR";


      const finalAnalysis: AnalysisData = {

        project,

        documentId,

        filename,

        capitalCost,

        approvedBudget,

        durationMonths,

        recommendedApproval,

        riskReserve,

        riskScore,

        overallRisk,

        dimensions,

        risks,

      };


      setAnalysis(
        finalAnalysis
      );


      // ------------------------------------------------------
      // SAVE ANALYSIS
      // ------------------------------------------------------

      localStorage.setItem(
        "active_dpr_analysis",
        JSON.stringify(
          finalAnalysis
        )
      );


      // Also keep compatibility with upload page
      localStorage.setItem(
        "active_risk_analysis",
        JSON.stringify(
          riskData
        )
      );


    } catch (err) {

      console.error(
        "DPR ANALYSIS ERROR:",
        err
      );


      setError(
        err instanceof Error
          ? err.message
          : "DPR analysis failed."
      );


    } finally {

      setLoading(false);

    }

  }


  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {

    return (

      <div className="flex min-h-[500px] items-center justify-center">

        <div className="text-center">

          <RefreshCw
            className="mx-auto h-8 w-8 animate-spin text-cyan-400"
          />

          <p className="mt-4 text-sm font-semibold text-slate-300">
            Analyzing uploaded DPR...
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Reading cost, schedule, technical,
            financial, environmental and
            compliance data.
          </p>

        </div>

      </div>

    );

  }


  // ==========================================================
  // ERROR
  // ==========================================================

  if (error || !analysis) {

    return (

      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">

        <AlertTriangle
          className="mx-auto h-10 w-10 text-red-400"
        />

        <h2 className="mt-4 text-xl font-bold text-white">
          DPR Analysis Unavailable
        </h2>

        <p className="mx-auto mt-2 max-w-xl text-sm text-slate-400">
          {error ||
            "Upload a DPR document before opening the risk analysis page."}
        </p>

        <button
          onClick={() =>
            navigate("/upload-dpr")
          }
          className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"
        >
          Upload DPR
        </button>

      </div>

    );

  }


  // ==========================================================
  // RADAR
  // ==========================================================

  const radarData = [

    {
      dimension: "Cost Risk",
      value: analysis.dimensions.costRisk,
    },

    {
      dimension: "Schedule Risk",
      value: analysis.dimensions.scheduleRisk,
    },

    {
      dimension: "Technical Risk",
      value: analysis.dimensions.technicalRisk,
    },

    {
      dimension: "Financial Risk",
      value: analysis.dimensions.financialRisk,
    },

    {
      dimension: "Environmental",
      value: analysis.dimensions.environmentalRisk,
    },

    {
      dimension: "Compliance",
      value: analysis.dimensions.complianceRisk,
    },

  ];


  // ==========================================================
  // CRITICAL FINDINGS
  // ==========================================================

  const criticalFindings =
    analysis.risks
      .filter(
        (risk) =>
          [
            "critical",
            "high",
          ].includes(
            risk.severity.toLowerCase()
          )
      )
      .slice(0, 6);


  // ==========================================================
  // UI
  // ==========================================================

  return (

    <div className="space-y-6">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="rounded-2xl border border-slate-800 bg-[#0c1427] p-6">

        <div className="flex flex-col justify-between gap-5 lg:flex-row">

          <div>

            <div className="flex flex-wrap items-center gap-2">

              <span className="rounded-md border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 text-xs font-mono font-bold text-cyan-300">
                LIVE DPR ANALYSIS
              </span>

              <RiskBadge
                severity={
                  analysis.overallRisk.toLowerCase()
                }
                size="sm"
                showPulse
              />

            </div>

            <h1 className="mt-3 text-2xl font-extrabold text-white md:text-3xl">

              {analysis.project?.name ||
                "Uploaded DPR Risk Analysis"}

            </h1>

            <p className="mt-2 text-sm text-slate-400">
              {analysis.filename}
            </p>

            {analysis.project?.description && (

              <p className="mt-1 text-xs text-slate-500">
                {analysis.project.description}
              </p>

            )}

          </div>


          <div className="flex items-center gap-2">

            <button
              onClick={loadAnalysis}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800"
            >

              <RefreshCw className="h-3.5 w-3.5" />

              Re-analyze

            </button>


            <button
              onClick={() =>
                navigate("/copilot")
              }
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
            >

              <BotMessageSquare className="h-3.5 w-3.5" />

              Ask Copilot

            </button>

          </div>

        </div>


        {/* ==================================================
            PROJECT METRICS
        ================================================== */}

        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-800 pt-5 md:grid-cols-4">

          <CostMetric
            label="Project Capital Cost"
            value={
              analysis.capitalCost !== null
                ? `₹${formatNumber(
                    analysis.capitalCost
                  )} Cr`
                : "Not found"
            }
          />


          <CostMetric
            label="Approved Budget"
            value={
              analysis.approvedBudget !== null
                ? `₹${formatNumber(
                    analysis.approvedBudget
                  )} Cr`
                : "Not found"
            }
          />


          <CostMetric
            label="Duration"
            value={
              analysis.durationMonths !== null
                ? `${analysis.durationMonths} Months`
                : "Not found"
            }
          />


          <CostMetric
            label="Risk Score"
            value={`${analysis.riskScore}/100`}
          />

        </div>

      </div>


      {/* =====================================================
          APPROVAL RECOMMENDATION
      ===================================================== */}

      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">

        <div className="flex items-start gap-4">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">

            <IndianRupee className="h-5 w-5 text-emerald-400" />

          </div>


          <div className="flex-1">

            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-400">
              AI Approval Recommendation
            </p>

            <h2 className="mt-1 text-xl font-bold text-white">
              Recommended Approval Cost
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              This amount is calculated from the DPR's
              detected project cost and the risk reserve
              required by the identified risk exposure.
            </p>


            <div className="mt-5 grid gap-4 md:grid-cols-3">

              <ApprovalValue
                label="DPR Capital Cost"
                value={
                  analysis.capitalCost !== null
                    ? `₹${formatNumber(
                        analysis.capitalCost
                      )} Cr`
                    : "Not detected"
                }
              />


              <ApprovalValue
                label="Risk Reserve"
                value={
                  `₹${formatNumber(
                    analysis.riskReserve
                  )} Cr`
                }
              />


              <ApprovalValue
                label="Recommended Approval"
                value={
                  analysis.recommendedApproval !== null
                    ? `₹${formatNumber(
                        analysis.recommendedApproval
                      )} Cr`
                    : "Cannot calculate"
                }
                highlight
              />

            </div>


            {analysis.approvedBudget !== null &&
              analysis.recommendedApproval !== null && (

                <div className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">

                  <p className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Budget Decision
                  </p>


                  {analysis.approvedBudget >=
                  analysis.recommendedApproval ? (

                    <p className="mt-1 text-sm text-slate-300">
                      Current approved budget is sufficient
                      based on the calculated risk reserve.
                    </p>

                  ) : (

                    <p className="mt-1 text-sm text-slate-300">

                      Current approved budget is below the
                      calculated safe approval amount by{" "}

                      <strong className="text-amber-400">

                        ₹
                        {formatNumber(
                          roundCr(
                            analysis.recommendedApproval -
                              analysis.approvedBudget
                          )
                        )}{" "}
                        Cr

                      </strong>

                      . Budget reconciliation is recommended
                      before approval.

                    </p>

                  )}

                </div>

              )}

          </div>

        </div>

      </div>


      {/* =====================================================
          HEALTH + RADAR
      ===================================================== */}

      <div className="grid gap-6 lg:grid-cols-2">


        {/* HEALTH */}

        <div className="rounded-2xl border border-slate-800 bg-[#0c1427] p-6">

          <div>

            <h2 className="text-base font-bold text-white">
              DPR Health & Risk Index
            </h2>

            <p className="text-xs text-slate-500">
              Calculated from the uploaded DPR
            </p>

          </div>


          <div className="flex justify-center py-8">

            <HealthScoreGauge
              score={analysis.riskScore}
              maxScore={100}
              size={190}
              statusText={
                getHealthText(
                  analysis.riskScore
                )
              }
            />

          </div>


          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 text-center">

            <p className="text-xs text-slate-500">
              Overall Risk
            </p>

            <p className="mt-1 text-2xl font-extrabold text-red-400">
              {analysis.overallRisk}
            </p>

          </div>

        </div>


        {/* RADAR */}

        <div className="rounded-2xl border border-slate-800 bg-[#0c1427] p-6">

          <h2 className="text-base font-bold text-white">
            Multi-Dimensional Risk Exposure
          </h2>

          <p className="text-xs text-slate-500">
            Calculated from actual uploaded DPR content
          </p>


          <div className="mt-4 h-72">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <RadarChart
                cx="50%"
                cy="50%"
                outerRadius="72%"
                data={radarData}
              >

                <PolarGrid
                  stroke="#334155"
                  strokeDasharray="3 3"
                />

                <PolarAngleAxis
                  dataKey="dimension"
                  tick={{
                    fill: "#94a3b8",
                    fontSize: 10,
                  }}
                />

                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={{
                    fill: "#64748b",
                    fontSize: 9,
                  }}
                />

                <Radar
                  name="Risk Exposure"
                  dataKey="value"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.3}
                />

                <Tooltip
                  formatter={(value: any) => [
                    `${value}%`,
                    "Risk",
                  ]}
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    color: "#f8fafc",
                  }}
                />

              </RadarChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>


      {/* =====================================================
          RISK DIMENSIONS
      ===================================================== */}

      <div className="rounded-2xl border border-slate-800 bg-[#0c1427] p-6">

        <div className="mb-5">

          <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">
            Risk Intelligence
          </p>

          <h2 className="mt-1 text-xl font-bold text-white">
            Risk Dimension Breakdown
          </h2>

        </div>


        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

          <RiskDimension
            name="Cost Risk"
            value={analysis.dimensions.costRisk}
          />

          <RiskDimension
            name="Schedule Risk"
            value={analysis.dimensions.scheduleRisk}
          />

          <RiskDimension
            name="Technical Risk"
            value={analysis.dimensions.technicalRisk}
          />

          <RiskDimension
            name="Financial Risk"
            value={analysis.dimensions.financialRisk}
          />

          <RiskDimension
            name="Environmental Risk"
            value={analysis.dimensions.environmentalRisk}
          />

          <RiskDimension
            name="Compliance Risk"
            value={analysis.dimensions.complianceRisk}
          />

        </div>

      </div>


      {/* =====================================================
          FINDINGS
      ===================================================== */}

      <div className="rounded-2xl border border-slate-800 bg-[#0c1427] p-6">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-xs font-bold uppercase tracking-wider text-red-400">
              AI Findings
            </p>

            <h2 className="mt-1 text-xl font-bold text-white">
              Risks Detected in Uploaded DPR
            </h2>

          </div>


          <span className="rounded-lg bg-red-500/10 px-3 py-2 text-xs font-bold text-red-400">

            {analysis.risks.length} FINDINGS

          </span>

        </div>


        {criticalFindings.length === 0 ? (

          <div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">

            <p className="text-sm font-semibold text-emerald-400">
              No critical/high risks detected.
            </p>

          </div>

        ) : (

          <div className="mt-6 grid gap-4 md:grid-cols-2">

            {criticalFindings.map(
              (risk, index) => (

                <div
                  key={`${risk.category}-${index}`}
                  className="rounded-xl border border-slate-800 bg-slate-900/50 p-5"
                >

                  <div className="flex items-center justify-between">

                    <span className="text-xs font-bold uppercase tracking-wider text-red-400">
                      {risk.severity}
                    </span>

                    <span className="text-xs font-mono text-slate-500">
                      +{risk.points} points
                    </span>

                  </div>


                  <h3 className="mt-3 font-bold text-white">
                    {risk.title ||
                      risk.category}
                  </h3>


                  {risk.description && (

                    <p className="mt-2 text-sm leading-5 text-slate-400">
                      {risk.description}
                    </p>

                  )}


                  {risk.recommendation && (

                    <p className="mt-3 text-xs leading-5 text-cyan-400">
                      Recommendation:{" "}
                      {risk.recommendation}
                    </p>

                  )}


                  {risk.keywords?.length > 0 && (

                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      Evidence:{" "}
                      {risk.keywords.join(", ")}
                    </p>

                  )}

                </div>

              )
            )}

          </div>

        )}

      </div>


      {/* =====================================================
          ACTIONS
      ===================================================== */}

      <div className="flex flex-wrap gap-3">

        <button
          onClick={() =>
            navigate("/contradictions")
          }
          className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-xs font-semibold text-slate-200 hover:bg-slate-800"
        >

          <Scale className="h-4 w-4 text-amber-400" />

          Contradictions

        </button>


        <button
          onClick={() =>
            navigate("/simulator")
          }
          className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-xs font-semibold text-slate-200 hover:bg-slate-800"
        >

          <SlidersHorizontal className="h-4 w-4 text-blue-400" />

          Simulate Scenarios

        </button>


        <button
          onClick={() =>
            navigate("/evidence")
          }
          className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-xs font-semibold text-slate-200 hover:bg-slate-800"
        >

          <FileSearch className="h-4 w-4 text-cyan-400" />

          Open Evidence

          <ArrowRight className="h-3.5 w-3.5" />

        </button>

      </div>

    </div>

  );
};


// ============================================================
// COST METRIC
// ============================================================

function CostMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {

  return (

    <div>

      <p className="text-[11px] font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-base font-bold text-white">
        {value}
      </p>

    </div>

  );
}


// ============================================================
// APPROVAL VALUE
// ============================================================

function ApprovalValue({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {

  return (

    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">

      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p
        className={`mt-2 text-xl font-extrabold ${
          highlight
            ? "text-emerald-400"
            : "text-white"
        }`}
      >
        {value}
      </p>

    </div>

  );

}


// ============================================================
// RISK DIMENSION
// ============================================================

function RiskDimension({
  name,
  value,
}: {
  name: string;
  value: number;
}) {

  let bar =
    "bg-emerald-400";

  let text =
    "text-emerald-400";


  if (value >= 80) {

    bar = "bg-red-500";
    text = "text-red-400";

  } else if (value >= 60) {

    bar = "bg-orange-400";
    text = "text-orange-400";

  } else if (value >= 40) {

    bar = "bg-amber-400";
    text = "text-amber-400";

  }


  const safeValue =
    Math.max(
      0,
      Math.min(
        100,
        Number(value) || 0
      )
    );


  return (

    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">

      <div className="flex items-center justify-between">

        <span className="text-sm font-semibold text-slate-300">
          {name}
        </span>

        <span
          className={`font-mono text-lg font-extrabold ${text}`}
        >
          {safeValue}%
        </span>

      </div>


      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">

        <div
          className={`h-full rounded-full ${bar}`}
          style={{
            width: `${safeValue}%`,
          }}
        />

      </div>

    </div>

  );

}


// ============================================================
// HELPERS
// ============================================================

function validNumber(
  value: unknown
): boolean {

  return (
    value !== null &&
    value !== undefined &&
    value !== "" &&
    Number.isFinite(
      Number(value)
    ) &&
    Number(value) > 0
  );

}


function formatNumber(
  value: number
): string {

  return Number(value).toLocaleString(
    "en-IN",
    {
      maximumFractionDigits: 2,
    }
  );

}


function roundCr(
  value: number
): number {

  return Math.round(
    value * 100
  ) / 100;

}


function getRiskLevel(
  score: number
): string {

  if (score >= 80)
    return "CRITICAL";

  if (score >= 65)
    return "HIGH";

  if (score >= 45)
    return "MEDIUM";

  return "LOW";

}


function getHealthText(
  score: number
): string {

  if (score >= 80)
    return "CRITICAL RISK EXPOSURE";

  if (score >= 65)
    return "HIGH RISK EXPOSURE";

  if (score >= 45)
    return "MODERATE RISK EXPOSURE";

  return "LOW RISK EXPOSURE";

}


// ============================================================
// TEXT NORMALIZATION
// ============================================================

function normalizeText(
  text: string
): string {

  return text
    .replace(/\u00a0/g, " ")
    .replace(/,/g, "")
    .replace(/\s+/g, " ")
    .trim();

}


// ============================================================
// AMOUNT EXTRACTION
// ============================================================

function extractAmountInCr(
  text: string,
  patterns: RegExp[]
): number | null {

  const normalized =
    normalizeText(text);


  for (
    const pattern of patterns
  ) {

    const match =
      normalized.match(pattern);


    if (!match)
      continue;


    const value =
      Number(match[1]);


    if (
      Number.isFinite(value) &&
      value > 0
    ) {

      const unit =
        (match[2] || "")
          .toLowerCase();


      if (
        unit.includes("lakh")
      ) {

        return roundCr(
          value / 100
        );

      }


      return value;

    }

  }


  return null;

}


// ============================================================
// CAPITAL COST
// ============================================================

function extractCapitalCost(
  text: string
): number | null {

  return extractAmountInCr(
    text,
    [

      /(?:total\s+)?(?:project\s+)?capital\s+(?:cost|outlay)[^₹\d]{0,100}(?:₹|rs\.?|inr)?\s*([\d.]+)\s*(cr|crore|crores|lakh|lakhs)\b/i,

      /total\s+project\s+cost[^₹\d]{0,100}(?:₹|rs\.?|inr)?\s*([\d.]+)\s*(cr|crore|crores|lakh|lakhs)\b/i,

      /total\s+outlay[^₹\d]{0,100}(?:₹|rs\.?|inr)?\s*([\d.]+)\s*(cr|crore|crores|lakh|lakhs)\b/i,

      /(?:₹|rs\.?|inr)\s*([\d.]+)\s*(cr|crore|crores|lakh|lakhs)\b[^.]{0,80}(?:project\s+cost|capital\s+outlay)/i,

    ]
  );

}


// ============================================================
// APPROVED BUDGET
// ============================================================

function extractApprovedBudget(
  text: string
): number | null {

  return extractAmountInCr(
    text,
    [

      /approved\s+budget[^₹\d]{0,100}(?:₹|rs\.?|inr)?\s*([\d.]+)\s*(cr|crore|crores|lakh|lakhs)\b/i,

      /approved\s+cost[^₹\d]{0,100}(?:₹|rs\.?|inr)?\s*([\d.]+)\s*(cr|crore|crores|lakh|lakhs)\b/i,

      /sanctioned\s+(?:budget|cost)[^₹\d]{0,100}(?:₹|rs\.?|inr)?\s*([\d.]+)\s*(cr|crore|crores|lakh|lakhs)\b/i,

      /funding\s+(?:proposal|requirement)[^₹\d]{0,100}(?:₹|rs\.?|inr)?\s*([\d.]+)\s*(cr|crore|crores|lakh|lakhs)\b/i,

    ]
  );

}


// ============================================================
// DURATION
// ============================================================

function extractDuration(
  text: string
): number | null {

  const normalized =
    normalizeText(text);


  const monthPatterns = [

    /(?:project\s+)?duration[^.\d]{0,100}(\d+(?:\.\d+)?)\s*months?/i,

    /implementation\s+(?:period|duration)[^.\d]{0,100}(\d+(?:\.\d+)?)\s*months?/i,

    /completion\s+(?:period|target)[^.\d]{0,100}(\d+(?:\.\d+)?)\s*months?/i,

    /(\d+(?:\.\d+)?)\s*months?\s+(?:implementation|project\s+duration)/i,

  ];


  for (
    const pattern of monthPatterns
  ) {

    const match =
      normalized.match(pattern);


    if (match?.[1]) {

      const value =
        Number(match[1]);


      if (
        Number.isFinite(value) &&
        value > 0
      ) {

        return value;

      }

    }

  }


  const yearPatterns = [

    /(?:project\s+)?duration[^.\d]{0,100}(\d+(?:\.\d+)?)\s*years?/i,

    /implementation\s+(?:period|duration)[^.\d]{0,100}(\d+(?:\.\d+)?)\s*years?/i,

  ];


  for (
    const pattern of yearPatterns
  ) {

    const match =
      normalized.match(pattern);


    if (match?.[1]) {

      const years =
        Number(match[1]);


      if (
        Number.isFinite(years) &&
        years > 0
      ) {

        return roundCr(
          years * 12
        );

      }

    }

  }


  return null;

}


// ============================================================
// NORMALIZE RISKS
// ============================================================

function normalizeRisks(
  backendRisks: BackendRisk[]
): Risk[] {

  return backendRisks.map(
    (risk) => {

      const severity =
        String(
          risk.severity ||
          "MEDIUM"
        ).toUpperCase();


      let defaultPoints =
        10;


      if (
        severity === "CRITICAL"
      ) {

        defaultPoints = 20;

      } else if (
        severity === "HIGH"
      ) {

        defaultPoints = 15;

      } else if (
        severity === "MEDIUM"
      ) {

        defaultPoints = 10;

      } else {

        defaultPoints = 5;

      }


      return {

        category:
          risk.category ||
          "General",

        severity,

        title:
          risk.title ||
          risk.category ||
          "Risk identified",

        description:
          risk.description ||
          "",

        recommendation:
          risk.recommendation ||
          "",

        keywords:
          Array.isArray(
            risk.keywords
          )
            ? risk.keywords
            : [],

        points:
          Number.isFinite(
            Number(risk.points)
          )
            ? Number(risk.points)
            : defaultPoints,

      };

    }
  );

}


// ============================================================
// RISK DIMENSIONS
// ============================================================

function calculateRiskDimensions(
  text: string,
  risks: Risk[],
  backendScore: number
) {

  const lower =
    normalizeText(text)
      .toLowerCase();


  const scoreForCategories = (
    categories: string[]
  ): number => {

    const matching =
      risks.filter(
        (risk) =>
          categories.some(
            (category) =>
              risk.category
                .toLowerCase()
                .includes(category)
          )
      );


    if (
      matching.length === 0
    ) {

      return 0;

    }


    let score = 0;


    for (
      const risk of matching
    ) {

      const severity =
        risk.severity
          .toLowerCase();


      if (
        severity === "critical"
      ) {

        score += 85;

      } else if (
        severity === "high"
      ) {

        score += 65;

      } else if (
        severity === "medium"
      ) {

        score += 45;

      } else {

        score += 25;

      }

    }


    return Math.min(
      100,
      score
    );

  };


  const keywordScore = (
    keywords: string[],
    base: number
  ): number => {

    const matches =
      keywords.filter(
        (keyword) =>
          lower.includes(
            keyword.toLowerCase()
          )
      ).length;


    return Math.min(
      100,
      base + matches * 8
    );

  };


  let costRisk =
    Math.max(
      scoreForCategories([
        "cost",
        "budget",
      ]),
      keywordScore(
        [
          "cost overrun",
          "budget mismatch",
          "budget discrepancy",
          "price escalation",
          "cost escalation",
          "unbudgeted",
        ],
        10
      )
    );


  let scheduleRisk =
    Math.max(
      scoreForCategories([
        "schedule",
        "delay",
        "time",
      ]),
      keywordScore(
        [
          "delay",
          "critical path",
          "schedule conflict",
          "schedule compression",
          "monsoon",
          "weather",
        ],
        10
      )
    );


  let technicalRisk =
    Math.max(
      scoreForCategories([
        "technical",
        "engineering",
      ]),
      keywordScore(
        [
          "slope instability",
          "geotechnical",
          "landslide",
          "soil",
          "micro-piling",
          "structural",
          "design conflict",
        ],
        10
      )
    );


  let financialRisk =
    Math.max(
      scoreForCategories([
        "financial",
        "funding",
      ]),
      keywordScore(
        [
          "funding gap",
          "cost overrun",
          "cash flow",
          "contingency",
          "escalation",
        ],
        10
      )
    );


  let environmentalRisk =
    Math.max(
      scoreForCategories([
        "environmental",
        "forest",
      ]),
      keywordScore(
        [
          "forest",
          "environmental clearance",
          "environment clearance",
          "ec clearance",
          "wildlife",
          "muck disposal",
          "environmental impact",
        ],
        5
      )
    );


  let complianceRisk =
    Math.max(
      scoreForCategories([
        "compliance",
        "clearance",
      ]),
      keywordScore(
        [
          "missing clearance",
          "statutory",
          "non-compliance",
          "compliance gap",
          "regulatory",
        ],
        5
      )
    );


  /*
   * If the backend produced a score but there are no
   * dimension-specific findings, don't display a completely
   * empty radar. Give each dimension a conservative baseline.
   */

  if (
    backendScore > 0 &&
    risks.length === 0
  ) {

    const baseline =
      Math.round(
        backendScore * 0.65
      );


    costRisk = baseline;
    scheduleRisk = baseline;
    technicalRisk = baseline;
    financialRisk = baseline;
    environmentalRisk = baseline;
    complianceRisk = baseline;

  }


  return {

    costRisk,
    scheduleRisk,
    technicalRisk,
    financialRisk,
    environmentalRisk,
    complianceRisk,

  };

}


// ============================================================
// FALLBACK SCORE
// ============================================================

function calculateFallbackRiskScore(
  dimensions: {
    costRisk: number;
    scheduleRisk: number;
    technicalRisk: number;
    financialRisk: number;
    environmentalRisk: number;
    complianceRisk: number;
  }
): number {

  const values = [

    dimensions.costRisk,

    dimensions.scheduleRisk,

    dimensions.technicalRisk,

    dimensions.financialRisk,

    dimensions.environmentalRisk,

    dimensions.complianceRisk,

  ];


  return Math.round(
    values.reduce(
      (sum, value) =>
        sum + value,
      0
    ) / values.length
  );

}


export default DprAnalysisPage;