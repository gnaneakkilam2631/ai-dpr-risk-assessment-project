import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  IndianRupee,
  Clock,
  Building2,
  Users,
  Calendar,
  AlertTriangle,
  FileSearch,
  ArrowRight,
  TrendingDown,
  Scale,
  SlidersHorizontal,
  BotMessageSquare,
  FileText,
} from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from 'recharts';
import { useProject } from '../context/ProjectContext';
import { HealthScoreGauge } from '../components/common/HealthScoreGauge';
import { RiskBadge } from '../components/common/RiskBadge';

export const DprAnalysisPage: React.FC = () => {
  const {
    activeProject,
    healthScore,
    riskAssessment,
    criticalFindings,
    setActiveEvidenceTarget,
  } = useProject();
  const navigate = useNavigate();

  // Radar chart data for risk dimensions
  const RADAR_DATA = [
    { dimension: 'Cost Risk', value: riskAssessment.dimensions.costRisk, fullMark: 100 },
    { dimension: 'Schedule Risk', value: riskAssessment.dimensions.scheduleRisk, fullMark: 100 },
    { dimension: 'Technical Risk', value: riskAssessment.dimensions.technicalRisk, fullMark: 100 },
    { dimension: 'Financial Risk', value: riskAssessment.dimensions.financialRisk, fullMark: 100 },
    { dimension: 'Environmental', value: riskAssessment.dimensions.environmentalRisk, fullMark: 100 },
    { dimension: 'Compliance', value: riskAssessment.dimensions.complianceRisk, fullMark: 100 },
  ];

  const handleViewEvidence = (pageNumber: number, section: string, title: string) => {
    setActiveEvidenceTarget({
      page: pageNumber,
      section,
      title,
    });
    navigate('/evidence');
  };

  return (
    <div className="space-y-6">
      {/* HERO HEADER: PROJECT METADATA */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-[#0c1427]">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-mono font-bold text-blue-700 dark:bg-blue-950 dark:text-cyan-300 border border-blue-200 dark:border-blue-900">
                {activeProject.code}
              </span>
              <span className="text-xs text-slate-400 font-medium font-mono">
                {activeProject.sector}
              </span>
              <RiskBadge severity={activeProject.overallRisk} size="sm" showPulse />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
              {activeProject.name}
            </h1>

            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span>{activeProject.location}, <strong className="text-slate-700 dark:text-slate-200">{activeProject.state}</strong></span>
            </p>
          </div>

          {/* QUICK SHORTCUT ACTIONS */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => navigate('/contradictions')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer"
            >
              <Scale className="h-3.5 w-3.5 text-amber-500" />
              Contradictions (12)
            </button>
            <button
              onClick={() => navigate('/simulator')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-blue-500" />
              Simulate Scenarios
            </button>
            <button
              onClick={() => navigate('/copilot')}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition cursor-pointer"
            >
              <BotMessageSquare className="h-3.5 w-3.5" />
              Ask Copilot
            </button>
          </div>
        </div>

        {/* METRIC BADGES BAR */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-5 border-t border-slate-100 dark:border-slate-800/80 text-xs">
          <div className="space-y-0.5">
            <span className="text-[11px] text-slate-400 font-medium">Project Capital Cost</span>
            <p className="text-base font-bold font-mono text-slate-900 dark:text-white">
              ₹{activeProject.totalCostCr} Cr
            </p>
          </div>
          <div className="space-y-0.5">
            <span className="text-[11px] text-slate-400 font-medium">Approved Budget</span>
            <p className="text-base font-bold font-mono text-slate-900 dark:text-white">
              ₹{activeProject.approvedBudgetCr} Cr
            </p>
          </div>
          <div className="space-y-0.5">
            <span className="text-[11px] text-slate-400 font-medium">Duration Target</span>
            <p className="text-base font-bold font-mono text-slate-900 dark:text-white flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              {activeProject.durationMonths} Months
            </p>
          </div>
          <div className="space-y-0.5">
            <span className="text-[11px] text-slate-400 font-medium">Implementing Agency</span>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate" title={activeProject.implementingAgency}>
              {activeProject.implementingAgency}
            </p>
          </div>
          <div className="space-y-0.5">
            <span className="text-[11px] text-slate-400 font-medium">Beneficiaries</span>
            <p className="text-base font-bold font-mono text-slate-900 dark:text-white flex items-center gap-1">
              <Users className="h-3.5 w-3.5 text-slate-400" />
              {activeProject.beneficiariesCount.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="space-y-0.5">
            <span className="text-[11px] text-slate-400 font-medium">Last AI Appraisal</span>
            <p className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              {activeProject.lastAnalyzed}
            </p>
          </div>
        </div>
      </div>

      {/* CORE 2-COLUMN SECTION: HEALTH SCORE & RISK MATRIX */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* LEFT: DPR HEALTH SCORE (5 COLUMNS) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-[#0c1427] lg:col-span-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                DPR Health & Conformance Index
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Automated multi-factor quality audit against MoRTH & NEC standards
              </p>
            </div>
            <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
              +8% vs Sector Avg
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
            <HealthScoreGauge
              score={healthScore.overall}
              maxScore={100}
              size={170}
              statusText={healthScore.statusText}
            />
          </div>

          {/* DIMENSION BREAKDOWN (PROGRESS BARS) */}
          <div className="space-y-3.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Quality Dimension Score Breakdown
            </h3>

            {healthScore.dimensionDetails.map((dim) => {
              let barColor = 'bg-blue-600';
              if (dim.score >= 90) barColor = 'bg-emerald-500';
              else if (dim.score >= 75) barColor = 'bg-blue-600';
              else if (dim.score >= 60) barColor = 'bg-amber-500';
              else barColor = 'bg-red-500';

              return (
                <div key={dim.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {dim.name}
                    </span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {dim.score} <span className="text-slate-400 font-normal">/ 100</span>
                    </span>
                  </div>

                  <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                      style={{ width: `${dim.score}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                    {dim.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: OVERALL RISK & RADAR CHART (6 COLUMNS) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-[#0c1427] lg:col-span-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Multi-Dimensional Risk Exposure
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Evaluation of 6 core risk axes across project lifecycle
              </p>
            </div>
            <RiskBadge severity="high" size="md" showPulse />
          </div>

          {/* RADAR CHART */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={RADAR_DATA}>
                <PolarGrid stroke="#334155" strokeDasharray="3 3" />
                <PolarAngleAxis
                  dataKey="dimension"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={{ fill: '#64748b', fontSize: 10 }}
                />
                <Radar
                  name="Project Risk Exposure %"
                  dataKey="value"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.35}
                />
                <Tooltip
                  formatter={(value: any) => [`${value}% Exposure`, 'Risk Level']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* RISK DIMENSIONS GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            {[
              { label: 'Schedule Risk', val: riskAssessment.dimensions.scheduleRisk, color: 'text-rose-600 dark:text-rose-400' },
              { label: 'Cost Risk', val: riskAssessment.dimensions.costRisk, color: 'text-rose-600 dark:text-rose-400' },
              { label: 'Financial Risk', val: riskAssessment.dimensions.financialRisk, color: 'text-orange-500' },
              { label: 'Environmental', val: riskAssessment.dimensions.environmentalRisk, color: 'text-amber-500' },
              { label: 'Technical Risk', val: riskAssessment.dimensions.technicalRisk, color: 'text-blue-500' },
              { label: 'Compliance Risk', val: riskAssessment.dimensions.complianceRisk, color: 'text-emerald-500' },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/50 p-2.5 text-center"
              >
                <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                  {item.label}
                </div>
                <div className={`text-lg font-extrabold font-mono mt-0.5 ${item.color}`}>
                  {item.val}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* KEY FINDINGS SECTION (CRITICAL, HIGH, MEDIUM, LOW) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Key AI Findings & Identified Vulnerabilities
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Correlated evidence across Chapter 1 to Annexure IX
            </p>
          </div>
          <button
            onClick={() => navigate('/evidence')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline dark:text-cyan-400 cursor-pointer"
          >
            Open Evidence Viewer <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Finding 1: CRITICAL */}
          <div className="rounded-xl border border-red-200 bg-red-50/20 p-4 shadow-xs dark:border-red-900/50 dark:bg-red-950/20">
            <div className="flex items-start justify-between">
              <RiskBadge severity="critical" size="sm" showPulse />
              <span className="text-xs font-mono text-slate-400">Section 1.4 vs 7.2 (P. 94)</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-2">
              Project Budget Mismatch (₹14.60 Cr Escalation)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              Executive Summary claims total outlay is ₹110.00 Cr, but priced BoQ aggregates to ₹124.60 Cr due to GST and structural additions.
            </p>
            <div className="mt-3 flex items-center justify-between pt-2 border-t border-red-100 dark:border-red-900/40">
              <span className="text-[11px] font-semibold text-red-700 dark:text-red-300">
                Affected: Chapter 1 & Bill of Quantities
              </span>
              <button
                onClick={() => handleViewEvidence(94, 'Section 7.2', 'Project Budget Mismatch')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline dark:text-cyan-400 cursor-pointer"
              >
                <FileSearch className="h-3.5 w-3.5" /> View Evidence
              </button>
            </div>
          </div>

          {/* Finding 2: HIGH */}
          <div className="rounded-xl border border-orange-200 bg-orange-50/20 p-4 shadow-xs dark:border-orange-900/50 dark:bg-orange-950/20">
            <div className="flex items-start justify-between">
              <RiskBadge severity="high" size="sm" />
              <span className="text-xs font-mono text-slate-400">Section 6.3 (P. 62)</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-2">
              Schedule Compression & Monsoon Clash Detected
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              Dense Bituminous Macadam (DBM) road surfacing is programmed during June–August, directly colliding with 2,800 mm peak monsoon rainfall.
            </p>
            <div className="mt-3 flex items-center justify-between pt-2 border-t border-orange-100 dark:border-orange-900/40">
              <span className="text-[11px] font-semibold text-orange-700 dark:text-orange-300">
                Affected: Construction Gantt Schedule
              </span>
              <button
                onClick={() => handleViewEvidence(62, 'Section 6.3', 'Schedule Monsoon Conflict')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline dark:text-cyan-400 cursor-pointer"
              >
                <FileSearch className="h-3.5 w-3.5" /> View Evidence
              </button>
            </div>
          </div>

          {/* Finding 3: MEDIUM */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/20 p-4 shadow-xs dark:border-amber-900/50 dark:bg-amber-950/20">
            <div className="flex items-start justify-between">
              <RiskBadge severity="medium" size="sm" />
              <span className="text-xs font-mono text-slate-400">Section 7.2 (P. 94)</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-2">
              Contingency Allocation is Below Recommended Range
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              Physical contingency provisioned at 2.5% (₹2.40 Cr). MoRTH standards prescribe 5.0% for hill terrain in Seismic Zone V.
            </p>
            <div className="mt-3 flex items-center justify-between pt-2 border-t border-amber-100 dark:border-amber-900/40">
              <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-300">
                Affected: Cost Abstract Table 7.4
              </span>
              <button
                onClick={() => handleViewEvidence(94, 'Section 7.2', 'Low Contingency Allocation')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline dark:text-cyan-400 cursor-pointer"
              >
                <FileSearch className="h-3.5 w-3.5" /> View Evidence
              </button>
            </div>
          </div>

          {/* Finding 4: LOW */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/20 p-4 shadow-xs dark:border-emerald-900/50 dark:bg-emerald-950/20">
            <div className="flex items-start justify-between">
              <RiskBadge severity="low" size="sm" />
              <span className="text-xs font-mono text-slate-400">Annexure IX (P. 132)</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-2">
              Minor Documentation: Catchment Demarcation Clarification
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              Beneficiary count difference (84,500 vs 54,200) reflects direct road corridor vs wider district indirect catchment.
            </p>
            <div className="mt-3 flex items-center justify-between pt-2 border-t border-emerald-100 dark:border-emerald-900/40">
              <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                Affected: Social Impact Survey
              </span>
              <button
                onClick={() => handleViewEvidence(132, 'Annexure IX', 'Beneficiary Count Variance')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline dark:text-cyan-400 cursor-pointer"
              >
                <FileSearch className="h-3.5 w-3.5" /> View Evidence
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
