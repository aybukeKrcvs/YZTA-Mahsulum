from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models import Product, StockMovement, Alert
from datetime import datetime, timedelta

def calculate_daily_avg_sales(db: Session, product_id: int, days: int = 30) -> float:
    since = datetime.utcnow() - timedelta(days=days)
    result = db.query(func.sum(StockMovement.quantity)).filter(
        StockMovement.product_id == product_id,
        StockMovement.movement_type == "out",
        StockMovement.reason == "sale",
        StockMovement.timestamp >= since
    ).scalar()
    return float(result or 0) / days

def get_days_until_stockout(current_stock: float, daily_avg: float) -> float:
    if daily_avg <= 0:
        return 999.0
    return current_stock / daily_avg

def get_stock_status(product: Product, days_until_stockout: float) -> str:
    if product.current_stock <= 0:
        return "out_of_stock"
    elif product.current_stock <= product.critical_threshold:
        return "critical"
    elif days_until_stockout < 7:
        return "warning"
    else:
        return "ok"

def check_and_create_alerts(db: Session, product: Product) -> list:
    daily_avg = calculate_daily_avg_sales(db, product.id)
    days_until_stockout = get_days_until_stockout(product.current_stock, daily_avg)
    
    supplier = product.supplier_id
    lead_time = 1  # varsayılan
    
    alerts_created = []
    
    if product.current_stock <= 0:
        existing = db.query(Alert).filter(
            Alert.product_id == product.id,
            Alert.alert_type == "out_of_stock",
            Alert.is_read == False
        ).first()
        if not existing:
            alert = Alert(
                product_id=product.id,
                alert_type="out_of_stock",
                message=f"{product.name} stoğu tamamen tükendi!",
                severity="critical"
            )
            db.add(alert)
            alerts_created.append(alert)

    elif product.current_stock <= product.critical_threshold:
        existing = db.query(Alert).filter(
            Alert.product_id == product.id,
            Alert.alert_type == "low_stock",
            Alert.is_read == False
        ).first()
        if not existing:
            alert = Alert(
                product_id=product.id,
                alert_type="low_stock",
                message=f"{product.name} kritik stok seviyesinde! "
                        f"Mevcut: {product.current_stock} {product.unit}, "
                        f"Tahmini {days_until_stockout:.0f} günde tükenir.",
                severity="warning" if days_until_stockout > lead_time else "critical"
            )
            db.add(alert)
            alerts_created.append(alert)
    
    if alerts_created:
        db.commit()
    
    return alerts_created