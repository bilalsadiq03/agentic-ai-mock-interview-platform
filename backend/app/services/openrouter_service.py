import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("OPENROUTER_API_KEY")

URL = "https://openrouter.ai/api/v1/chat/completions"


def generate_response(prompt: str) -> str:
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",

        # REQUIRED by OpenRouter
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Agentic AI Mock Interview",
    }

    data = {
        # ✅ Use a guaranteed available FREE model
        "model": "deepseek/deepseek-chat",

        "messages": [
            {"role": "user", "content": prompt}
        ],
    }

    response = requests.post(URL, headers=headers, json=data)

    response.raise_for_status()

    return response.json()["choices"][0]["message"]["content"]