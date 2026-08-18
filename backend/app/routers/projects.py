from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Project, User
from app.schemas import ProjectCreate, ProjectResponse


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
    user = (
        db.query(User)
        .filter(
            User.id == project.user_id
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

    new_project = Project(
        name=project.name,
        description=project.description,
        user_id=project.user_id,

        total_cost_cr=(
            project.total_cost_cr or 0
        ),

        approved_budget_cr=(
            project.approved_budget_cr or 0
        ),

        duration_months=(
            project.duration_months or 0
        ),

        location=project.location,
        state=project.state,
        sector=project.sector,

        implementing_agency=(
            project.implementing_agency
        ),

        beneficiaries_count=(
            project.beneficiaries_count or 0
        ),
    )

    try:
        db.add(new_project)

        db.commit()

        db.refresh(new_project)

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
        )

    except Exception as exc:
        db.rollback()

        print(
            "PROJECT CREATE ERROR:",
            exc,
        )

        raise HTTPException(
            status_code=500,
            detail="Could not create project.",
        )


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
        f"[PROJECTS] Loading projects for user_id={user_id}"
    )

    if user_id <= 0:
        raise HTTPException(
            status_code=400,
            detail="Invalid user_id.",
        )

    user = (
        db.query(User)
        .filter(
            User.id == user_id
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

    projects = (
        db.query(Project)
        .filter(
            Project.user_id == user_id
        )
        .order_by(
            Project.created_at.desc()
        )
        .all()
    )

    print(
        f"[PROJECTS] Found {len(projects)} projects"
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
    project = (
        db.query(Project)
        .filter(
            Project.id == project_id,
            Project.user_id == user_id,
        )
        .first()
    )

    if project is None:
        raise HTTPException(
            status_code=404,
            detail="Project not found.",
        )

    return project