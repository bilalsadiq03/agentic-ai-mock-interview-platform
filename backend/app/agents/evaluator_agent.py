import json
from app.services.openrouter_service import generate_response

# 🔥 THE FIX: Only accept one argument, the merged list
def evaluate_interview_performance(questions_with_answers):
    evaluation_data = []
    
    for q in questions_with_answers:
        # Pull the answer directly from the object
        raw_answer = q.get("candidate_answer", "")
        
        if not raw_answer or not str(raw_answer).strip():
            candidate_answer = "No answer provided."
        else:
            candidate_answer = raw_answer

        evaluation_data.append({
            "question_id": q.get("id", "Unknown"),
            "section": q.get("section", "General"),
            "type": q.get("type", "open_ended"),
            "topic": q.get("topic", "General"),
            "question_text": q.get("text", "Question Text Missing"),
            "expected_keywords": q.get("expected_keywords", []),
            "correct_answer": q.get("correct_answer", None),
            "candidate_answer": candidate_answer
        })

    prompt = f"""
    You are an expert Senior Technical Interview Evaluator. 
    Analyze the candidate's answers to the provided interview questions.

    You must evaluate different question types using this rubric:
    * 'mcq': Score 10 if the candidate_answer exactly matches the correct_answer. Score 0 otherwise. Provide a brief explanation of why the correct answer is right.
    * 'coding': Evaluate the code for logical correctness, syntax, and time/space complexity. Score 0 to 10. Point out bugs or optimizations.
    * 'open_ended' / 'text': Evaluate based on clarity, depth of knowledge, and presence of expected_keywords. Score 0 to 10.

    CRITICAL INSTRUCTION: If the candidate_answer is "No answer provided.", you MUST score it a 0. Do not guess or hallucinate an answer.

    Here is the interview data (Questions and Candidate Answers):
    {json.dumps(evaluation_data, indent=2)}

    You MUST return ONLY a valid JSON object following this exact structure. 
    Make sure to include the original 'question_text', 'type', and 'section' in your response!
    {{
        "evaluations": [
            {{
                "question_id": 1,
                "question_text": "What is a hash map?",
                "type": "open_ended",
                "section": "Technical",
                "candidate_answer": "It stores key value pairs.",
                "score": 8,
                "feedback": "Strong explanation, but missed the mention of caching."
            }}
        ],
        "overall_score": 7.5,
        "summary": "The candidate has strong fundamentals in Data Structures but needs more practice writing optimal code under pressure."
    }}
    """

    try:
        response_text = generate_response(prompt)
        
        start_idx = response_text.find('{')
        end_idx = response_text.rfind('}')
        
        if start_idx != -1 and end_idx != -1:
            clean_json = response_text[start_idx:end_idx+1]
            return json.loads(clean_json)
        else:
            raise ValueError("No JSON found in the LLM response.")

    except Exception as e:
        print(f"Evaluator Error: {e}")
        return {
            "evaluations": [
                {
                    "question_id": q.get("id", 1),
                    "question_text": q.get("text", "Error loading question"),
                    "type": q.get("type", "text"),
                    "section": q.get("section", "General"),
                    "score": 0,
                    "feedback": "Could not generate evaluation due to a server error."
                } for q in questions_with_answers
            ],
            "overall_score": 0,
            "summary": "An error occurred while evaluating your test. Please contact support."
        }