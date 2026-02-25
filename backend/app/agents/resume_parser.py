from app.services.gemini_service import generate_response
import json
import re

def clean_json_response(text: str):
    # Remove markdown code block formatting
    text = re.sub(r"```json", "", text)
    text = re.sub(r"```", "", text)
    return text.strip()

def parse_resume_and_jd(resume_text: str, job_description: str):
    prompt = f"""
    You are an AI career analyst.

    Analyze the resume and job description.

    Resume:
    {resume_text}

    Job Description:
    {job_description}

    Return strictly valid JSON:

    {{
        "candidate_skills": [],
        "experience_level": "Junior/Mid/Senior",
        "projects": [],
        "target_role": "",
        "required_skills": [],
        "skill_gap": []
    }}

    Do not include explanations.
    Do not wrap in markdown.
    """

    response = generate_response(prompt)

    cleaned_response = clean_json_response(response)

    try:
        return json.loads(cleaned_response)
    except Exception as e:
        return {
            "error": "Failed to parse structured JSON",
            "exception": str(e),
            "raw_output": response
        }