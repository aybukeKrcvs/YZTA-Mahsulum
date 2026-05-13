from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models import Product, Supplier
from app.schemas.product import ProductCreate, ProductResponse, ProductUpdate
from app.services.alerting import calculate_daily_avg_sales, get_days_until_stockout, get_stock_status
from app.services.forecast import get_daily_sales, forecast_demand

router = APIRouter(prefix="/api/products", tags=["products"])

@router.get("/", response_model=List[ProductResponse])
def get_products(
    category: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Product).filter(Product.is_active == True)
    if category:
        query = query.filter(Product.category == category)
    products = query.all()

    result = []
    for p in products:
        daily_avg = calculate_daily_avg_sales(db, p.id)
        days = get_days_until_stockout(p.current_stock, daily_avg)
        stock_status = get_stock_status(p, days)

        if status and stock_status != status:
            continue

        p_dict = {
            "id": p.id, "name": p.name, "sku": p.sku,
            "category": p.category, "unit": p.unit,
            "unit_cost": p.unit_cost, "unit_price": p.unit_price,
            "current_stock": p.current_stock,
            "critical_threshold": p.critical_threshold,
            "target_stock": p.target_stock,
            "season_start_month": p.season_start_month,
            "season_end_month": p.season_end_month,
            "shelf_life_days": p.shelf_life_days,
            "is_perishable": p.is_perishable,
            "supplier_id": p.supplier_id,
            "is_active": p.is_active,
            "created_at": p.created_at,
            "stock_status": stock_status,
            "days_until_stockout": round(days, 1) if days < 999 else None
        }
        result.append(p_dict)

    return result

@router.get("/{product_id}")
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Ürün bulunamadı")

    daily_avg = calculate_daily_avg_sales(db, product.id)
    days = get_days_until_stockout(product.current_stock, daily_avg)

    supplier = None
    if product.supplier_id:
        s = db.query(Supplier).filter(Supplier.id == product.supplier_id).first()
        if s:
            supplier = {"id": s.id, "name": s.name, "lead_time_days": s.lead_time_days}

    return {
        "id": product.id,
        "name": product.name,
        "sku": product.sku,
        "category": product.category,
        "unit": product.unit,
        "unit_cost": product.unit_cost,
        "unit_price": product.unit_price,
        "current_stock": product.current_stock,
        "critical_threshold": product.critical_threshold,
        "target_stock": product.target_stock,
        "is_perishable": product.is_perishable,
        "shelf_life_days": product.shelf_life_days,
        "season_start_month": product.season_start_month,
        "season_end_month": product.season_end_month,
        "supplier": supplier,
        "stock_status": get_stock_status(product, days),
        "days_until_stockout": round(days, 1) if days < 999 else None,
        "daily_avg_sales": round(daily_avg, 2)
    }

@router.get("/{product_id}/sales-history")
def get_sales_history(product_id: int, days: int = 90, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Ürün bulunamadı")
    history = get_daily_sales(db, product_id, days=days)
    return {"product_id": product_id, "product_name": product.name, "history": history}

@router.get("/{product_id}/forecast")
def get_forecast(product_id: int, days_ahead: int = 7, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Ürün bulunamadı")
    forecast = forecast_demand(db, product_id, days_ahead=days_ahead)
    return {"product_id": product_id, "product_name": product.name, "forecast": forecast}

@router.patch("/{product_id}")
def update_product(product_id: int, update: ProductUpdate, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Ürün bulunamadı")
    for field, value in update.model_dump(exclude_unset=True).items():
        setattr(product, field, value)
    db.commit()
    db.refresh(product)
    return {"message": "Güncellendi", "product_id": product_id}