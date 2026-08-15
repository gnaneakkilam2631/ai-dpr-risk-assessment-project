import type{
  Project,
  DPRHealthScore,
  Contradiction,
  CriticalFinding,
  DocumentSection,
  RiskSeverity
} from '../types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-001',
    name: 'Rural Connectivity Improvement Project (Phase IV)',
    code: 'DPR-NER-2025-084',
    location: 'Papum Pare & Lower Subansiri Districts',
    state: 'Arunachal Pradesh',
    sector: 'Roads & Highways',
    implementingAgency: 'Public Works Department (PWD - Highway Division)',
    totalCostCr: 124.6,
    approvedBudgetCr: 110.0,
    durationMonths: 24,
    startDate: '2025-10-01',
    expectedCompletion: '2027-09-30',
    beneficiariesCount: 84500,
    healthScore: 82,
    overallRisk: 'high',
    costRiskPct: 73,
    scheduleRiskPct: 81,
    lastAnalyzed: '2026-08-12 14:30',
    status: 'Flagged Issues',
    dprFile: {
      name: 'DPR_Arunachal_Rural_Connect_v2.4_Final.pdf',
      sizeMb: 18.4,
      pages: 148,
      uploadedAt: '2026-08-12 14:15',
      version: 'v2.4-Rev3',
    },
  },
  {
    id: 'proj-002',
    name: 'Integrated Jal Jeevan Water Supply Project',
    code: 'DPR-NER-2025-112',
    location: 'Kamrup & Darrang Rural Clusters',
    state: 'Assam',
    sector: 'Water Supply & Sanitation',
    implementingAgency: 'Public Health Engineering Department (PHED)',
    totalCostCr: 88.4,
    approvedBudgetCr: 88.4,
    durationMonths: 18,
    startDate: '2025-11-15',
    expectedCompletion: '2027-05-15',
    beneficiariesCount: 142000,
    healthScore: 89,
    overallRisk: 'low',
    costRiskPct: 24,
    scheduleRiskPct: 32,
    lastAnalyzed: '2026-08-10 11:20',
    status: 'In Review',
    dprFile: {
      name: 'Assam_PHED_WaterSupply_Cluster7_DPR.pdf',
      sizeMb: 14.2,
      pages: 116,
      uploadedAt: '2026-08-10 11:05',
      version: 'v1.8',
    },
  },
  {
    id: 'proj-003',
    name: 'District Multi-Specialty Hospital Expansion',
    code: 'DPR-NER-2025-059',
    location: 'Tura, West Garo Hills',
    state: 'Meghalaya',
    sector: 'Healthcare',
    implementingAgency: 'Directorate of Health Services (DHS)',
    totalCostCr: 65.0,
    approvedBudgetCr: 58.5,
    durationMonths: 20,
    startDate: '2026-01-10',
    expectedCompletion: '2027-09-10',
    beneficiariesCount: 320000,
    healthScore: 74,
    overallRisk: 'medium',
    costRiskPct: 56,
    scheduleRiskPct: 52,
    lastAnalyzed: '2026-08-08 16:45',
    status: 'Needs Revision',
    dprFile: {
      name: 'Meghalaya_Hospital_Expansion_DPR_Final.pdf',
      sizeMb: 22.1,
      pages: 184,
      uploadedAt: '2026-08-08 16:30',
      version: 'v3.1',
    },
  },
  {
    id: 'proj-004',
    name: 'High-Altitude Mountain Bypass & Tunnel Corridor',
    code: 'DPR-NER-2025-021',
    location: 'North Sikkim District',
    state: 'Sikkim',
    sector: 'Bridges & Tunnels',
    implementingAgency: 'Border Roads Organization (BRO / Project Swastik)',
    totalCostCr: 342.8,
    approvedBudgetCr: 310.0,
    durationMonths: 36,
    startDate: '2025-09-01',
    expectedCompletion: '2028-08-31',
    beneficiariesCount: 65000,
    healthScore: 68,
    overallRisk: 'critical',
    costRiskPct: 88,
    scheduleRiskPct: 92,
    lastAnalyzed: '2026-08-05 09:15',
    status: 'Flagged Issues',
    dprFile: {
      name: 'Sikkim_HighAltitude_Corridor_DPR.pdf',
      sizeMb: 36.8,
      pages: 290,
      uploadedAt: '2026-08-05 09:00',
      version: 'v4.0',
    },
  },
  {
    id: 'proj-005',
    name: 'Distributed Solar & Microgrid Infrastructure',
    code: 'DPR-NER-2025-144',
    location: 'Lunglei & Champhai Blocks',
    state: 'Mizoram',
    sector: 'Power & Energy',
    implementingAgency: 'Power & Electricity Department (P&ED)',
    totalCostCr: 45.2,
    approvedBudgetCr: 45.2,
    durationMonths: 14,
    startDate: '2026-02-01',
    expectedCompletion: '2027-04-01',
    beneficiariesCount: 48000,
    healthScore: 93,
    overallRisk: 'low',
    costRiskPct: 18,
    scheduleRiskPct: 22,
    lastAnalyzed: '2026-08-01 10:00',
    status: 'Approved with Conditions',
    dprFile: {
      name: 'Mizoram_SolarMicrogrid_DPR_Rev2.pdf',
      sizeMb: 11.5,
      pages: 94,
      uploadedAt: '2026-08-01 09:40',
      version: 'v2.0',
    },
  },
];

