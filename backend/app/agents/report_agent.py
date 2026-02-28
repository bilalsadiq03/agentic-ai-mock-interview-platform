from app.services.gemini_service import generate_response


def generate_final_report(
    parsed_data,
    job_description,
    questions,
    evaluations
):
    prompt = f"""
    You are a senior technical hiring manager.

    Candidate Profile:
    {parsed_data}

    Job Description:
    {job_description}

    Interview Questions:
    {questions}

    Evaluation Results:
    {evaluations}

    Generate a professional interview report including:

    1. Overall Score (out of 100)
    2. Strengths
    3. Weaknesses
    4. Technical Skill Assessment
    5. Communication Assessment
    6. Hiring Recommendation (Hire / Borderline / Reject)
    7. Detailed Improvement Suggestions

    Format the response as clear professional text.
    """

    return generate_response(prompt)