import type { CopilotMessage, CopilotCitation } from '../types';

export const INITIAL_COPILOT_MESSAGES: CopilotMessage[] = [
  {
    id: 'msg-welcome',
    role: 'assistant',
    content: `Greetings. I am **DPR Copilot**, your AI assistant for the **Rural Connectivity Improvement Project (Phase IV)** (DPR-NER-2025-084).

I have indexed all 148 pages, geotechnical borelogs, schedule Gantt charts, and Bill of Quantities (BoQ) schedules. Every answer I provide is strictly **grounded in the DPR** with verified page and section citations.

You can ask me questions regarding financial consistency, schedule feasibility, compliance clearances, or mitigation strategies.`,
    timestamp: 'Just now',
    grounded: true,
    citations: [
      {
        section: 'Section 1.1',
        page: 2,
        title: 'Project Inception & DPR Scope',
        excerpt: 'DPR prepared in accordance with MoRTH specifications for Rural Roads (IRC:SP:20:2002).',
        confidence: 0.98,
      },
    ],
    actionableInsights: [
      'Top project risk is schedule slippage during the 4-month monsoon window.',
      'A ₹14.60 Cr cost contradiction exists between Executive Summary and BoQ Table 7.4.',
      '19 cross-drainage structures are unpriced in the Bill of Quantities.',
    ],
  },
];

export const PRESET_QUESTIONS = [
  'What are the top three risks in this DPR?',
  'Where is the budget inconsistency?',
  'Why is schedule risk evaluated as High (81%)?',
  'What sections or statutory clearances are missing?',
  'What could cause cost overruns during execution?',
  'Show me evidence for the schedule risk.',
  'How was physical contingency budgeted?',
];