export const MOCK_HEALTH_SCORE_PROJ_1: DPRHealthScore = {
  overall: 82,
  statusText: 'Good — Minor Critical Contradictions Detected',
  benchmarkSectorAvg: 74,
  dimensions: {
    completeness: 92,
    financialQuality: 76,
    scheduleFeasibility: 64,
    technicalQuality: 86,
    compliance: 91,
    riskPreparedness: 61,
  },
  dimensionDetails: [
    {
      name: 'Completeness',
      score: 92,
      maxScore: 100,
      weight: 0.2,
      status: 'excellent',
      description: 'All 14 mandatory MoRTH / NEC DPR chapters and annexures are present with signed BoQs.',
    },
    {
      name: 'Technical Quality',
      score: 86,
      maxScore: 100,
      weight: 0.2,
      status: 'good',
      description: 'Geotechnical surveys and bridge design calculations conform to IRC:SP:20 standards.',
    },
    {
      name: 'Compliance & Clearances',
      score: 91,
      maxScore: 100,
      weight: 0.15,
      status: 'excellent',
      description: 'Forest Stage-I clearance referenced; EIA and Social Impact surveys completed.',
    },
    {
      name: 'Financial Quality',
      score: 76,
      maxScore: 100,
      weight: 0.15,
      status: 'warning',
      description: 'Cost discrepancies found between Executive Summary (₹110 Cr) and BoQ Annexure VII (₹124.6 Cr).',
    },
    {
      name: 'Schedule Feasibility',
      score: 64,
      maxScore: 100,
      weight: 0.15,
      status: 'warning',
      description: 'No buffer allocated for monsoon season (June–September), compressing pavement timeline.',
    },
    {
      name: 'Risk Preparedness',
      score: 61,
      maxScore: 100,
      weight: 0.15,
      status: 'critical',
      description: 'Physical contingency budgeted at 2.5% vs required 5.0% for hilly terrain.',
    },
  ],
};

