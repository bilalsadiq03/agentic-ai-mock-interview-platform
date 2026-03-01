from backend.app.services.openrouter_service import generate_response

def ask_followup(question, user_answer):

    prompt = f"""
You are a human-like interviewer.

Question:
{question}

Candidate Answer:
{user_answer}

Ask one follow-up question.
"""

    return generate_response(prompt)