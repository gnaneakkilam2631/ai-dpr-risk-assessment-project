from typing import Any, Dict, List

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import engine, Base, get_db
from .models import Project, Document

from .routers import auth, projects, documents

# Import the existing DPR risk-analysis function
from .routers.documents import analyze_document_risks


# ============================================================
# CREATE DATABASE TABLES
# ============================================================

Base.metadata.create_all(bind=engine)


# ============================================================
# APPLICATION
# ============================================================

app = FastAPI(
    title="AI DPR Risk Assessment API",
    version="1.0.0",
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# ROUTERS
# ============================================================

app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(documents.router)


# ============================================================
# ROOT
# ============================================================

@app.get("/")
def root():
    return {
        "message": "AI DPR Risk Assessment API is running",
        "status": "ok",
    }


# ============================================================
# HEALTH
# ============================================================

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "AI DPR Risk Assessment API",
    }


# ============================================================
# API DEBUG
# ============================================================

@app.get("/api-status")
def api_status():
    return {
        "backend": "running",
        "projects_api": "/projects/",
        "documents_api": "/documents/",
        "risk_analysis_api": "/documents/{document_id}/risks",
        "contradictions_api": "/contradictions/",
        "contradictions_summary_api": "/contradictions/summary",
        "health_api": "/health",
    }


# ============================================================
# HELPER
# ============================================================

def get_latest_document(
    project_id: int,
    db: Session,
):
    """
    Return the latest uploaded DPR document
    belonging to a project.
    """

    return (
        db.query(Document)
        .filter(
            Document.project_id == project_id
        )
        .order_by(
            Document.created_at.desc()
        )
        .first()
    )


# ============================================================
# CONTRADICTIONS / PROJECT INTELLIGENCE
# ============================================================

