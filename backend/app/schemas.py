from pydantic import BaseModel, EmailStr, ConfigDict


# =========================
# USER REGISTRATION
# =========================

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


# =========================
# USER LOGIN
# =========================

class UserLogin(BaseModel):
    email: EmailStr
    password: str


# =========================
# USER RESPONSE
# =========================

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr

    model_config = ConfigDict(
        from_attributes=True
    )


# =========================
# LOGIN RESPONSE
# =========================

class TokenResponse(BaseModel):
    message: str
    access_token: str
    token_type: str
    user: UserResponse