import os
from datetime import datetime, timedelta, timezone

from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException, status
from jose import jwt
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError, VerificationError

from app.database import get_db
from app.models import User
from app.schemas import UserCreate, UserLogin


# Load .env
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
# PASSWORD HASHING
# ============================================================

password_hasher = PasswordHasher()


def hash_password(password: str) -> str:
    """
    Hash the user's password using Argon2.
    """
    return password_hasher.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    """
    Verify a plain password against the stored Argon2 hash.
    """
    try:
        return password_hasher.verify(
            hashed_password,
            password
        )

    except (VerifyMismatchError, VerificationError):
        return False


# ============================================================
# CREATE JWT TOKEN
# ============================================================

def create_access_token(data: dict) -> str:

    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
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

    # --------------------------------------------------------
    # Check whether email already exists
    # --------------------------------------------------------

    existing_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # --------------------------------------------------------
    # Hash password
    # --------------------------------------------------------

    hashed_password = hash_password(user.password)

    # --------------------------------------------------------
    # Create user
    # --------------------------------------------------------

    new_user = User(
        name=user.name,
        email=user.email,
        password_hash=hashed_password
    )

    try:

        db.add(new_user)

        db.commit()

        db.refresh(new_user)

    except IntegrityError as e:

        db.rollback()

        # Print actual PostgreSQL error in terminal
        print("\n================ DATABASE ERROR ================")
        print(e)
        print("=================================================\n")

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Database integrity error: {str(e.orig)}"
        )

    except Exception as e:

        db.rollback()

        print("\n================ SERVER ERROR ==================")
        print(e)
        print("=================================================\n")

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not create user"
        )

    # --------------------------------------------------------
    # Success response
    # --------------------------------------------------------

    return {
        "message": "User registered successfully",
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email
        }
    }


# ============================================================
# LOGIN
# ============================================================

@router.post("/login")
def login(
    user: UserLogin,
    db: Session = Depends(get_db)
):

    # --------------------------------------------------------
    # Find user
    # --------------------------------------------------------

    existing_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if not existing_user:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # --------------------------------------------------------
    # Verify password
    # --------------------------------------------------------

    password_valid = verify_password(
        user.password,
        existing_user.password_hash
    )

    if not password_valid:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # --------------------------------------------------------
    # Create JWT
    # --------------------------------------------------------

    access_token = create_access_token({
        "sub": str(existing_user.id),
        "email": existing_user.email
    })

    # --------------------------------------------------------
    # Success response
    # --------------------------------------------------------

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