export const MOCK_CONTRADICTIONS: Contradiction[] = [
  {
    id: 'cnt-001',
    title: 'Project Total Budget Mismatch',
    category: 'Financial',
    severity: 'critical',
    sectionA: {
      title: 'Executive Summary & Financing Plan',
      sectionNumber: 'Section 1.4',
      page: 8,
      text: 'The total capital outlay for the 48.5 km corridor is calculated at ₹110.00 Crore, to be funded under the Ministry Development Scheme.',
    },
    sectionB: {
      title: 'Detailed Bill of Quantities (BoQ) & Cost Abstract',
      sectionNumber: 'Section 7.2 (Table 7.4)',
      page: 94,
      text: 'Total Abstract of Cost (Earthwork + Pavement + CD Works + Quality Control + GST @18%) aggregates to ₹124.60 Crore.',
    },
    aiFinding: 'Significant budget inconsistency of ₹14.60 Crore (13.2% escalation) between Executive Summary and Bill of Quantities.',
    impactDescription: 'Will cause project sanction rejection during Expenditure Finance Committee (EFC) review and lead to contractual disputes if uncorrected.',
    financialImpactCr: 14.6,
    reviewed: false,
  },
  {
    id: 'cnt-002',
    title: 'Construction Timeline Conflict with Monsoon Restriction',
    category: 'Timeline',
    severity: 'high',
    sectionA: {
      title: 'Project Implementation Schedule (Gantt Chart)',
      sectionNumber: 'Section 6.3',
      page: 62,
      text: 'Dense Bituminous Macadam (DBM) and Bituminous Concrete (BC) laying scheduled continuously from May 15 to August 30 in Year 1.',
    },
    sectionB: {
      title: 'Hydrological & Meteorological Profile',
      sectionNumber: 'Section 2.7',
      page: 24,
      text: 'The project area experiences intense south-west monsoon rainfall (average 2,800 mm/year) between June 1 and September 20, halting all bituminous work.',
    },
    aiFinding: 'Bituminous paving is scheduled during peak monsoon months when IRC 27 prohibit hot-mix asphalt laying due to moisture stripping.',
    impactDescription: 'High risk of premature pavement distress or an inevitable 4-month project timeline slip.',
    reviewed: false,
  },
  {
    id: 'cnt-003',
    title: 'Target Beneficiary Population Discrepancy',
    category: 'Beneficiaries',
    severity: 'medium',
    sectionA: {
      title: 'Socio-Economic Benefits & Justification',
      sectionNumber: 'Section 3.1',
      page: 36,
      text: 'The proposed alignment will directly connect 42 habitations with an aggregate rural population of 84,500 people (Census 2021 projected).',
    },
    sectionB: {
      title: 'Social Impact Assessment Survey',
      sectionNumber: 'Annexure IX',
      page: 132,
      text: 'Survey covered 28 fringe villages totaling 54,200 individuals residing along the 100m corridor of direct impact.',
    },
    aiFinding: 'Beneficiary statistics mismatch by 30,300 people across narrative and survey tables.',
    impactDescription: 'Affects Economic Internal Rate of Return (EIRR) computation and socio-economic justification metrics.',
    reviewed: true,
    reviewedAt: '2026-08-13 11:30',
    reviewerNotes: 'Verified with PWD Executive Engineer; difference represents direct corridor residents vs indirect catchment area.',
  },
  {
    id: 'cnt-004',
    title: 'Culvert & Minor Bridge Cross-Drainage Count Variance',
    category: 'Material & Quantities',
    severity: 'high',
    sectionA: {
      title: 'Drainage & Cross-Drainage Structures Overview',
      sectionNumber: 'Section 5.4',
      page: 54,
      text: 'The alignment requires 68 Hume Pipe Culverts (1200mm dia) and 14 Box Culverts across major streams.',
    },
    sectionB: {
      title: 'Schedule of Cross Drainage Structures (BoQ Schedule B)',
      sectionNumber: 'Section 7.6',
      page: 108,
      text: 'Rate analysis and quantities are provided for only 52 Hume Pipe Culverts and 11 Box Culverts.',
    },
    aiFinding: '16 Hume Pipe Culverts and 3 Box Culverts mentioned in engineering narrative are missing from the pricing schedule.',
    impactDescription: 'Unfunded structural items worth approx. ₹3.85 Cr will lead to variation orders or contractor claims during execution.',
    financialImpactCr: 3.85,
    reviewed: false,
  },
  {
    id: 'cnt-005',
    title: 'Forest Clearance Land Diversion Area Mismatch',
    category: 'Statutory Approvals',
    severity: 'medium',
    sectionA: {
      title: 'Environmental & Forest Regulatory Approvals',
      sectionNumber: 'Section 8.2',
      page: 118,
      text: 'Forest Stage-1 application submitted for 14.85 Hectares of Reserve Forest diversion along the 18 km hill section.',
    },
    sectionB: {
      title: 'Right of Way (RoW) Demarcation Schedule',
      sectionNumber: 'Section 4.1',
      page: 44,
      text: 'Total forest land under proposed 24m Right-of-Way in chainage km 12.000 to km 30.000 is measured at 18.20 Hectares.',
    },
    aiFinding: 'Forest clearance application under-reports forest land requirement by 3.35 Hectares.',
    impactDescription: 'May stall construction at km 22.0 due to forest department stop-work orders until supplementary clearance is processed.',
    reviewed: false,
  },
  {
    id: 'cnt-006',
    title: 'Earthwork Cut-to-Fill Balance Inconsistency',
    category: 'Material & Quantities',
    severity: 'low',
    sectionA: {
      title: 'Geometric Design & Mass Haul Diagram',
      sectionNumber: 'Section 4.5',
      page: 49,
      text: 'Hill cutting will generate 420,000 m³ of excavated rock/soil, with 85% planned for embankment filling.',
    },
    sectionB: {
      title: 'Muck Disposal & Environmental Management Plan',
      sectionNumber: 'Section 8.5',
      page: 122,
      text: 'Five designated dumping yards have been provisioned to store 280,000 m³ of surplus unusable muck.',
    },
    aiFinding: 'Mass haul balance leaves an unaccounted discrepancy of 15% in material balance volumes.',
    impactDescription: 'Low technical severity but requires disposal site capacity validation.',
    reviewed: false,
  },
];

