from pydantic import BaseModel


class UserSignup(BaseModel):
    email: str
    password: str
    full_name: str | None = None


class UserLogin(BaseModel):
    email: str
    password: str


class UserPublic(BaseModel):
    id: str
    email: str
    full_name: str | None = None


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserPublic
