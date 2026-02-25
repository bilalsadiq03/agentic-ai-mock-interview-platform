from fastapi import APIRouter, UploadFile, File, Form
from app.utils.pdf_utils import extract_text_from_pdf
from app.agents.resume_parser import parse_resume_and_jd
from app.config import db
from datetime import datetime

router = APIRouter()

@router.post("/upload-resume")
async def upload_resume(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):
    # Extract text from PDF
    resume_text = extract_text_from_pdf(file.file)

    # AI Parsing
    parsed_data = parse_resume_and_jd(resume_text, job_description)

    # Store in DB
    interview = {
        "resume_data": parsed_data,
        "job_description": job_description,
        "interview_plan": {},
        "questions": [],
        "evaluations": [],
        "final_report": {},
        "created_at": datetime.utcnow()
    }

    result = db.interviews.insert_one(interview)

    return {
        "interview_id": str(result.inserted_id),
        "parsed_data": parsed_data
    }