export type RiskSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface Project {
  id: string;
  name: string;
  code: string;
  location: string;
  state: string;
  sector: 'Roads & Highways' | 'Water Supply & Sanitation' | 'Healthcare' | 'Power & Energy' | 'Urban Development' | 'Bridges & Tunnels';
  implementingAgency: string;
  totalCostCr: number;
  approvedBudgetCr: number;
  durationMonths: number;
  startDate: string;
  expectedCompletion: string;
  beneficiariesCount: number;
  healthScore: number;
  overallRisk: RiskSeverity;
  costRiskPct: number;
  scheduleRiskPct: number;
  lastAnalyzed: string;
  status: 'In Review' | 'Flagged Issues' | 'Approved with Conditions' | 'Needs Revision';
  dprFile: {
    name: string;
    sizeMb: number;
    pages: number;
    uploadedAt: string;
    version: string;
  };
}

export interface DimensionScore {
  name: string;
  score: number;
  maxScore: number;
  weight: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  description: string;
}

export interface DPRHealthScore {
  overall: number;
  statusText: string;
  benchmarkSectorAvg: number;
  dimensions: {
    completeness: number;
    financialQuality: number;
    scheduleFeasibility: number;
    technicalQuality: number;
    compliance: number;
    riskPreparedness: number;
  };
  dimensionDetails: DimensionScore[];
}

export interface RiskItem {
  id: string;
  title: string;
  category: 'Cost' | 'Schedule' | 'Technical' | 'Financial' | 'Environmental' | 'Compliance' | 'Procurement' | 'Social';
  probability: number; // 0-100%
  impact: 'Low' | 'Medium' | 'High' | 'Critical';
  impactScore: number; // 1-10
  riskScore: number; // 1-10
  primaryCauses: string[];
  evidenceSection: string;
  evidencePage: number;
  evidenceQuote: string;
  potentialImpact: string;
  recommendedMitigation: string;
  xPos?: number; // Probability coord on heatmap (0-100)
  yPos?: number; // Impact coord on heatmap (0-100)
}

export interface RiskAssessment {
  overallRisk: RiskSeverity;
  dimensions: {
    costRisk: number;
    scheduleRisk: number;
    technicalRisk: number;
    financialRisk: number;
    environmentalRisk: number;
    complianceRisk: number;
  };
  risks: RiskItem[];
}

export interface Contradiction {
  id: string;
  title: string;
  category: 'Financial' | 'Timeline' | 'Area / Scope' | 'Beneficiaries' | 'Material & Quantities' | 'Statutory Approvals';
  severity: RiskSeverity;
  sectionA: {
    title: string;
    sectionNumber: string;
    page: number;
    text: string;
  };
  sectionB: {
    title: string;
    sectionNumber: string;
    page: number;
    text: string;
  };
  aiFinding: string;
  impactDescription: string;
  financialImpactCr?: number;
  reviewed: boolean;
  reviewedAt?: string;
  reviewerNotes?: string;
}

export interface CriticalFinding {
  id: string;
  title: string;
  severity: RiskSeverity;
  projectId: string;
  projectName: string;
  section: string;
  pageNumber: number;
  explanation: string;
  impact: string;
  detectedAt: string;
  recommendation: string;
}

export interface MitigationRecommendation {
  id: string;
  title: string;
  riskCategory: string;
  targetedRisk: string;
  cause: string;
  recommendation: string;
  expectedBenefit: string;
  priority: 'Immediate' | 'High' | 'Medium' | 'Low';
  estimatedImpact: 'Very High' | 'High' | 'Medium' | 'Moderate';
  implementationDifficulty: 'Easy' | 'Moderate' | 'Complex';
  status: 'Pending' | 'Accepted' | 'Under Review' | 'Deferred';
  estimatedSavingCr: number;
  timeRecoveryMonths: number;
  responsibleAgency: string;
}

export interface SimulationParams {
  durationMonths: number;
  budgetCr: number;
  materialCostChangePct: number;
  labourCostChangePct: number;
  contingencyPct: number;
  rainfallExposurePct: number;
  procurementDelayWeeks: number;
}

export interface SimulationResult {
  baseParams: SimulationParams;
  simulatedParams: SimulationParams;
  baseCostRisk: number;
  simulatedCostRisk: number;
  baseScheduleRisk: number;
  simulatedScheduleRisk: number;
  baseOverallRisk: RiskSeverity;
  simulatedOverallRisk: RiskSeverity;
  baseHealthScore: number;
  simulatedHealthScore: number;
  projectedCostVarianceCr: number;
  projectedDelayMonths: number;
  criticalRiskCount: number;
  keyDrivers: Array<{
    driver: string;
    effect: string;
    delta: number;
  }>;
}

export interface CopilotCitation {
  section: string;
  page: number;
  title: string;
  excerpt: string;
  confidence: number;
}

export interface CopilotMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: CopilotCitation[];
  grounded: boolean;
  actionableInsights?: string[];
}

export interface DocumentSection {
  id: string;
  pageNumber: number;
  sectionNumber: string;
  title: string;
  content: string;
  hasFinding: boolean;
  findingSeverity?: RiskSeverity;
  findingTitle?: string;
  findingExplanation?: string;
  findingImpact?: string;
  findingRecommendation?: string;
}