@app.get("/contradictions/")
def get_contradictions_summary(
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Build the Contradictions / Project Intelligence page
    from the actual database and actual DPR risk analysis.

    NOTHING IS HARDCODED.

    Counts are calculated from:

        Project table
        Document table
        Existing DPR risk analysis

    For every project:

        1. Check whether a DPR has been uploaded.
        2. Take the latest uploaded DPR.
        3. Run the existing DPR risk analysis.
        4. Read the real score and overall risk level.
        5. Add the project to the appropriate risk category.
    """

    print(
        "================================================"
    )

    print(
        "[CONTRADICTIONS] Starting project summary..."
    )

    # ========================================================
    # GET ALL PROJECTS
    # ========================================================

    projects_list = (
        db.query(Project)
        .order_by(
            Project.id.desc()
        )
        .all()
    )

    total_projects = len(
        projects_list
    )

    print(
        "[CONTRADICTIONS] Total projects:",
        total_projects,
    )

    # ========================================================
    # COUNTERS
    # ========================================================

    dpr_uploaded = 0
    analyzed = 0

    critical_count = 0
    high_count = 0
    medium_count = 0
    low_count = 0

    # ========================================================
    # PROJECT RESULT LIST
    # ========================================================

    project_results: List[
        Dict[str, Any]
    ] = []

    # ========================================================
    # PROCESS EVERY PROJECT
    # ========================================================

    for project in projects_list:

        print(
            "[CONTRADICTIONS] Processing project:",
            project.id,
        )

        # ----------------------------------------------------
        # FIND LATEST DPR
        # ----------------------------------------------------

        document = get_latest_document(
            project.id,
            db,
        )

        # ----------------------------------------------------
        # NO DPR UPLOADED
        # ----------------------------------------------------

        if document is None:

            project_results.append(
                {
                    "project_id":
                        project.id,

                    "project_name":
                        getattr(
                            project,
                            "name",
                            None,
                        ),

                    "status":
                        "NOT_UPLOADED",

                    "dpr_uploaded":
                        False,

                    "analyzed":
                        False,

                    "document_id":
                        None,

                    "filename":
                        None,

                    "score":
                        None,

                    "overall_level":
                        None,

                    "risk_count":
                        0,

                    "risks":
                        [],
                }
            )

            continue

        # ----------------------------------------------------
        # DPR EXISTS
        # ----------------------------------------------------

        dpr_uploaded += 1

        print(
            "[CONTRADICTIONS] DPR found:",
            document.id,
            document.filename,
        )

        # ----------------------------------------------------
        # ANALYZE DPR
        # ----------------------------------------------------

        try:

            analysis = analyze_document_risks(
                document.id,
                db,
            )

        except Exception as exc:

            print(
                "[CONTRADICTIONS] Analysis failed:",
                f"project={project.id}",
                f"document={document.id}",
                f"error={exc}",
            )

            project_results.append(
                {
                    "project_id":
                        project.id,

                    "project_name":
                        getattr(
                            project,
                            "name",
                            None,
                        ),

                    "status":
                        "ANALYSIS_FAILED",

                    "dpr_uploaded":
                        True,

                    "analyzed":
                        False,

                    "document_id":
                        document.id,

                    "filename":
                        document.filename,

                    "score":
                        None,

                    "overall_level":
                        None,

                    "risk_count":
                        0,

                    "risks":
                        [],
                }
            )

            continue

        # ----------------------------------------------------
        # ANALYSIS SUCCESSFUL
        # ----------------------------------------------------

        analyzed += 1

        score = analysis.get(
            "score"
        )

        overall_level = (
            analysis.get(
                "overall_level"
            )
        )

        risk_count = (
            analysis.get(
                "risk_count",
                0,
            )
        )

        risks = (
            analysis.get(
                "risks",
                [],
            )
        )

        # ----------------------------------------------------
        # NORMALIZE RISK LEVEL
        # ----------------------------------------------------

        if overall_level:

            overall_level = str(
                overall_level
            ).upper().strip()

        # ----------------------------------------------------
        # COUNT REAL RISK LEVEL
        # ----------------------------------------------------

        if overall_level == "CRITICAL":

            critical_count += 1

        elif overall_level == "HIGH":

            high_count += 1

        elif overall_level == "MEDIUM":

            medium_count += 1

        elif overall_level == "LOW":

            low_count += 1

        # ----------------------------------------------------
        # PROJECT RESULT
        # ----------------------------------------------------

        project_results.append(
            {
                "project_id":
                    project.id,

                "project_name":
                    getattr(
                        project,
                        "name",
                        None,
                    ),

                "status":
                    "ANALYZED",

                "dpr_uploaded":
                    True,

                "analyzed":
                    True,

                "document_id":
                    document.id,

                "filename":
                    document.filename,

                "score":
                    score,

                "overall_level":
                    overall_level,

                "risk_count":
                    risk_count,

                "risks":
                    risks,

                # --------------------------------------------
                # PROJECT COST INFORMATION
                # --------------------------------------------

                "capital_cost_cr":
                    analysis.get(
                        "capital_cost_cr"
                    ),

                "capital_cost_source":
                    analysis.get(
                        "capital_cost_source"
                    ),

                "capital_cost_source_detail":
                    analysis.get(
                        "capital_cost_source_detail"
                    ),

                "prediction_confidence":
                    analysis.get(
                        "prediction_confidence"
                    ),

                "prediction_model_available":
                    analysis.get(
                        "prediction_model_available",
                        False,
                    ),

                # --------------------------------------------
                # OTHER DPR DATA
                # --------------------------------------------

                "approved_budget_cr":
                    analysis.get(
                        "approved_budget_cr"
                    ),

                "duration_months":
                    analysis.get(
                        "duration_months"
                    ),
            }
        )

        print(
            "[CONTRADICTIONS] Analysis:",
            f"project={project.id}",
            f"score={score}",
            f"level={overall_level}",
            f"risks={risk_count}",
        )

    # ========================================================
    # FINAL RESPONSE
    # ========================================================

    response = {

        # ----------------------------------------------------
        # SUMMARY COUNTS
        # ----------------------------------------------------

        "total_projects":
            total_projects,

        "dpr_uploaded":
            dpr_uploaded,

        "analyzed":
            analyzed,

        # ----------------------------------------------------
        # REAL RISK COUNTS
        # ----------------------------------------------------

        "critical":
            critical_count,

        "high":
            high_count,

        "medium":
            medium_count,

        "low":
            low_count,

        # ----------------------------------------------------
        # ALTERNATIVE NAMES
        #
        # Useful for frontend compatibility.
        # ----------------------------------------------------

        "critical_count":
            critical_count,

        "high_count":
            high_count,

        "medium_count":
            medium_count,

        "low_count":
            low_count,

        # ----------------------------------------------------
        # PROJECTS
        # ----------------------------------------------------

        "projects":
            project_results,
    }

    print(
        "[CONTRADICTIONS] Final summary:",
        {
            "total_projects":
                total_projects,

            "dpr_uploaded":
                dpr_uploaded,

            "analyzed":
                analyzed,

            "critical":
                critical_count,

            "high":
                high_count,

            "medium":
                medium_count,

            "low":
                low_count,
        }
    )

    print(
        "================================================"
    )

    return response


# ============================================================
# CONTRADICTIONS SUMMARY
#
# Same information as /contradictions/
# This endpoint is useful if your frontend specifically calls
# /contradictions/summary.
# ============================================================

@app.get("/contradictions/summary")
def get_contradictions_summary_alias(
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Alias endpoint for frontend compatibility.

    Returns exactly the same live data as:

        GET /contradictions/
    """

    return get_contradictions_summary(
        db
    )