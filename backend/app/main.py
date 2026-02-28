from fastapi import FastAPI
from pydantic import BaseModel
from app.services.gemini_service import generate_response
from app.routes import resume_routes
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# ✅ CORS (required for Next.js)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resume_routes.router)


class PromptRequest(BaseModel):
    prompt: str


@app.post("/test")
def test(data: PromptRequest):
    return generate_response(data.prompt)


@app.get("/")
def health_check():
    return {"status": "ok"}