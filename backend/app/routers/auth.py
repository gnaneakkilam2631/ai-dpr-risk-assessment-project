import hashlib
import os
import secrets
import smtplib

from datetime import datetime, timedelta, timezone
from email.message import EmailMessage

from dotenv import load_dotenv

from fastapi import APIRouter, Depends, HTTPException, status

from jose import jwt

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError, VerificationError

from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from app.database import get_db
from app.models import User, PasswordResetToken

from app.schemas import (
    UserCreate,
    UserLogin,
    GoogleLogin,
    ForgotPasswordRequest,
    ResetPasswordRequest,
)


load_dotenv()


# ============================================================
# ROUTER
# ============================================================

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# ============================================================
# JWT CONFIGURATION
# ============================================================

JWT_SECRET = os.getenv("JWT_SECRET")

if not JWT_SECRET:
    raise ValueError("JWT_SECRET is missing from .env")

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 60


# ============================================================
# GOOGLE CONFIGURATION
# ============================================================

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

if not GOOGLE_CLIENT_ID:
    print(
        "WARNING: GOOGLE_CLIENT_ID is missing. "
        "Google login will not work until it is configured."
    )


# ============================================================
# PASSWORD RESET CONFIGURATION
# ============================================================

RESET_TOKEN_EXPIRE_MINUTES = 30

FRONTEND_URL = os.getenv(
    "FRONTEND_URL",
    "http://localhost:5173"
)


SMTP_HOST = os.getenv(
    "SMTP_HOST",
    "smtp.gmail.com"
)

SMTP_PORT = int(
    os.getenv(
        "SMTP_PORT",
        "587"
    )
)

SMTP_USERNAME = os.getenv(
    "SMTP_USERNAME"
)

SMTP_PASSWORD = os.getenv(
    "SMTP_PASSWORD"
)


# ============================================================
# PASSWORD HASHING
# ============================================================

password_hasher = PasswordHasher()


def hash_password(password: str) -> str:
    return password_hasher.hash(password)


def verify_password(
    password: str,
    hashed_password: str
) -> bool:

    try:

        return password_hasher.verify(
            hashed_password,
            password
        )

    except (
        VerifyMismatchError,
        VerificationError
    ):

        return False


# ============================================================
# JWT
# ============================================================

def create_access_token(data: dict) -> str:

    to_encode = data.copy()

    expire = (
        datetime.now(timezone.utc)
        + timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        )
    )

    to_encode.update({
        "exp": expire
    })

    return jwt.encode(
        to_encode,
        JWT_SECRET,
        algorithm=ALGORITHM
    )


# ============================================================
# REGISTER
# ============================================================

@router.post("/register")
def register(
    user: UserCreate,
    db: Session = Depends(get_db)
):

    existing_user = (
        db.query(User)
        .filter(
            User.email == user.email
        )
        .first()
    )

    if existing_user:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    if len(user.password) < 8:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must contain at least 8 characters"
        )

    hashed_password = hash_password(
        user.password
    )

    new_user = User(
        name=user.name,
        email=user.email,
        password_hash=hashed_password,
        is_active=True
    )

    try:

        db.add(new_user)

        db.commit()

        db.refresh(new_user)

    except IntegrityError as e:

        db.rollback()

        print(
            "\n================ DATABASE ERROR ================"
        )
        print(e)
        print(
            "=================================================\n"
        )

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unable to create account"
        )

    except Exception as e:

        db.rollback()

        print(
            "\n================ SERVER ERROR =================="
        )
        print(e)
        print(
            "=================================================\n"
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not create user"
        )

    return {
        "message": "User registered successfully",
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email
        }
    }


# ============================================================
# NORMAL LOGIN
# ============================================================

@router.post("/login")
def login(
    user: UserLogin,
    db: Session = Depends(get_db)
):

    existing_user = (
        db.query(User)
        .filter(
            User.email == user.email
        )
        .first()
    )

    if not existing_user:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    if not existing_user.is_active:

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is disabled"
        )

    password_valid = verify_password(
        user.password,
        existing_user.password_hash
    )

    if not password_valid:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    access_token = create_access_token({
        "sub": str(existing_user.id),
        "email": existing_user.email
    })

    return {
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": existing_user.id,
            "name": existing_user.name,
            "email": existing_user.email
        }
    }


# ============================================================
# GOOGLE LOGIN
# ============================================================

@router.post("/google")
def google_login(
    payload: GoogleLogin,
    db: Session = Depends(get_db)
):

    if not GOOGLE_CLIENT_ID:

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Google authentication is not configured"
        )

    try:

        google_user = id_token.verify_oauth2_token(
            payload.credential,
            google_requests.Request(),
            GOOGLE_CLIENT_ID
        )

    except ValueError:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google authentication"
        )

    email = google_user.get("email")

    email_verified = google_user.get(
        "email_verified",
        False
    )

    name = google_user.get(
        "name"
    ) or email.split("@")[0]

    if not email:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google account email was not provided"
        )

    if not email_verified:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Google email is not verified"
        )

    # --------------------------------------------------------
    # Find existing account
    # --------------------------------------------------------

    existing_user = (
        db.query(User)
        .filter(
            User.email == email
        )
        .first()
    )

    # --------------------------------------------------------
    # Create account if it doesn't exist
    # --------------------------------------------------------

    if not existing_user:

        # Google users do not use the local password.
        # Create a random Argon2 password that the user
        # does not know.
        random_password = secrets.token_urlsafe(48)

        existing_user = User(
            name=name,
            email=email,
            password_hash=hash_password(
                random_password
            ),
            is_active=True
        )

        try:

            db.add(existing_user)

            db.commit()

            db.refresh(existing_user)

        except IntegrityError:

            db.rollback()

            existing_user = (
                db.query(User)
                .filter(
                    User.email == email
                )
                .first()
            )

            if not existing_user:

                raise HTTPException(
                    status_code=500,
                    detail="Unable to create Google account"
                )

    # --------------------------------------------------------
    # Check active status
    # --------------------------------------------------------

    if not existing_user.is_active:

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is disabled"
        )

    # --------------------------------------------------------
    # Create YOUR application JWT
    # --------------------------------------------------------

    access_token = create_access_token({
        "sub": str(existing_user.id),
        "email": existing_user.email
    })

    return {
        "message": "Google login successful",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": existing_user.id,
            "name": existing_user.name,
            "email": existing_user.email
        }
    }


