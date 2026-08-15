import React, { useState } from 'react';
import {
  SlidersHorizontal,
  RotateCcw,
  Save,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  BookmarkCheck,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { useProject } from '../context/ProjectContext';
import { SimulationParams } from '../types';
import {
  riskService,
  DEFAULT_SIMULATION_PARAMS,
} from '../services/riskService';
import { RiskBadge } from '../components/common/RiskBadge';

export const WhatIfSimulatorPage: React.FC = () => {
  const { activeProject, addToast } = useProject();

  const [params, setParams] = useState<SimulationParams>({
    ...DEFAULT_SIMULATION_PARAMS,
    budgetCr: activeProject.totalCostCr || 124.6,
    durationMonths: activeProject.durationMonths || 24,
  });

  const [savedScenarios, setSavedScenarios] = useState<
    Array<{
      id: string;
      name: string;
      date: string;
      params: SimulationParams;
      costRisk: number;
      scheduleRisk: number;
      overall: string;
    }>
  >([
    {
      id: 'scen-1',
      name: 'Pessimistic: Monsoon Surge + Steel Price Spike (+15%)',
      date: 'Yesterday',
      params: {
        ...DEFAULT_SIMULATION_PARAMS,
        materialCostChangePct: 15,
        rainfallExposurePct: 90,
        contingencyPct: 2.5,
      },
      costRisk: 88,
      scheduleRisk: 94,
      overall: 'critical',
    },
    {
      id: 'scen-2',
      name: 'Recommended: Contingency Raised to 5% + Fast-tracked Procurement',
      date: '2 days ago',
      params: {
        ...DEFAULT_SIMULATION_PARAMS,
        contingencyPct: 5.0,
        procurementDelayWeeks: 1,
        rainfallExposurePct: 50,
      },
      costRisk: 52,
      scheduleRisk: 62,
      overall: 'medium',
    },
  ]);

  const [scenarioNameInput, setScenarioNameInput] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);

  // Compute live mathematical simulation
  const result = riskService.calculateScenario(DEFAULT_SIMULATION_PARAMS, params);

  const handleReset = () => {
    setParams({
      ...DEFAULT_SIMULATION_PARAMS,
      budgetCr: activeProject.totalCostCr || 124.6,
      durationMonths: activeProject.durationMonths || 24,
    });
    addToast('info', 'Simulation Reset', 'Parameters restored to DPR baseline.');
  };

  const handleSaveScenario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scenarioNameInput.trim()) return;

    const newScenario = {
      id: 'scen-' + Date.now(),
      name: scenarioNameInput.trim(),
      date: 'Just now',
      params: { ...params },
      costRisk: result.simulatedCostRisk,
      scheduleRisk: result.simulatedScheduleRisk,
      overall: result.simulatedOverallRisk,
    };

    setSavedScenarios([newScenario, ...savedScenarios]);
    setShowSaveModal(false);
    setScenarioNameInput('');
    addToast('success', 'Scenario Saved', `Added "${newScenario.name}" to register.`);
  };

  const loadScenario = (s: (typeof savedScenarios)[0]) => {
    setParams({ ...s.params });
    addToast('info', 'Scenario Loaded', `Applied assumptions: ${s.name}`);
  };

  const COMPARISON_CHART_DATA = [
    {
      metric: 'Cost Risk %',
      'Baseline DPR': result.baseCostRisk,
      'Simulated Scenario': result.simulatedCostRisk,
    },
    {
      metric: 'Schedule Risk %',
      'Baseline DPR': result.baseScheduleRisk,
      'Simulated Scenario': result.simulatedScheduleRisk,
    },
    {
      metric: 'Health Score / 100',
      'Baseline DPR': result.baseHealthScore,
      'Simulated Scenario': result.simulatedHealthScore,
    },
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display flex items-center gap-2.5">
            <SlidersHorizontal className="h-7 w-7 text-blue-600 dark:text-cyan-400" />
            What-if Project Simulator
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Explore how modifications to project duration, contingency buffers, raw materials, and monsoon windows impact overall project viability.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer shadow-xs"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Baseline
          </button>
          <button
            type="button"
            onClick={() => setShowSaveModal(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition cursor-pointer"
          >
            <Save className="h-3.5 w-3.5" />
            Save Scenario
          </button>
        </div>
      </div>

      {/* 2-PANEL LAYOUT: SLIDERS ON LEFT (5 COLS), LIVE RESULTS ON RIGHT (7 COLS) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* LEFT PANEL: INTERACTIVE PARAMETER SLIDERS (5 COLS) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-[#0c1427] lg:col-span-5 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Project Assumption Variables
            </span>
            <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/60 px-2 py-0.5 rounded">
              Active Reactive Model
            </span>
          </div>

          {/* SLIDER 1: PROJECT DURATION */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="duration-slider" className="font-semibold text-slate-800 dark:text-slate-200">
                Project Target Duration
              </label>
              <span className="font-mono font-bold text-blue-600 dark:text-cyan-400 text-sm">
                {params.durationMonths} Months
              </span>
            </div>
            <input
              id="duration-slider"
              type="range"
              min="12"
              max="48"
              step="1"
              value={params.durationMonths}
              onChange={(e) =>
                setParams({ ...params, durationMonths: parseInt(e.target.value) })
              }
              className="w-full accent-blue-600 h-2 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>12m (Aggressive)</span>
              <span>Baseline: 24m</span>
              <span>48m (Extended)</span>
            </div>
          </div>

          {/* SLIDER 2: PROJECT BUDGET */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="budget-slider" className="font-semibold text-slate-800 dark:text-slate-200">
                Sanctioned Capital Budget
              </label>
              <span className="font-mono font-bold text-blue-600 dark:text-cyan-400 text-sm">
                ₹{params.budgetCr} Cr
              </span>
            </div>
            <input
              id="budget-slider"
              type="range"
              min="80"
              max="200"
              step="1"
              value={params.budgetCr}
              onChange={(e) =>
                setParams({ ...params, budgetCr: parseFloat(e.target.value) })
              }
              className="w-full accent-blue-600 h-2 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>₹80 Cr (Restricted)</span>
              <span>Baseline: ₹124.6 Cr</span>
              <span>₹200 Cr</span>
            </div>
          </div>

          {/* SLIDER 3: MATERIAL COST CHANGE */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="material-slider" className="font-semibold text-slate-800 dark:text-slate-200">
                Raw Material Price Fluctuation (Bitumen/Steel)
              </label>
              <span
                className={`font-mono font-bold text-sm ${
                  params.materialCostChangePct > 0
                    ? 'text-rose-600 dark:text-rose-400'
                    : params.materialCostChangePct < 0
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                {params.materialCostChangePct > 0 ? `+${params.materialCostChangePct}%` : `${params.materialCostChangePct}%`}
              </span>
            </div>
            <input
              id="material-slider"
              type="range"
              min="-20"
              max="40"
              step="1"
              value={params.materialCostChangePct}
              onChange={(e) =>
                setParams({ ...params, materialCostChangePct: parseInt(e.target.value) })
              }
              className="w-full accent-blue-600 h-2 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>-20% Deflation</span>
              <span>0% Flat</span>
              <span>+40% Price Shock</span>
            </div>
          </div>

          {/* SLIDER 4: PHYSICAL CONTINGENCY % */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="contingency-slider" className="font-semibold text-slate-800 dark:text-slate-200">
                Physical Contingency Buffer Allocation
              </label>
              <span className="font-mono font-bold text-blue-600 dark:text-cyan-400 text-sm">
                {params.contingencyPct}% (₹{((params.contingencyPct / 100) * params.budgetCr).toFixed(1)} Cr)
              </span>
            </div>
            <input
              id="contingency-slider"
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={params.contingencyPct}
              onChange={(e) =>
                setParams({ ...params, contingencyPct: parseFloat(e.target.value) })
              }
              className="w-full accent-blue-600 h-2 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>1.0% (Deficit)</span>
              <span>Baseline: 2.5%</span>
              <span>10.0% (Resilient)</span>
            </div>
          </div>

          {/* SLIDER 5: RAINFALL EXPOSURE % */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="rainfall-slider" className="font-semibold text-slate-800 dark:text-slate-200">
                Monsoon Work Schedule Overlap
              </label>
              <span className="font-mono font-bold text-blue-600 dark:text-cyan-400 text-sm">
                {params.rainfallExposurePct}%
              </span>
            </div>
            <input
              id="rainfall-slider"
              type="range"
              min="10"
              max="100"
              step="5"
              value={params.rainfallExposurePct}
              onChange={(e) =>
                setParams({ ...params, rainfallExposurePct: parseInt(e.target.value) })
              }
              className="w-full accent-blue-600 h-2 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>10% Dry Window</span>
              <span>Baseline: 75%</span>
              <span>100% Monsoon Halt</span>
            </div>
          </div>

          {/* SLIDER 6: PROCUREMENT DELAY */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="procurement-slider" className="font-semibold text-slate-800 dark:text-slate-200">
                Machinery & Sensor Paver Logistics Delay
              </label>
              <span className="font-mono font-bold text-blue-600 dark:text-cyan-400 text-sm">
                {params.procurementDelayWeeks} Weeks
              </span>
            </div>
            <input
              id="procurement-slider"
              type="range"
              min="0"
              max="16"
              step="1"
              value={params.procurementDelayWeeks}
              onChange={(e) =>
                setParams({ ...params, procurementDelayWeeks: parseInt(e.target.value) })
              }
              className="w-full accent-blue-600 h-2 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0 wks (On-time)</span>
              <span>Baseline: 4 wks</span>
              <span>16 wks (Severe)</span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: LIVE RISK RESULTS & COMPARISONS (7 COLS) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-[#0c1427] lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Live Simulation Output & Forecast
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Real-time risk sensitivity calculation based on adjusted engineering parameters
              </p>
            </div>
            <RiskBadge severity={result.simulatedOverallRisk} size="md" showPulse />
          </div>

          {/* LIVE RISK SHIFT COMPARISON CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* COST RISK CARD */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 p-3.5 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Cost Risk Exposure
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-mono text-slate-400 line-through">
                  {result.baseCostRisk}%
                </span>
                <ArrowRight className="h-3 w-3 text-slate-400" />
                <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
                  {result.simulatedCostRisk}%
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Variance: {result.simulatedCostRisk - result.baseCostRisk > 0 ? '+' : ''}
                {result.simulatedCostRisk - result.baseCostRisk}% delta
              </p>
            </div>

            {/* SCHEDULE RISK CARD */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 p-3.5 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Schedule Risk Exposure
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-mono text-slate-400 line-through">
                  {result.baseScheduleRisk}%
                </span>
                <ArrowRight className="h-3 w-3 text-slate-400" />
                <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
                  {result.simulatedScheduleRisk}%
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Variance: {result.simulatedScheduleRisk - result.baseScheduleRisk > 0 ? '+' : ''}
                {result.simulatedScheduleRisk - result.baseScheduleRisk}% delta
              </p>
            </div>

            {/* OVERALL HEALTH CARD */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 p-3.5 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                DPR Health Score
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-mono text-slate-400 line-through">
                  {result.baseHealthScore}
                </span>
                <ArrowRight className="h-3 w-3 text-slate-400" />
                <span className="text-2xl font-extrabold font-mono text-blue-600 dark:text-cyan-400">
                  {result.simulatedHealthScore}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                {result.simulatedOverallRisk.toUpperCase()} Severity Status
              </p>
            </div>
          </div>

          {/* PROJECTED FINANCIAL & TIMELINE IMPACT */}
          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 dark:border-blue-900/40 dark:bg-blue-950/20 grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-500 dark:text-slate-400 font-medium">Projected Cost Variance:</span>
              <div className="text-lg font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                {result.projectedCostVarianceCr > 0 ? `+₹${result.projectedCostVarianceCr} Cr` : `₹0.0 Cr`}
              </div>
              <span className="text-[10px] text-slate-500">Beyond initial budget</span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 font-medium">Projected Timeline Shift:</span>
              <div className="text-lg font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                +{result.projectedDelayMonths} Months Delay
              </div>
              <span className="text-[10px] text-slate-500">Based on critical path analysis</span>
            </div>
          </div>

          {/* SIDE-BY-SIDE BAR COMPARISON CHART */}
          <div className="space-y-2 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Current Baseline vs. Simulated Scenario
            </h3>
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={COMPARISON_CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="metric" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#f8fafc',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="Baseline DPR" fill="#64748b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Simulated Scenario" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* KEY RISK DRIVERS ANALYSIS */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Active Sensitivity Drivers:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {result.keyDrivers.map((driver, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 p-2.5 text-xs flex items-center justify-between"
                >
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {driver.driver}
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{driver.effect}</p>
                  </div>
                  <span
                    className={`font-mono font-bold text-xs ${
                      driver.delta > 0
                        ? 'text-rose-600 dark:text-rose-400'
                        : driver.delta < 0
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {driver.delta > 0 ? `+${driver.delta}%` : `${driver.delta}%`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SAVED SCENARIOS REGISTER */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#0c1427] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookmarkCheck className="h-4 w-4 text-blue-600 dark:text-cyan-400" />
              Saved Simulation Scenarios ({savedScenarios.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Load previously benchmarked sensitivity assumptions for EFC presentation
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {savedScenarios.map((scen) => (
            <div
              key={scen.id}
              className="rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 hover:border-blue-300 dark:hover:border-blue-800 transition bg-slate-50/40 dark:bg-slate-900/30 flex items-center justify-between"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <RiskBadge severity={scen.overall} size="sm" />
                  <span className="text-[10px] text-slate-400 font-mono">{scen.date}</span>
                </div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {scen.name}
                </h3>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  Cost Risk: {scen.costRisk}% • Sched Risk: {scen.scheduleRisk}%
                </div>
              </div>

              <button
                type="button"
                onClick={() => loadScenario(scen)}
                className="inline-flex items-center gap-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:bg-blue-50 dark:hover:bg-slate-700 transition cursor-pointer shrink-0 ml-3"
              >
                Apply
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SAVE SCENARIO MODAL */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <form
            onSubmit={handleSaveScenario}
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-[#0c1427] space-y-4"
          >
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Save Simulation Scenario
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Provide a descriptive label for this set of project assumptions:
            </p>

            <input
              type="text"
              required
              placeholder="e.g., Extended Monsoon Window + 5% Contingency Buffer"
              value={scenarioNameInput}
              onChange={(e) => setScenarioNameInput(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowSaveModal(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition cursor-pointer"
              >
                Save to Register
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
