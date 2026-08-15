import type { Project, DPRHealthScore, RiskAssessment, Contradiction, MitigationRecommendation } from '../types';

export interface ReportData {
  reportId: string;
  generatedDate: string;
  evaluatorName: string;
  evaluatorRole: string;
  evaluatorOrganization: string;
  project: Project;
  healthScore: DPRHealthScore;
  riskAssessment: RiskAssessment;
  contradictions: Contradiction[];
  mitigations: MitigationRecommendation[];
  executiveSummary: string;
  formalVerdict: 'Approved with Conditions' | 'Returned for Revision' | 'Rejected';
  conditionsOfApproval: string[];
}

export const reportService = {
  generateReportData(
    project: Project,
    healthScore: DPRHealthScore,
    riskAssessment: RiskAssessment,
    contradictions: Contradiction[],
    mitigations: MitigationRecommendation[]
  ): ReportData {
    return {
      reportId: `DPR-REV-${project.code.replace('DPR-', '')}-${new Date().getFullYear()}`,
      generatedDate: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
      evaluatorName: 'Er. Rajesh V. Sharma, M.Tech (Structures)',
      evaluatorRole: 'Senior DPR Quality & Risk Evaluator',
      evaluatorOrganization: 'National Infrastructure Appraisal Board / Ministry of DoNER',
      project,
      healthScore,
      riskAssessment,
      contradictions,
      mitigations,
      executiveSummary: `The Detailed Project Report (DPR) for "${project.name}" (Estimated Outlay: ₹${project.totalCostCr} Cr) has undergone comprehensive automated quality, risk, and consistency appraisal via AI-DPR Guardian. 

Overall DPR Health Score is evaluated at ${healthScore.overall}/100. While technical survey parameters and compliance clearances demonstrate high diligence (${healthScore.dimensions.compliance}/100), the project is evaluated under HIGH RISK (Overall Risk Severity: High) due to critical temporal and financial contradictions. 

Specifically, an unresolved ₹14.60 Cr discrepancy exists between the Executive Summary and the priced Bill of Quantities (BoQ Table 7.4), along with an unfeasible road paving schedule that overlaps with 2,800 mm peak monsoon rainfall. 

Subject to compliance with the 4 mandatory conditions outlined herein, the project qualifies for conditional administrative approval.`,
      formalVerdict: 'Approved with Conditions',
      conditionsOfApproval: [
        'Mandatory financial reconciliation: Re-align Executive Summary funding requisition with priced BoQ sum of ₹124.60 Cr, including unpriced culverts (₹3.85 Cr).',
        'Schedule re-sequencing: Submit amended CPM Gantt chart shifting Dense Bituminous Macadam (DBM) and Bituminous Concrete (BC) to October–February dry weather window.',
        'Contingency enhancement: Increase physical contingency allocation from 2.5% to 5.0% (₹5.50 Cr) in compliance with MoRTH Hill Road standards.',
        'Statutory Forest GIS sync: Submit rectified 18.20 Ha KML boundary polygon to Parivesh State Forest Nodal Cell prior to final sanction release.',
      ],
    };
  },
};