# ============================================================
# TOKEN HASH
# ============================================================

def hash_reset_token(token: str) -> str:

    return hashlib.sha256(
        token.encode("utf-8")
    ).hexdigest()


# ============================================================
# SEND RESET EMAIL
# ============================================================

def send_reset_email(
    recipient: str,
    reset_url: str
):

    if not SMTP_USERNAME or not SMTP_PASSWORD:

        raise RuntimeError(
            "SMTP_USERNAME and SMTP_PASSWORD "
            "are missing from .env"
        )

    message = EmailMessage()

    message["Subject"] = (
        "AI-DPR Guardian - Password Reset"
    )

    message["From"] = SMTP_USERNAME

    message["To"] = recipient

    message.set_content(
        f"""
Hello,

A password reset was requested for your AI-DPR Guardian account.

Use the link below to create a new password:

{reset_url}

This link will expire in 30 minutes.

If you did not request this password reset, you can safely ignore this email.

Regards,

Team Nexus
AI-DPR Guardian
"""
    )

    with smtplib.SMTP(
        SMTP_HOST,
        SMTP_PORT
    ) as server:

        server.starttls()

        server.login(
            SMTP_USERNAME,
            SMTP_PASSWORD
        )

        server.send_message(
            message
        )


# ============================================================
# FORGOT PASSWORD
# ============================================================

@router.post("/forgot-password")
def forgot_password(
    payload: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):

    existing_user = (
        db.query(User)
        .filter(
            User.email == payload.email
        )
        .first()
    )

    # Do not reveal whether an email exists.
    generic_response = {
        "message": (
            "If an account exists for this email, "
            "a password reset link has been sent."
        )
    }

    if not existing_user:

        return generic_response

    # --------------------------------------------------------
    # Invalidate previous tokens
    # --------------------------------------------------------

    old_tokens = (
        db.query(PasswordResetToken)
        .filter(
            PasswordResetToken.user_id
            == existing_user.id,
            PasswordResetToken.used == False
        )
        .all()
    )

    for old_token in old_tokens:

        old_token.used = True

    # --------------------------------------------------------
    # Generate secure token
    # --------------------------------------------------------

    raw_token = secrets.token_urlsafe(48)

    token_hash = hash_reset_token(
        raw_token
    )

    expires_at = (
        datetime.now(timezone.utc)
        + timedelta(
            minutes=RESET_TOKEN_EXPIRE_MINUTES
        )
    )

    reset_record = PasswordResetToken(
        user_id=existing_user.id,
        token_hash=token_hash,
        expires_at=expires_at,
        used=False
    )

    db.add(reset_record)

    db.commit()

    # --------------------------------------------------------
    # Create frontend reset URL
    # --------------------------------------------------------

    reset_url = (
        f"{FRONTEND_URL}/reset-password"
        f"?token={raw_token}"
    )

    try:

        send_reset_email(
            existing_user.email,
            reset_url
        )

    except Exception as e:

        print(
            "\n================ EMAIL ERROR =================="
        )

        print(e)

        print(
            "================================================\n"
        )

        # Roll back the reset record if email failed.
        reset_record.used = True

        db.commit()

        raise HTTPException(
            status_code=500,
            detail="Unable to send password reset email"
        )

    return generic_response


# ============================================================
# RESET PASSWORD
# ============================================================

@router.post("/reset-password")
def reset_password(
    payload: ResetPasswordRequest,
    db: Session = Depends(get_db)
):

    if len(payload.password) < 8:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must contain at least 8 characters"
        )

    token_hash = hash_reset_token(
        payload.token
    )

    reset_record = (
        db.query(PasswordResetToken)
        .filter(
            PasswordResetToken.token_hash
            == token_hash,
            PasswordResetToken.used == False
        )
        .first()
    )

    if not reset_record:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset link"
        )

    now = datetime.now(timezone.utc)

    expires_at = reset_record.expires_at

    if expires_at.tzinfo is None:

        expires_at = expires_at.replace(
            tzinfo=timezone.utc
        )

    if expires_at < now:

        reset_record.used = True

        db.commit()

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This reset link has expired"
        )

    user = (
        db.query(User)
        .filter(
            User.id == reset_record.user_id
        )
        .first()
    )

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User account not found"
        )

    # --------------------------------------------------------
    # Update password
    # --------------------------------------------------------

    user.password_hash = hash_password(
        payload.password
    )

    reset_record.used = True

    db.commit()

    return {
        "message": (
            "Password reset successfully. "
            "You can now sign in."
        )
    }