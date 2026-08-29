import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const API_URL =
  "http://127.0.0.1:8000";


// ============================================================
// TYPES
// ============================================================

export type RiskSeverity =
  | "low"
  | "medium"
  | "high"
  | "critical";

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
};

export type RiskDimensions = {
  costRisk: number;
  scheduleRisk: number;
  technicalRisk: number;
  financialRisk: number;
  environmentalRisk: number;
  complianceRisk: number;
};

export type ProjectDocument = {
  id: number;
  filename: string;
  file_path?: string;
  document_type?: string;
  project_id: number;
  uploaded_by?: number;
  created_at?: string;
};

export type Project = {
  id: number;
  name: string;
  description?: string;

  totalCostCr: number;
  approvedBudgetCr: number;
  durationMonths: number;

  location: string;
  state: string;
  sector: string;

  implementingAgency: string;
  beneficiariesCount: number;

  overallRisk: RiskSeverity;

  dprFile?: ProjectDocument | null;
};

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
};

export type HealthScore = {
  overall: number;
  statusText: string;
};

export type EvidenceTarget = {
  page: number;
  section: string;
  title: string;
};

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

export type ProjectContextType = {
  activeProject: Project;

  projects: Project[];

  selectedProjectId:
    | number
    | null;

  setSelectedProjectId: (
    id: number | null
  ) => void;

  refreshProjects: () => Promise<void>;

  analyzeActiveProject: () => Promise<void>;

  loadingAnalysis: boolean;

  analysisError: string;

  healthScore: HealthScore;

  riskAssessment: {
    riskScore: number;
    riskCount: number;
    overallRisk: RiskSeverity;
    dimensions: RiskDimensions;
    risks: RiskItem[];
  };

  criticalFindings: RiskItem[];

  contradictions: Contradiction[];

  mitigations: Mitigation[];

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

  toasts: Toast[];

  activeEvidenceTarget:
    | EvidenceTarget
    | null;

  setActiveEvidenceTarget: (
    target: EvidenceTarget | null
  ) => void;

  appraisalRecommendation: {
    projectCapitalCostCr: number;
    recommendedApprovalCostCr: number;
    riskReserveCr: number;
  };
};


// ============================================================
// CONTEXT
// ============================================================

export const ProjectContext =
  createContext<
    ProjectContextType | null
  >(null);


// ============================================================
// DEFAULT
// ============================================================

const EMPTY_PROJECT: Project = {
  id: 0,

  name:
    "No Project Selected",

  description:
    "",

  totalCostCr:
    0,

  approvedBudgetCr:
    0,

  durationMonths:
    0,

  location:
    "Not specified",

  state:
    "India",

  sector:
    "Infrastructure",

  implementingAgency:
    "Not specified",

  beneficiariesCount:
    0,

  overallRisk:
    "low",

  dprFile:
    null,
};


// ============================================================
// HELPERS
// ============================================================

function getUserId():
  number | null {

  const direct =
    localStorage.getItem(
      "user_id"
    );


  if (direct) {

    const value =
      Number(
        direct
      );


    if (
      Number.isFinite(
        value
      ) &&
      value > 0
    ) {

      return value;
    }
  }


  const userString =
    localStorage.getItem(
      "user"
    );


  if (!userString) {
    return null;
  }


  try {

    const user =
      JSON.parse(
        userString
      );


    const value =
      Number(
        user?.id ??
          user?.user_id ??
          user?.userId
      );


    if (
      Number.isFinite(
        value
      ) &&
      value > 0
    ) {

      return value;
    }

  } catch {
    return null;
  }


  return null;
}


function clamp(
  value: number
): number {

  if (
    !Number.isFinite(
      value
    )
  ) {

    return 0;
  }


  return Math.max(
    0,
    Math.min(
      100,
      value
    )
  );
}


