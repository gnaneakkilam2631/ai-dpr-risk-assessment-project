import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertTriangle,
  Loader2,
  ArrowRight,
} from "lucide-react";

const API_URL = "http://127.0.0.1:8000";

type Project = {
  id: number;
  name: string;
  description?: string;
};

type BackendProject = {
  id?: number;
  name?: string;
  description?: string;
};

type UploadResponse = {
  id?: number;
  document_id?: number;
  filename?: string;
  project_id?: number;
  document?: {
    id?: number;
    filename?: string;
    project_id?: number;
  };
  detail?: string;
  message?: string;
};

type RiskAnalysisResponse = {
  score?: number;
  overall_level?: string;
  risk_count?: number;
  risks?: unknown[];
  detail?: string;
};

type UploadAnalysis = {
  documentId: number;
  score: number;
  overall_level: string;
  risk_count: number;
};

function getStoredUserId(): number | null {
  const directUserId = localStorage.getItem("user_id");

  if (directUserId) {
    const parsed = Number(directUserId);

    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
  }

  const storedUser = localStorage.getItem("user");

  if (storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser);

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
      // Ignore invalid JSON.
    }
  }

  return null;
}

async function readResponseSafely(
  response: Response
): Promise<Record<string, unknown>> {
  const contentType =
    response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    try {
      const data = await response.json();

      if (
        data &&
        typeof data === "object"
      ) {
        return data as Record<string, unknown>;
      }

      return {};
    } catch {
      return {};
    }
  }

  try {
    const text = await response.text();

    return {
      detail: text,
    };
  } catch {
    return {};
  }
}

function getBackendError(
  data: Record<string, unknown>,
  fallback: string
): string {
  const detail = data.detail;

  if (typeof detail === "string" && detail.trim()) {
    return detail;
  }

  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        if (
          item &&
          typeof item === "object" &&
          "msg" in item
        ) {
          return String(
            (item as { msg?: unknown }).msg
          );
        }

        return String(item);
      })
      .join(", ");
  }

  const message = data.message;

  if (
    typeof message === "string" &&
    message.trim()
  ) {
    return message;
  }

  return fallback;
}

