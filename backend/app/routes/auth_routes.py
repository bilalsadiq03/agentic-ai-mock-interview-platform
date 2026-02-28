from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime
from app.config import db
from app.schemas.auth_schema import UserSignup, UserLogin, TokenResponse, UserPublic
from app.utils.auth import hash_password, verify_password, create_access_token
from app.dependencies.auth import get_current_user

router = APIRouter(prefix="/auth", tags=["Auth"])


def _public_user(user_doc: dict) -> UserPublic:
    return UserPublic(
        id=str(user_doc["_id"]),
        email=user_doc["email"],
        full_name=user_doc.get("full_name"),
    )


@router.post("/signup", response_model=TokenResponse)
def signup(payload: UserSignup):
    email = payload.email.strip().lower()
    password = payload.password

    if len(password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters.")
    if len(password.encode("utf-8")) > 72:
        raise HTTPException(status_code=400, detail="Password must be 72 bytes or fewer.")

    if db.users.find_one({"email": email}):
        raise HTTPException(status_code=409, detail="Email already registered.")

    user_doc = {
        "email": email,
        "password_hash": hash_password(password),
        "full_name": payload.full_name,
        "created_at": datetime.utcnow(),
    }
    result = db.users.insert_one(user_doc)
    user_doc["_id"] = result.inserted_id

    token = create_access_token(subject=str(result.inserted_id), email=email)
    return TokenResponse(access_token=token, user=_public_user(user_doc))


@router.post("/login", response_model=TokenResponse)
def login(payload: UserLogin):
    email = payload.email.strip().lower()
    if len(payload.password.encode("utf-8")) > 72:
        raise HTTPException(status_code=400, detail="Password must be 72 bytes or fewer.")
    user = db.users.find_one({"email": email})

    if not user or not verify_password(payload.password, user.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    token = create_access_token(subject=str(user["_id"]), email=user["email"])
    return TokenResponse(access_token=token, user=_public_user(user))


@router.get("/me", response_model=UserPublic)
def me(user: dict = Depends(get_current_user)):
    return _public_user(user)
