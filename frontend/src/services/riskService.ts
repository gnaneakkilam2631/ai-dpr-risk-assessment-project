import type{
  RiskAssessment,
  RiskItem,
  MitigationRecommendation,
  SimulationParams,
  SimulationResult,
  RiskSeverity,
} from '../types';

export const MOCK_RISK_ITEMS: RiskItem[] = [
  {
    id: 'risk-001',
    title: 'Schedule Delay due to Heavy Monsoon & Paving Clash',
    category: 'Schedule',
    probability: 84,
    impact: 'High',
    impactScore: 8.8,
    riskScore: 8.6,
    xPos: 84, // Probability %
    yPos: 88, // Impact %
    primaryCauses: [
      'Bituminous paving programmed during June–September peak monsoon',
      'No weather contingency buffer included in baseline Gantt chart',
      'High rainfall intensity (2,800 mm/year) causing slope mudslides and haulage disruption',
    ],
    evidenceSection: 'Section 6.3 — Construction Schedule & Hydrology 2.7',
    evidencePage: 62,
    evidenceQuote: 'Dense Bituminous Macadam (DBM) laying scheduled continuously from May 15 to August 30 in Year 1.',
    potentialImpact: 'Project completion date may slip by 4–6 months, incurring price escalation and delayed economic connectivity.',
    recommendedMitigation: 'Shift asphalt paving activities to dry season window (October–February); advance cross-drainage and non-moisture-sensitive rock works.',
  },
  {
    id: 'risk-002',
    title: 'Cost Overrun from Raw Material Price Volatility & Low Contingency',
    category: 'Cost',
    probability: 76,
    impact: 'High',
    impactScore: 8.2,
    riskScore: 8.0,
    xPos: 76,
    yPos: 82,
    primaryCauses: [
      'Physical contingency provisioned at only 2.5% vs standard 5.0% for hill roads',
      'Bitumen (VG-30) and structural steel long-distance transport tariffs from Guwahati refinery',
      'Diesel index escalation risk in difficult terrain haulage',
    ],
    evidenceSection: 'Section 7.2 — Detailed Cost Abstract Table 7.4',
    evidencePage: 94,
    evidenceQuote: 'Physical Contingency allocated at 2.5% (₹2.40 Cr).',
    potentialImpact: 'Estimated cost variance of ₹14.8 Cr to ₹22.5 Cr over the 24-month construction lifecycle.',
    recommendedMitigation: 'Increase physical contingency to 5.0% and include formal price adjustment formula under standard FIDIC / MoRTH clauses.',
  },
  {
    id: 'risk-003',
    title: 'Procurement Delay & Key Equipment Availability',
    category: 'Procurement',
    probability: 68,
    impact: 'Medium',
    impactScore: 6.5,
    riskScore: 6.8,
    xPos: 68,
    yPos: 65,
    primaryCauses: [
      'Specialized 100 TPH Hot Mix Plants and heavy sensor pavers have limited regional availability',
      'Lead time for high-yield steel bridge girders exceeds 16 weeks',
      'Restricted single-lane access roads for heavy transport trailers',
    ],
    evidenceSection: 'Section 6.1 — Plant & Machinery Deployment Plan',
    evidencePage: 58,
    evidenceQuote: 'Hot Mix Plant setup planned at km 14.0 within 30 days of mobilization.',
    potentialImpact: 'Mobilization delays of 45–60 days before commercial production starts.',
    recommendedMitigation: 'Pre-qualify equipment vendors with local maintenance workshops and allow batching plant cluster sharing.',
  },
  {
    id: 'risk-004',
    title: 'Slope Instability & Landslide Exposure in Greenfield Cut Section',
    category: 'Technical',
    probability: 72,
    impact: 'High',
    impactScore: 7.9,
    riskScore: 7.6,
    xPos: 72,
    yPos: 79,
    primaryCauses: [
      '18 km greenfield section traverses fragile phyllite and schist rock formations',
      'Seismic Zone V classification with high vulnerability to slope failure during excavation',
      'Absence of micro-pile slope anchoring in deep-cut chainages (km 21 to 27)',
    ],
    evidenceSection: 'Section 3.4 — Geotechnical Investigation & Borelog Profiles',
    evidencePage: 38,
    evidenceQuote: 'Dip direction of foliation planes parallel to cut slopes between km 22.400 and km 25.100.',
    potentialImpact: 'Excessive hillside collapse, road blockage, environmental muck spillage, and safety hazards.',
    recommendedMitigation: 'Adopt bio-engineering slope stabilization, hydroseeding, and wire-mesh geo-synthetic rockfall barriers.',
  },
  {
    id: 'risk-005',
    title: 'Forest Clearance Boundary Demarcation & Stop-Work Query',
    category: 'Environmental',
    probability: 54,
    impact: 'Medium',
    impactScore: 6.0,
    riskScore: 5.8,
    xPos: 54,
    yPos: 60,
    primaryCauses: [
      'DPR RoW schedules indicate 18.20 Ha diversion, while Stage-I application lists 14.85 Ha',
      'Unresolved wildlife corridor crossing clearance between km 18 and 22',
      'Compensatory Afforestation (CA) land mutation pending at district revenue office',
    ],
    evidenceSection: 'Section 8.2 — Environmental & Forest Regulatory Approvals',
    evidencePage: 118,
    evidenceQuote: 'Forest Stage-1 application submitted for 14.85 Hectares of Reserve Forest diversion.',
    potentialImpact: 'Temporary stop-work orders in forest stretch causing idle plant compensation claims.',
    recommendedMitigation: 'Submit reconciled GIS boundary polygon to State Forest Department and expedite Stage-II compliance.',
  },
  {
    id: 'risk-006',
    title: 'Unbudgeted Cross-Drainage Variance Claims',
    category: 'Financial',
    probability: 82,
    impact: 'High',
    impactScore: 7.5,
    riskScore: 7.8,
    xPos: 82,
    yPos: 75,
    primaryCauses: [
      '19 cross-drainage culvert structures omitted from priced BoQ schedule',
      'Scour depth estimates at Bridge 2 based on empirical data rather than hydraulic borelogs',
    ],
    evidenceSection: 'Section 5.4 vs Section 7.6 (BoQ Schedule B)',
    evidencePage: 108,
    evidenceQuote: 'Schedule of cross-drainage prices 65 structures while hydrology chapter defines 82.',
    potentialImpact: 'Contractual dispute and variation order liability of ₹3.85 Cr.',
    recommendedMitigation: 'Issue pre-bid addendum rectifying BoQ quantities and standardizing culvert drawing designs.',
  },
  {
    id: 'risk-007',
    title: 'Local Labor Scarcity during Agricultural Sowing Seasons',
    category: 'Social',
    probability: 45,
    impact: 'Low',
    impactScore: 4.2,
    riskScore: 4.3,
    xPos: 45,
    yPos: 42,
    primaryCauses: [
      'Traditional Jhum cultivation seasons (March–April) pull local workforce away from civil works',
      'Inner Line Permit (ILP) verification process for outstation specialized labor',
    ],
    evidenceSection: 'Section 3.2 — Human Resources & Labor Mobilization Strategy',
    evidencePage: 34,
    evidenceQuote: 'Contractor shall engage 60% local community labor for masonry and stone pitching.',
    potentialImpact: 'Temporary productivity drops of 20–30% during planting and harvest months.',
    recommendedMitigation: 'Establish organized worker camps with incentives and schedule mechanized paving during labor-scarce months.',
  },
];