export const UploadDprPage: React.FC = () => {
  const navigate = useNavigate();

  const [projects, setProjects] =
    useState<Project[]>([]);

  const [selectedProject, setSelectedProject] =
    useState<number | null>(null);

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [uploading, setUploading] =
    useState(false);

  const [analyzing, setAnalyzing] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [analysis, setAnalysis] =
    useState<UploadAnalysis | null>(null);

  // =========================================================
  // LOAD PROJECTS
  // =========================================================

  const loadProjects = useCallback(
    async (): Promise<void> => {
      setError("");

      const userId =
        getStoredUserId();

      console.log(
        "Upload DPR - user_id:",
        userId
      );

      if (userId === null) {
        setError(
          "User ID was not found. Please login again."
        );
        return;
      }

      try {
        const response =
          await fetch(
            `${API_URL}/projects/?user_id=${encodeURIComponent(
              String(userId)
            )}`,
            {
              method: "GET",
              headers: {
                Accept:
                  "application/json",
              },
            }
          );

        const data =
          await readResponseSafely(
            response
          );

        if (!response.ok) {
          throw new Error(
            getBackendError(
              data,
              `Failed to load projects (${response.status}).`
            )
          );
        }

        const rawProjects =
          Array.isArray(data)
            ? data
            : [];

        const normalizedProjects: Project[] =
          rawProjects.map(
            (
              project: BackendProject
            ): Project => ({
              id:
                Number(
                  project.id
                ) || 0,

              name:
                project.name ||
                "Unnamed Project",

              description:
                project.description ||
                "",
            })
          );

        console.log(
          "Upload DPR - projects:",
          normalizedProjects
        );

        setProjects(
          normalizedProjects
        );

        const savedProjectId =
          localStorage.getItem(
            "active_project_id"
          );

        if (savedProjectId) {
          const savedId =
            Number(
              savedProjectId
            );

          const savedProject =
            normalizedProjects.find(
              (
                project: Project
              ) =>
                project.id ===
                savedId
            );

          if (savedProject) {
            setSelectedProject(
              savedProject.id
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

          setSelectedProject(
            firstProject.id
          );

          localStorage.setItem(
            "active_project_id",
            String(
              firstProject.id
            )
          );
        } else {
          setSelectedProject(
            null
          );

          localStorage.removeItem(
            "active_project_id"
          );
        }
      } catch (err) {
        console.error(
          "LOAD PROJECTS ERROR:",
          err
        );

        setProjects([]);

        setError(
          err instanceof Error
            ? err.message
            : "Could not load projects."
        );
      }
    },
    []
  );

  // =========================================================
  // LOAD PROJECTS ON PAGE OPEN
  // =========================================================

  useEffect(() => {
    void loadProjects();
  }, [loadProjects]);

  // =========================================================
  // SELECT PROJECT
  // =========================================================

  function handleProjectChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ): void {
    const value =
      event.target.value;

    if (!value) {
      setSelectedProject(
        null
      );

      localStorage.removeItem(
        "active_project_id"
      );

      return;
    }

    const projectId =
      Number(value);

    if (
      !Number.isFinite(
        projectId
      ) ||
      projectId <= 0
    ) {
      setSelectedProject(
        null
      );

      return;
    }

    setSelectedProject(
      projectId
    );

    localStorage.setItem(
      "active_project_id",
      String(projectId)
    );

    setSelectedFile(
      null
    );

    setMessage("");

    setError("");

    setAnalysis(
      null
    );
  }

  // =========================================================
  // FILE SELECT
  // =========================================================

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ): void {
    const file =
      event.target.files?.[0] ||
      null;

    setSelectedFile(
      file
    );

    setMessage("");

    setError("");

    setAnalysis(
      null
    );
  }

  // =========================================================
  // UPLOAD + ANALYZE
  // =========================================================

  async function uploadAndAnalyze(): Promise<void> {
    setMessage("");

    setError("");

    setAnalysis(
      null
    );

    // -------------------------------------------------------
    // VALIDATE PROJECT
    // -------------------------------------------------------

    if (
      selectedProject === null ||
      selectedProject <= 0
    ) {
      setError(
        "Please select a project."
      );

      return;
    }

    // -------------------------------------------------------
    // VALIDATE FILE
    // -------------------------------------------------------

    if (!selectedFile) {
      setError(
        "Please select a DPR file."
      );

      return;
    }

    // -------------------------------------------------------
    // VALIDATE EXTENSION
    // -------------------------------------------------------

    const extension =
      selectedFile.name
        .substring(
          selectedFile.name.lastIndexOf(
            "."
          )
        )
        .toLowerCase();

    const allowedExtensions =
      [
        ".pdf",
        ".docx",
        ".txt",
      ];

    if (
      !allowedExtensions.includes(
        extension
      )
    ) {
      setError(
        "Only PDF, DOCX and TXT files are supported."
      );

      return;
    }

    // -------------------------------------------------------
    // VALIDATE FILE SIZE
    // -------------------------------------------------------

    if (
      selectedFile.size <= 0
    ) {
      setError(
        "The selected file is empty."
      );

      return;
    }

    // 50 MB safety limit.
    const maxFileSize =
      50 * 1024 * 1024;

    if (
      selectedFile.size >
      maxFileSize
    ) {
      setError(
        "File size must be less than 50 MB."
      );

      return;
    }

    // -------------------------------------------------------
    // FORM DATA
    // -------------------------------------------------------

    const formData =
      new FormData();

    formData.append(
      "file",
      selectedFile,
      selectedFile.name
    );

    console.log(
      "===================================="
    );

    console.log(
      "DPR UPLOAD START"
    );

    console.log(
      "Project ID:",
      selectedProject
    );

    console.log(
      "File:",
      selectedFile.name
    );

    console.log(
      "Size:",
      selectedFile.size
    );

    console.log(
      "Type:",
      selectedFile.type
    );

    console.log(
      "===================================="
    );

    try {
      // =====================================================
      // STEP 1 — UPLOAD DPR
      // =====================================================

      setUploading(
        true
      );

      setMessage(
        "Uploading DPR document..."
      );

      const uploadUrl =
        `${API_URL}/documents/upload?project_id=${encodeURIComponent(
          String(selectedProject)
        )}`;

      console.log(
        "UPLOAD URL:",
        uploadUrl
      );

      const uploadResponse =
        await fetch(
          uploadUrl,
          {
            method: "POST",
            body: formData,
            headers: {
              Accept:
                "application/json",
            },
          }
        );

      const uploadData =
        await readResponseSafely(
          uploadResponse
        );

      console.log(
        "UPLOAD STATUS:",
        uploadResponse.status
      );

      console.log(
        "UPLOAD RESPONSE:",
        uploadData
      );

      if (
        !uploadResponse.ok
      ) {
        throw new Error(
          getBackendError(
            uploadData,
            `DPR upload failed (${uploadResponse.status}).`
          )
        );
      }

      // =====================================================
      // GET DOCUMENT ID
      // =====================================================

      const documentId = Number(
        uploadData.id ??
          uploadData.document_id ??
          (
            uploadData.document as
              | {
                  id?: number;
                }
              | undefined
          )?.id ??
          0
      );

      if (
        !Number.isFinite(
          documentId
        ) ||
        documentId <= 0
      ) {
        throw new Error(
          "DPR was uploaded but the backend did not return a valid document ID."
        );
      }

      // =====================================================
      // SAVE ACTIVE PROJECT
      // =====================================================

      localStorage.setItem(
        "active_project_id",
        String(
          selectedProject
        )
      );

      // =====================================================
      // SAVE ACTIVE DOCUMENT
      // =====================================================

      localStorage.setItem(
        "active_document_id",
        String(
          documentId
        )
      );

      localStorage.setItem(
        "active_document_name",
        selectedFile.name
      );

      console.log(
        "DOCUMENT ID:",
        documentId
      );

      // =====================================================
      // STEP 2 — ANALYZE
      // =====================================================

      setUploading(
        false
      );

      setAnalyzing(
        true
      );

      setMessage(
        "DPR uploaded successfully. AI is analyzing the document..."
      );

      const riskUrl =
        `${API_URL}/documents/${documentId}/risks`;

      console.log(
        "RISK URL:",
        riskUrl
      );

      const riskResponse =
        await fetch(
          riskUrl,
          {
            method: "GET",
            headers: {
              Accept:
                "application/json",
            },
          }
        );

      const riskDataRaw =
        await readResponseSafely(
          riskResponse
        );

      console.log(
        "RISK STATUS:",
        riskResponse.status
      );

      console.log(
        "RISK RESPONSE:",
        riskDataRaw
      );

      if (
        !riskResponse.ok
      ) {
        throw new Error(
          getBackendError(
            riskDataRaw,
            `Risk analysis failed (${riskResponse.status}).`
          )
        );
      }

      const riskData =
        riskDataRaw as RiskAnalysisResponse;

      const result: UploadAnalysis =
        {
          documentId,

          score:
            Number(
              riskData.score ??
                0
            ),

          overall_level:
            String(
              riskData.overall_level ??
                "UNKNOWN"
            ),

          risk_count:
            Number(
              riskData.risk_count ??
                (
                  Array.isArray(
                    riskData.risks
                  )
                    ? riskData
                        .risks
                        .length
                    : 0
                )
            ),
        };

      setAnalysis(
        result
      );

      // =====================================================
      // SAVE COMPLETE RISK RESPONSE
      // =====================================================

      localStorage.setItem(
        "active_risk_analysis",
        JSON.stringify(
          riskData
        )
      );

      localStorage.setItem(
        "latest_dpr_analysis",
        JSON.stringify({
          documentId,

          filename:
            selectedFile.name,

          riskData,

          analyzedAt:
            new Date().toISOString(),
        })
      );

      // =====================================================
      // SUCCESS
      // =====================================================

      setMessage(
        "DPR analysis completed successfully."
      );

      setError("");

      console.log(
        "===================================="
      );

      console.log(
        "DPR UPLOAD + ANALYSIS SUCCESS"
      );

      console.log(
        "Project ID:",
        selectedProject
      );

      console.log(
        "Document ID:",
        documentId
      );

      console.log(
        "Risk Score:",
        result.score
      );

      console.log(
        "Risk Level:",
        result.overall_level
      );

      console.log(
        "Risk Count:",
        result.risk_count
      );

      console.log(
        "===================================="
      );
    } catch (err) {
      console.error(
        "DPR UPLOAD/ANALYSIS ERROR:",
        err
      );

      setMessage("");

      setError(
        err instanceof Error
          ? err.message
          : "Upload or analysis failed."
      );
    } finally {
      setUploading(
        false
      );

      setAnalyzing(
        false
      );
    }
  }

  // =========================================================
  // OPEN DPR ANALYSIS
  // =========================================================

  function openAnalysis(): void {
    navigate(
      "/dpr-analysis"
    );
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="space-y-6">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-400">
          DPR Intelligence
        </p>

        <h1 className="mt-1 text-3xl font-extrabold text-white">
          Upload DPR
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Upload your Detailed Project Report.
          The system will automatically analyze
          the document and update the DPR Risk
          Analysis page.
        </p>
      </div>

      {/* =====================================================
          UPLOAD CARD
      ===================================================== */}

      <div className="rounded-2xl border border-slate-800 bg-[#0b1220] p-6">

        {/* PROJECT */}

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
            Select Project
          </label>

          <select
            value={
              selectedProject ??
              ""
            }
            onChange={
              handleProjectChange
            }
            disabled={
              uploading ||
              analyzing
            }
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="">
              Select project
            </option>

            {projects.map(
              (
                project: Project
              ) => (
                <option
                  key={
                    project.id
                  }
                  value={
                    project.id
                  }
                >
                  {
                    project.name
                  }
                </option>
              )
            )}
          </select>

          {selectedProject !==
            null && (
            <div className="mt-3 rounded-xl bg-slate-900/70 px-4 py-3 text-sm text-slate-300">
              Selected:{" "}
              <span className="font-bold text-white">
                {
                  projects.find(
                    (
                      project: Project
                    ) =>
                      project.id ===
                      selectedProject
                  )?.name ??
                  "Selected Project"
                }
              </span>
            </div>
          )}
        </div>

        {/* DPR FILE */}

        <div className="mt-6">

          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
            DPR Document
          </label>

          <label
            className={`flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-slate-700 bg-slate-900/70 px-5 py-6 transition hover:border-cyan-400 ${
              uploading ||
              analyzing
                ? "pointer-events-none opacity-60"
                : ""
            }`}
          >

            <Upload className="h-8 w-8 shrink-0 text-cyan-400" />

            <div className="flex-1">

              <p className="text-sm font-semibold text-white">
                {selectedFile
                  ? selectedFile.name
                  : "Choose DPR document"}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                PDF, DOCX or TXT
              </p>

              {selectedFile && (
                <p className="mt-2 text-xs text-slate-500">
                  {(
                    selectedFile.size /
                    (1024 * 1024)
                  ).toFixed(
                    2
                  )}{" "}
                  MB
                </p>
              )}

            </div>

            <input
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={
                handleFileChange
              }
              disabled={
                uploading ||
                analyzing
              }
              className="hidden"
            />

          </label>
        </div>

        {/* =================================================
            UPLOAD BUTTON
        ================================================= */}

        <button
          type="button"
          onClick={
            uploadAndAnalyze
          }
          disabled={
            uploading ||
            analyzing ||
            selectedProject ===
              null ||
            selectedFile ===
              null
          }
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >

          {uploading ||
          analyzing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />

              {uploading
                ? "Uploading..."
                : "Analyzing DPR..."}
            </>
          ) : (
            <>
              <FileText className="h-4 w-4" />

              Upload & Analyze DPR
            </>
          )}

        </button>

        {/* =================================================
            SUCCESS
        ================================================= */}

        {message && (
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">

            <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />

            <p className="text-sm text-emerald-300">
              {message}
            </p>

          </div>
        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4">

            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />

            <div>
              <p className="text-sm font-bold text-red-300">
                Upload Error
              </p>

              <p className="mt-1 text-sm text-red-300/90">
                {error}
              </p>
            </div>

          </div>
        )}

      </div>

      {/* =====================================================
          ANALYSIS RESULT
      ===================================================== */}

      {analysis && (
        <div className="rounded-2xl border border-cyan-500/20 bg-[#0b1220] p-6">

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

            <div>

              <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Analysis Completed
              </p>

              <h2 className="mt-1 text-xl font-bold text-white">
                DPR Risk Assessment Ready
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                The uploaded DPR is now connected
                to the DPR Risk Analysis page.
              </p>

            </div>

            <button
              type="button"
              onClick={
                openAnalysis
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-400"
            >
              Open Risk Analysis

              <ArrowRight className="h-4 w-4" />
            </button>

          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">

            {/* SCORE */}

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">

              <p className="text-xs text-slate-500">
                Risk Score
              </p>

              <p className="mt-2 text-3xl font-extrabold text-white">
                {analysis.score}

                <span className="text-sm text-slate-500">
                  /100
                </span>
              </p>

            </div>

            {/* LEVEL */}

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">

              <p className="text-xs text-slate-500">
                Overall Risk
              </p>

              <p className="mt-2 text-2xl font-extrabold text-red-400">
                {
                  analysis.overall_level
                }
              </p>

            </div>

            {/* COUNT */}

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">

              <p className="text-xs text-slate-500">
                Risks Detected
              </p>

              <p className="mt-2 text-3xl font-extrabold text-amber-400">
                {
                  analysis.risk_count
                }
              </p>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default UploadDprPage;