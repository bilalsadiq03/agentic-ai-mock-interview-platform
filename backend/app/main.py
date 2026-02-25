from fastapi import FastAPI
from app.services.gemini_service import generate_response
from app.config import client
from app.routes import resume_routes

app = FastAPI()

app.include_router(resume_routes.router)

@app.get("/test")
def test():
    return generate_response("Hello, how are you?")

@app.get("/")
def health_check():
    return {"status": "ok"}