export const copilotService = {
  async askQuestion(question: string, history: CopilotMessage[]): Promise<CopilotMessage> {
    const qLower = question.toLowerCase();
    
    // Simulate AI response delay
    await new Promise((r) => setTimeout(r, 650));

    let content = '';
    let citations: CopilotCitation[] = [];
    let actionableInsights: string[] = [];

    if (qLower.includes('top three') || qLower.includes('top risk') || qLower.includes('key risk')) {
      content = `Based on the risk models executed across the 148 pages of the DPR, here are the **Top 3 Critical Risks**:

1. **Schedule Delay & Monsoon Paving Clash (Risk Score: 8.6/10)**
   - **Reason**: Bituminous road paving (DBM and BC) is scheduled in Section 6.3 during June–August, when regional monsoon precipitation averages 2,800 mm/year.
   - **Impact**: 4 to 6 months total project delay.

2. **Cost Overrun & Budget Contradiction (Risk Score: 8.0/10)**
   - **Reason**: Physical contingency is provisioned at only 2.5% (vs 5% standard), plus an active ₹14.60 Cr discrepancy between Executive Summary (₹110 Cr) and BoQ (₹124.6 Cr).
   - **Impact**: ₹14.8 Cr to ₹22.5 Cr potential cost escalation.

3. **Slope Instability in Greenfield Cut Stretch (Risk Score: 7.6/10)**
   - **Reason**: 18 km greenfield section traverses fragile phyllite rock formations in Seismic Zone V without designated micro-piles or bio-engineering slope anchors.
   - **Impact**: Slope collapse, road blockage, and environmental muck spillage.`;

      citations = [
        {
          section: 'Section 6.3',
          page: 62,
          title: 'Project Implementation Schedule',
          excerpt: 'DBM and BC laying scheduled continuously from May 15 to August 30 in Year 1.',
          confidence: 0.96,
        },
        {
          section: 'Section 7.2 (Table 7.4)',
          page: 94,
          title: 'Detailed Cost Abstract',
          excerpt: 'Total Project Capital Outlay: ₹124.60 Crore vs ₹110.00 Cr in Executive Summary.',
          confidence: 0.99,
        },
        {
          section: 'Section 3.4',
          page: 38,
          title: 'Geotechnical Investigation',
          excerpt: 'Dip direction of foliation planes parallel to cut slopes between km 22.400 and km 25.100.',
          confidence: 0.94,
        },
      ];

      actionableInsights = [
        'Shift asphalt paving to October–February dry window.',
        'Reconcile BoQ with Executive Summary before EFC submission.',
        'Include bio-engineering slope stabilization in BoQ.',
      ];
    } else if (qLower.includes('budget') || qLower.includes('inconsisten') || qLower.includes('cost') || qLower.includes('contradict')) {
      content = `The primary **budget contradiction** detected in this DPR is an unresolved **₹14.60 Crore (13.2%) discrepancy**:

- **Location 1 (Section 1.4, Page 8)**: The Executive Summary and financing proposal states the total capital outlay is **₹110.00 Crore**.
- **Location 2 (Section 7.2 / Table 7.4, Page 94)**: The priced Master Bill of Quantities (BoQ) totals **₹124.60 Crore** (Base works ₹96.10 Cr + GST @18% ₹17.30 Cr + Contingency ₹2.40 Cr + Agency/Consultancy charges).

Additionally, **Section 7.6 (Page 108)** omits 19 cross-drainage culverts that were specified in the engineering design (Section 5.4, Page 54), creating an estimated additional **₹3.85 Cr** unbudgeted liability.`;

      citations = [
        {
          section: 'Section 1.4',
          page: 8,
          title: 'Executive Summary & Financing Plan',
          excerpt: 'Total capital outlay for the 48.5 km corridor is calculated at ₹110.00 Crore.',
          confidence: 0.99,
        },
        {
          section: 'Section 7.2 (Table 7.4)',
          page: 94,
          title: 'Detailed Cost Abstract',
          excerpt: 'Total Abstract of Cost aggregates to ₹124.60 Crore.',
          confidence: 0.99,
        },
        {
          section: 'Section 7.6',
          page: 108,
          title: 'BoQ Schedule B - Cross Drainage',
          excerpt: 'Prices 52 Hume Pipe Culverts and 11 Box Culverts (Total 63 vs 82 specified).',
          confidence: 0.95,
        },
      ];

      actionableInsights = [
        'Issue formal clarification note to PWD Executive Engineer.',
        'Update funding request to ₹124.60 Cr plus ₹3.85 Cr culvert adjustment.',
      ];
    } else if (qLower.includes('schedule') || qLower.includes('monsoon') || qLower.includes('delay')) {
      content = `The **Schedule Risk is evaluated as High (81%)** for three primary reasons evidenced directly from the document:

1. **Direct Monsoon Conflict**:
   In **Section 6.3 (Page 62)**, Dense Bituminous Macadam (DBM) and Bituminous Concrete (BC) are scheduled to be laid between **May 15 and August 30**. However, the meteorological chapter (**Section 2.7, Page 24**) records that this region receives **2,800 mm of annual rainfall** with frequent cloudbursts during June–September, making asphalt laying technically prohibited under IRC:SP:20.

2. **Zero Weather Buffer in Critical Path**:
   The CPM network treats the 24-month duration as continuous without factoring in 8 months of monsoon slowdown across the two-year cycle.

3. **Single Point of Failure in Equipment Logistics**:
   The 100 TPH Hot Mix Plant deployment is scheduled to complete in 30 days without addressing single-lane hilly haulage road access limitations (Section 6.1, Page 58).`;

      citations = [
        {
          section: 'Section 6.3',
          page: 62,
          title: 'Construction Schedule & Milestones',
          excerpt: 'DBM and BC laying scheduled continuously from May 15 to August 30 in Year 1.',
          confidence: 0.98,
        },
        {
          section: 'Section 2.7',
          page: 24,
          title: 'Climate, Hydrology & Precipitation',
          excerpt: 'Intense south-west monsoon rainfall (average 2,800 mm/year) between June 1 and September 20, halting all bituminous work.',
          confidence: 0.97,
        },
      ];

      actionableInsights = [
        'Re-sequence Gantt chart to shift DBM/BC to October–February window.',
        'Increase schedule buffer by 3.5 to 4 months.',
      ];
    } else if (qLower.includes('missing') || qLower.includes('clearance') || qLower.includes('section')) {
      content = `Based on MoRTH & NEC DPR appraisal guidelines, here are the **missing components and compliance gaps**:

1. **Forest Diversion Boundary Inconsistency**:
   - Section 8.2 (Page 118) applies for **14.85 Hectares** of forest land, whereas Right of Way (RoW) drawings in Section 4.1 (Page 44) measure **18.20 Hectares** of forest area required.

2. **Missing BoQ Pricing for 19 Drainage Structures**:
   - 16 Hume pipe culverts and 3 box culverts detailed in Section 5.4 are missing from the priced BoQ Schedule B (Section 7.6).

3. **Absence of Slope Micro-piling Specification**:
   - Geotechnical investigation notes slope instability between km 22.4 and 25.1, but no engineering design or rates are included for soil nailing/micro-piling.`;

      citations = [
        {
          section: 'Section 8.2',
          page: 118,
          title: 'Environmental & Forest Regulatory Approvals',
          excerpt: 'Forest Stage-1 application submitted for 14.85 Hectares of Reserve Forest diversion.',
          confidence: 0.96,
        },
        {
          section: 'Section 4.1',
          page: 44,
          title: 'Alignment & Right of Way (RoW)',
          excerpt: 'Total forest land under proposed 24m Right-of-Way is measured at 18.20 Hectares.',
          confidence: 0.95,
        },
      ];
    } else if (qLower.includes('contingency') || qLower.includes('contingencies')) {
      content = `In **Section 7.2 (Page 94, Table 7.4)**, the Physical Contingency is budgeted at **2.5% (₹2.40 Crore)**.

**Appraisal Assessment**:
- For hill road projects in **Seismic Zone V / fragile geotechnical terrain**, standard MoRTH / CPWD guidelines recommend a minimum physical contingency of **5.0%**.
- At 2.5%, the project possesses insufficient reserve to absorb unforeseen rock over-break, landslide clearance, or slope protection enhancements.

**Recommendation**:
Increase physical contingency to 5.0% (₹5.50 Cr), which reduces cost risk by 12% in the What-If simulation model.`;

      citations = [
        {
          section: 'Section 7.2 (Table 7.4)',
          page: 94,
          title: 'Detailed Cost Abstract',
          excerpt: 'Physical Contingency @ 2.5% | ₹2.40 Crore.',
          confidence: 0.99,
        },
      ];
    } else {
      content = `Regarding your query on "${question}":

I have reviewed the indexed DPR sections for **${question}**. 

Key verified points from the report:
1. The project encompasses 48.5 km across Papum Pare and Lower Subansiri districts with an implementation target of 24 months.
2. The total capital cost in the priced Bill of Quantities is ₹124.60 Crore, requiring reconciliation with the Executive Summary figure of ₹110.00 Crore.
3. Technical specifications generally adhere to IRC:SP:20 and MoRTH hill road guidelines, but require seasonal schedule realignment to avoid Northeast monsoon disruptions.

Would you like me to pull specific excerpts or calculate the risk sensitivity impact on this aspect?`;

      citations = [
        {
          section: 'Section 1.1 - 1.4',
          page: 8,
          title: 'Executive Summary',
          excerpt: 'Rural Connectivity Improvement Project (Phase IV) specifications and project profile.',
          confidence: 0.91,
        },
      ];
    }

    return {
      id: 'msg-' + Date.now(),
      role: 'assistant',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      citations,
      grounded: true,
      actionableInsights: actionableInsights.length ? actionableInsights : undefined,
    };
  },
};