function normalizeSeverity(
  value: string,
  score: number
): RiskSeverity {

  const text =
    String(
      value || ""
    )
      .toLowerCase()
      .trim();


  if (
    text ===
    "critical"
  ) {

    return "critical";
  }


  if (
    text ===
    "high"
  ) {

    return "high";
  }


  if (
    text ===
      "medium" ||
    text ===
      "moderate"
  ) {

    return "medium";
  }


  if (
    text ===
    "low"
  ) {

    return "low";
  }


  if (
    score >=
    75
  ) {

    return "critical";
  }


  if (
    score >=
    60
  ) {

    return "high";
  }


  if (
    score >=
    35
  ) {

    return "medium";
  }


  return "low";
}


function normalizeProject(
  raw: any
): Project {

  return {
    id:
      Number(
        raw?.id
      ) || 0,

    name:
      String(
        raw?.name ??
          "Unnamed Project"
      ),

    description:
      String(
        raw?.description ??
          ""
      ),

    totalCostCr:
      Number(
        raw?.total_cost_cr ??
          raw?.totalCostCr ??
          0
      ),

    approvedBudgetCr:
      Number(
        raw?.approved_budget_cr ??
          raw?.approvedBudgetCr ??
          0
      ),

    durationMonths:
      Number(
        raw?.duration_months ??
          raw?.durationMonths ??
          0
      ),

    location:
      String(
        raw?.location ??
          "Not specified"
      ),

    state:
      String(
        raw?.state ??
          "India"
      ),

    sector:
      String(
        raw?.sector ??
          "Infrastructure"
      ),

    implementingAgency:
      String(
        raw?.implementing_agency ??
          raw?.implementingAgency ??
          "Not specified"
      ),

    beneficiariesCount:
      Number(
        raw?.beneficiaries_count ??
          raw?.beneficiariesCount ??
          0
      ),

    overallRisk:
      normalizeSeverity(
        String(
          raw?.overall_risk ??
            raw?.overallRisk ??
            "LOW"
        ),
        0
      ),

    dprFile:
      raw?.dprFile ??
      raw?.dpr_file ??
      null,
  };
}


// ============================================================
// PROVIDER
// ============================================================