export const MOCK_CRITICAL_FINDINGS: CriticalFinding[] = [
  {
    id: 'find-001',
    title: 'Budget Discrepancy Between Executive Summary and BoQ',
    severity: 'critical',
    projectId: 'proj-001',
    projectName: 'Rural Connectivity Improvement Project (Phase IV)',
    section: 'Section 1.4 vs 7.2',
    pageNumber: 94,
    explanation: 'Total cost in Executive Summary states ₹110 Cr, while the priced Bill of Quantities totals ₹124.6 Cr.',
    impact: 'Exceeds administrative sanction limit by ₹14.6 Cr; risk of financial audit objection.',
    detectedAt: '2026-08-12 14:30',
    recommendation: 'Reconcile contingency, GST, and escalation components in summary sheets before committee submission.',
  },
  {
    id: 'find-002',
    title: 'Pavement Laying Scheduled in Peak Northeast Monsoon',
    severity: 'high',
    projectId: 'proj-001',
    projectName: 'Rural Connectivity Improvement Project (Phase IV)',
    section: 'Section 6.3 (Schedule)',
    pageNumber: 62,
    explanation: 'Bituminous surfacing is programmed in June–August when precipitation exceeds 650mm/month.',
    impact: 'Pavement stripping, bitumen washouts, and inevitable 4-month project timeline delay.',
    detectedAt: '2026-08-12 14:30',
    recommendation: 'Re-sequence earthwork and cross drainage during pre-monsoon; shift DBM/BC paving to dry window (Oct–Feb).',
  },
  {
    id: 'find-003',
    title: 'Under-Provisioned Physical Contingency for Steep Hilly Terrain',
    severity: 'high',
    projectId: 'proj-001',
    projectName: 'Rural Connectivity Improvement Project (Phase IV)',
    section: 'Section 7.1 (Cost Abstract)',
    pageNumber: 92,
    explanation: 'Physical contingency allocated at 2.5% (₹2.75 Cr). MoRTH guidelines mandate 5.0% for Seismic Zone V hill terrain.',
    impact: 'High probability of cost overruns from slope stabilization, landslides, and unanticipated rock blasting.',
    detectedAt: '2026-08-12 14:30',
    recommendation: 'Increase contingency allocation to 5.0% (₹5.5 Cr) and conduct slope stability sensitivity analysis.',
  },
  {
    id: 'find-004',
    title: 'Missing Cross-Drainage BoQ Items for 19 Structures',
    severity: 'critical',
    projectId: 'proj-001',
    projectName: 'Rural Connectivity Improvement Project (Phase IV)',
    section: 'Section 5.4 vs 7.6',
    pageNumber: 108,
    explanation: 'Hydrology section lists 82 cross-drainage structures, but priced BoQ covers only 63 structures.',
    impact: 'Unbudgeted expenditure of ₹3.85 Cr requiring post-tender revision and arbitration exposure.',
    detectedAt: '2026-08-12 14:30',
    recommendation: 'Update BoQ Schedule B with complete cross-drainage inventory before NIT issuance.',
  },
  {
    id: 'find-005',
    title: 'High Geotechnical Instability in Mountain Tunnel Bypass',
    severity: 'critical',
    projectId: 'proj-004',
    projectName: 'High-Altitude Mountain Bypass & Tunnel Corridor',
    section: 'Geotech Survey Sec 3.4',
    pageNumber: 78,
    explanation: 'Rock Mass Rating (RMR) in Chainage 14.5 to 17.2 falls below 28 (Very Poor Rock), requiring heavy forepoling.',
    impact: 'Potential tunnel collapse risk and cost escalation exceeding ₹48 Cr.',
    detectedAt: '2026-08-05 09:15',
    recommendation: 'Mandate NATM Class VI support system and install 3D optical displacement monitoring.',
  },
  {
    id: 'find-006',
    title: 'Unrealistic 14-Month Commissioning for Multi-Specialty Hospital',
    severity: 'high',
    projectId: 'proj-003',
    projectName: 'District Multi-Specialty Hospital Expansion',
    section: 'Implementation Plan Sec 5.1',
    pageNumber: 52,
    explanation: 'HVAC, medical gas pipeline system, and AERB radiation shielding commissioning allocated only 45 days.',
    impact: 'Delayed operational licensing and inability to admit patients on scheduled date.',
    detectedAt: '2026-08-08 16:45',
    recommendation: 'Allocate realistic 120-day testing & commissioning window for hospital services.',
  },
];