export const MOCK_MITIGATIONS: MitigationRecommendation[] = [
  {
    id: 'mit-001',
    title: 'Re-sequence Paving to Dry Season & Add Monsoon Buffer',
    riskCategory: 'Schedule Delay',
    targetedRisk: 'Schedule Delay due to Heavy Monsoon & Paving Clash',
    cause: 'Bituminous surfacing scheduled during peak rainfall months (June–Aug).',
    recommendation: 'Restructure CPM network to conduct earthwork and culverts pre-monsoon, and program all DBM/BC asphalt laying between October 1 and February 28.',
    expectedBenefit: 'Eliminates moisture stripping damage and protects project from 4+ months of slippage.',
    priority: 'Immediate',
    estimatedImpact: 'Very High',
    implementationDifficulty: 'Moderate',
    status: 'Accepted',
    estimatedSavingCr: 6.5,
    timeRecoveryMonths: 4.0,
    responsibleAgency: 'Executive Engineer (PWD Highways) & Supervision Consultant',
  },
  {
    id: 'mit-002',
    title: 'Reconcile BoQ with Hydrology Inventory and Increase Contingency to 5%',
    riskCategory: 'Cost Overrun',
    targetedRisk: 'Cost Overrun from Raw Material Price Volatility & Low Contingency',
    cause: '19 missing culvert structures in priced schedule and low 2.5% physical contingency.',
    recommendation: 'Incorporate missing 19 cross-drainage structures into BoQ Addendum and adjust physical contingency to standard 5.0% for Seismic Zone V.',
    expectedBenefit: 'Prevents contractor dispute claims and ensures adequate financial buffer for hillside cuts.',
    priority: 'Immediate',
    estimatedImpact: 'Very High',
    implementationDifficulty: 'Easy',
    status: 'Under Review',
    estimatedSavingCr: 8.2,
    timeRecoveryMonths: 1.5,
    responsibleAgency: 'DPR Consultant (Design Bureau) & Finance Department',
  },
  {
    id: 'mit-003',
    title: 'Implement Bio-Engineering Slope Stabilization & Geo-composite Drainage',
    riskCategory: 'Technical Quality',
    targetedRisk: 'Slope Instability & Landslide Exposure in Greenfield Cut Section',
    cause: 'Fragile phyllite rock cutting in Seismic Zone V without slope anchors.',
    recommendation: 'Deploy hydroseeding with vetiver grass, wire rope nets, and perforated horizontal sub-surface drains along cut faces.',
    expectedBenefit: 'Reduces post-construction landslide maintenance by 70% and prevents debris choke in drainage.',
    priority: 'High',
    estimatedImpact: 'High',
    implementationDifficulty: 'Moderate',
    status: 'Pending',
    estimatedSavingCr: 4.5,
    timeRecoveryMonths: 2.0,
    responsibleAgency: 'Geotechnical Wing (PWD) & Specialized Bio-engineering Vendor',
  },
  {
    id: 'mit-004',
    title: 'Harmonize Parivesh GIS Coordinates for Forest Diversion (18.2 Ha)',
    riskCategory: 'Statutory Compliance',
    targetedRisk: 'Forest Clearance Boundary Demarcation & Stop-Work Query',
    cause: 'Discrepancy of 3.35 Ha between RoW engineering drawing and Stage-I forest dossier.',
    recommendation: 'Submit amended KML polygon boundary file to DFO and State Nodal Officer prior to physical tree-felling permission.',
    expectedBenefit: 'Prevents forest halt notices and ensures legal immunity during Right-of-Way clearance.',
    priority: 'High',
    estimatedImpact: 'High',
    implementationDifficulty: 'Easy',
    status: 'Accepted',
    estimatedSavingCr: 2.1,
    timeRecoveryMonths: 2.5,
    responsibleAgency: 'State Forest Nodal Officer & PWD Environment Cell',
  },
  {
    id: 'mit-005',
    title: 'Advance Equipment Logistics & Establish Cluster Batching Facility',
    riskCategory: 'Procurement',
    targetedRisk: 'Procurement Delay & Key Equipment Availability',
    cause: 'Limited regional availability of sensor asphalt pavers and batching plants.',
    recommendation: 'Mandate pre-bid joint venture proof of equipment mobilization and establish an aggregate stockpile yard at km 12.',
    expectedBenefit: 'Reduces initial plant setup time by 45 days and secures uniform aggregate gradation.',
    priority: 'Medium',
    estimatedImpact: 'Medium',
    implementationDifficulty: 'Moderate',
    status: 'Pending',
    estimatedSavingCr: 1.8,
    timeRecoveryMonths: 1.5,
    responsibleAgency: 'Tender Evaluation Committee & Awarded EPC Contractor',
  },
];

