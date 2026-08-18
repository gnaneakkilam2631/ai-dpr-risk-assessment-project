import React, { useEffect, useMemo, useState } from "react";
import {
  FileSearch,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Search,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

import { useProject } from "../context/ProjectContext";
import { RiskBadge } from "../components/common/RiskBadge";

type EvidenceFinding = {
  id: string;
  title: string;
  page: number;
  section: string;
  severity: "critical" | "high" | "medium" | "low";
  category: string;
  findingSummary: string;
  quotedText: string;
  bodyParagraphs: string[];
};

const EVIDENCE_REGISTRY: EvidenceFinding[] = [
  {
    id: "ev-1",
    title: "Project Budget Mismatch",
    page: 94,
    section: "Section 7.2 & Table 7.4",
    severity: "critical",
    category: "Financial",
    findingSummary:
      "The DPR contains conflicting project cost figures between the executive summary and the detailed cost abstract.",
    quotedText:
      "Detailed cost abstract and priced Bill of Quantities contain the consolidated capital cost used for appraisal.",
    bodyParagraphs: [
      "The detailed financial appraisal contains the consolidated project cost.",
      "The cost should be reconciled with the executive summary before final approval.",
      "Any difference should be supported by a revised financing proposal.",
    ],
  },

  {
    id: "ev-2",
    title: "Schedule and Monsoon Clash",
    page: 62,
    section: "Section 6.3",
    severity: "high",
    category: "Schedule",
    findingSummary:
      "The implementation schedule contains activities that may overlap with adverse weather conditions.",
    quotedText:
      "Bituminous surfacing operations are scheduled during the identified implementation window.",
    bodyParagraphs: [
      "The execution schedule should be reviewed against seasonal weather constraints.",
      "Critical path activities should include suitable contingency.",
    ],
  },

  {
    id: "ev-3",
    title: "Technical Foundation Conflict",
    page: 88,
    section: "Section 5.8",
    severity: "high",
    category: "Technical",
    findingSummary:
      "The technical design should be checked against the latest geotechnical investigation.",
    quotedText:
      "Foundation design parameters should be consistent with the geotechnical investigation findings.",
    bodyParagraphs: [
      "Review the foundation assumptions.",
      "Confirm that the final design reflects the actual soil and rock conditions.",
    ],
  },

  {
    id: "ev-4",
    title: "Environmental Clearance Variance",
    page: 112,
    section: "Section 8.4",
    severity: "medium",
    category: "Environmental",
    findingSummary:
      "Environmental land diversion figures should be reconciled with the statutory application.",
    quotedText:
      "The environmental chapter records the land diversion information used for appraisal.",
    bodyParagraphs: [
      "Reconcile the DPR value with the statutory application.",
      "Update the environmental management and financial provisions if required.",
    ],
  },

  {
    id: "ev-5",
    title: "Beneficiary Population Variance",
    page: 132,
    section: "Annexure IX",
    severity: "low",
    category: "Social",
    findingSummary:
      "Different beneficiary definitions may be used across DPR chapters.",
    quotedText:
      "Direct and indirect beneficiary populations should be clearly distinguished.",
    bodyParagraphs: [
      "Identify direct beneficiaries separately from indirect beneficiaries.",
      "Use one consistent definition throughout the DPR.",
    ],
  },
];

const MIN_PAGE = 1;
const MAX_PAGE = 148;

export const EvidenceViewerPage: React.FC = () => {
  const { activeProject, activeEvidenceTarget } = useProject();

  const [selectedFinding, setSelectedFinding] =
    useState<EvidenceFinding>(EVIDENCE_REGISTRY[0]);

  const [currentPage, setCurrentPage] = useState<number>(
    EVIDENCE_REGISTRY[0].page
  );

  const [zoomLevel, setZoomLevel] = useState<number>(100);

  const [searchQuery, setSearchQuery] = useState<string>("");

  /*
   * Resolve the document name without using ProjectDocument.name.
   *
   * Different versions of the ProjectContext may store the document
   * under different fields, so we safely inspect the available object.
   */
  const documentName = useMemo(() => {
    const dprFile = activeProject?.dprFile as
      | Record<string, unknown>
      | null
      | undefined;

    if (dprFile) {
      const possibleNames = [
        dprFile.fileName,
        dprFile.filename,
        dprFile.originalName,
        dprFile.originalFilename,
        dprFile.documentName,
        dprFile.title,
      ];

      const foundName = possibleNames.find(
        (value): value is string =>
          typeof value === "string" && value.trim().length > 0
      );

      if (foundName) {
        return foundName;
      }
    }

    const storedName = localStorage.getItem("active_document_name");

    if (storedName && storedName.trim().length > 0) {
      return storedName;
    }

    return "No DPR uploaded";
  }, [activeProject]);

  /*
   * Deep-link from ContradictionsPage.
   */
  useEffect(() => {
    if (!activeEvidenceTarget) {
      return;
    }

    const targetSection =
      activeEvidenceTarget.section?.toLowerCase() ?? "";

    const targetTitle =
      activeEvidenceTarget.title?.toLowerCase() ?? "";

    const match = EVIDENCE_REGISTRY.find((finding) => {
      const pageMatches =
        finding.page === activeEvidenceTarget.page;

      const sectionMatches =
        targetSection.length > 0 &&
        finding.section.toLowerCase().includes(targetSection);

      const titleMatches =
        targetTitle.length > 0 &&
        finding.title.toLowerCase().includes(targetTitle);

      return pageMatches || sectionMatches || titleMatches;
    });

    if (match) {
      setSelectedFinding(match);
      setCurrentPage(match.page);
    } else {
      setCurrentPage(
        Math.min(
          MAX_PAGE,
          Math.max(MIN_PAGE, activeEvidenceTarget.page)
        )
      );
    }
  }, [activeEvidenceTarget]);

  /*
   * Select finding.
   */
  const handleSelectFinding = (finding: EvidenceFinding) => {
    setSelectedFinding(finding);
    setCurrentPage(finding.page);
  };

  /*
   * Change page.
   */
  const handlePreviousPage = () => {
    setCurrentPage((page) =>
      Math.max(MIN_PAGE, page - 1)
    );
  };

  const handleNextPage = () => {
    setCurrentPage((page) =>
      Math.min(MAX_PAGE, page + 1)
    );
  };

  /*
   * Zoom.
   */
  const handleZoom = (delta: number) => {
    setZoomLevel((previous) =>
      Math.min(
        150,
        Math.max(75, previous + delta)
      )
    );
  };

  /*
   * Search findings.
   */
  const filteredFindings = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return EVIDENCE_REGISTRY;
    }

    return EVIDENCE_REGISTRY.filter((finding) => {
      return (
        finding.title.toLowerCase().includes(query) ||
        finding.section.toLowerCase().includes(query) ||
        finding.category.toLowerCase().includes(query) ||
        finding.findingSummary.toLowerCase().includes(query) ||
        finding.quotedText.toLowerCase().includes(query)
      );
    });
  }, [searchQuery]);

  return (
    <div className="space-y-4">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col gap-4 border-b border-slate-200 pb-3 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
            <FileSearch className="h-6 w-6 text-blue-600 dark:text-cyan-400" />

            Split-Screen Document Evidence Viewer
          </h1>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Corroborate AI findings against the uploaded DPR.
          </p>
        </div>

        {/* =================================================
            CONTROLS
        ================================================== */}

        <div className="flex flex-wrap items-center gap-2">
          {/* SEARCH */}

          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              placeholder="Search findings..."
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(event.target.value)
              }
              className="h-8 rounded-lg border border-slate-200 bg-white pl-8 pr-3 text-xs text-slate-800 outline-none focus:border-blue-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </div>

          {/* PAGE CONTROLS */}

          <div className="flex items-center rounded-lg border border-slate-200 bg-white p-0.5 dark:border-slate-700 dark:bg-slate-900">
            <button
              type="button"
              onClick={handlePreviousPage}
              disabled={currentPage <= MIN_PAGE}
              className="p-1 text-slate-500 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:text-white"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <span className="px-2 font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
              Page {currentPage}
            </span>

            <button
              type="button"
              onClick={handleNextPage}
              disabled={currentPage >= MAX_PAGE}
              className="p-1 text-slate-500 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:text-white"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* ZOOM CONTROLS */}

          <div className="flex items-center rounded-lg border border-slate-200 bg-white p-0.5 dark:border-slate-700 dark:bg-slate-900">
            <button
              type="button"
              onClick={() => handleZoom(-10)}
              disabled={zoomLevel <= 75}
              className="p-1 text-slate-500 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:text-white"
              aria-label="Zoom out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>

            <span className="px-1.5 font-mono text-xs text-slate-600 dark:text-slate-400">
              {zoomLevel}%
            </span>

            <button
              type="button"
              onClick={() => handleZoom(10)}
              disabled={zoomLevel >= 150}
              className="p-1 text-slate-500 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:text-white"
              aria-label="Zoom in"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================
          SPLIT SCREEN
      ====================================================== */}

      <div className="grid h-[calc(100vh-210px)] grid-cols-1 gap-6 lg:grid-cols-12">
        {/* ===================================================
            LEFT PANEL
        ==================================================== */}

        <div className="flex flex-col space-y-4 overflow-y-auto pr-1 lg:col-span-5">
          {/* ACTIVE FINDING */}

          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#0c1427]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <RiskBadge
                  severity={selectedFinding.severity}
                  size="sm"
                  showPulse={selectedFinding.severity === "critical"}
                />

                <span className="text-xs font-mono font-bold uppercase text-slate-500">
                  {selectedFinding.category} Issue
                </span>
              </div>

              <span className="rounded border border-blue-200 bg-blue-50 px-2 py-0.5 font-mono text-xs font-bold text-blue-600 dark:border-blue-900 dark:bg-blue-950 dark:text-cyan-400">
                Page {selectedFinding.page}
              </span>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {selectedFinding.title}
              </h2>

              <p className="mt-0.5 font-mono text-xs text-slate-400">
                Location: {selectedFinding.section}
              </p>
            </div>

            {/* AI SUMMARY */}

            <div>
              <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <Sparkles className="h-3.5 w-3.5 text-cyan-500" />

                AI Corroboration Summary
              </span>

              <p className="mt-1 rounded-xl border border-slate-200/80 bg-slate-50 p-3 text-xs leading-relaxed text-slate-700 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300">
                {selectedFinding.findingSummary}
              </p>
            </div>

            {/* EXCERPT */}

            <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-3.5 dark:border-amber-900/40 dark:bg-amber-950/20">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                Extracted Document Excerpt
              </span>

              <div className="mt-1 font-serif text-xs italic leading-relaxed text-slate-800 dark:text-slate-200">
                "{selectedFinding.quotedText}"
              </div>
            </div>
          </div>

          {/* FINDING LIST */}

          <div className="flex-1 space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#0c1427]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Audit Findings ({filteredFindings.length})
              </span>

              {searchQuery.trim() && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 dark:text-cyan-400"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="space-y-2">
              {filteredFindings.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 p-5 text-center text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  No findings match your search.
                </div>
              ) : (
                filteredFindings.map((finding) => (
                  <button
                    key={finding.id}
                    type="button"
                    onClick={() =>
                      handleSelectFinding(finding)
                    }
                    className={`w-full rounded-xl border p-3 text-left text-xs transition ${
                      selectedFinding.id === finding.id
                        ? "border-blue-500 bg-blue-50/70 dark:bg-blue-950/60"
                        : "border-slate-200/80 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
                    }`}
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <RiskBadge
                        severity={finding.severity}
                        size="sm"
                      />

                      <span className="font-mono text-[11px] text-slate-400">
                        Page {finding.page}
                      </span>
                    </div>

                    <div className="font-bold text-slate-900 dark:text-white">
                      {finding.title}
                    </div>

                    <div className="mt-0.5 truncate text-[11px] text-slate-500 dark:text-slate-400">
                      {finding.section}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ===================================================
            RIGHT DOCUMENT PANEL
        ==================================================== */}

        <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-300 bg-slate-200/80 p-4 shadow-inner dark:border-slate-800 dark:bg-slate-950 lg:col-span-7">
          {/* DOCUMENT TOOLBAR */}

          <div className="flex items-center justify-between gap-3 pb-2 font-mono text-xs text-slate-500">
            <span
              className="truncate"
              title={documentName}
            >
              DOCUMENT_STREAM: {documentName}
            </span>

            <span className="shrink-0">
              ZOOM: {zoomLevel}%
            </span>
          </div>

          {/* DOCUMENT VIEW */}

          <div className="flex-1 overflow-auto py-4">
            <div
              style={{
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: "top center",
                marginBottom:
                  zoomLevel > 100
                    ? `${(zoomLevel - 100) * 5}px`
                    : undefined,
              }}
              className="mx-auto min-h-[750px] w-full max-w-2xl space-y-6 rounded-sm border border-slate-300 bg-white p-8 font-serif text-slate-900 shadow-2xl transition-transform duration-150 sm:p-12"
            >
              {/* DOCUMENT HEADER */}

              <div className="space-y-1 border-b-2 border-slate-800 pb-4 text-center">
                <div className="font-sans text-[10px] font-bold uppercase tracking-widest text-slate-600">
                  DPR INTELLIGENCE
                </div>

                <div className="font-sans text-xs font-semibold uppercase text-slate-800">
                  Detailed Project Report
                </div>

                <div className="font-mono text-[10px] text-slate-500">
                  PROJECT: {activeProject?.name ?? "No Active Project"}
                </div>

                <div className="font-mono text-[10px] text-slate-500">
                  DOCUMENT: {documentName}
                </div>
              </div>

              {/* PAGE INFORMATION */}

              <div className="flex items-center justify-between border-b border-slate-300 pb-2 font-sans text-xs text-slate-500">
                <span>
                  Section {selectedFinding.section}
                </span>

                <span>
                  Page {currentPage}
                </span>
              </div>

              {/* FINDING TITLE */}

              <h2 className="text-xl font-bold">
                {selectedFinding.title}
              </h2>

              {/* BODY */}

              {selectedFinding.bodyParagraphs.map(
                (paragraph, index) => (
                  <p
                    key={`${selectedFinding.id}-paragraph-${index}`}
                    className="text-sm leading-7"
                  >
                    {paragraph}
                  </p>
                )
              )}

              {/* HIGHLIGHTED EVIDENCE */}

              <div className="border-l-4 border-amber-500 bg-amber-50 p-4 text-sm italic leading-7">
                {selectedFinding.quotedText}
              </div>

              {/* WARNING */}

              <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 font-sans text-xs text-red-700">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />

                <span>
                  This page is an evidence representation
                  for the selected finding. Review the
                  original DPR before final statutory
                  decisions.
                </span>
              </div>

              {/* FOOTER */}

              <div className="border-t border-slate-300 pt-4 text-center font-mono text-[10px] text-slate-400">
                END OF EVIDENCE VIEW
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvidenceViewerPage;