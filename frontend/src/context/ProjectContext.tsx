import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const API_URL = "http://127.0.0.1:8000";

/* ============================================================
   BASIC TYPES
============================================================ */

export type RiskSeverity =
  | "low"
  | "medium"
  | "high"
  | "critical";

/* ============================================================
   RISK ITEM
============================================================ */

export type RiskItem = {
  id: number;
  category: string;
  severity: RiskSeverity;
  keywords: string[];
  points: number;
  title: string;
  description: string;
  probability: number;
  impact: string;
  impactScore: number;
  riskScore: number;
  xPos: number;
  yPos: number;
  recommendation: string;
  source?: string;
  page?: number;
};

/* ============================================================
   BACKEND RISK ITEM
============================================================ */

export type BackendRiskItem = {
  category: string;
  severity: string;
  keywords?: string[];
  points?: number;
  title?: string;
  description?: string;
  recommendation?: string;
  page?: number;
};

/* ============================================================
   BACKEND RISK ANALYSIS
============================================================ */

export type BackendRiskAnalysis = {
  document_id?: number;
  project_id?: number;
  filename?: string;
  score: number;
  overall_level: string;
  risk_count: number;
  risks: BackendRiskItem[];
};

/* ============================================================
   RISK DIMENSIONS
============================================================ */

export type RiskDimensions = {
  costRisk: number;
  scheduleRisk: number;
  technicalRisk: number;
  financialRisk: number;
  environmentalRisk: number;
  complianceRisk: number;
};

/* ============================================================
   HEALTH
============================================================ */

export type HealthDimension = {
  name: string;
  score: number;
  description: string;
};

export type HealthScore = {
  overall: number;
  statusText: string;
  dimensionDetails: HealthDimension[];
};

/* ============================================================
   DOCUMENT
============================================================ */

export type ProjectDocument = {
  id: number;
  filename: string;
  file_path?: string;
  document_type?: string;
  project_id: number;
  uploaded_by?: number;
  created_at?: string;
};

/* ============================================================
   PROJECT
============================================================ */

export type Project = {
  id: number;
  name: string;
  description?: string;
  code: string;
  sector: string;
  location: string;
  state: string;
  totalCostCr: number;
  approvedBudgetCr: number;
  durationMonths: number;
  implementingAgency: string;
  beneficiariesCount: number;
  lastAnalyzed: string;
  overallRisk: RiskSeverity;
  dprFile?: ProjectDocument | null;
};

/* ============================================================
   CONTRADICTION
============================================================ */

export type ContradictionSection = {
  sectionNumber: string;
  title: string;
  page: number;
  text: string;
};

export type Contradiction = {
  id: number;
  category: string;
  severity: RiskSeverity;
  title: string;
  sectionA: ContradictionSection;
  sectionB: ContradictionSection;
  aiFinding: string;
  impactDescription: string;
  financialImpactCr?: number;
  reviewed: boolean;
};

/* ============================================================
   MITIGATION
============================================================ */

export type MitigationStatus =
  | "Proposed"
  | "Accepted"
  | "Rejected"
  | "In Progress"
  | "Completed";

export type Mitigation = {
  id: number;
  riskId?: number;
  riskTitle: string;
  category: string;
  severity: RiskSeverity;
  recommendation: string;
  action: string;
  owner: string;
  timeline: string;
  status: MitigationStatus;
  expectedImpact: string;
  costCr?: number;
};

/* ============================================================
   APPRAISAL
============================================================ */

export type AppraisalRecommendation = {
  projectCapitalCostCr: number;
  currentApprovedBudgetCr: number;
  recommendedApprovalCostCr: number;
  additionalFundingRequiredCr: number;
  plannedDurationMonths: number;
  recommendedDurationMonths: number;
  scheduleBufferMonths: number;
  approvalStatus:
    | "APPROVE"
    | "APPROVE_WITH_CONDITIONS"
    | "REVISE_AND_RESUBMIT"
    | "DO_NOT_APPROVE";
  explanation: string;
};

/* ============================================================
   EVIDENCE
============================================================ */

export type EvidenceTarget = {
  page: number;
  section: string;
  title: string;
};

/* ============================================================
   TOAST
============================================================ */

export type ToastType =
  | "success"
  | "error"
  | "info"
  | "warning";

export type Toast = {
  id: number;
  message: string;
  type: ToastType;
};

/* ============================================================
   PROJECT CONTEXT
============================================================ */

type ProjectContextType = {
  activeProject: Project;

  projects: Project[];

  selectedProjectId: number | null;

  setSelectedProjectId: (id: number | null) => void;

  refreshProjects: () => Promise<void>;

  healthScore: HealthScore;

  riskAssessment: {
    dimensions: RiskDimensions;
    overallRisk: RiskSeverity;
    riskScore: number;
    riskCount: number;
    risks: RiskItem[];
  };

  criticalFindings: RiskItem[];

  contradictions: Contradiction[];

  mitigations: Mitigation[];

  appraisalRecommendation: AppraisalRecommendation;

  loadingAnalysis: boolean;

  analysisError: string;

  projectCapitalCostInput: number;

  approvedBudgetInput: number;

  durationInput: number;

  setProjectCapitalCostInput: (value: number) => void;

  setApprovedBudgetInput: (value: number) => void;

  setDurationInput: (value: number) => void;

  analyzeActiveProject: () => Promise<void>;

  markContradictionReviewed: (
    id: number,
    reviewed: boolean
  ) => void;

  updateMitigationStatus: (
    id: number,
    status: MitigationStatus
  ) => void;

  addToast: (
    message: string,
    type?: ToastType
  ) => void;

  setActiveEvidenceTarget: (
    target: EvidenceTarget | null
  ) => void;

  activeEvidenceTarget: EvidenceTarget | null;

  toasts: Toast[];
};

/* ============================================================
   CONTEXT
============================================================ */

const ProjectContext =
  createContext<ProjectContextType | null>(null);

/* ============================================================
   HELPERS
============================================================ */

function clamp(
  value: number,
  min = 0,
  max = 100
): number {
  if (!Number.isFinite(value)) {
    return min;
  }

  return Math.max(
    min,
    Math.min(max, value)
  );
}

/* ============================================================
   GET STORED USER ID
============================================================ */

function getStoredUserId(): number | null {
  const possibleKeys = [
    "user_id",
    "userId",
    "id",
  ];

  for (const key of possibleKeys) {
    const value =
      localStorage.getItem(key);

    if (value) {
      const parsed = Number(value);

      if (
        Number.isFinite(parsed) &&
        parsed > 0
      ) {
        return parsed;
      }
    }
  }

  const storedUser =
    localStorage.getItem("user");

  if (storedUser) {
    try {
      const parsedUser =
        JSON.parse(storedUser);

      const possibleUserId = Number(
        parsedUser?.id ??
          parsedUser?.user_id ??
          parsedUser?.userId
      );

      if (
        Number.isFinite(possibleUserId) &&
        possibleUserId > 0
      ) {
        return possibleUserId;
      }
    } catch {
      // Ignore invalid JSON
    }
  }

  return null;
}

/* ============================================================
   NORMALIZE SEVERITY
============================================================ */

function normalizeSeverity(
  level: string,
  score: number
): RiskSeverity {
  const value =
    String(level || "").toLowerCase();

  if (value.includes("critical")) {
    return "critical";
  }

  if (value.includes("high")) {
    return "high";
  }

  if (
    value.includes("medium") ||
    value.includes("moderate")
  ) {
    return "medium";
  }

  if (value.includes("low")) {
    return "low";
  }

  if (score >= 80) {
    return "critical";
  }

  if (score >= 60) {
    return "high";
  }

  if (score >= 35) {
    return "medium";
  }

  return "low";
}

/* ============================================================
   NORMALIZE RISK
============================================================ */

function normalizeRisk(
  risk: BackendRiskItem,
  index: number
): RiskItem {
  const points = clamp(
    Number(risk.points) || 0
  );

  const severity =
    normalizeSeverity(
      risk.severity,
      points
    );

  const probability =
    clamp(points + 5);

  const impactScore =
    clamp(points);

  const riskScore = Number(
    (
      (probability / 100) *
      (impactScore / 10)
    ).toFixed(2)
  );

  return {
    id: index + 1,

    category:
      risk.category || "General",

    severity,

    keywords:
      Array.isArray(risk.keywords)
        ? risk.keywords
        : [],

    points,

    title:
      risk.title ||
      `${risk.category || "Project"} Risk`,

    description:
      risk.description ||
      `Potential ${String(
        risk.category || "project"
      ).toLowerCase()} risk identified during DPR analysis.`,

    probability,

    impact:
      severity.charAt(0).toUpperCase() +
      severity.slice(1),

    impactScore,

    riskScore,

    xPos: probability,

    yPos: impactScore,

    recommendation:
      risk.recommendation ||
      "Review the finding and implement appropriate mitigation measures.",

    source:
      "AI DPR Risk Analysis",

    page:
      Number(risk.page) || undefined,
  };
}

/* ============================================================
   NORMALIZE PROJECT
============================================================ */

function normalizeProject(
  raw: any
): Project {
  return {
    id: Number(raw?.id) || 0,

    name:
      raw?.name ||
      "Unnamed Project",

    description:
      raw?.description || "",

    code:
      raw?.code ||
      `DPR-${raw?.id || "PROJECT"}`,

    sector:
      raw?.sector ||
      "Infrastructure",

    location:
      raw?.location ||
      "Not specified",

    state:
      raw?.state ||
      "India",

    totalCostCr: Number(
      raw?.total_cost_cr ??
        raw?.totalCostCr ??
        0
    ),

    approvedBudgetCr: Number(
      raw?.approved_budget_cr ??
        raw?.approvedBudgetCr ??
        0
    ),

    durationMonths: Number(
      raw?.duration_months ??
        raw?.durationMonths ??
        0
    ),

    implementingAgency:
      raw?.implementing_agency ??
      raw?.implementingAgency ??
      "Not specified",

    beneficiariesCount: Number(
      raw?.beneficiaries_count ??
        raw?.beneficiariesCount ??
        0
    ),

    lastAnalyzed:
      raw?.last_analyzed ??
      raw?.lastAnalyzed ??
      "Not analyzed",

    overallRisk:
      normalizeSeverity(
        raw?.overallRisk ??
          raw?.overall_risk ??
          "low",
        Number(
          raw?.risk_score ??
            raw?.riskScore ??
            0
        )
      ),

    dprFile:
      raw?.dprFile ??
      raw?.dpr_file ??
      null,
  };
}

/* ============================================================
   DEFAULT PROJECT
============================================================ */

const DEFAULT_PROJECT: Project = {
  id: 0,

  name: "No Project Selected",

  description:
    "Create or select a project to begin DPR analysis.",

  code: "DPR-000",

  sector: "Infrastructure",

  location: "Not specified",

  state: "India",

  totalCostCr: 0,

  approvedBudgetCr: 0,

  durationMonths: 0,

  implementingAgency:
    "Not specified",

  beneficiariesCount: 0,

  lastAnalyzed:
    "Not analyzed",

  overallRisk: "low",

  dprFile: null,
};

/* ============================================================
   DEFAULT HEALTH
============================================================ */

const DEFAULT_HEALTH: HealthScore = {
  overall: 0,

  statusText:
    "UPLOAD AND ANALYZE DPR",

  dimensionDetails: [],
};

/* ============================================================
   DEFAULT DIMENSIONS
============================================================ */

const DEFAULT_DIMENSIONS:
  RiskDimensions = {
  costRisk: 0,
  scheduleRisk: 0,
  technicalRisk: 0,
  financialRisk: 0,
  environmentalRisk: 0,
  complianceRisk: 0,
};

/* ============================================================
   APPRAISAL
============================================================ */

function calculateRecommendation(
  capitalCost: number,
  approvedBudget: number,
  durationMonths: number,
  riskScore: number,
  scheduleRisk: number
): AppraisalRecommendation {
  let reservePercent = 0.03;

  if (riskScore >= 80) {
    reservePercent = 0.12;
  } else if (riskScore >= 60) {
    reservePercent = 0.08;
  } else if (riskScore >= 35) {
    reservePercent = 0.05;
  }

  const baseCost =
    Math.max(
      capitalCost || 0,
      approvedBudget || 0
    );

  const recommendedApprovalCost =
    Number(
      (
        baseCost *
        (1 + reservePercent)
      ).toFixed(2)
    );

  const additionalFunding =
    Number(
      Math.max(
        0,
        recommendedApprovalCost -
          approvedBudget
      ).toFixed(2)
    );

  let bufferPercent = 0.05;

  if (scheduleRisk >= 80) {
    bufferPercent = 0.17;
  } else if (scheduleRisk >= 60) {
    bufferPercent = 0.12;
  } else if (scheduleRisk >= 35) {
    bufferPercent = 0.08;
  }

  const safeDuration =
    durationMonths > 0
      ? durationMonths
      : 12;

  const scheduleBufferMonths =
    Math.max(
      1,
      Math.ceil(
        safeDuration *
          bufferPercent
      )
    );

  const recommendedDuration =
    safeDuration +
    scheduleBufferMonths;

  let approvalStatus:
    | "APPROVE"
    | "APPROVE_WITH_CONDITIONS"
    | "REVISE_AND_RESUBMIT"
    | "DO_NOT_APPROVE";

  if (riskScore >= 85) {
    approvalStatus =
      "DO_NOT_APPROVE";
  } else if (riskScore >= 65) {
    approvalStatus =
      "REVISE_AND_RESUBMIT";
  } else if (riskScore >= 35) {
    approvalStatus =
      "APPROVE_WITH_CONDITIONS";
  } else {
    approvalStatus =
      "APPROVE";
  }

  let explanation =
    "Risk exposure is within the acceptable appraisal range.";

  if (
    approvalStatus ===
    "DO_NOT_APPROVE"
  ) {
    explanation =
      "Critical risk exposure must be resolved before approval.";
  } else if (
    approvalStatus ===
    "REVISE_AND_RESUBMIT"
  ) {
    explanation =
      "Major risk findings should be addressed and the DPR revised before approval.";
  } else if (
    approvalStatus ===
    "APPROVE_WITH_CONDITIONS"
  ) {
    explanation =
      "The project may be considered subject to mitigation of identified risks.";
  }

  return {
    projectCapitalCostCr:
      capitalCost || 0,

    currentApprovedBudgetCr:
      approvedBudget || 0,

    recommendedApprovalCostCr:
      recommendedApprovalCost,

    additionalFundingRequiredCr:
      additionalFunding,

    plannedDurationMonths:
      safeDuration,

    recommendedDurationMonths:
      recommendedDuration,

    scheduleBufferMonths,

    approvalStatus,

    explanation,
  };
}

/* ============================================================
   PROVIDER
============================================================ */

export const ProjectProvider:
  React.FC<{
    children: React.ReactNode;
  }> = ({ children }) => {
    const [projects, setProjects] =
      useState<Project[]>([]);

    const [
      selectedProjectId,
      setSelectedProjectIdState,
    ] =
      useState<number | null>(() => {
        const saved =
          localStorage.getItem(
            "active_project_id"
          );

        if (!saved) {
          return null;
        }

        const parsed = Number(saved);

        return Number.isFinite(parsed)
          ? parsed
          : null;
      });

    const [healthScore, setHealthScore] =
      useState<HealthScore>(
        DEFAULT_HEALTH
      );

    const [
      riskAssessment,
      setRiskAssessment,
    ] = useState({
      dimensions:
        DEFAULT_DIMENSIONS,

      overallRisk:
        "low" as RiskSeverity,

      riskScore: 0,

      riskCount: 0,

      risks: [] as RiskItem[],
    });

    const [
      criticalFindings,
      setCriticalFindings,
    ] = useState<RiskItem[]>([]);

    const [
      contradictions,
      setContradictions,
    ] =
      useState<Contradiction[]>([]);

    const [
      mitigations,
      setMitigations,
    ] =
      useState<Mitigation[]>([]);

    const [
      appraisalRecommendation,
      setAppraisalRecommendation,
    ] =
      useState<AppraisalRecommendation>(
        calculateRecommendation(
          0,
          0,
          12,
          0,
          0
        )
      );

    const [
      projectCapitalCostInput,
      setProjectCapitalCostInput,
    ] =
      useState<number>(0);

    const [
      approvedBudgetInput,
      setApprovedBudgetInput,
    ] =
      useState<number>(0);

    const [
      durationInput,
      setDurationInput,
    ] =
      useState<number>(0);

    const [
      loadingAnalysis,
      setLoadingAnalysis,
    ] =
      useState<boolean>(false);

    const [
      analysisError,
      setAnalysisError,
    ] =
      useState<string>("");

    const [
      activeEvidenceTarget,
      setActiveEvidenceTarget,
    ] =
      useState<EvidenceTarget | null>(
        null
      );

    const [toasts, setToasts] =
      useState<Toast[]>([]);

    /* ========================================================
       TOAST
    ======================================================== */

    const addToast =
      useCallback(
        (
          message: string,
          type: ToastType = "info"
        ) => {
          const id =
            Date.now();

          setToasts(
            (previous) => [
              ...previous,
              {
                id,
                message,
                type,
              },
            ]
          );

          window.setTimeout(
            () => {
              setToasts(
                (previous) =>
                  previous.filter(
                    (toast) =>
                      toast.id !==
                      id
                  )
              );
            },
            3500
          );
        },
        []
      );

    /* ========================================================
       ACTIVE PROJECT
    ======================================================== */

    const activeProject =
      useMemo<Project>(() => {
        if (
          selectedProjectId !== null
        ) {
          const found =
            projects.find(
              (project) =>
                project.id ===
                selectedProjectId
            );

          if (found) {
            return found;
          }
        }

        return (
          projects[0] ??
          DEFAULT_PROJECT
        );
      }, [
        projects,
        selectedProjectId,
      ]);

    /* ========================================================
       SELECT PROJECT
    ======================================================== */

    const setSelectedProjectId =
      useCallback(
        (id: number | null) => {
          setSelectedProjectIdState(
            id
          );

          if (id !== null) {
            localStorage.setItem(
              "active_project_id",
              String(id)
            );
          } else {
            localStorage.removeItem(
              "active_project_id"
            );
          }
        },
        []
      );

    /* ========================================================
       LOAD PROJECTS
    ======================================================== */

    const refreshProjects =
      useCallback(
        async (): Promise<void> => {
          try {
            setAnalysisError("");

            const userId =
              getStoredUserId();

            console.log(
              "[ProjectContext] userId:",
              userId
            );

            if (userId === null) {
              setProjects([]);

              setSelectedProjectIdState(
                null
              );

              console.warn(
                "[ProjectContext] No user ID found."
              );

              return;
            }

            const url =
              `${API_URL}/projects/?user_id=${encodeURIComponent(
                String(userId)
              )}`;

            console.log(
              "[ProjectContext] Fetching:",
              url
            );

            const response =
              await fetch(url);

            const responseText =
              await response.text();

            console.log(
              "[ProjectContext] Status:",
              response.status
            );

            if (!response.ok) {
              let detail =
                `Failed to load projects (${response.status})`;

              try {
                const parsed =
                  JSON.parse(
                    responseText
                  );

                if (
                  typeof parsed?.detail ===
                  "string"
                ) {
                  detail =
                    parsed.detail;
                }
              } catch {
                // Ignore
              }

              throw new Error(
                detail
              );
            }

            let data: any;

            try {
              data =
                JSON.parse(
                  responseText
                );
            } catch {
              throw new Error(
                "Backend returned invalid project JSON."
              );
            }

            if (!Array.isArray(data)) {
              throw new Error(
                "Backend project response is not an array."
              );
            }

            const normalizedProjects =
              data.map(
                (project) =>
                  normalizeProject(
                    project
                  )
              );

            console.log(
              "[ProjectContext] Projects:",
              normalizedProjects
            );

            setProjects(
              normalizedProjects
            );

            const savedId =
              localStorage.getItem(
                "active_project_id"
              );

            if (savedId) {
              const numericId =
                Number(savedId);

              const savedProject =
                normalizedProjects.find(
                  (project) =>
                    project.id ===
                    numericId
                );

              if (savedProject) {
                setSelectedProjectIdState(
                  numericId
                );

                return;
              }
            }

            if (
              normalizedProjects.length >
              0
            ) {
              const firstProject =
                normalizedProjects[0];

              setSelectedProjectIdState(
                firstProject.id
              );

              localStorage.setItem(
                "active_project_id",
                String(
                  firstProject.id
                )
              );
            } else {
              setSelectedProjectIdState(
                null
              );

              localStorage.removeItem(
                "active_project_id"
              );
            }
          } catch (error) {
            console.error(
              "[ProjectContext] Project loading error:",
              error
            );

            setProjects([]);

            const message =
              error instanceof Error
                ? error.message
                : "Unable to load projects.";

            setAnalysisError(
              message
            );
          }
        },
        []
      );

    /* ========================================================
       LOAD PROJECTS ON START
    ======================================================== */

    useEffect(() => {
      void refreshProjects();
    }, [refreshProjects]);

    /* ========================================================
       RESET PROJECT ANALYSIS
    ======================================================== */

    useEffect(() => {
      setHealthScore(
        DEFAULT_HEALTH
      );

      setRiskAssessment({
        dimensions:
          DEFAULT_DIMENSIONS,

        overallRisk: "low",

        riskScore: 0,

        riskCount: 0,

        risks: [],
      });

      setCriticalFindings([]);

      setContradictions([]);

      setMitigations([]);

      setAnalysisError("");

      setProjectCapitalCostInput(
        activeProject.totalCostCr
      );

      setApprovedBudgetInput(
        activeProject.approvedBudgetCr
      );

      setDurationInput(
        activeProject.durationMonths
      );

      if (activeProject.id > 0) {
        localStorage.setItem(
          "active_project_id",
          String(
            activeProject.id
          )
        );
      }
    }, [
      activeProject.id,
      activeProject.totalCostCr,
      activeProject.approvedBudgetCr,
      activeProject.durationMonths,
    ]);

    /* ========================================================
       GET LATEST DOCUMENT
    ======================================================== */

    const getLatestDocument =
      useCallback(
        async (): Promise<ProjectDocument> => {
          if (
            activeProject.id <= 0
          ) {
            throw new Error(
              "Please select a project first."
            );
          }

          const response =
            await fetch(
              `${API_URL}/documents/project/${activeProject.id}`
            );

          const text =
            await response.text();

          if (!response.ok) {
            let message =
              "Unable to load project documents.";

            try {
              const data =
                JSON.parse(text);

              if (
                typeof data?.detail ===
                "string"
              ) {
                message =
                  data.detail;
              }
            } catch {
              // Ignore
            }

            throw new Error(
              message
            );
          }

          let documents: any;

          try {
            documents =
              JSON.parse(text);
          } catch {
            throw new Error(
              "Invalid document response from backend."
            );
          }

          if (
            !Array.isArray(
              documents
            ) ||
            documents.length === 0
          ) {
            throw new Error(
              "No DPR document has been uploaded for this project."
            );
          }

          return documents[0] as ProjectDocument;
        },
        [activeProject.id]
      );

    /* ========================================================
       CALCULATE DIMENSIONS
    ======================================================== */

    const calculateDimensions =
      (
        risks: RiskItem[],
        overall: number
      ): RiskDimensions => {
        const dimensions: RiskDimensions =
          {
            costRisk: overall,
            scheduleRisk: overall,
            technicalRisk: overall,
            financialRisk: overall,
            environmentalRisk: overall,
            complianceRisk: overall,
          };

        const values: Record<
          keyof RiskDimensions,
          number[]
        > = {
          costRisk: [],
          scheduleRisk: [],
          technicalRisk: [],
          financialRisk: [],
          environmentalRisk: [],
          complianceRisk: [],
        };

        risks.forEach(
          (risk) => {
            const category =
              String(
                risk.category || ""
              ).toLowerCase();

            const score =
              clamp(risk.points);

            if (
              category.includes("cost") ||
              category.includes("budget")
            ) {
              values.costRisk.push(
                score
              );
            }

            if (
              category.includes(
                "schedule"
              ) ||
              category.includes("delay") ||
              category.includes("time")
            ) {
              values.scheduleRisk.push(
                score
              );
            }

            if (
              category.includes(
                "technical"
              ) ||
              category.includes(
                "engineering"
              )
            ) {
              values.technicalRisk.push(
                score
              );
            }

            if (
              category.includes(
                "financial"
              ) ||
              category.includes("funding")
            ) {
              values.financialRisk.push(
                score
              );
            }

            if (
              category.includes(
                "environment"
              ) ||
              category.includes("forest")
            ) {
              values.environmentalRisk.push(
                score
              );
            }

            if (
              category.includes(
                "compliance"
              ) ||
              category.includes(
                "clearance"
              ) ||
              category.includes(
                "regulatory"
              )
            ) {
              values.complianceRisk.push(
                score
              );
            }
          }
        );

        (
          Object.keys(
            dimensions
          ) as Array<
            keyof RiskDimensions
          >
        ).forEach(
          (key) => {
            if (
              values[key].length > 0
            ) {
              dimensions[key] =
                clamp(
                  values[key].reduce(
                    (
                      total,
                      value
                    ) =>
                      total + value,
                    0
                  ) /
                    values[key]
                      .length
                );
            }
          }
        );

        return dimensions;
      };

    /* ========================================================
       HEALTH
    ======================================================== */

    const calculateHealth =
      (
        dimensions: RiskDimensions,
        riskScore: number
      ): HealthScore => {
        const overall =
          Math.round(
            clamp(
              100 - riskScore
            )
          );

        const dimensionDetails: HealthDimension[] =
          [
            {
              name: "Completeness",
              score:
                100 -
                dimensions.complianceRisk,
              description:
                "Coverage of required DPR information and supporting documentation.",
            },
            {
              name: "Consistency",
              score:
                100 -
                Math.max(
                  dimensions.costRisk,
                  dimensions.scheduleRisk
                ),
              description:
                "Consistency between cost, schedule and project assumptions.",
            },
            {
              name:
                "Technical Conformance",
              score:
                100 -
                dimensions.technicalRisk,
              description:
                "Technical adequacy and engineering risk exposure.",
            },
            {
              name:
                "Financial Soundness",
              score:
                100 -
                dimensions.financialRisk,
              description:
                "Financial viability and cost-risk exposure.",
            },
            {
              name:
                "Environmental",
              score:
                100 -
                dimensions.environmentalRisk,
              description:
                "Environmental and clearance-related risk.",
            },
            {
              name: "Compliance",
              score:
                100 -
                dimensions.complianceRisk,
              description:
                "Regulatory and approval compliance.",
            },
          ].map(
            (item) => ({
              ...item,
              score:
                Math.round(
                  clamp(item.score)
                ),
            })
          );

        let statusText =
          "GOOD DOCUMENT HEALTH";

        if (overall < 60) {
          statusText =
            "CRITICAL DOCUMENT DEFICIENCIES";
        } else if (overall < 75) {
          statusText =
            "MODERATE DOCUMENT RISK";
        } else if (overall < 90) {
          statusText =
            "GOOD — REVIEW IDENTIFIED RISKS";
        }

        return {
          overall,
          statusText,
          dimensionDetails,
        };
      };

    /* ========================================================
       CONTRADICTIONS
    ======================================================== */

    const createContradictions =
      (
        risks: RiskItem[]
      ): Contradiction[] => {
        return risks
          .filter(
            (risk) =>
              risk.severity ===
                "critical" ||
              risk.severity ===
                "high"
          )
          .slice(0, 10)
          .map(
            (
              risk,
              index
            ) => ({
              id: index + 1,

              category:
                risk.category ||
                "General",

              severity:
                risk.severity,

              title:
                `Potential inconsistency in ${risk.category}`,

              sectionA: {
                sectionNumber:
                  "DPR Analysis",

                title:
                  "Risk Finding",

                page:
                  risk.page || 1,

                text:
                  risk.description,
              },

              sectionB: {
                sectionNumber:
                  "Risk Assessment",

                title:
                  "AI Assessment",

                page:
                  risk.page || 1,

                text:
                  risk.recommendation,
              },

              aiFinding:
                risk.description,

              impactDescription:
                risk.recommendation,

              financialImpactCr:
                risk.category
                  .toLowerCase()
                  .includes("cost")
                  ? risk.points
                  : undefined,

              reviewed: false,
            })
          );
      };

    /* ========================================================
       MITIGATIONS
    ======================================================== */

    const createMitigations =
      (
        risks: RiskItem[]
      ): Mitigation[] => {
        return risks.map(
          (
            risk,
            index
          ) => ({
            id: index + 1,

            riskId: risk.id,

            riskTitle:
              risk.title,

            category:
              risk.category,

            severity:
              risk.severity,

            recommendation:
              risk.recommendation,

            action:
              `Review and mitigate the identified ${risk.category.toLowerCase()} risk.`,

            owner:
              "Project Implementation Agency",

            timeline:
              risk.severity ===
              "critical"
                ? "Immediate"
                : risk.severity ===
                  "high"
                ? "Within 30 days"
                : "Within 60 days",

            status: "Proposed",

            expectedImpact:
              "Reduce project risk exposure and improve DPR readiness.",
          })
        );
      };

    /* ========================================================
       ANALYZE ACTIVE PROJECT
    ======================================================== */

    const analyzeActiveProject =
      useCallback(
        async (): Promise<void> => {
          setLoadingAnalysis(true);
          setAnalysisError("");

          try {
            if (
              activeProject.id <= 0
            ) {
              throw new Error(
                "Please select a project first."
              );
            }

            const document =
              await getLatestDocument();

            console.log(
              "[Analysis] Document:",
              document
            );

            const riskResponse =
              await fetch(
                `${API_URL}/documents/${document.id}/risks`
              );

            const riskText =
              await riskResponse.text();

            let riskData:
              | BackendRiskAnalysis
              | { detail?: string };

            try {
              riskData =
                JSON.parse(
                  riskText
                );
            } catch {
              throw new Error(
                "Invalid response received from risk analysis API."
              );
            }

            if (!riskResponse.ok) {
              throw new Error(
                typeof (
                  riskData as any
                )?.detail ===
                  "string"
                  ? (
                      riskData as any
                    ).detail
                  : "Risk analysis failed."
              );
            }

            const typedRiskData =
              riskData as BackendRiskAnalysis;

            const rawRisks =
              Array.isArray(
                typedRiskData.risks
              )
                ? typedRiskData.risks
                : [];

            const risks =
              rawRisks.map(
                (
                  risk,
                  index
                ) =>
                  normalizeRisk(
                    risk,
                    index
                  )
              );

            const riskScore =
              clamp(
                Number(
                  typedRiskData.score
                ) || 0
              );

            const overallRisk =
              normalizeSeverity(
                typedRiskData.overall_level,
                riskScore
              );

            const dimensions =
              calculateDimensions(
                risks,
                riskScore
              );

            const calculatedHealth =
              calculateHealth(
                dimensions,
                riskScore
              );

            const recommendation =
              calculateRecommendation(
                projectCapitalCostInput,
                approvedBudgetInput,
                durationInput ||
                  12,
                riskScore,
                dimensions.scheduleRisk
              );

            setHealthScore(
              calculatedHealth
            );

            setRiskAssessment({
              dimensions,

              overallRisk,

              riskScore,

              riskCount:
                Number(
                  typedRiskData.risk_count
                ) ||
                risks.length,

              risks,
            });

            setCriticalFindings(
              risks
                .filter(
                  (risk) =>
                    risk.severity ===
                      "critical" ||
                    risk.severity ===
                      "high"
                )
                .slice(0, 6)
            );

            setContradictions(
              createContradictions(
                risks
              )
            );

            setMitigations(
              createMitigations(
                risks
              )
            );

            setAppraisalRecommendation(
              recommendation
            );

            /* =================================================
               SAVE PROJECT-SPECIFIC ANALYSIS
            ================================================= */

            const storageKey =
              `dpr_analysis_project_${activeProject.id}`;

            localStorage.setItem(
              storageKey,
              JSON.stringify({
                projectId:
                  activeProject.id,

                documentId:
                  document.id,

                filename:
                  document.filename,

                riskData,

                risks,

                dimensions,

                health:
                  calculatedHealth,

                recommendation,

                analyzedAt:
                  new Date().toISOString(),
              })
            );

            localStorage.setItem(
              "active_document_id",
              String(
                document.id
              )
            );

            localStorage.setItem(
              "active_document_name",
              document.filename
            );

            addToast(
              "DPR analysis completed successfully.",
              "success"
            );
          } catch (error) {
            console.error(
              "[Analysis] Error:",
              error
            );

            const message =
              error instanceof Error
                ? error.message
                : "DPR analysis failed.";

            setAnalysisError(
              message
            );

            addToast(
              message,
              "error"
            );
          } finally {
            setLoadingAnalysis(false);
          }
        },
        [
          activeProject.id,
          getLatestDocument,
          projectCapitalCostInput,
          approvedBudgetInput,
          durationInput,
          addToast,
        ]
      );

    /* ========================================================
       RESTORE PROJECT-SPECIFIC ANALYSIS
    ======================================================== */

    useEffect(() => {
      if (
        activeProject.id <= 0
      ) {
        return;
      }

      const storageKey =
        `dpr_analysis_project_${activeProject.id}`;

      const saved =
        localStorage.getItem(
          storageKey
        );

      if (!saved) {
        return;
      }

      try {
        const data =
          JSON.parse(saved);

        if (data.health) {
          setHealthScore(
            data.health
          );
        }

        const risks: RiskItem[] =
          Array.isArray(
            data.risks
          )
            ? data.risks
            : [];

        const riskData =
          data.riskData ?? {};

        const riskScore =
          Number(
            riskData.score
          ) || 0;

        const overallRisk =
          normalizeSeverity(
            riskData.overall_level,
            riskScore
          );

        if (
          data.dimensions
        ) {
          setRiskAssessment({
            dimensions:
              data.dimensions,

            overallRisk,

            riskScore,

            riskCount:
              Number(
                riskData.risk_count
              ) ||
              risks.length,

            risks,
          });

          setCriticalFindings(
            risks
              .filter(
                (risk) =>
                  risk.severity ===
                    "critical" ||
                  risk.severity ===
                    "high"
              )
              .slice(0, 6)
          );

          setContradictions(
            createContradictions(
              risks
            )
          );

          setMitigations(
            createMitigations(
              risks
            )
          );
        }

        if (
          data.recommendation
        ) {
          setAppraisalRecommendation(
            data.recommendation
          );

          setProjectCapitalCostInput(
            Number(
              data.recommendation
                .projectCapitalCostCr
            ) || 0
          );

          setApprovedBudgetInput(
            Number(
              data.recommendation
                .currentApprovedBudgetCr
            ) || 0
          );

          setDurationInput(
            Number(
              data.recommendation
                .plannedDurationMonths
            ) || 0
          );
        }
      } catch (error) {
        console.error(
          "Failed to restore project analysis:",
          error
        );
      }
    }, [activeProject.id]);

    /* ========================================================
       CONTRADICTION REVIEW
    ======================================================== */

    const markContradictionReviewed =
      useCallback(
        (
          id: number,
          reviewed: boolean
        ) => {
          setContradictions(
            (previous) =>
              previous.map(
                (item) =>
                  item.id === id
                    ? {
                        ...item,
                        reviewed,
                      }
                    : item
              )
          );
        },
        []
      );

    /* ========================================================
       MITIGATION STATUS
    ======================================================== */

    const updateMitigationStatus =
      useCallback(
        (
          id: number,
          status: MitigationStatus
        ) => {
          setMitigations(
            (previous) =>
              previous.map(
                (item) =>
                  item.id === id
                    ? {
                        ...item,
                        status,
                      }
                    : item
              )
          );
        },
        []
      );

    /* ========================================================
       CONTEXT VALUE
    ======================================================== */

    const contextValue =
      useMemo<ProjectContextType>(
        () => ({
          activeProject,

          projects,

          selectedProjectId,

          setSelectedProjectId,

          refreshProjects,

          healthScore,

          riskAssessment,

          criticalFindings,

          contradictions,

          mitigations,

          appraisalRecommendation,

          loadingAnalysis,

          analysisError,

          projectCapitalCostInput,

          approvedBudgetInput,

          durationInput,

          setProjectCapitalCostInput,

          setApprovedBudgetInput,

          setDurationInput,

          analyzeActiveProject,

          markContradictionReviewed,

          updateMitigationStatus,

          addToast,

          setActiveEvidenceTarget,

          activeEvidenceTarget,

          toasts,
        }),
        [
          activeProject,
          projects,
          selectedProjectId,
          setSelectedProjectId,
          refreshProjects,
          healthScore,
          riskAssessment,
          criticalFindings,
          contradictions,
          mitigations,
          appraisalRecommendation,
          loadingAnalysis,
          analysisError,
          projectCapitalCostInput,
          approvedBudgetInput,
          durationInput,
          analyzeActiveProject,
          markContradictionReviewed,
          updateMitigationStatus,
          addToast,
          activeEvidenceTarget,
          toasts,
        ]
      );

    /* ========================================================
       PROVIDER
    ======================================================== */

    return (
      <ProjectContext.Provider
        value={contextValue}
      >
        {children}
      </ProjectContext.Provider>
    );
  };

/* ============================================================
   HOOK
============================================================ */

export function useProject(): ProjectContextType {
  const context =
    useContext(ProjectContext);

  if (!context) {
    throw new Error(
      "useProject must be used inside ProjectProvider"
    );
  }

  return context;
}