export const ProjectProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children,
}) => {

  const [
    projects,
    setProjects,
  ] =
    useState<Project[]>(
      []
    );


  const [
    selectedProjectId,
    setSelectedProjectIdState,
  ] =
    useState<
      number | null
    >(() => {

      const id =
        Number(
          localStorage.getItem(
            "active_project_id"
          )
        );


      return Number.isFinite(
        id
      ) && id > 0
        ? id
        : null;
    });


  const [
    loadingAnalysis,
    setLoadingAnalysis,
  ] =
    useState(false);


  const [
    analysisError,
    setAnalysisError,
  ] =
    useState("");


  const [
    riskAssessment,
    setRiskAssessment,
  ] =
    useState({
      riskScore:
        0,

      riskCount:
        0,

      overallRisk:
        "low" as RiskSeverity,

      dimensions: {
        costRisk:
          0,

        scheduleRisk:
          0,

        technicalRisk:
          0,

        financialRisk:
          0,

        environmentalRisk:
          0,

        complianceRisk:
          0,
      },

      risks:
        [] as RiskItem[],
    });


  const [
    healthScore,
    setHealthScore,
  ] =
    useState<HealthScore>({
      overall:
        0,

      statusText:
        "NO DPR ANALYZED",
    });


  const [
    criticalFindings,
    setCriticalFindings,
  ] =
    useState<RiskItem[]>(
      []
    );


  const [
    contradictions,
    setContradictions,
  ] =
    useState<
      Contradiction[]
    >([]);


  const [
    mitigations,
    setMitigations,
  ] =
    useState<
      Mitigation[]
    >([]);


  const [
    toasts,
    setToasts,
  ] =
    useState<Toast[]>(
      []
    );


  const [
    activeEvidenceTarget,
    setActiveEvidenceTarget,
  ] =
    useState<
      EvidenceTarget | null
    >(null);


  // ==========================================================
  // ACTIVE PROJECT
  // ==========================================================

  const activeProject =
    projects.find(
      (
        project
      ) =>
        project.id ===
        selectedProjectId
    ) ??
    projects[0] ??
    EMPTY_PROJECT;


  // ==========================================================
  // SELECT
  // ==========================================================

  const setSelectedProjectId =
    useCallback(
      (
        id: number | null
      ) => {

        setSelectedProjectIdState(
          id
        );


        if (
          id !== null
        ) {

          localStorage.setItem(
            "active_project_id",
            String(
              id
            )
          );

          const project =
            projects.find(
              (
                item
              ) =>
                item.id ===
                id
            );


          if (
            project
          ) {

            localStorage.setItem(
              "active_project_name",
              project.name
            );
          }

        }

      },
      [
        projects,
      ]
    );


  // ==========================================================
  // TOAST
  // ==========================================================

  const addToast =
    useCallback(
      (
        message: string,
        type:
          ToastType =
          "info"
      ) => {

        const id =
          Date.now();


        setToasts(
          (
            previous
          ) => [
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
              (
                previous
              ) =>
                previous.filter(
                  (
                    toast
                  ) =>
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


  // ==========================================================
  // REFRESH PROJECTS
  // ==========================================================

  const refreshProjects =
    useCallback(
      async (): Promise<void> => {

        const userId =
          getUserId();


        if (
          userId ===
          null
        ) {

          setProjects(
            []
          );

          return;
        }


        try {

          const response =
            await fetch(
              `${API_URL}/projects/?user_id=${encodeURIComponent(
                String(
                  userId
                )
              )}`,
              {
                headers: {
                  Accept:
                    "application/json",
                },
              }
            );


          if (
            !response.ok
          ) {

            throw new Error(
              "Could not load projects."
            );
          }


          const json =
            await response.json();


          if (
            !Array.isArray(
              json
            )
          ) {

            setProjects(
              []
            );

            return;
          }


          const normalized =
            json
              .map(
                (
                  item
                ) =>
                  normalizeProject(
                    item
                  )
              )
              .filter(
                (
                  project
                ) =>
                  project.id >
                  0
              );


          setProjects(
            normalized
          );


          const savedId =
            Number(
              localStorage.getItem(
                "active_project_id"
              )
            );


          if (
            Number.isFinite(
              savedId
            ) &&
            normalized.some(
              (
                project
              ) =>
                project.id ===
                savedId
            )
          ) {

            setSelectedProjectIdState(
              savedId
            );

          } else if (
            normalized.length >
            0
          ) {

            setSelectedProjectIdState(
              normalized[0].id
            );

            localStorage.setItem(
              "active_project_id",
              String(
                normalized[0].id
              )
            );

            localStorage.setItem(
              "active_project_name",
              normalized[0].name
            );
          }

        } catch (
          error
        ) {

          console.error(
            "PROJECT REFRESH ERROR:",
            error
          );

          setProjects(
            []
          );
        }

      },
      []
    );


  // ==========================================================
  // LOAD
  // ==========================================================

  useEffect(
    () => {

      void refreshProjects();

    },
    [
      refreshProjects,
    ]
  );


  // ==========================================================
  // ANALYZE ACTIVE PROJECT
  // ==========================================================

  const analyzeActiveProject =
    useCallback(
      async (): Promise<void> => {

        if (
          activeProject.id <=
          0
        ) {

          return;
        }


        setLoadingAnalysis(
          true
        );

        setAnalysisError("");


        try {

          const documentsResponse =
            await fetch(
              `${API_URL}/documents/project/${activeProject.id}`,
              {
                headers: {
                  Accept:
                    "application/json",
                },
              }
            );


          if (
            !documentsResponse.ok
          ) {

            throw new Error(
              "Could not load DPR documents."
            );
          }


          const documents =
            await documentsResponse.json();


          if (
            !Array.isArray(
              documents
            ) ||
            documents.length ===
              0
          ) {

            setRiskAssessment(
              {
                riskScore:
                  0,

                riskCount:
                  0,

                overallRisk:
                  "low",

                dimensions:
                  {
                    costRisk:
                      0,

                    scheduleRisk:
                      0,

                    technicalRisk:
                      0,

                    financialRisk:
                      0,

                    environmentalRisk:
                      0,

                    complianceRisk:
                      0,
                  },

                risks:
                  [],
              }
            );


            setCriticalFindings(
              []
            );


            setMitigations(
              []
            );


            setHealthScore(
              {
                overall:
                  0,

                statusText:
                  "NO DPR ANALYZED",
              }
            );


            setContradictions(
              []
            );


            return;
          }


          const document =
            documents[0];


          const riskResponse =
            await fetch(
              `${API_URL}/documents/${document.id}/risks`,
              {
                headers: {
                  Accept:
                    "application/json",
                },
              }
            );


          if (
            !riskResponse.ok
          ) {

            throw new Error(
              "Could not analyze DPR."
            );
          }


          const data =
            await riskResponse.json();


          const rawRisks =
            Array.isArray(
              data?.risks
            )
              ? data.risks
              : [];


          const risks: RiskItem[] =
            rawRisks.map(
              (
                risk: any,
                index: number
              ) => {

                const points =
                  clamp(
                    Number(
                      risk?.points ??
                        0
                    )
                  );


                const severity =
                  normalizeSeverity(
                    String(
                      risk?.severity ??
                        ""
                    ),
                    points
                  );


                const probability =
                  clamp(
                    points +
                      5
                  );


                const impactScore =
                  points;


                const riskScore =
                  Number(
                    (
                      (
                        probability /
                        100
                      ) *
                      (
                        impactScore /
                        10
                      )
                    ).toFixed(
                      2
                    )
                  );


                return {
                  id:
                    index + 1,

                  category:
                    String(
                      risk?.category ??
                        "General"
                    ),

                  severity,

                  keywords:
                    Array.isArray(
                      risk?.keywords
                    )
                      ? risk.keywords
                      : [],

                  points,

                  title:
                    String(
                      risk?.title ??
                        "Risk Finding"
                    ),

                  description:
                    String(
                      risk?.description ??
                        "Risk identified from DPR."
                    ),

                  probability,

                  impact:
                    severity,

                  impactScore,

                  riskScore,

                  xPos:
                    probability,

                  yPos:
                    impactScore,

                  recommendation:
                    String(
                      risk?.recommendation ??
                        "Review and mitigate this risk."
                    ),
                };
              }
            );


          const score =
            clamp(
              Number(
                data?.score ??
                  0
              )
            );


          const overallRisk =
            normalizeSeverity(
              String(
                data?.overall_level ??
                  ""
              ),
              score
            );


          const dimension =
            (
              category: string
            ): number => {

              const matches =
                risks.filter(
                  (
                    risk
                  ) =>
                    risk.category
                      .toLowerCase()
                      .includes(
                        category
                      )
                );


              if (
                matches.length ===
                0
              ) {

                return score;
              }


              return Math.round(
                matches.reduce(
                  (
                    total,
                    risk
                  ) =>
                    total +
                    risk.points,
                  0
                ) /
                  matches.length
              );
            };


          const dimensions:
            RiskDimensions =
            {
              costRisk:
                dimension(
                  "cost"
                ),

              scheduleRisk:
                dimension(
                  "schedule"
                ),

              technicalRisk:
                dimension(
                  "technical"
                ),

              financialRisk:
                dimension(
                  "financial"
                ),

              environmentalRisk:
                dimension(
                  "environment"
                ),

              complianceRisk:
                dimension(
                  "compliance"
                ),
            };


          const health =
            Math.round(
              100 -
              (
                dimensions.costRisk +
                dimensions.scheduleRisk +
                dimensions.technicalRisk +
                dimensions.financialRisk +
                dimensions.environmentalRisk +
                dimensions.complianceRisk
              ) /
                6
            );


          setRiskAssessment(
            {
              riskScore:
                score,

              riskCount:
                Number(
                  data?.risk_count ??
                    risks.length
                ),

              overallRisk,

              dimensions,

              risks,
            }
          );


          setHealthScore(
            {
              overall:
                clamp(
                  health
                ),

              statusText:
                health >= 80
                  ? "GOOD"
                  : health >= 60
                  ? "MODERATE"
                  : "HIGH RISK",
            }
          );


          setCriticalFindings(
            risks.filter(
              (
                risk
              ) =>
                risk.severity ===
                  "critical" ||
                risk.severity ===
                  "high"
            )
          );


          const mitigationList =
            risks.map(
              (
                risk
              ) => ({
                id:
                  risk.id,

                riskId:
                  risk.id,

                riskTitle:
                  risk.title,

                category:
                  risk.category,

                severity:
                  risk.severity,

                recommendation:
                  risk.recommendation,

                action:
                  risk.recommendation,

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

                status:
                  "Proposed" as MitigationStatus,

                expectedImpact:
                  "Reduce identified project risk.",
              })
            );


          setMitigations(
            mitigationList
          );


          // Contradictions remain separate
          setContradictions(
            []
          );


          localStorage.setItem(
            "active_document_id",
            String(
              document.id
            )
          );


          localStorage.setItem(
            "active_document_name",
            String(
              document.filename
            )
          );


          localStorage.setItem(
            "active_risk_analysis",
            JSON.stringify(
              data
            )
          );


        } catch (
          error
        ) {

          console.error(
            "ANALYSIS ERROR:",
            error
          );


          const message =
            error instanceof Error
              ? error.message
              : "DPR analysis failed.";


          setAnalysisError(
            message
          );

        } finally {

          setLoadingAnalysis(
            false
          );
        }

      },
      [
        activeProject.id,
      ]
    );


  // ==========================================================
  // REVIEW
  // ==========================================================

  const markContradictionReviewed =
    useCallback(
      (
        id: number,
        reviewed: boolean
      ) => {

        setContradictions(
          (
            previous
          ) =>
            previous.map(
              (
                item
              ) =>
                item.id ===
                id
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


  // ==========================================================
  // MITIGATION STATUS
  // ==========================================================

  const updateMitigationStatus =
    useCallback(
      (
        id: number,
        status: MitigationStatus
      ) => {

        setMitigations(
          (
            previous
          ) =>
            previous.map(
              (
                item
              ) =>
                item.id ===
                id
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


  // ==========================================================
  // APPRAISAL
  // ==========================================================

  const riskReserveRate =
    riskAssessment.riskScore >=
    75
      ? 0.12
      : riskAssessment.riskScore >=
        60
      ? 0.08
      : 0.05;


  const projectCapitalCostCr =
    Number(
      localStorage.getItem(
        "active_project_cost"
      )
    ) ||
    activeProject.totalCostCr ||
    0;


  const riskReserveCr =
    Number(
      (
        projectCapitalCostCr *
        riskReserveRate
      ).toFixed(2)
    );


  const recommendedApprovalCostCr =
    Number(
      (
        projectCapitalCostCr +
        riskReserveCr
      ).toFixed(2)
    );


  // ==========================================================
  // VALUE
  // ==========================================================

  const value =
    useMemo(
      (): ProjectContextType =>
        ({
          activeProject,

          projects,

          selectedProjectId,

          setSelectedProjectId,

          refreshProjects,

          analyzeActiveProject,

          loadingAnalysis,

          analysisError,

          healthScore,

          riskAssessment,

          criticalFindings,

          contradictions,

          mitigations,

          markContradictionReviewed,

          updateMitigationStatus,

          addToast,

          toasts,

          activeEvidenceTarget,

          setActiveEvidenceTarget,

          appraisalRecommendation:
            {
              projectCapitalCostCr,

              recommendedApprovalCostCr,

              riskReserveCr,
            },
        }),
      [
        activeProject,
        projects,
        selectedProjectId,
        setSelectedProjectId,
        refreshProjects,
        analyzeActiveProject,
        loadingAnalysis,
        analysisError,
        healthScore,
        riskAssessment,
        criticalFindings,
        contradictions,
        mitigations,
        markContradictionReviewed,
        updateMitigationStatus,
        addToast,
        toasts,
        activeEvidenceTarget,
        projectCapitalCostCr,
        recommendedApprovalCostCr,
        riskReserveCr,
      ]
    );


  return (
    <ProjectContext.Provider
      value={value}
    >
      {children}
    </ProjectContext.Provider>
  );
};


// ============================================================
// HOOK
// ============================================================

export function useProject():
  ProjectContextType {

  const context =
    useContext(
      ProjectContext
    );


  if (!context) {

    throw new Error(
      "useProject must be used inside ProjectProvider"
    );
  }


  return context;
}


export default ProjectProvider;