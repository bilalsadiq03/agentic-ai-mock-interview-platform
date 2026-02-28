from fastapi import FastAPI
from pydantic import BaseModel
from app.services.gemini_service import generate_response
from app.routes import resume_routes
from app.routes import auth_routes
from app.config import FRONTEND_ORIGINS_LIST
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# ✅ CORS (required for Next.js)
app.add_middleware(
    CORSMiddleware,
    allow_origins=FRONTEND_ORIGINS_LIST,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resume_routes.router)
app.include_router(auth_routes.router)


@app.on_event("startup")
def ensure_indexes():
    try:
        # Enforce unique user emails
        from app.config import db
        db.users.create_index("email", unique=True)
    except Exception:
        # Index creation shouldn't block app startup
        pass


class PromptRequest(BaseModel):
    prompt: str


@app.post("/test")
def test(data: PromptRequest):
    return generate_response(data.prompt)


@app.get("/")
def health_check():
    return {"status": "ok"}
