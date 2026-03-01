import json
from app.services.openrouter_service import generate_response

def generate_interview_questions(resume_data, job_description, interview_plan):

    prompt = f"""
You are an expert technical interviewer creating a REAL mock assessment.

Generate EXACTLY 20 questions divided into sections:

• MCQ: 10 questions (with options + correct answer)
• Coding: 5 problems
• Technical: 3 conceptual questions
• Resume-based: 2 personalized questions

Difficulty: {interview_plan.get('difficulty', 'Intermediate')}

Return ONLY valid JSON.

Structure:

{{
  "questions": [
    {{
      "id": 1,
      "section": "mcq",
      "type": "mcq",
      "topic": "Data Structures",
      "difficulty": "Easy",
      "text": "Which structure uses LIFO?",
      "options": ["Queue", "Stack", "Tree", "Graph"],
      "answer": "Stack"
    }},
    {{
      "id": 11,
      "section": "coding",
      "type": "coding",
      "topic": "Algorithms",
      "difficulty": "Intermediate",
      "text": "Write a function to check if a string is a palindrome.",
      "constraints": ["O(n) time"],
      "evaluation_keywords": ["two pointers", "reverse"]
    }}
  ]
}}

Resume:
{resume_data}

Job Description:
{job_description}
"""

    try:
        response_text = generate_response(prompt)
        clean = response_text.replace("```json", "").replace("```", "").strip()
        return json.loads(clean)["questions"]

    except Exception as e:
        print("Error:", e)
        return []