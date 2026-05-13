import json
from app.ai.gemini_client import generate_text
from app.ai.prompts import INSIGHTS_PROMPT, PRODUCT_EXPLANATION_PROMPT, EMAIL_DRAFT_PROMPT

def generate_dashboard_insights(sales_summary: dict, stock_summary: list) -> list:
    try:
        prompt = INSIGHTS_PROMPT.format(
            sales_summary=json.dumps(sales_summary, ensure_ascii=False, indent=2),
            stock_summary=json.dumps(stock_summary, ensure_ascii=False, indent=2)
        )
        text = generate_text(prompt).strip()

        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].split("```")[0].strip()

        return json.loads(text)
    except Exception as e:
        return [{"title": "Sistem Mesajı", "message": f"İçgörüler yüklenemedi: {str(e)}", "severity": "info"}]

def generate_product_explanation(product_data: dict) -> str:
    try:
        prompt = PRODUCT_EXPLANATION_PROMPT.format(**product_data)
        return generate_text(prompt).strip()
    except Exception as e:
        return f"Açıklama yüklenemedi: {str(e)}"

def generate_email_draft(supplier_name: str, supplier_email: str, items: list, expected_date: str) -> str:
    try:
        items_text = "\n".join([
            f"- {item['product_name']}: {item['quantity']} {item['unit']}"
            for item in items
        ])
        prompt = EMAIL_DRAFT_PROMPT.format(
            supplier_name=supplier_name,
            supplier_email=supplier_email,
            items_list=items_text,
            expected_date=expected_date
        )
        return generate_text(prompt).strip()
    except Exception as e:
        return f"Mail taslağı oluşturulamadı: {str(e)}"