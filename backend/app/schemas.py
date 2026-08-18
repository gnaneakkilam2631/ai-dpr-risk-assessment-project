from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field


# ============================================================
# USER SCHEMAS
# ============================================================

class UserCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr

    model_config = ConfigDict(from_attributes=True)


class GoogleLogin(BaseModel):
    credential: str


# ============================================================
# PASSWORD RESET
# ============================================================

class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    password: str = Field(..., min_length=8)


# ============================================================
# PROJECT SCHEMAS
# ============================================================

class ProjectCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)

    description: Optional[str] = None

    user_id: int

    total_cost_cr: Optional[float] = 0
    approved_budget_cr: Optional[float] = 0
    duration_months: Optional[int] = 0

    location: Optional[str] = None
    state: Optional[str] = None
    sector: Optional[str] = None

    implementing_agency: Optional[str] = None
    beneficiaries_count: Optional[int] = 0


class ProjectResponse(BaseModel):
    id: int

    name: str
    description: Optional[str] = None

    user_id: int

    total_cost_cr: Optional[float] = 0
    approved_budget_cr: Optional[float] = 0
    duration_months: Optional[int] = 0

    location: Optional[str] = None
    state: Optional[str] = None
    sector: Optional[str] = None

    implementing_agency: Optional[str] = None
    beneficiaries_count: Optional[int] = 0

    # IMPORTANT:
    # SQLAlchemy returns datetime here.
    # Do NOT make this str.
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


# ============================================================
# DOCUMENT SCHEMAS
# ============================================================

class DocumentResponse(BaseModel):
    id: int
    project_id: int
    filename: str

    file_path: Optional[str] = None
    document_type: Optional[str] = None

    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


# ============================================================
# RISK SCHEMAS
# ============================================================

class RiskItem(BaseModel):
    category: str
    severity: str
    keywords: List[str] = []
    points: float = 0


class RiskAnalysisResponse(BaseModel):
    score: float
    overall_level: str
    risk_count: int
    risks: List[RiskItem]


# ============================================================
# GENERIC RESPONSE
# ============================================================

class MessageResponse(BaseModel):
    message: str


# ============================================================
# LOGIN RESPONSE
# ============================================================

class LoginUser(BaseModel):
    id: int
    name: str
    email: EmailStr


class LoginResponse(BaseModel):
    message: str
    access_token: str
    token_type: str = "bearer"
    user: LoginUser