from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.utils.pdf_utils import extract_text_from_pdf
from app.agents.resume_parser import parse_resume_and_jd
from app.config import db
from datetime import datetime
from bson import ObjectId

router = APIRouter(prefix="/resume", tags=["Resume"])


@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):
    try:
        # Validate file type
        if not file.filename.endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Only PDF allowed")

        # Extract text from resume
        resume_text = extract_text_from_pdf(file.file)

        if not resume_text.strip():
            raise HTTPException(status_code=400, detail="Empty resume text")

        # AI Parsing (Gemini / Agent)
        parsed_data = parse_resume_and_jd(resume_text, job_description)

        # Create interview document
        interview = {
            "resume_data": parsed_data,
            "job_description": job_description,
            "interview_plan": {},
            "questions": [],
            "evaluations": [],
            "final_report": {},
            "status": "created",
            "created_at": datetime.utcnow()
        }

        result = db.interviews.insert_one(interview)

        return {
            "success": True,
            "interview_id": str(result.inserted_id),
            "parsed_data": parsed_data
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ⭐ Get Interview Data
@router.get("/{interview_id}")
def get_interview(interview_id: str):
    interview = db.interviews.find_one({"_id": ObjectId(interview_id)})

    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")

    interview["_id"] = str(interview["_id"])
    return interview