import json
from app.services.gemini_service import generate_response

def evaluate_interview_performance(questions, user_answers):
    prompt = f"""
    You are a Senior Technical Interview Evaluator. 
    Analyze the candidate's answers to the provided interview questions.
    
    For each question, compare the 'user_answer' against the 'expected_keywords'.
    Provide a score from 0 to 10 and a brief, helpful feedback string.
    Also, calculate an overall performance summary.

    Questions & Expected Keywords:
    {questions}

    Candidate's Answers:
    {user_answers}

    You MUST return ONLY a valid JSON object following this structure:
    {{
        "evaluations": [
            {{
                "question_id": 1,
                "score": 8,
                "feedback": "Strong explanation of hash maps, but missed the mention of caching."
            }}
        ],
        "overall_score": 7.5,
        "summary": "The candidate has strong fundamentals in DSA but needs more depth in System Design."
    }}
    """

    try:
        response_text = generate_response(prompt)
        
        # Robust JSON extraction
        start_idx = response_text.find('{')
        end_idx = response_text.rfind('}')
        
        if start_idx != -1 and end_idx != -1:
            clean_json = response_text[start_idx:end_idx+1]
            return json.loads(clean_json)
        else:
            raise ValueError("No JSON found in evaluation response.")

    except Exception as e:
        print(f"Evaluator Error: {e}")
        return {
            "evaluations": [],
            "overall_score": 0,
            "summary": "Error generating evaluation."
        }