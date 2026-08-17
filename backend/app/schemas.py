from pydantic import BaseModel, EmailStr, ConfigDict


# ============================================================
# REGISTER
# ============================================================

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


# ============================================================
# NORMAL LOGIN
# ============================================================

class UserLogin(BaseModel):
    email: EmailStr
    password: str


# ============================================================
# GOOGLE LOGIN
# ============================================================

class GoogleLogin(BaseModel):
    credential: str


# ============================================================
# FORGOT PASSWORD
# ============================================================

class ForgotPasswordRequest(BaseModel):
    email: EmailStr


# ============================================================
# RESET PASSWORD
# ============================================================

class ResetPasswordRequest(BaseModel):
    token: str
    password: str


# ============================================================
# USER RESPONSE
# ============================================================

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr

    model_config = ConfigDict(
        from_attributes=True
    )


# ============================================================
# LOGIN RESPONSE
# ============================================================

class TokenResponse(BaseModel):
    message: str
    access_token: str
    token_type: str
    user: UserResponse