export const MOCK_DPR_PAGES: DocumentSection[] = [
  {
    id: 'doc-p8',
    pageNumber: 8,
    sectionNumber: '1.4',
    title: 'Executive Summary & Financing Strategy',
    content: `1.4 EXECUTIVE SUMMARY & FINANCING PLAN
The Rural Connectivity Improvement Project (Phase IV) has been conceptualized to provide all-weather road connectivity to 42 backward tribal habitations across Papum Pare and Lower Subansiri districts of Arunachal Pradesh.

The total capital outlay for the 48.5 km corridor is calculated at ₹110.00 Crore, to be funded under the Ministry of Development of North Eastern Region (DoNER) / NEC central funding pool with state counterpart share.

The project encompasses 2-lane formation (3.75m carriageway, 1.5m paved shoulders) with slope protection works, 82 cross-drainage structures, and safety appurtenances conforming to IRC:SP:20 standards. The target implementation duration is 24 calendar months.`,
    hasFinding: true,
    findingSeverity: 'critical',
    findingTitle: 'Contradiction: Budget Understated by ₹14.6 Cr',
    findingExplanation: 'This executive chapter reports ₹110.00 Cr, whereas Section 7.2 (Priced BoQ) sums to ₹124.60 Cr.',
    findingImpact: 'High risk of budget sanction shortfall and administrative query.',
    findingRecommendation: 'Align Executive Summary with Master Cost Abstract Table 7.4.',
  },
  {
    id: 'doc-p24',
    pageNumber: 24,
    sectionNumber: '2.7',
    title: 'Hydrological & Meteorological Profile',
    content: `2.7 CLIMATE, HYDROLOGY & PRECIPITATION
The project alignment traverses sub-tropical to temperate hilly terrain with altitude varying between 420m to 1,680m above MSL.

The project area experiences intense south-west monsoon rainfall (average 2,800 mm/year) between June 1 and September 20, halting all bituminous work and major earthwork cuts. High intensity cloudburst events are frequent during July and August, generating peak flood discharges in local nullahs and rivers.

Design High Flood Level (HFL) calculations have been carried out for a 50-year return period using Snyder's Synthetic Unit Hydrograph method.`,
    hasFinding: false,
  },
  {
    id: 'doc-p44',
    pageNumber: 44,
    sectionNumber: '4.1',
    title: 'Right of Way (RoW) & Alignment Geometric Design',
    content: `4.1 ALIGNMENT & RIGHT OF WAY (RoW)
The proposed alignment follows existing fair-weather forest tracks for 30.5 km and requires new greenfield bench cutting for 18.0 km.

The required Right of Way (RoW) is 24 meters in plain sections and 18 meters in steep hill slopes. Total forest land under proposed 24m Right-of-Way in chainage km 12.000 to km 30.000 is measured at 18.20 Hectares.

Geometric design parameters:
- Design Speed: 40 km/h (Ruling), 30 km/h (Minimum)
- Maximum Super-elevation: 7.0%
- Minimum Horizontal Curve Radius: 30 meters
- Maximum Longitudinal Gradient: 6.0% (Ruling), 7.0% (Limiting for max 100m stretch)`,
    hasFinding: true,
    findingSeverity: 'medium',
    findingTitle: 'Land Diversion Area Conflict',
    findingExplanation: 'RoW calculation states 18.20 Hectares of forest land, but Chapter 8.2 reports 14.85 Hectares.',
    findingImpact: 'Forest Stage-I clearance might face boundary rejection during ground demarcation.',
    findingRecommendation: 'Ensure synchronized boundary coordinates between DPR RoW schedule and Parivesh Forest Portal dossier.',
  },
  {
    id: 'doc-p62',
    pageNumber: 62,
    sectionNumber: '6.3',
    title: 'Project Implementation Schedule & Milestone Chart',
    content: `6.3 CONSTRUCTION SCHEDULE & MILESTONES
The construction program is divided into four major physical phases over 24 calendar months:

Phase 1 (Months 1-6): Mobilization, Site Clearance, Greenfield Hill Cutting (Ch 0.0 to 20.0).
Phase 2 (Months 7-12): Retaining walls, Gabion structures, and Subgrade preparation.
Phase 3 (Months 13-18): Dense Bituminous Macadam (DBM) and Bituminous Concrete (BC) laying scheduled continuously from May 15 to August 30 in Year 1.
Phase 4 (Months 19-24): Bridges, road safety barriers, signage, road marking, and final punch-list commissioning.

Critical Path Analysis indicates pavement laying and Box Culvert construction are on the primary critical path.`,
    hasFinding: true,
    findingSeverity: 'high',
    findingTitle: 'Schedule Infeasibility: Paving in Heavy Monsoon',
    findingExplanation: 'DBM and BC laying is scheduled between May 15 and Aug 30, directly conflicting with 2,800mm monsoon rains.',
    findingImpact: 'Bitumen emulsion failure, stripping, and estimated 4-month completion slip.',
    findingRecommendation: 'Re-program asphalt pavement laying to October–February window.',
  },
  {
    id: 'doc-p94',
    pageNumber: 94,
    sectionNumber: '7.2',
    title: 'Detailed Bill of Quantities (BoQ) & Cost Abstract',
    content: `7.2 DETAILED COST ABSTRACT (TABLE 7.4)
Rates adopted are based on Arunachal Pradesh PWD Schedule of Rates (APSR 2024) with Cost Index @12.5%.

Item No. | Description | Amount (₹ Cr)
1.0 | Site Clearance & Earthwork Cutting | ₹26.40
2.0 | Granular Sub-Base (GSB) & WBM Base | ₹22.80
3.0 | Dense Bituminous Macadam (50mm) | ₹19.50
4.0 | Bituminous Concrete (30mm) | ₹14.20
5.0 | Cross Drainage & Bridge Structures | ₹18.60
6.0 | Slope Protection (Retaining/Breast Walls) | ₹11.20
7.0 | Road Safety & Environmental Mitigation | ₹3.40
Sub-Total (A) | Base Construction Cost | ₹96.10
8.0 | Physical Contingency @ 2.5% | ₹2.40
9.0 | Quality Control & Third Party Audit @ 1.5% | ₹1.44
10.0 | GST @ 18% on Construction Work | ₹17.30
11.0 | Agency Charges & DPR Consultancy | ₹7.36
TOTAL | PROJECT CAPITAL OUTLAY | ₹124.60 Crore`,
    hasFinding: true,
    findingSeverity: 'critical',
    findingTitle: 'BoQ Abstract Overrun & Low Contingency',
    findingExplanation: '1) Total is ₹124.60 Cr (vs ₹110 Cr in Section 1.4). 2) Physical Contingency is only 2.5% instead of standard 5.0% for hill roads.',
    findingImpact: '₹14.6 Cr unbudgeted gap plus high risk of cost overrun from terrain uncertainties.',
    findingRecommendation: 'Increase contingency to 5.0% and obtain updated financial sanction for ₹127.5 Cr.',
  },
  {
    id: 'doc-p108',
    pageNumber: 108,
    sectionNumber: '7.6',
    title: 'Schedule of Cross Drainage Structures (BoQ Schedule B)',
    content: `7.6 BOQ SCHEDULE B - CROSS DRAINAGE STRUCTURES
Bill of quantities for cross drainage works across the 48.5 km alignment:

Structure Type | Size / Span | Quantity in BoQ | Unit Cost (₹ Lakh) | Total (₹ Cr)
Hume Pipe Culvert | 1200mm dia NP4 | 52 Nos. | 14.50 | 7.54
Box Culvert | 2m x 2m Single Cell | 8 Nos. | 38.00 | 3.04
Box Culvert | 4m x 3m Double Cell | 3 Nos. | 82.00 | 2.46
Minor Bridges | 15m Composite Girder | 2 Nos. | 278.00 | 5.56
TOTAL CROSS DRAINAGE BUDGET | | 65 Nos. | | ₹18.60 Crore

Note: Geological test bores at Bridge 2 indicate bed rock at 6.8m depth below scour line.`,
    hasFinding: true,
    findingSeverity: 'high',
    findingTitle: '19 Missing Structures in Priced BoQ',
    findingExplanation: 'Section 5.4 specifies 68 Hume Pipe Culverts and 14 Box Culverts (Total 82), but this schedule prices only 52 Pipe Culverts and 11 Box Culverts (Total 63).',
    findingImpact: '19 missing structures represents approx ₹3.85 Cr unbudgeted liability.',
    findingRecommendation: 'Include all 82 structures in priced BoQ prior to tender release.',
  },
];

