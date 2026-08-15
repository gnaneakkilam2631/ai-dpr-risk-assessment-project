import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Cpu,
  Layers,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
  Settings,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { Project } from '../types';

const PROCESSING_STAGES = [
  { id: 1, name: 'Reading document & extracting OCR text', detail: 'Parsing 148 pages, engineering drawings, and metadata tables...' },
  { id: 2, name: 'Extracting project information & BoQ rates', detail: 'Identifying chainages, rate abstracts, and financial tables...' },
  { id: 3, name: 'Building project knowledge graph', detail: 'Cross-referencing narrative statements against priced schedules...' },
  { id: 4, name: 'Checking DPR completeness & IRC compliance', detail: 'Validating against MoRTH 2024 & NEC appraisal standard checklists...' },
  { id: 5, name: 'Detecting contradictions & discrepancies', detail: 'Evaluating cost totals, environmental hectare claims, and timelines...' },
  { id: 6, name: 'Running multi-dimensional risk models', detail: 'Simulating weather exposure, geotechnical instability, and cost sensitivity...' },
  { id: 7, name: 'Generating AI mitigation recommendations', detail: 'Formulating actionable countermeasures with expected impact...' },
  { id: 8, name: 'Preparing comprehensive report & evidence links', detail: 'Synthesizing health score 82/100 and final appraisal dossier...' },
];

