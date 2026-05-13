from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from app.models import Order, OrderItem, Product, StockMovement
from datetime import datetime, timedelta
from typing import List, Dict

def get_sales_trend(db: Session, days: int = 30, period: str = "daily") -> List[Dict]:
    since = datetime.utcnow() - timedelta(days=days)
    movements = db.query(StockMovement).filter(
        StockMovement.movement_type == "out",
        StockMovement.reason == "sale",
        StockMovement.timestamp >= since
    ).all()

    daily = {}
    for m in movements:
        day = str(m.timestamp.date())
        if day not in daily:
            daily[day] = {"date": day, "quantity": 0, "revenue": 0}
        daily[day]["quantity"] += m.quantity
        # Gelir hesabı için ürün fiyatı
        if m.product:
            daily[day]["revenue"] += m.quantity * m.product.unit_price

    result = []
    for i in range(days):
        day = str((datetime.utcnow() - timedelta(days=days-i-1)).date())
        result.append(daily.get(day, {"date": day, "quantity": 0, "revenue": 0}))

    return result

def get_top_products(db: Session, days: int = 30, limit: int = 10) -> List[Dict]:
    since = datetime.utcnow() - timedelta(days=days)
    movements = db.query(StockMovement).filter(
        StockMovement.movement_type == "out",
        StockMovement.reason == "sale",
        StockMovement.timestamp >= since
    ).all()

    product_sales = {}
    for m in movements:
        pid = m.product_id
        if pid not in product_sales:
            product_sales[pid] = {
                "product_id": pid,
                "product_name": m.product.name if m.product else "Bilinmeyen",
                "category": m.product.category if m.product else "",
                "unit": m.product.unit if m.product else "",
                "total_quantity": 0,
                "total_revenue": 0
            }
        product_sales[pid]["total_quantity"] += m.quantity
        if m.product:
            product_sales[pid]["total_revenue"] += m.quantity * m.product.unit_price

    sorted_products = sorted(
        product_sales.values(),
        key=lambda x: x["total_quantity"],
        reverse=True
    )
    return sorted_products[:limit]

def get_category_breakdown(db: Session, days: int = 30) -> List[Dict]:
    since = datetime.utcnow() - timedelta(days=days)
    movements = db.query(StockMovement).filter(
        StockMovement.movement_type == "out",
        StockMovement.reason == "sale",
        StockMovement.timestamp >= since
    ).all()

    categories = {}
    for m in movements:
        if m.product:
            cat = m.product.category
            categories[cat] = categories.get(cat, 0) + m.quantity

    total = sum(categories.values()) or 1
    return [
        {
            "category": cat,
            "quantity": qty,
            "percentage": round(qty / total * 100, 1)
        }
        for cat, qty in sorted(categories.items(), key=lambda x: x[1], reverse=True)
    ]

def get_kpis(db: Session) -> Dict:
    today = datetime.utcnow().date()
    month_start = today.replace(day=1)

    # Bu ay satış
    this_month = db.query(StockMovement).filter(
        StockMovement.movement_type == "out",
        StockMovement.reason == "sale",
        StockMovement.timestamp >= month_start
    ).all()

    monthly_revenue = sum(
        m.quantity * m.product.unit_price for m in this_month if m.product
    )

    # Toplam aktif ürün
    total_products = db.query(Product).filter(Product.is_active == True).count()

    # Kritik stok
    critical_count = db.query(Product).filter(
        Product.is_active == True,
        Product.current_stock <= Product.critical_threshold
    ).count()

    # Bugünkü siparişler
    today_orders = db.query(Order).filter(
        func.date(Order.order_date) == today
    ).count()

    return {
        "monthly_revenue": round(monthly_revenue, 2),
        "total_products": total_products,
        "critical_stock_count": critical_count,
        "today_orders": today_orders,
        "currency": "TL"
    }

def get_heatmap(db: Session, days: int = 90) -> List[Dict]:
    since = datetime.utcnow() - timedelta(days=days)
    movements = db.query(StockMovement).filter(
        StockMovement.movement_type == "out",
        StockMovement.reason == "sale",
        StockMovement.timestamp >= since
    ).all()

    heatmap = {}
    for m in movements:
        dow = m.timestamp.weekday()  # 0=Pazartesi, 6=Pazar
        hour = m.timestamp.hour
        key = f"{dow}-{hour}"
        heatmap[key] = heatmap.get(key, 0) + m.quantity

    result = []
    days_tr = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"]
    for dow in range(7):
        for hour in range(24):
            key = f"{dow}-{hour}"
            result.append({
                "day": dow,
                "day_name": days_tr[dow],
                "hour": hour,
                "value": round(heatmap.get(key, 0), 1)
            })

    return result