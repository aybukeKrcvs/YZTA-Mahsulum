from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Product
from app.services.analytics import get_sales_trend, get_top_products
from app.services.alerting import calculate_daily_avg_sales, get_days_until_stockout
from app.services.forecast import forecast_demand
from app.ai.insights import generate_dashboard_insights, generate_product_explanation

router = APIRouter(prefix="/api/ai", tags=["ai"])

@router.get("/insights")
def get_insights(db: Session = Depends(get_db)):
    sales = get_sales_trend(db, days=30)
    top = get_top_products(db, days=30, limit=5)
    
    critical_products = db.query(Product).filter(
        Product.is_active == True,
        Product.current_stock <= Product.critical_threshold
    ).all()

    stock_summary = [
        {
            "name": p.name,
            "category": p.category,
            "current_stock": p.current_stock,
            "critical_threshold": p.critical_threshold,
            "unit": p.unit
        }
        for p in critical_products[:10]
    ]

    sales_summary = {
        "top_products": top[:5],
        "total_days": len(sales),
        "total_quantity": sum(s["quantity"] for s in sales),
        "total_revenue": sum(s["revenue"] for s in sales)
    }

    insights = generate_dashboard_insights(sales_summary, stock_summary)
    return {"insights": insights}

@router.get("/products/{product_id}/explanation")
def get_product_explanation(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        return {"explanation": "Ürün bulunamadı"}

    from app.models import Supplier
    lead_time = 1
    if product.supplier_id:
        supplier = db.query(Supplier).filter(Supplier.id == product.supplier_id).first()
        if supplier:
            lead_time = supplier.lead_time_days

    daily_avg = calculate_daily_avg_sales(db, product_id)
    days = get_days_until_stockout(product.current_stock, daily_avg)
    forecast = forecast_demand(db, product_id, days_ahead=7)
    total_forecast_7d = sum(f["predicted"] for f in forecast)

    from datetime import datetime
    now_month = datetime.utcnow().month
    if product.season_start_month and product.season_end_month:
        if product.season_start_month <= now_month <= product.season_end_month:
            season_info = f"Sezon içinde ({product.season_start_month}. - {product.season_end_month}. ay)"
        else:
            season_info = f"Sezon dışı (sezon: {product.season_start_month}. - {product.season_end_month}. ay)"
    else:
        season_info = "Yıl boyu ürün"

    product_data = {
        "product_name": product.name,
        "current_stock": product.current_stock,
        "unit": product.unit,
        "total_sold_30": round(daily_avg * 30, 1),
        "daily_avg": round(daily_avg, 2),
        "days_until_stockout": round(days, 1) if days < 999 else "Belirsiz",
        "lead_time": lead_time,
        "season_info": season_info,
        "forecast_7d": round(total_forecast_7d, 1)
    }

    explanation = generate_product_explanation(product_data)
    return {"explanation": explanation}