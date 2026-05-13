from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.analytics import (
    get_sales_trend, get_top_products,
    get_category_breakdown, get_kpis, get_heatmap
)

router = APIRouter(prefix="/api/analytics", tags=["analytics"])

@router.get("/sales-trend")
def sales_trend(days: int = 30, db: Session = Depends(get_db)):
    return get_sales_trend(db, days=days)

@router.get("/top-products")
def top_products(days: int = 30, limit: int = 10, db: Session = Depends(get_db)):
    return get_top_products(db, days=days, limit=limit)

@router.get("/category-breakdown")
def category_breakdown(days: int = 30, db: Session = Depends(get_db)):
    return get_category_breakdown(db, days=days)

@router.get("/kpis")
def kpis(db: Session = Depends(get_db)):
    return get_kpis(db)

@router.get("/heatmap")
def heatmap(days: int = 90, db: Session = Depends(get_db)):
    return get_heatmap(db, days=days)