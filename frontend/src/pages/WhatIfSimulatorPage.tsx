import React, {
  useMemo,
  useState,
} from "react";

import {
  Calculator,
  TrendingUp,
} from "lucide-react";

import {
  useProject,
} from "../context/ProjectContext";

export const WhatIfSimulatorPage: React.FC =
  () => {
    const {
      activeProject,
      riskAssessment,
      addToast,
    } =
      useProject();

    const [
      costChange,
      setCostChange,
    ] = useState(0);

    const [
      durationChange,
      setDurationChange,
    ] = useState(0);

    const simulation =
      useMemo(() => {
        const baseCost =
          activeProject.totalCostCr ||
          0;

        const baseDuration =
          activeProject.durationMonths ||
          12;

        const simulatedCost =
          baseCost *
          (1 +
            costChange /
              100);

        const simulatedDuration =
          baseDuration *
          (1 +
            durationChange /
              100);

        const riskAdjustment =
          Math.max(
            0,
            durationChange
          ) *
          0.25;

        const simulatedRisk =
          Math.min(
            100,
            Math.max(
              0,
              riskAssessment.riskScore +
                riskAdjustment
            )
          );

        return {
          simulatedCost,

          simulatedDuration,

          simulatedRisk,
        };
      }, [
        activeProject.totalCostCr,
        activeProject.durationMonths,
        costChange,
        durationChange,
        riskAssessment.riskScore,
      ]);

    function runSimulation() {
      addToast(
        "What-if scenario calculated.",
        "success"
      );
    }

    return (
      <div className="space-y-6">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-extrabold text-slate-900 dark:text-white">
            <Calculator className="h-7 w-7 text-cyan-500" />

            What-If Simulator
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Test how changes in project cost and duration may affect risk.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* INPUTS */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#0c1427]">
            <h2 className="font-bold text-slate-900 dark:text-white">
              Scenario Inputs
            </h2>

            <div className="mt-6 space-y-6">
              <div>
                <div className="flex justify-between">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Cost Change
                  </label>

                  <span className="text-sm font-bold text-cyan-600">
                    {costChange}%
                  </span>
                </div>

                <input
                  type="range"
                  min="-30"
                  max="50"
                  value={
                    costChange
                  }
                  onChange={(
                    event
                  ) =>
                    setCostChange(
                      Number(
                        event.target
                          .value
                      )
                    )
                  }
                  className="mt-3 w-full"
                />
              </div>

              <div>
                <div className="flex justify-between">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Duration Change
                  </label>

                  <span className="text-sm font-bold text-cyan-600">
                    {
                      durationChange
                    }
                    %
                  </span>
                </div>

                <input
                  type="range"
                  min="-30"
                  max="50"
                  value={
                    durationChange
                  }
                  onChange={(
                    event
                  ) =>
                    setDurationChange(
                      Number(
                        event.target
                          .value
                      )
                    )
                  }
                  className="mt-3 w-full"
                />
              </div>

              <button
                type="button"
                onClick={
                  runSimulation
                }
                className="w-full rounded-xl bg-cyan-600 px-4 py-3 text-sm font-bold text-white hover:bg-cyan-700"
              >
                Run Simulation
              </button>
            </div>
          </div>

          {/* RESULTS */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#0c1427]">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-500" />

              <h2 className="font-bold text-slate-900 dark:text-white">
                Simulation Result
              </h2>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4">
              <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900">
                <p className="text-xs text-slate-500">
                  Simulated Cost
                </p>

                <p className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">
                  ₹
                  {
                    simulation.simulatedCost.toFixed(
                      2
                    )
                  }{" "}
                  Cr
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900">
                <p className="text-xs text-slate-500">
                  Simulated Duration
                </p>

                <p className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">
                  {
                    simulation.simulatedDuration.toFixed(
                      1
                    )
                  }{" "}
                  months
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900">
                <p className="text-xs text-slate-500">
                  Simulated Risk
                </p>

                <p className="mt-1 text-2xl font-extrabold text-red-600 dark:text-red-400">
                  {
                    simulation.simulatedRisk.toFixed(
                      1
                    )
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

export default WhatIfSimulatorPage;