export const DEFAULT_SIMULATION_PARAMS: SimulationParams = {
  durationMonths: 24,
  budgetCr: 124.6,
  materialCostChangePct: 0,
  labourCostChangePct: 0,
  contingencyPct: 2.5,
  rainfallExposurePct: 75,
  procurementDelayWeeks: 4,
};

export const riskService = {
  async getRiskAssessment(projectId: string): Promise<RiskAssessment> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          overallRisk: 'high',
          dimensions: {
            costRisk: 73,
            scheduleRisk: 81,
            technicalRisk: 42,
            financialRisk: 67,
            environmentalRisk: 59,
            complianceRisk: 28,
          },
          risks: [...MOCK_RISK_ITEMS],
        });
      }, 140);
    });
  },

  async getMitigations(projectId: string): Promise<MitigationRecommendation[]> {
    return new Promise((resolve) => setTimeout(() => resolve([...MOCK_MITIGATIONS]), 150));
  },

  async updateMitigationStatus(id: string, status: MitigationRecommendation['status']): Promise<boolean> {
    const item = MOCK_MITIGATIONS.find((m) => m.id === id);
    if (item) {
      item.status = status;
    }
    return true;
  },

  calculateScenario(base: SimulationParams, current: SimulationParams): SimulationResult {
    // Math-based simulation engine for realistic what-if analysis
    const durationDelta = current.durationMonths - base.durationMonths;
    const budgetDelta = current.budgetCr - base.budgetCr;
    const materialDelta = current.materialCostChangePct;
    const labourDelta = current.labourCostChangePct;
    const contingencyDelta = current.contingencyPct - base.contingencyPct;
    const rainfallDelta = current.rainfallExposurePct - base.rainfallExposurePct;
    const procurementDelta = current.procurementDelayWeeks - base.procurementDelayWeeks;

    // Cost risk calculation
    // Material cost has high weight (40%), labour (15%), contingency dampens cost risk (-3% per +1% contingency)
    let simulatedCostRisk = 73 + (materialDelta * 1.3) + (labourDelta * 0.6) - (contingencyDelta * 4.5) - (budgetDelta > 0 ? (budgetDelta / base.budgetCr) * 30 : 0);
    simulatedCostRisk = Math.min(99, Math.max(12, Math.round(simulatedCostRisk)));

    // Schedule risk calculation
    // Shortened duration increases risk, rainfall increases risk, procurement delay increases risk
    let simulatedScheduleRisk = 81 - (durationDelta * 1.8) + (rainfallDelta * 0.45) + (procurementDelta * 2.2);
    simulatedScheduleRisk = Math.min(99, Math.max(15, Math.round(simulatedScheduleRisk)));

    // Overall risk severity
    const combinedScore = (simulatedCostRisk * 0.5) + (simulatedScheduleRisk * 0.5);
    let simulatedOverallRisk: RiskSeverity = 'medium';
    if (combinedScore > 75) simulatedOverallRisk = 'critical';
    else if (combinedScore > 60) simulatedOverallRisk = 'high';
    else if (combinedScore > 35) simulatedOverallRisk = 'medium';
    else simulatedOverallRisk = 'low';

    // Projected cost variance in Crores
    const projectedCostVarianceCr = Number((((simulatedCostRisk - 50) / 100) * current.budgetCr * 0.22).toFixed(2));
    
    // Projected delay in months
    const projectedDelayMonths = Number(Math.max(0, ((simulatedScheduleRisk - 40) / 60) * 8).toFixed(1));

    // Health score shift
    const baseHealthScore = 82;
    let healthPenalty = (simulatedCostRisk - 73) * 0.3 + (simulatedScheduleRisk - 81) * 0.35;
    const simulatedHealthScore = Math.min(98, Math.max(35, Math.round(baseHealthScore - healthPenalty)));

    // Key risk drivers analysis
    const keyDrivers = [
      {
        driver: 'Material Cost Fluctuation',
        effect: materialDelta > 0 ? `+${materialDelta}% Inflation pressure` : materialDelta < 0 ? `${materialDelta}% Cost deflation benefit` : 'Stable index benchmark',
        delta: Math.round(materialDelta * 1.3),
      },
      {
        driver: 'Physical Contingency Buffer',
        effect: contingencyDelta > 0 ? `+${contingencyDelta.toFixed(1)}% Shock absorption` : contingencyDelta < 0 ? `${contingencyDelta.toFixed(1)}% Vulnerability increase` : 'Baseline 2.5% provision',
        delta: -Math.round(contingencyDelta * 4.5),
      },
      {
        driver: 'Weather & Monsoon Exposure',
        effect: rainfallDelta > 0 ? `+${rainfallDelta}% Wet season exposure` : rainfallDelta < 0 ? `${rainfallDelta}% Dry window optimized` : 'Normal seasonal pattern',
        delta: Math.round(rainfallDelta * 0.45),
      },
      {
        driver: 'Procurement Lead Time',
        effect: procurementDelta > 0 ? `+${procurementDelta} wks Machinery delay` : procurementDelta < 0 ? `${Math.abs(procurementDelta)} wks Fast-tracked delivery` : 'Standard 4-week mobilization',
        delta: Math.round(procurementDelta * 2.2),
      },
    ];

    let criticalRiskCount = 0;
    if (simulatedCostRisk >= 75) criticalRiskCount++;
    if (simulatedScheduleRisk >= 75) criticalRiskCount++;
    if (current.contingencyPct < 3.0) criticalRiskCount++;

    return {
      baseParams: { ...base },
      simulatedParams: { ...current },
      baseCostRisk: 73,
      simulatedCostRisk,
      baseScheduleRisk: 81,
      simulatedScheduleRisk,
      baseOverallRisk: 'high',
      simulatedOverallRisk,
      baseHealthScore,
      simulatedHealthScore,
      projectedCostVarianceCr,
      projectedDelayMonths,
      criticalRiskCount,
      keyDrivers,
    };
  },
};
