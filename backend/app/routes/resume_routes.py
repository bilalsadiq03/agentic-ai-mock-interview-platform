from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from app.utils.pdf_utils import extract_text_from_pdf
from app.agents.resume_parser import parse_resume_and_jd
from app.agents.planner_agent import create_interview_plan
from app.agents.question_agent import generate_interview_questions
from app.agents.evaluator_agent import evaluate_interview_performance
from app.config import db
from app.dependencies.auth import get_current_user
from datetime import datetime
from bson import ObjectId

router = APIRouter(prefix="/resume", tags=["Resume"], dependencies=[Depends(get_current_user)])

@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    job_description: str = Form(...),
    user: dict = Depends(get_current_user)
):
    try:
        # Validate file type
        if not file.filename.endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Only PDF allowed")

        # Extract text
        resume_text = extract_text_from_pdf(file.file)

        if not resume_text.strip():
            raise HTTPException(status_code=400, detail="Empty resume text")

        # AI Resume Parser Agent
        parsed_data = parse_resume_and_jd(resume_text, job_description)

        # Save interview record
        interview = {
            "owner_id": user["_id"],
            "resume_data": parsed_data,
            "job_description": job_description,
            "interview_plan": {},
            "questions": [],
            "evaluations": [],
            "final_report": {},
            "status": "parsed",
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

@router.post("/{interview_id}/plan")
def generate_plan(interview_id: str, user: dict = Depends(get_current_user)):
    try:
        # Convert string ID to MongoDB ObjectId
        oid = ObjectId(interview_id)
        interview = db.interviews.find_one({"_id": oid})

        if not interview:
            raise HTTPException(status_code=404, detail="Interview not found")
        if interview.get("owner_id") != user["_id"]:
            raise HTTPException(status_code=403, detail="Forbidden")

        resume_data = interview["resume_data"]
        job_description = interview["job_description"]

        # Planner Agent
        plan = create_interview_plan(resume_data, job_description)

        # Save plan to DB
        db.interviews.update_one(
            {"_id": oid},
            {
                "$set": {
                    "interview_plan": plan,
                    "status": "planned"
                }
            }
        )

        return {
            "success": True,
            "interview_id": interview_id,
            "interview_plan": plan
        }

    except Exception as e:
        # Handle invalid ObjectId format or Agent failures
        raise HTTPException(status_code=500, detail=f"Planner Error: {str(e)}")

@router.post("/{interview_id}/questions")
def create_questions(interview_id: str, user: dict = Depends(get_current_user)):
    try:
        oid = ObjectId(interview_id)
        interview = db.interviews.find_one({"_id": oid})

        if not interview:
            raise HTTPException(status_code=404, detail="Interview not found")
        if interview.get("owner_id") != user["_id"]:
            raise HTTPException(status_code=403, detail="Forbidden")

        resume_data = interview.get("resume_data", {})
        job_description = interview.get("job_description", "")
        interview_plan = interview.get("interview_plan", {})

        if not interview_plan:
            raise HTTPException(status_code=400, detail="Please generate an interview plan first.")

        # 🧠 QA Agent
        questions = generate_interview_questions(resume_data, job_description, interview_plan)

        # Save questions to DB
        db.interviews.update_one(
            {"_id": oid},
            {
                "$set": {
                    "questions": questions,
                    "status": "questions_ready"
                }
            }
        )

        return {
            "success": True,
            "interview_id": interview_id,
            "questions": questions
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"QA Agent Error: {str(e)}")

@router.post("/{interview_id}/evaluate")
def submit_interview(interview_id: str, payload: dict, user: dict = Depends(get_current_user)):
    try:
        oid = ObjectId(interview_id)
        interview = db.interviews.find_one({"_id": oid})

        if not interview:
            raise HTTPException(status_code=404, detail="Interview not found")
        if interview.get("owner_id") != user["_id"]:
            raise HTTPException(status_code=403, detail="Forbidden")

        user_answers = payload.get("answers", {})
        questions = interview.get("questions", [])

        # 🧠 Evaluator Agent
        report = evaluate_interview_performance(questions, user_answers)

        # Update DB with the final results
        db.interviews.update_one(
            {"_id": oid},
            {
                "$set": {
                    "final_report": report,
                    "status": "completed"
                }
            }
        )

        return {"success": True, "report": report}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Evaluation Error: {str(e)}")
    
#Get Interview Data (Any Step)
@router.get("/{interview_id}")
def get_interview(interview_id: str, user: dict = Depends(get_current_user)):
    try:
        interview = db.interviews.find_one({"_id": ObjectId(interview_id)})

        if not interview:
            raise HTTPException(status_code=404, detail="Interview not found")
        if interview.get("owner_id") != user["_id"]:
            raise HTTPException(status_code=403, detail="Forbidden")

        interview["_id"] = str(interview["_id"])
        return interview
    except:
        raise HTTPException(status_code=400, detail="Invalid ID format")

# List interviews for current user
@router.get("/mine/list")
def list_my_interviews(user: dict = Depends(get_current_user)):
    cursor = db.interviews.find({"owner_id": user["_id"]}).sort("created_at", -1)
    items = []
    for doc in cursor:
        created_at = doc.get("created_at")
        items.append({
            "id": str(doc["_id"]),
            "status": doc.get("status"),
            "created_at": created_at.isoformat() if created_at else None,
            "target_role": (doc.get("resume_data") or {}).get("target_role"),
        })
    return {"items": items}
