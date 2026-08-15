import React, { useState, useEffect } from 'react';
import {
  FileSearch,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Bookmark,
  Share2,
  Download,
  Building,
  Scale,
  Sparkles,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { RiskBadge } from '../components/common/RiskBadge';

interface EvidenceFindingItem {
  id: string;
  title: string;
  page: number;
  section: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  findingSummary: string;
  quotedText: string;
  pageContent: {
    chapter: string;
    subheading: string;
    bodyParagraphs: string[];
    table?: {
      title: string;
      headers: string[];
      rows: string[][];
    };
    highlightSentence: string;
  };
}

const EVIDENCE_REGISTRY: EvidenceFindingItem[] = [
  {
    id: 'ev-1',
    title: 'Project Budget Mismatch: Executive Summary vs. Priced BoQ',
    page: 94,
    section: 'Section 7.2 & Table 7.4',
    severity: 'critical',
    category: 'Financial',
    findingSummary:
      'Executive Summary Chapter 1 (Page 4) claims total outlay is ₹110.00 Cr, whereas detailed rate analysis and Priced Bill of Quantities aggregates to ₹124.60 Cr, generating an unbudgeted exposure of ₹14.60 Cr.',
    quotedText:
      'Total estimated capital expenditure for Package A, B & C aggregates to INR 124,60,00,000 (Rupees One Hundred Twenty-Four Crore Sixty Lakhs only), inclusive of 18% Goods & Services Tax and 2.5% physical contingencies.',
    pageContent: {
      chapter: 'CHAPTER 7: DETAILED FINANCIAL APPRAISAL & BILL OF QUANTITIES',
      subheading: '7.2 Cost Abstract and Capital Outlay Summary',
      bodyParagraphs: [
        'The comprehensive cost analysis has been compiled in accordance with the Central Public Works Department (CPWD) Schedule of Rates 2024 with regional hill area index adjustments (1.28 multiplier).',
        'Total estimated capital expenditure for Package A, B & C aggregates to INR 124,60,00,000 (Rupees One Hundred Twenty-Four Crore Sixty Lakhs only), inclusive of 18% Goods & Services Tax and 2.5% physical contingencies.',
        'The revised structural estimate incorporates additional cross-drainage culverts (Chainage 14+200 to 28+400) necessitated by geotechnical slope stability recommendations submitted by the Regional Soil Testing Laboratory.',
      ],
      table: {
        title: 'Table 7.4: Consolidated Abstract of Estimated Cost',
        headers: ['Item No.', 'Component / Sub-head', 'Amount (INR)', 'Weightage (%)'],
        rows: [
          ['1.0', 'Earthwork, Cutting & Embankment', '₹28,45,00,000', '22.8%'],
          ['2.0', 'Granular Sub-Base & WBM Layers', '₹34,12,00,000', '27.4%'],
          ['3.0', 'Pavement Surfacing (DBM + BC)', '₹31,80,00,000', '25.5%'],
          ['4.0', 'Cross Drainage & Major Bridges', '₹16,40,00,000', '13.2%'],
          ['5.0', 'Bio-Engineering & Retaining Walls', '₹11,43,00,000', '9.2%'],
          ['6.0', 'Physical Contingencies (2.5%)', '₹2,40,00,000', '1.9%'],
          ['TOTAL', 'Consolidated Capital Cost Outlay', '₹124,60,00,000', '100.0%'],
        ],
      },
      highlightSentence:
        'Total estimated capital expenditure for Package A, B & C aggregates to INR 124,60,00,000 (Rupees One Hundred Twenty-Four Crore Sixty Lakhs only), inclusive of 18% Goods & Services Tax and 2.5% physical contingencies.',
    },
  },
  {
    id: 'ev-2',
    title: 'Schedule Compression & Monsoon Clash in Surfacing Activity',
    page: 62,
    section: 'Section 6.3',
    severity: 'high',
    category: 'Schedule',
    findingSummary:
      'Gantt schedule programs Dense Bituminous Macadam (DBM) laying during June–August, colliding directly with heavy precipitation (2,800 mm avg rainfall), which causes severe binder wash-off and IRC:37 violations.',
    quotedText:
      'Bituminous surfacing operations across Sector 2 (Km 18.00 to Km 42.00) are scheduled to commence in Week 38 and conclude by Week 48 (June to August 2026), utilizing 2 Nos. high-capacity sensor pavers.',
    pageContent: {
      chapter: 'CHAPTER 6: PROJECT EXECUTION SCHEDULE & WORK BREAKDOWN',
      subheading: '6.3 Milestone Phasing & Critical Path Activity Mapping',
      bodyParagraphs: [
        'The project execution schedule has been prepared utilizing critical path methodology (CPM) assuming standard 6-day work weeks with two shifts during earthwork excavation.',
        'Bituminous surfacing operations across Sector 2 (Km 18.00 to Km 42.00) are scheduled to commence in Week 38 and conclude by Week 48 (June to August 2026), utilizing 2 Nos. high-capacity sensor pavers.',
        'Contractors shall maintain dry storage aggregates at central staging depots to minimize downtime during unseasonal weather fluctuations.',
      ],
      table: {
        title: 'Table 6.2: Critical Path Activity Schedule',
        headers: ['Activity ID', 'Task Description', 'Start Week', 'End Week', 'Critical'],
        rows: [
          ['ACT-04', 'Slope Excavation & Benching', 'W-04', 'W-24', 'Yes'],
          ['ACT-09', 'Culvert Construction (24 Nos)', 'W-16', 'W-36', 'Yes'],
          ['ACT-14', 'DBM Road Surfacing (Sector 2)', 'W-38 (June)', 'W-48 (Aug)', 'CRITICAL'],
          ['ACT-19', 'Signage & Road Furniture', 'W-48', 'W-52', 'No'],
        ],
      },
      highlightSentence:
        'Bituminous surfacing operations across Sector 2 (Km 18.00 to Km 42.00) are scheduled to commence in Week 38 and conclude by Week 48 (June to August 2026), utilizing 2 Nos. high-capacity sensor pavers.',
    },
  },
  {
    id: 'ev-3',
    title: 'Bridge Substructure Foundation Design Conflict',
    page: 88,
    section: 'Section 5.8 & Annexure IV',
    severity: 'high',
    category: 'Technical',
    findingSummary:
      'Section 5.8 specifies open foundation on bedrock for Dikrong River Bridge (Chainage 18+400), but Borehole Log BH-04 indicates loose boulder-gravel strata requiring deep well/pile foundation.',
    quotedText:
      'All major and minor bridges across the alignment shall be founded on open raft foundations resting on sound basalt rock at an average depth of 3.5 meters below bed level.',
    pageContent: {
      chapter: 'CHAPTER 5: STRUCTURAL ENGINEERING & CROSS DRAINAGE DESIGNS',
      subheading: '5.8 Substructure and Foundation Design Parameters',
      bodyParagraphs: [
        'Hydraulic calculations have been executed based on IRC:78-2014 and 100-year return flood discharge estimates recorded at the State Central Water Commission gauging station.',
        'All major and minor bridges across the alignment shall be founded on open raft foundations resting on sound basalt rock at an average depth of 3.5 meters below bed level.',
        'Geotechnical investigation logs appended in Annexure IV indicate average allowable bearing capacity exceeding 450 kN/m2 across normal river crossing stretches.',
      ],
      highlightSentence:
        'All major and minor bridges across the alignment shall be founded on open raft foundations resting on sound basalt rock at an average depth of 3.5 meters below bed level.',
    },
  },
  {
    id: 'ev-4',
    title: 'Forest Clearance Boundary GIS Coordinates Mismatch',
    page: 112,
    section: 'Section 8.4',
    severity: 'medium',
    category: 'Statutory',
    findingSummary:
      'Environmental Impact Assessment claims forest land diversion of 14.2 hectares, but MoEFCC Parivesh Portal application records 18.6 hectares.',
    quotedText:
      'The proposed road corridor involves diversion of 14.20 hectares of reserve forest land falling under the jurisdiction of the Sagalee Social Forestry Division.',
    pageContent: {
      chapter: 'CHAPTER 8: STATUTORY CLEARANCES & ENVIRONMENTAL MANAGEMENT',
      subheading: '8.4 Forest Diversion and Wildlife Sanctuary Buffer Zones',
      bodyParagraphs: [
        'In accordance with the Forest (Conservation) Act, 1980, the proposal for diversion of reserve forest land has been demarcated using handheld DGPS receivers.',
        'The proposed road corridor involves diversion of 14.20 hectares of reserve forest land falling under the jurisdiction of the Sagalee Social Forestry Division.',
        'Net Present Value (NPV) calculation has been provisioned at Eco-Class II rates (₹14.50 Lakh per hectare) in the miscellaneous statutory head.',
      ],
      highlightSentence:
        'The proposed road corridor involves diversion of 14.20 hectares of reserve forest land falling under the jurisdiction of the Sagalee Social Forestry Division.',
    },
  },
  {
    id: 'ev-5',
    title: 'Beneficiary Population Demarcation Variance',
    page: 132,
    section: 'Annexure IX',
    severity: 'low',
    category: 'Social',
    findingSummary:
      'Economic Return Chapter states project serves 84,500 beneficiaries, whereas Social Impact Survey specifies 54,200 direct village residents.',
    quotedText:
      'Total direct beneficiary count across 42 habitations in Papum Pare district stands at 54,200 individuals as per 2021 census survey projections.',
    pageContent: {
      chapter: 'ANNEXURE IX: SOCIO-ECONOMIC SURVEY & BENEFICIARY ENUMERATION',
      subheading: 'IX.1 Village Habitation Survey & Direct Impact Area',
      bodyParagraphs: [
        'Socio-economic baseline enumeration was conducted across 42 habitations situated within a 5 km buffer of the proposed road alignment.',
        'Total direct beneficiary count across 42 habitations in Papum Pare district stands at 54,200 individuals as per 2021 census survey projections.',
        'Indirect benefits extend to the broader regional market population of 84,500 individuals who utilize the corridor for healthcare and agricultural market access.',
      ],
      highlightSentence:
        'Total direct beneficiary count across 42 habitations in Papum Pare district stands at 54,200 individuals as per 2021 census survey projections.',
    },
  },
];

export const EvidenceViewerPage: React.FC = () => {
  const { activeProject, activeEvidenceTarget, addToast } = useProject();

  const [selectedFinding, setSelectedFinding] = useState<EvidenceFindingItem>(
    EVIDENCE_REGISTRY[0]
  );
  const [currentPage, setCurrentPage] = useState<number>(94);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Handle deep-link target if navigated from another page
  useEffect(() => {
    if (activeEvidenceTarget) {
      const match = EVIDENCE_REGISTRY.find(
        (f) =>
          f.page === activeEvidenceTarget.page ||
          f.section.includes(activeEvidenceTarget.section)
      );
      if (match) {
        setSelectedFinding(match);
        setCurrentPage(match.page);
      } else {
        setCurrentPage(activeEvidenceTarget.page);
      }
    }
  }, [activeEvidenceTarget]);

  const handleSelectFinding = (finding: EvidenceFindingItem) => {
    setSelectedFinding(finding);
    setCurrentPage(finding.page);
  };

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(150, Math.max(75, prev + delta)));
  };

  return (
    <div className="space-y-4">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display flex items-center gap-2.5">
            <FileSearch className="h-6 w-6 text-blue-600 dark:text-cyan-400" />
            Split-Screen Document Evidence Viewer
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Side-by-side audit corroborating AI findings against original indexed DPR PDF pages.
          </p>
        </div>

        {/* CONTROLS (PAGE JUMP, ZOOM, SEARCH) */}
        <div className="flex flex-wrap items-center gap-2">
          {/* SEARCH BAR */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search in PDF..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 rounded-lg border border-slate-200 bg-white pl-8 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </div>

          {/* PAGE PAGINATION */}
          <div className="flex items-center rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 p-0.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2 text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
              Page {currentPage} of 148
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(148, p + 1))}
              disabled={currentPage >= 148}
              className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* ZOOM CONTROLS */}
          <div className="flex items-center rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 p-0.5">
            <button
              onClick={() => handleZoom(-10)}
              className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="px-1.5 text-xs font-mono text-slate-600 dark:text-slate-400">
              {zoomLevel}%
            </span>
            <button
              onClick={() => handleZoom(10)}
              className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* SPLIT-SCREEN CONTAINER */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 h-[calc(100vh-210px)]">
        {/* LEFT PANEL: AI FINDINGS & EXPLANATION (5 COLS) */}
        <div className="lg:col-span-5 flex flex-col space-y-4 overflow-y-auto pr-1">
          {/* ACTIVE FINDING CARD */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#0c1427] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <RiskBadge severity={selectedFinding.severity} size="sm" showPulse />
                <span className="text-xs font-mono font-bold text-slate-500 uppercase">
                  {selectedFinding.category} Issue
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-900">
                Page {selectedFinding.page}
              </span>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {selectedFinding.title}
              </h2>
              <p className="text-xs font-mono text-slate-400 mt-0.5">
                Location: {selectedFinding.section}
              </p>
            </div>

            {/* AI DIAGNOSTIC FINDING */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-cyan-500" />
                AI Corroboration Summary:
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800">
                {selectedFinding.findingSummary}
              </p>
            </div>

            {/* GROUNDED QUOTE */}
            <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-3.5 dark:border-amber-900/40 dark:bg-amber-950/20 space-y-1">
              <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                Extracted Document Excerpt:
              </span>
              <div className="text-xs italic text-slate-800 dark:text-slate-200 font-serif leading-relaxed">
                "{selectedFinding.quotedText}"
              </div>
            </div>
          </div>

          {/* ALL FINDINGS ACCORDION / SELECTOR LIST */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-[#0c1427] space-y-3 flex-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Audit Findings in this DPR ({EVIDENCE_REGISTRY.length}):
            </span>

            <div className="space-y-2">
              {EVIDENCE_REGISTRY.map((finding) => (
                <button
                  key={finding.id}
                  onClick={() => handleSelectFinding(finding)}
                  className={`w-full text-left rounded-xl p-3 text-xs transition border cursor-pointer ${
                    selectedFinding.id === finding.id
                      ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/60 font-semibold'
                      : 'border-slate-200/80 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <RiskBadge severity={finding.severity} size="sm" />
                    <span className="font-mono text-slate-400 text-[11px]">
                      Page {finding.page}
                    </span>
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white truncate">
                    {finding.title}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                    {finding.section}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: REALISTIC PDF DOCUMENT VIEWER (7 COLS) */}
        <div className="lg:col-span-7 flex flex-col rounded-2xl border border-slate-300 dark:border-slate-800 bg-slate-200/80 dark:bg-slate-950 p-4 shadow-inner overflow-hidden">
          <div className="flex items-center justify-between pb-2 text-xs text-slate-500 font-mono">
            <span>DOCUMENT_STREAM: {activeProject.dprFile.name}</span>
            <span>ZOOM: {zoomLevel}%</span>
          </div>

          {/* SIMULATED PDF PAGE PAPER CANVAS */}
          <div className="flex-1 overflow-y-auto flex justify-center py-4">
            <div
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
              className="w-full max-w-2xl bg-white text-slate-900 shadow-2xl p-8 sm:p-12 rounded-sm border border-slate-300 min-h-[750px] font-serif space-y-6 select-text transition-transform duration-150"
            >
              {/* WATERMARKED OFFICIAL HEADER */}
              <div className="text-center pb-4 border-b-2 border-slate-800 space-y-1">
                <div className="text-[10px] font-sans font-bold tracking-widest uppercase text-slate-600">
                  GOVERNMENT OF ARUNACHAL PRADESH • PUBLIC WORKS DEPARTMENT
                </div>
                <div className="text-xs font-sans font-semibold text-slate-800 uppercase">
                  DETAILED PROJECT REPORT (DPR) FOR PMGSY / NEC HIGHWAY SPECIAL PACKAGE
                </div>
                <div className="text-[10px] font-mono text-slate-500">
                  DOCUMENT NO: PWD/AP/DPR/2025/RC-IV • VOLUME II (TECHNICAL & FINANCIAL)
                </div>
              </div>

              {/* CHAPTER HEADER */}
              <div className="space-y-1 pt-2">
                <h2 className="text-xs font-sans font-bold uppercase tracking-wider text-slate-700">
                  {selectedFinding.pageContent.chapter}
                </h2>
                <h3 className="text-sm font-sans font-bold text-slate-900">
                  {selectedFinding.pageContent.subheading}
                </h3>
              </div>

              {/* BODY PARAGRAPHS WITH HIGHLIGHTED SNIPPET */}
              <div className="space-y-4 text-xs leading-relaxed text-slate-800">
                {selectedFinding.pageContent.bodyParagraphs.map((para, idx) => {
                  const isHighlighted = para.includes(selectedFinding.pageContent.highlightSentence);

                  return (
                    <div
                      key={idx}
                      className={
                        isHighlighted
                          ? 'relative rounded-md bg-amber-100/80 p-3 border-2 border-amber-400 font-medium shadow-sm transition animate-pulse'
                          : ''
                      }
                    >
                      {isHighlighted && (
                        <div className="absolute -top-3 left-3 bg-amber-500 text-white font-sans text-[9px] font-bold px-2 py-0.5 rounded shadow-xs">
                          AI AUDIT DETECTED VULNERABILITY
                        </div>
                      )}
                      <p>{para}</p>
                    </div>
                  );
                })}
              </div>

              {/* DATA TABLE (IF PRESENT ON THIS PAGE) */}
              {selectedFinding.pageContent.table && (
                <div className="space-y-2 pt-2">
                  <div className="text-[11px] font-sans font-bold text-slate-800">
                    {selectedFinding.pageContent.table.title}
                  </div>
                  <div className="overflow-x-auto border border-slate-400">
                    <table className="w-full text-[11px] text-left">
                      <thead className="bg-slate-100 font-sans border-b border-slate-400">
                        <tr>
                          {selectedFinding.pageContent.table.headers.map((h, i) => (
                            <th key={i} className="p-2 font-bold text-slate-900">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-300 font-mono">
                        {selectedFinding.pageContent.table.rows.map((row, rIdx) => {
                          const isTotal = row[0] === 'TOTAL';
                          return (
                            <tr
                              key={rIdx}
                              className={isTotal ? 'bg-amber-100 font-bold' : 'hover:bg-slate-50'}
                            >
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} className="p-2">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* FOOTER & OFFICIAL SEAL */}
              <div className="pt-8 border-t border-slate-300 flex items-center justify-between text-[10px] font-sans text-slate-500">
                <div>
                  <span>Superintending Engineer (Highway Circle II)</span>
                  <div className="font-mono text-[9px]">Verified & Authenticated Copy</div>
                </div>
                <div className="font-mono font-bold text-slate-700">
                  Page {currentPage} of 148
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
