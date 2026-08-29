import React, {
  useEffect,
  useState,
} from "react";

import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  FileText,
  Loader2,
  Search,
  Upload,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useProject,
} from "../context/useProject";


const API_URL =
  "http://127.0.0.1:8000";


function getUserId():
  number | null {

  const direct =
    localStorage.getItem(
      "user_id"
    );


  if (
    direct
  ) {

    const id =
      Number(
        direct
      );


    if (
      Number.isFinite(
        id
      ) &&
      id > 0
    ) {

      return id;
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


    const id =
      Number(
        user?.id ??
          user?.user_id ??
          user?.userId
      );


    if (
      Number.isFinite(
        id
      ) &&
      id > 0
    ) {

      return id;
    }

  } catch {
    return null;
  }


  return null;
}


const UploadDprPage:
  React.FC =
  () => {

    const navigate =
      useNavigate();


    const {
      setSelectedProjectId,
      refreshProjects,
      analyzeActiveProject,
    } =
      useProject();


    const [
      projectName,
      setProjectName,
    ] =
      useState("");


    const [
      selectedFile,
      setSelectedFile,
    ] =
      useState<File | null>(
        null
      );


    const [
      processing,
      setProcessing,
    ] =
      useState(false);


    const [
      message,
      setMessage,
    ] =
      useState("");


    const [
      error,
      setError,
    ] =
      useState("");


    const [
      result,
      setResult,
    ] =
      useState<{
        projectId: number;
        documentId: number;
        projectName: string;
        filename: string;
        score: number;
        riskCount: number;
      } | null>(null);


    useEffect(
      () => {

        void refreshProjects();

      },
      [
        refreshProjects,
      ]
    );


    function handleFile(
      event:
        React.ChangeEvent<HTMLInputElement>
    ): void {

      const file =
        event.target.files?.[0] ??
        null;


      setSelectedFile(
        file
      );

      setMessage("");

      setError("");

      setResult(null);
    }


    async function findOrCreateProject(
      name: string,
      userId: number
    ) {

      const projectsResponse =
        await fetch(
          `${API_URL}/projects/?user_id=${encodeURIComponent(
            String(userId)
          )}`,
          {
            headers: {
              Accept:
                "application/json",
            },
          }
        );


      if (
        !projectsResponse.ok
      ) {

        throw new Error(
          "Could not load projects."
        );
      }


      const projects =
        await projectsResponse.json();


      const existing =
        Array.isArray(
          projects
        )
          ? projects.find(
              (
                project: any
              ) =>
                String(
                  project?.name ??
                    ""
                )
                  .trim()
                  .toLowerCase() ===
                name
                  .trim()
                  .toLowerCase()
            )
          : null;


      if (
        existing
      ) {

        return {
          id:
            Number(
              existing.id
            ),

          name:
            String(
              existing.name
            ),
        };
      }


      const createResponse =
        await fetch(
          `${API_URL}/projects/`,
          {
            method:
              "POST",

            headers: {
              Accept:
                "application/json",

              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                {
                  name:
                    name.trim(),

                  description:
                    `DPR project created from AI-DPR Guardian for ${name.trim()}.`,

                  user_id:
                    userId,

                  total_cost_cr:
                    0,

                  approved_budget_cr:
                    0,

                  duration_months:
                    0,

                  location:
                    "",

                  state:
                    "India",

                  sector:
                    "Infrastructure",

                  implementing_agency:
                    "",

                  beneficiaries_count:
                    0,
                }
              ),
          }
        );


      const data =
        await createResponse.json();


      if (
        !createResponse.ok
      ) {

        throw new Error(
          String(
            data?.detail ??
              "Could not create project."
          )
        );
      }


      return {
        id:
          Number(
            data?.id
          ),

        name:
          String(
            data?.name ??
              name
          ),
      };
    }


    async function uploadDocument(
      projectId: number,
      file: File
    ) {

      const extension =
        file.name
          .substring(
            file.name.lastIndexOf(
              "."
            )
          )
          .toLowerCase();


      if (
        ![
          ".pdf",
          ".docx",
          ".txt",
        ].includes(
          extension
        )
      ) {

        throw new Error(
          "Only PDF, DOCX and TXT files are supported."
        );
      }


      if (
        file.size <= 0
      ) {

        throw new Error(
          "The selected file is empty."
        );
      }


      if (
        file.size >
        50 *
          1024 *
          1024
      ) {

        throw new Error(
          "File size must be less than 50 MB."
        );
      }


      const formData =
        new FormData();


      formData.append(
        "file",
        file,
        file.name
      );


      const response =
        await fetch(
          `${API_URL}/documents/upload?project_id=${encodeURIComponent(
            String(projectId)
          )}`,
          {
            method:
              "POST",

            headers: {
              Accept:
                "application/json",
            },

            body:
              formData,
          }
        );


      const data =
        await response.json();


      if (
        !response.ok
      ) {

        throw new Error(
          String(
            data?.detail ??
              "DPR upload failed."
          )
        );
      }


      return {
        documentId:
          Number(
            data?.document_id ??
              data?.id ??
              0
          ),

        filename:
          String(
            data?.filename ??
              file.name
          ),
      };
    }


    async function handleSubmit(): Promise<void> {

      setMessage("");

      setError("");

      setResult(null);


      const name =
        projectName.trim();


      if (!name) {

        setError(
          "Please enter a project name."
        );

        return;
      }


      if (!selectedFile) {

        setError(
          "Please select the project DPR file."
        );

        return;
      }


      const userId =
        getUserId();


      if (
        userId ===
        null
      ) {

        setError(
          "User ID was not found. Please login again."
        );

        return;
      }


      setProcessing(
        true
      );


      try {

        setMessage(
          "Creating or loading project..."
        );


        const project =
          await findOrCreateProject(
            name,
            userId
          );


        if (
          !project.id
        ) {

          throw new Error(
            "Project ID was not returned."
          );
        }


        setSelectedProjectId(
          project.id
        );


        localStorage.setItem(
          "active_project_id",
          String(
            project.id
          )
        );


        localStorage.setItem(
          "active_project_name",
          project.name
        );


        setMessage(
          "Uploading DPR..."
        );


        const uploaded =
          await uploadDocument(
            project.id,
            selectedFile
          );


        if (
          !uploaded.documentId
        ) {

          throw new Error(
            "Document ID was not returned."
          );
        }


        localStorage.setItem(
          "active_document_id",
          String(
            uploaded.documentId
          )
        );


        localStorage.setItem(
          "active_document_name",
          uploaded.filename
        );


        setMessage(
          "DPR uploaded. Running project-specific analysis..."
        );


        await refreshProjects();


        await analyzeActiveProject();


        const savedAnalysis =
          localStorage.getItem(
            "active_risk_analysis"
          );


        let score = 0;

        let riskCount = 0;


        if (
          savedAnalysis
        ) {

          try {

            const parsed =
              JSON.parse(
                savedAnalysis
              );


            score =
              Number(
                parsed?.score ??
                  0
              );


            riskCount =
              Number(
                parsed?.risk_count ??
                  0
              );

          } catch {
            // Ignore.
          }
        }


        setResult(
          {
            projectId:
              project.id,

            documentId:
              uploaded.documentId,

            projectName:
              project.name,

            filename:
              uploaded.filename,

            score,

            riskCount,
          }
        );


        setMessage(
          "DPR uploaded and analyzed successfully."
        );

        setError("");

      } catch (
        caughtError
      ) {

        console.error(
          "UPLOAD ERROR:",
          caughtError
        );


        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "DPR upload failed."
        );

        setMessage("");

      } finally {

        setProcessing(
          false
        );
      }
    }


    return (
      <div className="space-y-6">

        <div>

          <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-400">
            DPR Intelligence
          </p>

          <h1 className="mt-1 text-3xl font-extrabold text-white">
            Upload DPR
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Enter any project name and upload its DPR.
            The system will read the document and generate
            a project-specific risk and cost assessment.
          </p>

        </div>


        <div className="rounded-2xl border border-slate-800 bg-[#0b1220] p-6">

          <label
            htmlFor="project-name"
            className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500"
          >
            Project Name
          </label>


          <div className="relative">

            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

            <input
              id="project-name"
              type="text"
              value={
                projectName
              }
              onChange={(
                event
              ) => {
                setProjectName(
                  event.target.value
                );

                setError("");

                setMessage("");

                setResult(null);
              }}
              placeholder="Enter any project name"
              disabled={
                processing
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3 pl-12 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400"
            />

          </div>


          <div className="mt-6">

            <label
              htmlFor="dpr-file"
              className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500"
            >
              Project DPR File
            </label>


            <label
              htmlFor="dpr-file"
              className={`flex cursor-pointer items-center gap-4 rounded-2xl border border-dashed border-slate-700 bg-slate-900/70 px-5 py-7 ${
                processing
                  ? "pointer-events-none opacity-50"
                  : "hover:border-cyan-400"
              }`}
            >

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10">

                <Upload className="h-7 w-7 text-cyan-400" />

              </div>


              <div className="flex-1">

                <p className="text-sm font-semibold text-white">

                  {
                    selectedFile
                      ? selectedFile.name
                      : "Click to select project DPR"
                  }

                </p>


                <p className="mt-1 text-xs text-slate-500">
                  PDF, DOCX or TXT
                </p>


                {selectedFile && (
                  <p className="mt-2 text-xs text-slate-500">

                    {
                      (
                        selectedFile.size /
                        1024 /
                        1024
                      ).toFixed(
                        2
                      )
                    }{" "}
                    MB

                  </p>
                )}

              </div>


              <input
                id="dpr-file"
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={
                  handleFile
                }
                disabled={
                  processing
                }
                className="hidden"
              />

            </label>

          </div>


          <button
            type="button"
            onClick={
              handleSubmit
            }
            disabled={
              processing ||
              !projectName.trim() ||
              !selectedFile
            }
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >

            {processing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing DPR...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                Upload & Analyze DPR
              </>
            )}

          </button>


          {message && (
            <div className="mt-5 flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">

              <CheckCircle className="h-5 w-5 shrink-0 text-emerald-400" />

              <p className="text-sm text-emerald-300">
                {message}
              </p>

            </div>
          )}


          {error && (
            <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4">

              <AlertTriangle className="h-5 w-5 shrink-0 text-red-400" />

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


        {result && (
          <div className="rounded-2xl border border-cyan-500/20 bg-[#0b1220] p-6">

            <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Analysis Completed
            </p>


            <h2 className="mt-1 text-xl font-bold text-white">
              {result.projectName}
            </h2>


            <p className="mt-1 text-sm text-slate-500">
              {result.filename}
            </p>


            <div className="mt-5 grid gap-4 md:grid-cols-3">

              <div className="rounded-xl bg-slate-900/60 p-4">

                <p className="text-xs text-slate-500">
                  Risk Score
                </p>

                <p className="mt-2 text-3xl font-extrabold text-white">
                  {
                    result.score
                  }
                  <span className="text-sm text-slate-500">
                    /100
                  </span>
                </p>

              </div>


              <div className="rounded-xl bg-slate-900/60 p-4">

                <p className="text-xs text-slate-500">
                  Risks Detected
                </p>

                <p className="mt-2 text-3xl font-extrabold text-amber-400">
                  {
                    result.riskCount
                  }
                </p>

              </div>


              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/dpr-analysis"
                  )
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-bold text-slate-950"
              >

                Open Risk Analysis

                <ArrowRight className="h-4 w-4" />

              </button>

            </div>

          </div>
        )}

      </div>
    );
  };


export {
  UploadDprPage,
};

export default UploadDprPage;