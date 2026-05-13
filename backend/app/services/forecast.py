from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models import StockMovement
from datetime import datetime, timedelta
from typing import List, Dict
import statistics

def get_daily_sales(db: Session, product_id: int, days: int = 90) -> List[Dict]:
    since = datetime.utcnow() - timedelta(days=days)
    movements = db.query(StockMovement).filter(
        StockMovement.product_id == product_id,
        StockMovement.movement_type == "out",
        StockMovement.reason == "sale",
        StockMovement.timestamp >= since
    ).all()

    # Günlük gruplama
    daily = {}
    for m in movements:
        day = m.timestamp.date()
        daily[day] = daily.get(day, 0) + m.quantity

    # Boş günleri 0 ile doldur
    result = []
    for i in range(days):
        day = (datetime.utcnow() - timedelta(days=days-i)).date()
        result.append({"date": str(day), "quantity": daily.get(day, 0)})

    return result

def forecast_demand(db: Session, product_id: int, days_ahead: int = 7) -> List[Dict]:
    history = get_daily_sales(db, product_id, days=90)
    quantities = [h["quantity"] for h in history]

    if not quantities or sum(quantities) == 0:
        return [
            {
                "date": str((datetime.utcnow() + timedelta(days=i+1)).date()),
                "predicted": 0.0,
                "lower_bound": 0.0,
                "upper_bound": 0.0
            }
            for i in range(days_ahead)
        ]

    # 7 günlük hareketli ortalama
    window = 7
    ma_values = []
    for i in range(len(quantities)):
        start = max(0, i - window + 1)
        ma_values.append(statistics.mean(quantities[start:i+1]))

    # Haftanın günlerine göre ortalama (mevsimsellik)
    dow_sums = {i: [] for i in range(7)}
    for idx, h in enumerate(history):
        from datetime import date
        d = date.fromisoformat(h["date"])
        dow_sums[d.weekday()].append(h["quantity"])

    dow_means = {}
    overall_mean = statistics.mean(quantities) if quantities else 1
    for dow, vals in dow_sums.items():
        dow_means[dow] = statistics.mean(vals) if vals else overall_mean

    # Trend (son 30 günün eğimi)
    recent = quantities[-30:]
    n = len(recent)
    if n > 1:
        x_mean = (n - 1) / 2
        y_mean = statistics.mean(recent)
        numerator = sum((i - x_mean) * (recent[i] - y_mean) for i in range(n))
        denominator = sum((i - x_mean) ** 2 for i in range(n))
        slope = numerator / denominator if denominator != 0 else 0
    else:
        slope = 0

    last_ma = ma_values[-1] if ma_values else overall_mean
    overall_dow_mean = statistics.mean(dow_means.values()) if dow_means else 1

    forecast = []
    for i in range(days_ahead):
        future_date = datetime.utcnow() + timedelta(days=i+1)
        dow = future_date.weekday()
        
        base = last_ma + slope * (i + 1)
        seasonal_factor = (dow_means.get(dow, overall_mean) / overall_dow_mean) if overall_dow_mean > 0 else 1
        predicted = max(0.0, base * seasonal_factor)
        
        forecast.append({
            "date": str(future_date.date()),
            "predicted": round(predicted, 1),
            "lower_bound": round(predicted * 0.80, 1),
            "upper_bound": round(predicted * 1.20, 1)
        })

    return forecast