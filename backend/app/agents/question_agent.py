import json
from app.services.gemini_service import generate_response

def generate_interview_questions(resume_data, job_description, interview_plan):
    
    # We use the number of questions defined by the planner, defaulting to 5
    num_questions = interview_plan.get("num_questions", 5)
    
    prompt = f"""
    You are an expert Technical Interviewer. 
    Based on the candidate's resume, the job description, and the provided interview plan, 
    generate exactly {num_questions} interview questions. 

    The questions should match the difficulty level: {interview_plan.get('difficulty', 'Intermediate')}.
    
    You MUST return ONLY a valid JSON object. Do not include markdown blocks like ```json or ```.
    
    The JSON must exactly follow this structure:
    {{
        "questions": [
            {{
                "id": 1,
                "topic": "Data Structures",
                "text": "How would you optimize the search function you built in your e-commerce project?",
                "expected_keywords": ["hash map", "O(1) complexity", "caching"]
            }}
        ]
    }}

    Resume:
    {resume_data}

    Job Description:
    {job_description}

    Interview Plan:
    {interview_plan}
    """

    try:
        # Call Gemini
        response_text = generate_response(prompt)
        
        # Clean up any markdown
        clean_text = response_text.replace("```json", "").replace("```", "").strip()
        
        # Parse JSON
        qa_dict = json.loads(clean_text)
        
        # Return just the list of questions
        return qa_dict.get("questions", [])

    except Exception as e:
        print(f"Error generating questions: {e}")
        # Safe fallback in case Gemini fails to format properly
        return [
            {
                "id": 1,
                "topic": "General Background",
                "text": "Can you walk me through your resume and highlight your most relevant experience?",
                "expected_keywords": ["experience", "background", "projects"]
            }
        ]