export const UploadDprPage: React.FC = () => {
  const { addNewUploadedProject, addToast } = useProject();
  const navigate = useNavigate();

  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: string;
    pages: number;
    type: string;
    projectName: string;
    state: string;
    cost: number;
  } | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [config, setConfig] = useState({
    quality: true,
    risk: true,
    contradiction: true,
    compliance: true,
    financial: true,
    schedule: true,
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [progressPct, setProgressPct] = useState(0);
  const [telemetryLogs, setTelemetryLogs] = useState<string[]>([]);

  // Simulation timer for 8 stages
  useEffect(() => {
    let interval: any;
    if (isProcessing) {
      interval = setInterval(() => {
        setProgressPct((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          const next = prev + 2;
          const stageIndex = Math.min(
            PROCESSING_STAGES.length - 1,
            Math.floor((next / 100) * PROCESSING_STAGES.length)
          );
          setCurrentStageIndex(stageIndex);

          if (next % 14 === 0) {
            const currentStage = PROCESSING_STAGES[stageIndex];
            setTelemetryLogs((logs) => [
              `[${new Date().toLocaleTimeString()}] Stage ${stageIndex + 1}: ${currentStage.name}`,
              ...logs.slice(0, 5),
            ]);
          }

          return next;
        });
      }, 90);
    }
    return () => clearInterval(interval);
  }, [isProcessing]);

  // Navigate when processing hits 100%
  useEffect(() => {
    if (progressPct >= 100 && isProcessing) {
      setTimeout(() => {
        setIsProcessing(false);
        const newProj: Project = {
          id: 'proj-' + Date.now(),
          name: uploadedFile?.projectName || 'Rural Connectivity Improvement Project (Phase IV)',
          code: 'DPR-NER-2025-084',
          location: 'Papum Pare & Lower Subansiri Districts',
          state: uploadedFile?.state || 'Arunachal Pradesh',
          sector: 'Roads & Highways',
          implementingAgency: 'Public Works Department (Highway Division)',
          totalCostCr: uploadedFile?.cost || 124.6,
          approvedBudgetCr: 110.0,
          durationMonths: 24,
          startDate: '2025-10-01',
          expectedCompletion: '2027-09-30',
          beneficiariesCount: 84500,
          healthScore: 82,
          overallRisk: 'high',
          costRiskPct: 73,
          scheduleRiskPct: 81,
          lastAnalyzed: 'Just now',
          status: 'Flagged Issues',
          dprFile: {
            name: uploadedFile?.name || 'DPR_Arunachal_Rural_Connect_v2.4_Final.pdf',
            sizeMb: 18.4,
            pages: uploadedFile?.pages || 148,
            uploadedAt: 'Just now',
            version: 'v2.4-Rev3',
          },
        };
        addNewUploadedProject(newProj);
        navigate('/dpr-analysis');
      }, 800);
    }
  }, [progressPct, isProcessing]);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setUploadedFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        pages: 148,
        type: file.name.endsWith('.docx') ? 'DOCX' : 'PDF',
        projectName: 'Rural Connectivity Improvement Project (Phase IV)',
        state: 'Arunachal Pradesh',
        cost: 124.6,
      });
      addToast('success', 'Document Uploaded', `${file.name} ready for analysis.`);
    }
  };

  const handleSelectSample = (sampleType: 'arunachal' | 'assam' | 'sikkim') => {
    if (sampleType === 'arunachal') {
      setUploadedFile({
        name: 'DPR_Arunachal_Rural_Connect_v2.4_Final.pdf',
        size: '18.4 MB',
        pages: 148,
        type: 'PDF',
        projectName: 'Rural Connectivity Improvement Project (Phase IV)',
        state: 'Arunachal Pradesh',
        cost: 124.6,
      });
    } else if (sampleType === 'assam') {
      setUploadedFile({
        name: 'Assam_PHED_WaterSupply_Cluster7_DPR.pdf',
        size: '14.2 MB',
        pages: 116,
        type: 'PDF',
        projectName: 'Integrated Jal Jeevan Water Supply Project',
        state: 'Assam',
        cost: 88.4,
      });
    } else {
      setUploadedFile({
        name: 'Sikkim_HighAltitude_Corridor_DPR.pdf',
        size: '36.8 MB',
        pages: 290,
        type: 'PDF',
        projectName: 'High-Altitude Mountain Bypass & Tunnel Corridor',
        state: 'Sikkim',
        cost: 342.8,
      });
    }
    addToast('info', 'Sample DPR Selected', 'Preloaded official infrastructure DPR template.');
  };

  const startAnalysis = () => {
    if (!uploadedFile) {
      addToast('warning', 'No File Selected', 'Please upload or select a DPR file first.');
      return;
    }
    setIsProcessing(true);
    setProgressPct(0);
    setCurrentStageIndex(0);
    setTelemetryLogs([`[${new Date().toLocaleTimeString()}] Initiating AI-DPR Guardian Pipeline...`]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
          Analyze a New DPR
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Upload a Detailed Project Report and let AI evaluate quality, consistency, and project risk.
        </p>
      </div>

      {/* SAMPLE QUICK PICKS */}
      <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-3.5 dark:border-blue-950 dark:bg-blue-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 dark:text-blue-200">
          <Sparkles className="h-4 w-4 text-blue-600 dark:text-cyan-400" />
          <span>Quick Evaluation Samples (Indian Infrastructure DPRs):</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleSelectSample('arunachal')}
            className="rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-slate-800 shadow-xs hover:bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 cursor-pointer"
          >
            Arunachal Road DPR (₹124.6 Cr)
          </button>
          <button
            type="button"
            onClick={() => handleSelectSample('assam')}
            className="rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-slate-800 shadow-xs hover:bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 cursor-pointer"
          >
            Assam Water DPR (₹88.4 Cr)
          </button>
          <button
            type="button"
            onClick={() => handleSelectSample('sikkim')}
            className="rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-slate-800 shadow-xs hover:bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 cursor-pointer"
          >
            Sikkim Tunnel DPR (₹342.8 Cr)
          </button>
        </div>
      </div>

      {!isProcessing ? (
        <div className="space-y-6">
          {/* DRAG & DROP ZONE */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileDrop}
            className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all ${
              isDragging
                ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20'
                : 'border-slate-300 bg-white hover:border-slate-400 dark:border-slate-700 dark:bg-[#0c1427] dark:hover:border-slate-600'
            }`}
          >
            <input
              type="file"
              id="file-upload"
              accept=".pdf,.docx"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const file = e.target.files[0];
                  setUploadedFile({
                    name: file.name,
                    size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
                    pages: 148,
                    type: file.name.endsWith('.docx') ? 'DOCX' : 'PDF',
                    projectName: 'Rural Connectivity Improvement Project (Phase IV)',
                    state: 'Arunachal Pradesh',
                    cost: 124.6,
                  });
                  addToast('success', 'File Selected', `${file.name}`);
                }
              }}
            />

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-cyan-400 mb-4 shadow-inner">
              <UploadCloud className="h-8 w-8" />
            </div>

            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Drag & drop your DPR here
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              or{' '}
              <label
                htmlFor="file-upload"
                className="font-semibold text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer"
              >
                browse files
              </label>{' '}
              from your system
            </p>

            <div className="mt-4 flex items-center gap-3 text-[11px] font-medium text-slate-400">
              <span className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 font-mono">
                PDF / DOCX formats supported
              </span>
              <span>•</span>
              <span>Max file size: 150 MB (Up to 500 pages)</span>
            </div>
          </div>

          {/* UPLOADED FILE CARD */}
          {uploadedFile && (
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-[#0c1427]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400 font-mono font-bold text-xs">
                    {uploadedFile.type}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {uploadedFile.name}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                      <span>{uploadedFile.size}</span>
                      <span>•</span>
                      <span>{uploadedFile.pages} Pages Indexed</span>
                      <span>•</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Ready for Analysis
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                    Scope: ₹{uploadedFile.cost} Cr ({uploadedFile.state})
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ANALYSIS CONFIGURATION CHECKBOXES */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#0c1427]">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
              <Settings className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              AI Intelligence Configuration Modules
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { id: 'quality', label: 'Quality Assessment', desc: 'MoRTH / CPWD conformance' },
                { id: 'risk', label: 'Risk Prediction', desc: 'Probability & cost exposure' },
                { id: 'contradiction', label: 'Contradiction Detection', desc: 'Cross-chapter reconciliation' },
                { id: 'compliance', label: 'Compliance Analysis', desc: 'Forest, EIA & Land clearances' },
                { id: 'financial', label: 'Financial & BoQ Analysis', desc: 'Rate abstract & contingency' },
                { id: 'schedule', label: 'Schedule Feasibility', desc: 'Monsoon clash & Gantt audit' },
              ].map((item) => (
                <label
                  key={item.id}
                  className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition ${
                    config[item.id as keyof typeof config]
                      ? 'border-blue-300 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/30'
                      : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={config[item.id as keyof typeof config]}
                    onChange={(e) =>
                      setConfig({ ...config, [item.id]: e.target.checked })
                    }
                    className="mt-0.5 h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {item.label}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {item.desc}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* START BUTTON */}
          <div className="flex items-center justify-end">
            <button
              onClick={startAnalysis}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/25 hover:from-blue-700 hover:to-cyan-700 transition cursor-pointer"
            >
              <Cpu className="h-4 w-4" />
              Start AI Analysis
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        /* PROCESSING PROGRESS SCREEN (8 STAGES) */
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl dark:border-slate-800 dark:bg-[#0c1427] space-y-6">
          {/* HEADER & OVERALL PROGRESS BAR */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                  AI Appraisal Engine Running
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                  Evaluating {uploadedFile?.name}
                </h3>
              </div>
              <span className="text-3xl font-extrabold text-blue-600 dark:text-cyan-400 font-mono">
                {progressPct}%
              </span>
            </div>

            <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 h-full rounded-full transition-all duration-200"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* 8 STAGES PROGRESS TRACKER */}
          <div className="space-y-3 pt-2">
            {PROCESSING_STAGES.map((stage, idx) => {
              const isCompleted = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;

              return (
                <div
                  key={stage.id}
                  className={`flex items-start gap-3.5 rounded-xl p-3 transition-colors ${
                    isCurrent
                      ? 'bg-blue-50 border border-blue-200 dark:bg-blue-950/60 dark:border-blue-900'
                      : isCompleted
                      ? 'text-slate-700 dark:text-slate-300'
                      : 'text-slate-400 opacity-60'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    ) : isCurrent ? (
                      <div className="h-5 w-5 rounded-full border-2 border-blue-600 border-t-transparent animate-spin dark:border-cyan-400" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center text-[10px] font-mono">
                        {stage.id}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold ${
                          isCurrent
                            ? 'text-blue-900 dark:text-cyan-200'
                            : isCompleted
                            ? 'text-slate-900 dark:text-white'
                            : 'text-slate-500'
                        }`}
                      >
                        {stage.id}. {stage.name}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-bold text-blue-600 dark:text-cyan-400 animate-pulse uppercase">
                          Processing
                        </span>
                      )}
                      {isCompleted && (
                        <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                          Complete
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {stage.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* TELEMETRY CONSOLE LOGS */}
          <div className="rounded-xl bg-slate-950 p-4 text-emerald-400 font-mono text-[11px] space-y-1 shadow-inner border border-slate-800">
            <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
              Live Knowledge Graph Stream
            </div>
            {telemetryLogs.map((log, i) => (
              <div key={i} className="leading-relaxed opacity-90 truncate">
                {log}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