// Service interface
export const dprService = {
  async getProjects(): Promise<Project[]> {
    return new Promise((resolve) => setTimeout(() => resolve([...INITIAL_PROJECTS]), 150));
  },

  async getProjectById(id: string): Promise<Project | undefined> {
    return new Promise((resolve) => {
      const p = INITIAL_PROJECTS.find((item) => item.id === id) || INITIAL_PROJECTS[0];
      setTimeout(() => resolve(p), 100);
    });
  },

  async getHealthScore(projectId: string): Promise<DPRHealthScore> {
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_HEALTH_SCORE_PROJ_1), 120));
  },

  async getContradictions(projectId: string): Promise<Contradiction[]> {
    return new Promise((resolve) => setTimeout(() => resolve([...MOCK_CONTRADICTIONS]), 150));
  },

  async getCriticalFindings(projectId?: string): Promise<CriticalFinding[]> {
    return new Promise((resolve) => {
      if (projectId) {
        resolve(MOCK_CRITICAL_FINDINGS.filter((f) => f.projectId === projectId));
      } else {
        resolve([...MOCK_CRITICAL_FINDINGS]);
      }
    });
  },

  async getDocumentSections(projectId: string): Promise<DocumentSection[]> {
    return new Promise((resolve) => setTimeout(() => resolve([...MOCK_DPR_PAGES]), 150));
  },

  async markContradictionReviewed(contradictionId: string, reviewed: boolean, notes?: string): Promise<boolean> {
    const item = MOCK_CONTRADICTIONS.find((c) => c.id === contradictionId);
    if (item) {
      item.reviewed = reviewed;
      if (reviewed) {
        item.reviewedAt = new Date().toISOString();
        item.reviewerNotes = notes || 'Reviewed and acknowledged by reviewer';
      }
    }
    return true;
  },
};
