import google.generativeai as genai
from app.config import settings

genai.configure(api_key=settings.gemini_api_key)

def get_model():
    return genai.GenerativeModel("gemini-2.0-flash-lite")

def generate_text(prompt: str) -> str:
    model = get_model()
    response = model.generate_content(prompt)
    return response.text