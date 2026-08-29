from typing import List

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Project, User
from app.schemas import (
    ProjectCreate,
    ProjectResponse,
)


# ============================================================
# ROUTER
# ============================================================

router = APIRouter(
    prefix="/projects",
    tags=["Projects"],
)


# ============================================================
# CREATE PROJECT
# ============================================================

@router.post(
    "/",
    response_model=ProjectResponse,
)
def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db),
):
    print(
        f"[PROJECT] Creating project "
        f"name={project.name}, "
        f"user_id={project.user_id}"
    )

    # --------------------------------------------------------
    # VALIDATE NAME
    # --------------------------------------------------------

    project_name = (
        project.name.strip()
        if project.name
        else ""
    )

    if not project_name:
        raise HTTPException(
            status_code=400,
            detail="Project name is required.",
        )

    # --------------------------------------------------------
    # CHECK USER
    # --------------------------------------------------------

    user = (
        db.query(User)
        .filter(
            User.id ==
            project.user_id
        )
        .first()
    )

    if user is None:
        raise HTTPException(
            status_code=404,
            detail=(
                f"User with id "
                f"{project.user_id} not found"
            ),
        )

    # --------------------------------------------------------
    # CHECK EXISTING PROJECT
    #
    # Prevent duplicate project names for the same user.
    # --------------------------------------------------------

    existing_project = (
        db.query(Project)
        .filter(
            Project.user_id ==
            project.user_id,
            Project.name.ilike(
                project_name
            ),
        )
        .first()
    )

    if existing_project is not None:
        print(
            f"[PROJECT] Existing project found "
            f"id={existing_project.id}"
        )

        return existing_project

    # --------------------------------------------------------
    # CREATE PROJECT
    # --------------------------------------------------------

    new_project = Project(
        name=project_name,

        description=(
            project.description
            or ""
        ),

        user_id=project.user_id,

        total_cost_cr=(
            project.total_cost_cr
            or 0
        ),

        approved_budget_cr=(
            project.approved_budget_cr
            or 0
        ),

        duration_months=(
            project.duration_months
            or 0
        ),

        location=(
            project.location
            or ""
        ),

        state=(
            project.state
            or "India"
        ),

        sector=(
            project.sector
            or "Infrastructure"
        ),

        implementing_agency=(
            project.implementing_agency
            or ""
        ),

        beneficiaries_count=(
            project.beneficiaries_count
            or 0
        ),
    )

    # --------------------------------------------------------
    # SAVE
    # --------------------------------------------------------

    try:

        db.add(
            new_project
        )

        db.commit()

        db.refresh(
            new_project
        )

        print(
            f"[PROJECT] Created successfully "
            f"id={new_project.id}"
        )

        return new_project

    except IntegrityError as exc:

        db.rollback()

        print(
            "PROJECT DATABASE INTEGRITY ERROR:",
            exc,
        )

        raise HTTPException(
            status_code=400,
            detail=(
                "Unable to create project "
                "because the supplied data is invalid."
            ),
        ) from exc

    except Exception as exc:

        db.rollback()

        print(
            "PROJECT CREATE ERROR:",
            exc,
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Could not create project."
            ),
        ) from exc


# ============================================================
# GET ALL PROJECTS FOR USER
# ============================================================

@router.get(
    "/",
    response_model=List[ProjectResponse],
)
def get_projects(
    user_id: int,
    db: Session = Depends(get_db),
):
    print(
        f"[PROJECTS] Loading projects "
        f"for user_id={user_id}"
    )

    if user_id <= 0:
        raise HTTPException(
            status_code=400,
            detail="Invalid user_id.",
        )

    # --------------------------------------------------------
    # CHECK USER
    # --------------------------------------------------------

    user = (
        db.query(User)
        .filter(
            User.id ==
            user_id
        )
        .first()
    )

    if user is None:
        raise HTTPException(
            status_code=404,
            detail=(
                f"User with id "
                f"{user_id} not found"
            ),
        )

    # --------------------------------------------------------
    # GET PROJECTS
    # --------------------------------------------------------

    projects = (
        db.query(Project)
        .filter(
            Project.user_id ==
            user_id
        )
        .order_by(
            Project.created_at.desc()
        )
        .all()
    )

    print(
        f"[PROJECTS] Found "
        f"{len(projects)} projects"
    )

    return projects


# ============================================================
# GET SINGLE PROJECT
# ============================================================

@router.get(
    "/{project_id}",
    response_model=ProjectResponse,
)
def get_project(
    project_id: int,
    user_id: int,
    db: Session = Depends(get_db),
):
    if project_id <= 0:
        raise HTTPException(
            status_code=400,
            detail="Invalid project_id.",
        )

    project = (
        db.query(Project)
        .filter(
            Project.id ==
            project_id,

            Project.user_id ==
            user_id,
        )
        .first()
    )

    if project is None:
        raise HTTPException(
            status_code=404,
            detail="Project not found.",
        )

    return project


# ============================================================
# DELETE PROJECT
# ============================================================

@router.delete(
    "/{project_id}",
)
def delete_project(
    project_id: int,
    user_id: int,
    db: Session = Depends(get_db),
):
    project = (
        db.query(Project)
        .filter(
            Project.id ==
            project_id,

            Project.user_id ==
            user_id,
        )
        .first()
    )

    if project is None:
        raise HTTPException(
            status_code=404,
            detail="Project not found.",
        )

    try:

        db.delete(
            project
        )

        db.commit()

        print(
            f"[PROJECT] Deleted "
            f"project_id={project_id}"
        )

        return {
            "message":
                "Project deleted successfully",

            "project_id":
                project_id,
        }

    except Exception as exc:

        db.rollback()

        print(
            "PROJECT DELETE ERROR:",
            exc,
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Could not delete project."
            ),
        ) from exc