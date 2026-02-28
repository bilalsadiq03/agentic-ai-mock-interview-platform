import json
from app.services.gemini_service import generate_response

def create_interview_plan(resume_data, job_description):

    # Update the prompt to strictly enforce JSON output
    prompt = f"""
    You are an Interview Planner AI.

    Based on the resume and job description, create an interview plan.
    You MUST return ONLY a valid JSON object. Do not include markdown blocks like ```json or ```.

    The JSON must exactly follow this structure:
    {{
        "difficulty": "Junior, Mid, or Senior",
        "key_topics": ["string", "string", "string"],
        "num_questions": 5,
        "focus_areas": ["string", "string"]
    }}

    Resume:
    {resume_data}

    Job Description:
    {job_description}
    """

    try:
        # Call Gemini via your service
        response_text = generate_response(prompt)
        
        # Clean up any potential markdown formatting Gemini might still add
        clean_text = response_text.replace("```json", "").replace("```", "").strip()
        
        # Convert the string response into a Python dictionary
        plan_dict = json.loads(clean_text)
        return plan_dict

    except Exception as e:
        print(f"Error generating or parsing plan: {e}")
        # Return a safe fallback plan so your frontend doesn't crash on failure
        return {
            "difficulty": "Standard",
            "key_topics": ["General Background", "Technical Fit"],
            "num_questions": 5,
            "focus_areas": ["Resume Walkthrough"]
        }