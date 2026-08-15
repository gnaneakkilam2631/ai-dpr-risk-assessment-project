import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Scale,
  CheckCircle2,
  AlertCircle,
  FileSearch,
  ExternalLink,
  Filter,
  Check,
  RotateCcw,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { RiskBadge } from '../components/common/RiskBadge';

export const ContradictionsPage: React.FC = () => {
  const {
    contradictions,
    markContradictionReviewed,
    setActiveEvidenceTarget,
  } = useProject();
  const navigate = useNavigate();

  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'UNREVIEWED' | 'REVIEWED'>('ALL');

  const criticalCount = contradictions.filter((c) => c.severity === 'critical').length;
  const highCount = contradictions.filter((c) => c.severity === 'high').length;
  const mediumCount = contradictions.filter((c) => c.severity === 'medium').length;
  const lowCount = contradictions.filter((c) => c.severity === 'low').length;
  const reviewedCount = contradictions.filter((c) => c.reviewed).length;

  const filteredContradictions = contradictions.filter((c) => {
    const matchesCategory = categoryFilter === 'ALL' || c.category === categoryFilter;
    const matchesSeverity = severityFilter === 'ALL' || c.severity === severityFilter;
    const matchesStatus =
      statusFilter === 'ALL'
        ? true
        : statusFilter === 'REVIEWED'
        ? c.reviewed
        : !c.reviewed;
    return matchesCategory && matchesSeverity && matchesStatus;
  });

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
            <Scale className="h-7 w-7 text-amber-500" />
            Consistency & Contradiction Analysis
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Cross-chapter validation identifying conflicting costs, schedules, dimensions, and quantities across DPR chapters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            Audit Status: <strong>{reviewedCount} of {contradictions.length} Reviewed</strong>
          </span>
        </div>
      </div>

      {/* SUMMARY COUNTER CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-red-200 bg-red-50/40 p-3.5 dark:border-red-950 dark:bg-red-950/20">
          <div className="flex items-center justify-between text-xs font-bold text-red-700 dark:text-red-300 uppercase tracking-wider">
            <span>Critical Severity</span>
            <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
          </div>
          <div className="mt-2 text-2xl font-extrabold font-mono text-red-700 dark:text-red-400">
            {criticalCount}
          </div>
          <p className="text-[11px] text-red-600/80 dark:text-red-400/70 mt-0.5">
            Immediate EFC sanction hurdle
          </p>
        </div>

        <div className="rounded-xl border border-orange-200 bg-orange-50/40 p-3.5 dark:border-orange-950 dark:bg-orange-950/20">
          <div className="text-xs font-bold text-orange-700 dark:text-orange-300 uppercase tracking-wider">
            High Severity
          </div>
          <div className="mt-2 text-2xl font-extrabold font-mono text-orange-700 dark:text-orange-400">
            {highCount}
          </div>
          <p className="text-[11px] text-orange-600/80 dark:text-orange-400/70 mt-0.5">
            Schedule & quantity variances
          </p>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-3.5 dark:border-amber-950 dark:bg-amber-950/20">
          <div className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider">
            Medium Severity
          </div>
          <div className="mt-2 text-2xl font-extrabold font-mono text-amber-700 dark:text-amber-400">
            {mediumCount}
          </div>
          <p className="text-[11px] text-amber-600/80 dark:text-amber-400/70 mt-0.5">
            Clearance boundary discrepancies
          </p>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-3.5 dark:border-emerald-950 dark:bg-emerald-950/20">
          <div className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
            Low / Reconciled
          </div>
          <div className="mt-2 text-2xl font-extrabold font-mono text-emerald-700 dark:text-emerald-400">
            {lowCount}
          </div>
          <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400/70 mt-0.5">
            Minor textual clarification
          </p>
        </div>
      </div>

      {/* FILTER CONTROLS */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-[#0c1427] border border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mr-1">
            <Filter className="h-3.5 w-3.5" /> Filters:
          </span>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-8 rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-xs text-slate-700 font-medium focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            <option value="Financial">Financial & Budget</option>
            <option value="Timeline">Timeline & Schedule</option>
            <option value="Material & Quantities">Material & Quantities</option>
            <option value="Statutory Approvals">Statutory Approvals</option>
            <option value="Beneficiaries">Beneficiaries</option>
          </select>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="h-8 rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-xs text-slate-700 font-medium focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 cursor-pointer"
          >
            <option value="ALL">All Severities</option>
            <option value="critical">Critical Only</option>
            <option value="high">High Only</option>
            <option value="medium">Medium Only</option>
            <option value="low">Low Only</option>
          </select>

          <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 bg-slate-50 dark:bg-slate-900">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${
                statusFilter === 'ALL'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              All ({contradictions.length})
            </button>
            <button
              onClick={() => setStatusFilter('UNREVIEWED')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${
                statusFilter === 'UNREVIEWED'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Pending Review ({contradictions.length - reviewedCount})
            </button>
            <button
              onClick={() => setStatusFilter('REVIEWED')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${
                statusFilter === 'REVIEWED'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Reviewed ({reviewedCount})
            </button>
          </div>
        </div>

        <span className="text-xs text-slate-400 font-mono">
          Showing {filteredContradictions.length} of {contradictions.length} findings
        </span>
      </div>

      {/* CONTRADICTION COMPARISON CARDS */}
      <div className="space-y-4">
        {filteredContradictions.map((item) => (
          <div
            key={item.id}
            className={`rounded-2xl border transition-all ${
              item.reviewed
                ? 'border-slate-200/60 bg-slate-50/40 opacity-80 dark:border-slate-800/60 dark:bg-slate-900/20'
                : 'border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0c1427]'
            } p-5 sm:p-6 space-y-4`}
          >
            {/* CARD TOP BAR */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex flex-wrap items-center gap-2.5">
                <RiskBadge severity={item.severity} size="sm" showPulse={!item.reviewed && item.severity === 'critical'} />
                <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                  {item.category} Contradiction
                </span>
                {item.financialImpactCr && (
                  <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-red-950/60 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-900">
                    Variance: ₹{item.financialImpactCr} Cr
                  </span>
                )}
              </div>

              {/* REVIEW BADGE */}
              {item.reviewed && (
                <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Audited by Reviewer</span>
                </div>
              )}
            </div>

            {/* TITLE */}
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {item.title}
            </h2>

            {/* SIDE-BY-SIDE CONTRADICTION COMPARISON */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* SECTION A */}
              <div className="rounded-xl border border-blue-200/80 bg-blue-50/30 p-4 dark:border-blue-900/40 dark:bg-blue-950/20 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-blue-700 dark:text-blue-300">
                    {item.sectionA.sectionNumber}: {item.sectionA.title}
                  </span>
                  <span className="font-mono text-slate-400">Page {item.sectionA.page}</span>
                </div>
                <div className="rounded-lg bg-white p-3 text-xs italic text-slate-700 border border-blue-100 dark:border-blue-950 dark:bg-[#0f172a] dark:text-slate-200 leading-relaxed font-serif">
                  "{item.sectionA.text}"
                </div>
              </div>

              {/* SECTION B */}
              <div className="rounded-xl border border-red-200/80 bg-red-50/30 p-4 dark:border-red-900/40 dark:bg-red-950/20 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-red-700 dark:text-red-300">
                    {item.sectionB.sectionNumber}: {item.sectionB.title}
                  </span>
                  <span className="font-mono text-slate-400">Page {item.sectionB.page}</span>
                </div>
                <div className="rounded-lg bg-white p-3 text-xs italic text-slate-700 border border-red-100 dark:border-red-950 dark:bg-[#0f172a] dark:text-slate-200 leading-relaxed font-serif">
                  "{item.sectionB.text}"
                </div>
              </div>
            </div>

            {/* AI FINDING & IMPACT BOX */}
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/80 dark:bg-slate-900/60 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <Sparkles className="h-4 w-4 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">AI Diagnostic Finding: </span>
                  <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{item.aiFinding}</span>
                </div>
              </div>

              <div className="flex items-start gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">Statutory & Financial Impact: </span>
                  <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{item.impactDescription}</span>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleOpenEvidence(item.sectionB.page, item.sectionB.sectionNumber, item.title)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 dark:text-cyan-400 dark:hover:text-cyan-300 cursor-pointer"
              >
                <FileSearch className="h-4 w-4" />
                View Document in Split-Screen Evidence Viewer
              </button>

              <div className="flex items-center gap-2">
                {item.reviewed ? (
                  <button
                    type="button"
                    onClick={() => markContradictionReviewed(item.id, false)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Reopen Finding
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => markContradictionReviewed(item.id, true)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg shadow-xs transition cursor-pointer"
                  >
                    <Check className="h-3.5 w-3.5" />
                    Mark as Reviewed
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
