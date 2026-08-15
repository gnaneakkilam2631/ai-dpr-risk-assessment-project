import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Lightbulb,
  CheckCircle2,
  Clock,
  TrendingDown,
  Sparkles,
  Layers,
  ArrowRight,
  Download,
  Building,
  FileCheck,
  Check,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { MitigationRecommendation } from '../types';

export const MitigationAdvisorPage: React.FC = () => {
  const { mitigations, updateMitigationStatus, activeProject, addToast } = useProject();
  const navigate = useNavigate();

  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [showPlanModal, setShowPlanModal] = useState(false);

  const totalSavingsCr = mitigations
    .filter((m) => m.status === 'Accepted' || m.status === 'Under Review')
    .reduce((acc, curr) => acc + curr.estimatedSavingCr, 0);

  const totalTimeSavedMonths = mitigations
    .filter((m) => m.status === 'Accepted' || m.status === 'Under Review')
    .reduce((acc, curr) => acc + curr.timeRecoveryMonths, 0);

  const acceptedCount = mitigations.filter((m) => m.status === 'Accepted').length;

  const filteredMitigations = mitigations.filter((m) => {
    const matchPriority = filterPriority === 'ALL' || m.priority === filterPriority;
    const matchStatus = filterStatus === 'ALL' || m.status === filterStatus;
    return matchPriority && matchStatus;
  });

  const handleExportMitigationPlan = () => {
    setShowPlanModal(true);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display flex items-center gap-2.5">
            <Lightbulb className="h-7 w-7 text-amber-500" />
            AI Mitigation Advisor
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Actionable, engineering-grounded countermeasures prioritized by cost saving, timeline recovery, and implementation feasibility.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportMitigationPlan}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition cursor-pointer"
          >
            <FileCheck className="h-4 w-4" />
            Generate Mitigation Plan
          </button>
        </div>
      </div>

      {/* KPI IMPACT BANNER */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/20">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
            Projected Cost Savings
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-700 dark:text-emerald-400 mt-1">
            ₹{totalSavingsCr.toFixed(1)} Cr
          </div>
          <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80 mt-0.5">
            From {acceptedCount} active mitigation actions
          </p>
        </div>

        <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-900/50 dark:bg-blue-950/20">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800 dark:text-cyan-300">
            Recoverable Timeline
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-blue-700 dark:text-cyan-400 mt-1">
            {totalTimeSavedMonths.toFixed(1)} Months
          </div>
          <p className="text-xs text-blue-600/80 dark:text-cyan-400/80 mt-0.5">
            Through monsoon rescheduling
          </p>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
            Adoption Status
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-700 dark:text-amber-400 mt-1">
            {acceptedCount} / {mitigations.length}
          </div>
          <p className="text-xs text-amber-600/80 dark:text-amber-400/80 mt-0.5">
            Actions incorporated in DPR addendum
          </p>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-[#0c1427] border border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Filter:
          </span>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="h-8 rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-xs text-slate-700 font-medium focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 cursor-pointer"
          >
            <option value="ALL">All Priorities</option>
            <option value="Immediate">Immediate Priority</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-8 rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-xs text-slate-700 font-medium focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="Accepted">Accepted</option>
            <option value="Under Review">Under Review</option>
            <option value="Pending">Pending Decision</option>
            <option value="Deferred">Deferred</option>
          </select>
        </div>

        <span className="text-xs text-slate-400 font-mono">
          Showing {filteredMitigations.length} recommendations
        </span>
      </div>

      {/* RECOMMENDATIONS CARDS */}
      <div className="space-y-4">
        {filteredMitigations.map((rec, index) => {
          let priorityClass = 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800';
          if (rec.priority === 'High') {
            priorityClass = 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800';
          } else if (rec.priority === 'Medium') {
            priorityClass = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
          }

          let statusClass = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
          if (rec.status === 'Accepted') {
            statusClass = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700';
          } else if (rec.status === 'Under Review') {
            statusClass = 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-cyan-300 border-blue-300 dark:border-blue-700';
          }

          return (
            <div
              key={rec.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs dark:border-slate-800 dark:bg-[#0c1427] space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition"
            >
              {/* TOP STRIP */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-white font-mono font-bold text-xs">
                    {index + 1}
                  </span>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${priorityClass}`}>
                    {rec.priority.toUpperCase()} PRIORITY
                  </span>
                  <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                    {rec.riskCategory}
                  </span>
                </div>

                {/* STATUS SELECTOR */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium">Status:</span>
                  <select
                    value={rec.status}
                    onChange={(e) =>
                      updateMitigationStatus(
                        rec.id,
                        e.target.value as MitigationRecommendation['status']
                      )
                    }
                    className={`rounded-lg border px-2.5 py-1 text-xs font-bold focus:outline-none cursor-pointer ${statusClass}`}
                  >
                    <option value="Pending">Pending Decision</option>
                    <option value="Accepted">Accepted into Addendum</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Deferred">Deferred</option>
                  </select>
                </div>
              </div>

              {/* TITLE & TARGET RISK */}
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {rec.title}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Targeted Hazard: <span className="font-semibold text-slate-700 dark:text-slate-300">{rec.targetedRisk}</span>
                </p>
              </div>

              {/* RECOMMENDATION BODY */}
              <div className="rounded-xl bg-blue-50/40 p-3.5 border border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/40 text-xs space-y-1.5">
                <div className="font-bold text-blue-900 dark:text-cyan-300 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  Prescribed Technical Action:
                </div>
                <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
                  {rec.recommendation}
                </p>
                <div className="pt-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                  Expected Benefit: {rec.expectedBenefit}
                </div>
              </div>

              {/* METRIC BADGES BAR */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-xs">
                <div className="rounded-lg bg-slate-50 dark:bg-slate-900 p-2 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase">Estimated Savings</span>
                  <p className="text-sm font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                    ₹{rec.estimatedSavingCr} Cr
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 dark:bg-slate-900 p-2 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase">Time Recovery</span>
                  <p className="text-sm font-extrabold font-mono text-blue-600 dark:text-cyan-400">
                    +{rec.timeRecoveryMonths} Months
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 dark:bg-slate-900 p-2 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase">Difficulty</span>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                    {rec.implementationDifficulty}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 dark:bg-slate-900 p-2 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase">Responsible Unit</span>
                  <p className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 truncate mt-0.5" title={rec.responsibleAgency}>
                    {rec.responsibleAgency}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* EXPORT MITIGATION PLAN MODAL */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-[#0c1427] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Formal AI Mitigation Directive & Addendum
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {activeProject.code} • {activeProject.name}
                </p>
              </div>
              <span className="rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono text-xs px-2.5 py-1 font-bold border border-emerald-200 dark:border-emerald-800">
                Ready for Issue
              </span>
            </div>

            <div className="space-y-3 text-xs max-h-80 overflow-y-auto pr-1">
              <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <p className="font-semibold text-slate-900 dark:text-white">
                  Executive Directive Summary:
                </p>
                <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  The National Infrastructure Appraisal Board recommends conditional approval of the DPR subject to formal incorporation of the {acceptedCount} accepted mitigation protocols. These measures safeguard ₹{totalSavingsCr.toFixed(1)} Cr against escalation and recover {totalTimeSavedMonths.toFixed(1)} months on critical road paving paths.
                </p>
              </div>

              <div className="space-y-2">
                <span className="font-bold uppercase tracking-wider text-[11px] text-slate-400">
                  Accepted Mandates:
                </span>
                {mitigations
                  .filter((m) => m.status === 'Accepted')
                  .map((m, idx) => (
                    <div
                      key={m.id}
                      className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] flex items-start gap-2"
                    >
                      <span className="font-mono font-bold text-blue-600 dark:text-cyan-400">
                        {idx + 1}.
                      </span>
                      <div className="flex-1">
                        <span className="font-bold text-slate-900 dark:text-white">{m.title}</span>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{m.recommendation}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowPlanModal(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPlanModal(false);
                  addToast('success', 'Plan Exported', 'Mitigation Directive PDF generated and downloaded.');
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition cursor-pointer"
              >
                <Download className="h-4 w-4" />
                Download Formal Directive (PDF)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
