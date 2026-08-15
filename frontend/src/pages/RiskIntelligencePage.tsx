import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertOctagon,
  FileSearch,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { RiskItem } from '../types';
import { RiskBadge } from '../components/common/RiskBadge';

export const RiskIntelligencePage: React.FC = () => {
  const { riskAssessment, setActiveEvidenceTarget } = useProject();
  const navigate = useNavigate();

  const [selectedRisk, setSelectedRisk] = useState<RiskItem>(riskAssessment.risks[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = ['ALL', 'Schedule', 'Cost', 'Procurement', 'Technical', 'Environmental', 'Financial', 'Social'];

  const filteredRisks = riskAssessment.risks.filter(
    (r) => selectedCategory === 'ALL' || r.category === selectedCategory
  );

  const handleOpenEvidence = (pageNumber: number, section: string, title: string) => {
    setActiveEvidenceTarget({
      page: pageNumber,
      section,
      title,
    });
    navigate('/evidence');
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display flex items-center gap-2.5">
            <AlertOctagon className="h-7 w-7 text-rose-500" />
            Risk Intelligence & Heatmap Matrix
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Interactive multi-dimensional probability vs. impact risk topology with grounded engineering causality.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/simulator')}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition cursor-pointer"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Run What-If Simulator
          </button>
        </div>
      </div>

      {/* CATEGORY FILTER CHIPS */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
          Filter Category:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition cursor-pointer ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-[#0c1427] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 2-COLUMN LAYOUT: HEATMAP ON LEFT (7 COLS), DETAIL PANEL ON RIGHT (5 COLS) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* HEATMAP MATRIX CONTAINER (7 COLS) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#0c1427] lg:col-span-7 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Probability vs. Impact Matrix
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Click on any bubble marker to inspect deep causality and evidence
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-red-500" /> Critical
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-orange-500" /> High
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-amber-500" /> Medium
              </span>
            </div>
          </div>

          {/* 2D MATRIX GRID */}
          <div className="relative mt-4 h-96 w-full rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-950/40">
            {/* Background 4-Quadrant Shading */}
            <div className="absolute inset-4 grid grid-cols-2 grid-rows-2 rounded-lg overflow-hidden pointer-events-none opacity-40">
              <div className="bg-amber-500/10 border-r border-b border-slate-300 dark:border-slate-700" />
              <div className="bg-red-500/20 border-b border-slate-300 dark:border-slate-700" />
              <div className="bg-emerald-500/10 border-r border-slate-300 dark:border-slate-700" />
              <div className="bg-amber-500/10" />
            </div>

            {/* Matrix Labels */}
            <div className="absolute left-6 top-6 text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
              Critical Risk Zone
            </div>
            <div className="absolute right-6 bottom-6 text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              Moderate Sensitivity
            </div>
            <div className="absolute left-6 bottom-6 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Low Vulnerability
            </div>

            {/* Y-AXIS LABEL */}
            <div className="absolute -left-6 top-1/2 -translate-y-1/2 -rotate-90 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Impact & Severity &rarr;
            </div>

            {/* X-AXIS LABEL */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Probability of Occurrence &rarr;
            </div>

            {/* RISK BUBBLE MARKERS */}
            {filteredRisks.map((risk) => {
              const isSelected = selectedRisk?.id === risk.id;
              const xPercent = risk.xPos || risk.probability;
              const yPercent = 100 - (risk.yPos || risk.impactScore * 10); // Flip Y axis for standard chart orientation

              let bubbleBg = 'bg-amber-500 border-amber-300 shadow-amber-500/40 text-white';
              if (risk.impact === 'Critical' || risk.riskScore >= 8.5) {
                bubbleBg = 'bg-red-600 border-red-300 shadow-red-500/50 text-white';
              } else if (risk.impact === 'High' || risk.riskScore >= 7.0) {
                bubbleBg = 'bg-orange-500 border-orange-300 shadow-orange-500/50 text-white';
              }

              return (
                <div
                  key={risk.id}
                  onClick={() => setSelectedRisk(risk)}
                  style={{
                    left: `${Math.min(90, Math.max(10, xPercent))}%`,
                    top: `${Math.min(85, Math.max(12, yPercent))}%`,
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer transition-all duration-200 group ${
                    isSelected ? 'scale-125 z-30' : 'hover:scale-115'
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 shadow-lg font-mono font-bold text-xs ${bubbleBg} ${
                      isSelected ? 'ring-4 ring-blue-500/50 animate-pulse' : ''
                    }`}
                  >
                    {risk.riskScore}
                  </div>

                  {/* Tooltip Tag */}
                  <div
                    className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 whitespace-nowrap rounded-md bg-slate-900 text-white px-2 py-1 text-[10px] font-semibold pointer-events-none transition shadow-md border border-slate-700 ${
                      isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    {risk.title}
                  </div>
                </div>
              );
            })}
          </div>

          {/* QUICK RISK ITEMS LIST BELOW MATRIX */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Identified Risk Register:
            </span>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {riskAssessment.risks.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelectedRisk(r)}
                  className={`text-left rounded-lg p-2 text-xs transition cursor-pointer border ${
                    selectedRisk?.id === r.id
                      ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/60 font-semibold text-blue-900 dark:text-cyan-200'
                      : 'border-slate-200/80 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate max-w-[200px]">{r.title}</span>
                    <span className="font-mono font-bold shrink-0 ml-1 text-slate-800 dark:text-slate-200">
                      {r.riskScore}/10
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: RISK DETAIL PANEL (5 COLS) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-[#0c1427] lg:col-span-5 space-y-5">
          {selectedRisk ? (
            <>
              {/* TOP DETAIL HEADER */}
              <div className="space-y-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                    Category: {selectedRisk.category}
                  </span>
                  <RiskBadge severity={selectedRisk.impact.toLowerCase()} size="sm" showPulse />
                </div>

                <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                  {selectedRisk.title}
                </h2>

                <div className="grid grid-cols-3 gap-2 pt-2 text-center">
                  <div className="rounded-lg bg-slate-50 dark:bg-slate-900 p-2 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase">Probability</span>
                    <p className="text-sm font-extrabold font-mono text-slate-900 dark:text-white">
                      {selectedRisk.probability}%
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-50 dark:bg-slate-900 p-2 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase">Impact</span>
                    <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {selectedRisk.impact}
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-50 dark:bg-slate-900 p-2 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase">Risk Score</span>
                    <p className="text-sm font-extrabold font-mono text-rose-600 dark:text-rose-400">
                      {selectedRisk.riskScore} / 10
                    </p>
                  </div>
                </div>
              </div>

              {/* PRIMARY CAUSES */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-blue-500" />
                  Primary Causative Factors
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  {selectedRisk.primaryCauses.map((cause, i) => (
                    <li key={i} className="flex items-start gap-2 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg border border-slate-100 dark:border-slate-800/60">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                      <span>{cause}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* EVIDENCE EXCERPT */}
              <div className="rounded-xl border border-blue-200/80 bg-blue-50/40 p-3.5 dark:border-blue-900/40 dark:bg-blue-950/20 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-blue-800 dark:text-cyan-300">
                    Document Citation Evidence:
                  </span>
                  <span className="font-mono text-slate-400 text-[11px]">
                    Page {selectedRisk.evidencePage}
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {selectedRisk.evidenceSection}
                </p>
                <div className="rounded-md bg-white p-2.5 text-xs italic text-slate-700 border border-blue-100 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 font-serif">
                  "{selectedRisk.evidenceQuote}"
                </div>
              </div>

              {/* POTENTIAL IMPACT */}
              <div className="space-y-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  Potential Project Impact
                </h3>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-rose-50/40 dark:bg-red-950/20 p-2.5 rounded-lg border border-rose-100 dark:border-red-900/40">
                  {selectedRisk.potentialImpact}
                </p>
              </div>

              {/* RECOMMENDED MITIGATION */}
              <div className="space-y-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Recommended AI Mitigation
                </h3>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-emerald-50/40 dark:bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-100 dark:border-emerald-900/40">
                  {selectedRisk.recommendedMitigation}
                </p>
              </div>

              {/* ACTION BUTTON */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() =>
                    handleOpenEvidence(
                      selectedRisk.evidencePage,
                      selectedRisk.evidenceSection,
                      selectedRisk.title
                    )
                  }
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition cursor-pointer"
                >
                  <FileSearch className="h-4 w-4" />
                  Open in Split-Screen Evidence Viewer
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400">
              <ShieldAlert className="h-10 w-10 text-slate-300 dark:text-slate-600 mb-2" />
              <p className="text-sm font-medium">Select a risk item to view intelligence breakdown</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
