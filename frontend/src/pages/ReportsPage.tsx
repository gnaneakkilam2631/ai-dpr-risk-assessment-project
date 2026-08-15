import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  CheckCircle2,
  Share2,
  FileCheck,
  ShieldCheck,
  Building,
  Sparkles,
  Layers,
  ArrowRight,
  Clock,
  Eye,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { RiskBadge } from '../components/common/RiskBadge';

export const ReportsPage: React.FC = () => {
  const { activeProject, healthScore, riskAssessment, contradictions, mitigations, addToast } =
    useProject();

  const [selectedReportType, setSelectedReportType] = useState<string>('comprehensive');
  const [includeContradictions, setIncludeContradictions] = useState(true);
  const [includeSimulations, setIncludeSimulations] = useState(true);
  const [includeMitigations, setIncludeMitigations] = useState(true);
  const [includeEvidenceSnippets, setIncludeEvidenceSnippets] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = (format: 'pdf' | 'docx' | 'brief') => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      addToast(
        'success',
        `Report Downloaded (${format.toUpperCase()})`,
        `${activeProject.code}_DPR_Appraisal_Dossier.${format === 'brief' ? 'pdf' : format}`
      );
    }, 1000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display flex items-center gap-2.5">
            <FileText className="h-7 w-7 text-blue-600 dark:text-cyan-400" />
            Reports & Executive Appraisal Dossiers
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Generate and export formal, board-ready DPR quality and risk appraisal reports formatted for government EFC/SFC sanction.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            Print Dossier
          </button>
          <button
            onClick={() => handleDownload('pdf')}
            disabled={isGenerating}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 disabled:opacity-50 transition cursor-pointer"
          >
            <Download className="h-4 w-4" />
            {isGenerating ? 'Generating...' : 'Export Full Report (PDF)'}
          </button>
        </div>
      </div>

      {/* 2-COLUMN LAYOUT: REPORT TYPES & CONFIG (4 COLS) + LIVE PREVIEW (8 COLS) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* LEFT COLUMN: REPORT TYPES & OPTIONS (4 COLS) */}
        <div className="space-y-5 lg:col-span-4">
          {/* SELECT REPORT TEMPLATE */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#0c1427] space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Select Appraisal Template
            </span>

            {[
              {
                id: 'comprehensive',
                title: 'Comprehensive Quality & Risk Dossier',
                desc: 'Full 18-page appraisal covering all 6 risk dimensions, BoQ validation, and contradictions.',
              },
              {
                id: 'efc',
                title: 'EFC / SFC Executive Memorandum',
                desc: 'Concise 4-page briefing designed for Expenditure Finance Committee sanction.',
              },
              {
                id: 'contradictions',
                title: 'Contradiction & Discrepancy Matrix',
                desc: 'Side-by-side comparative table with cited document chapter excerpts.',
              },
              {
                id: 'mitigation',
                title: 'Actionable Mitigation Directive',
                desc: 'Remedial checklist with expected cost savings & time recoveries.',
              },
            ].map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() => setSelectedReportType(tmpl.id)}
                className={`w-full text-left rounded-xl p-3.5 text-xs transition border cursor-pointer ${
                  selectedReportType === tmpl.id
                    ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/60 font-semibold'
                    : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900'
                }`}
              >
                <div className="font-bold text-slate-900 dark:text-white">
                  {tmpl.title}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  {tmpl.desc}
                </p>
              </button>
            ))}
          </div>

          {/* REPORT CUSTOMIZATION TOGGLES */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#0c1427] space-y-3 text-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Dossier Inclusions
            </span>

            <div className="space-y-2.5">
              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={includeContradictions}
                  onChange={(e) => setIncludeContradictions(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span>Include All 12 Contradictions with Evidence Quotes</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={includeSimulations}
                  onChange={(e) => setIncludeSimulations(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span>Include What-If Sensitivity & Stress Test Matrix</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={includeMitigations}
                  onChange={(e) => setIncludeMitigations(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span>Include Mitigation Directive (₹16.5 Cr Savings)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={includeEvidenceSnippets}
                  onChange={(e) => setIncludeEvidenceSnippets(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span>Include Highlighted PDF Excerpts and Table 7.4</span>
              </label>
            </div>
          </div>

          {/* QUICK EXPORT FORMATS */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#0c1427] space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Direct Export Formats
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDownload('pdf')}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 p-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                <Download className="h-3.5 w-3.5 text-red-500" />
                Adobe PDF (.pdf)
              </button>
              <button
                type="button"
                onClick={() => handleDownload('docx')}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 p-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                <Download className="h-3.5 w-3.5 text-blue-500" />
                MS Word (.docx)
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: REALISTIC FORMAL REPORT PREVIEW (8 COLS) */}
        <div className="lg:col-span-8 flex flex-col rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-950 p-6 shadow-inner overflow-y-auto max-h-[850px]">
          <div className="w-full bg-white text-slate-900 shadow-2xl p-8 sm:p-12 rounded-sm border border-slate-300 font-serif space-y-6 select-text">
            {/* OFFICIAL EMBLEM & REPORT HEADER */}
            <div className="text-center pb-6 border-b-2 border-slate-900 space-y-1.5">
              <div className="text-[11px] font-sans font-bold tracking-widest uppercase text-slate-600">
                GOVERNMENT OF INDIA • NATIONAL INFRASTRUCTURE APPRAISAL BOARD
              </div>
              <h2 className="text-lg sm:text-xl font-sans font-extrabold uppercase text-slate-900 tracking-tight">
                AI DETAILED PROJECT REPORT (DPR) QUALITY & RISK APPRAISAL DOSSIER
              </h2>
              <div className="flex items-center justify-center gap-4 text-xs font-mono text-slate-600 pt-1">
                <span>PROJECT CODE: {activeProject.code}</span>
                <span>•</span>
                <span>DATE OF APPRAISAL: 14 AUGUST 2025</span>
              </div>
            </div>

            {/* PROJECT SUMMARY STRIP */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 border border-slate-200 font-sans text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Project Title</span>
                <div className="font-bold text-slate-900 truncate" title={activeProject.name}>
                  {activeProject.name}
                </div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Location</span>
                <div className="font-bold text-slate-900">{activeProject.state}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Estimated Outlay</span>
                <div className="font-bold text-slate-900 font-mono">₹{activeProject.totalCostCr} Cr</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Approved Budget</span>
                <div className="font-bold text-slate-900 font-mono">₹{activeProject.approvedBudgetCr} Cr</div>
              </div>
            </div>

            {/* EXECUTIVE VERDICT */}
            <div className="rounded-lg border-2 border-amber-400 bg-amber-50/70 p-4 space-y-1.5 font-sans">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-amber-700" />
                  Appraisal Verdict & Statutory Recommendation:
                </span>
                <span className="rounded bg-amber-200 px-2 py-0.5 text-xs font-bold text-amber-900">
                  CONDITIONAL APPROVAL SUBJECT TO MANDATED REVISIONS
                </span>
              </div>
              <p className="text-xs text-amber-950 leading-relaxed font-serif pt-1">
                The AI-DPR Guardian engine assigns an overall DPR Health Score of <strong>82/100 (Good — Minor Issues Detected)</strong> with an overall risk classification of <strong>HIGH RISK</strong> driven by severe Schedule Compression (81%) and Cost Exposure (73%). The project is cleared for preliminary technical sanction on the condition that 4 critical discrepancies are formally rectified in the addendum.
              </p>
            </div>

            {/* HEALTH SCORE & RISK BREAKDOWN SECTION */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-sans font-bold uppercase tracking-wider text-slate-800 pb-1 border-b border-slate-300">
                1.0 Quality Conformance & Multi-Factor Index
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-sans">
                {healthScore.dimensionDetails.map((dim) => (
                  <div key={dim.name} className="p-2 border border-slate-200 bg-slate-50">
                    <span className="text-slate-500 text-[10px] uppercase">{dim.name}</span>
                    <div className="font-mono font-bold text-sm text-slate-900">{dim.score} / 100</div>
                  </div>
                ))}
              </div>
            </div>

            {/* KEY CONTRADICTIONS TABLE */}
            {includeContradictions && (
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-sans font-bold uppercase tracking-wider text-slate-800 pb-1 border-b border-slate-300">
                  2.0 Identified Contradictions & Cross-Chapter Variances
                </h3>

                <div className="overflow-x-auto border border-slate-300 font-sans text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 border-b border-slate-300">
                      <tr>
                        <th className="p-2 font-bold">Ref No.</th>
                        <th className="p-2 font-bold">Severity</th>
                        <th className="p-2 font-bold">Discrepancy Finding</th>
                        <th className="p-2 font-bold">Section A vs Section B</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-serif text-xs">
                      {contradictions.slice(0, 4).map((c, i) => (
                        <tr key={c.id}>
                          <td className="p-2 font-mono font-bold">{i + 1}</td>
                          <td className="p-2 font-sans font-bold uppercase text-[10px] text-red-600">
                            {c.severity}
                          </td>
                          <td className="p-2">{c.title}</td>
                          <td className="p-2 text-[11px] font-mono">
                            {c.sectionA.sectionNumber} (P.{c.sectionA.page}) vs {c.sectionB.sectionNumber} (P.{c.sectionB.page})
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* MITIGATION DIRECTIVE SUMMARY */}
            {includeMitigations && (
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-sans font-bold uppercase tracking-wider text-slate-800 pb-1 border-b border-slate-300">
                  3.0 Mandated Countermeasures & Cost Offsets
                </h3>

                <div className="space-y-2 text-xs font-serif">
                  {mitigations.slice(0, 3).map((m, i) => (
                    <div key={m.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                      <div className="font-sans font-bold text-slate-900">
                        {i + 1}. {m.title}
                      </div>
                      <p className="text-slate-700 mt-0.5">{m.recommendation}</p>
                      <div className="mt-1 font-sans text-[11px] text-emerald-700 font-semibold">
                        Impact: Cost saving of ₹{m.estimatedSavingCr} Cr • Schedule recovery of {m.timeRecoveryMonths} months
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* OFFICIAL SIGNATURES BLOCK */}
            <div className="pt-10 border-t-2 border-slate-900 grid grid-cols-2 gap-8 font-sans text-xs">
              <div>
                <div className="h-10 border-b border-slate-400 w-48 mb-1" />
                <div className="font-bold text-slate-900">Chief Engineer (Planning)</div>
                <div className="text-slate-500 text-[10px]">Ministry of Road Transport & Highways</div>
              </div>
              <div className="text-right flex flex-col items-end">
                <div className="h-10 border-b border-slate-400 w-48 mb-1" />
                <div className="font-bold text-slate-900">Lead Infrastructure Risk Assessor</div>
                <div className="text-slate-500 text-[10px]">AI-DPR Guardian Audit Group</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
