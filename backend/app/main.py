from fastapi import FastAPI
from app.services.gemini_service import generate_response
from app.config import client

app = FastAPI()



@app.get("/test")
def test():
    return generate_response("Hello, how are you?")

@app.get("/")
def health_check():
    return {"status": "ok"}


