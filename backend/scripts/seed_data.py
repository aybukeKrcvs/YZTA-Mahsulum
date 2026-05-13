"""
Mahsulüm - Polatlı Tarım Kooperatifi Demo Verisi
Çalıştırmak için: python scripts/seed_data.py
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal, engine, Base
from app.models import Product, Supplier, Order, OrderItem, StockMovement, Alert
import app.models
from datetime import datetime, timedelta
import random

random.seed(42)  # Deterministik veri

Base.metadata.create_all(bind=engine)
db = SessionLocal()

# Temizle
db.query(StockMovement).delete()
db.query(OrderItem).delete()
db.query(Order).delete()
db.query(Alert).delete()
db.query(Product).delete()
db.query(Supplier).delete()
db.commit()
print("✓ Eski veriler temizlendi")

# --- TEDARİKÇİLER ---
suppliers_data = [
    {"name": "Polatlı Üretici Birliği", "email": "info@polatliuretici.com",
     "phone": "0312 111 22 33", "lead_time_days": 1, "category": "Sebze"},
    {"name": "Konya Bakliyat Tedarik", "email": "siparis@konyabakliyat.com",
     "phone": "0332 444 55 66", "lead_time_days": 3, "category": "Bakliyat"},
    {"name": "Eskişehir Meyve Hali", "email": "hali@eskisehirmeyve.com",
     "phone": "0222 777 88 99", "lead_time_days": 2, "category": "Meyve"},
]
suppliers = []
for s in suppliers_data:
    supplier = Supplier(**s, is_active=True)
    db.add(supplier)
    suppliers.append(supplier)
db.commit()
print(f"✓ {len(suppliers)} tedarikçi eklendi")

# --- ÜRÜNLER ---
products_data = [
    # Sebzeler
    {"name": "Domates", "sku": "SBZ-001", "category": "Sebze",
     "unit": "kg", "unit_cost": 8.0, "unit_price": 14.0,
     "current_stock": 45.0, "critical_threshold": 50.0, "target_stock": 300.0,
     "season_start_month": 5, "season_end_month": 10,
     "shelf_life_days": 7, "is_perishable": True, "supplier_idx": 0},
    {"name": "Salatalık", "sku": "SBZ-002", "category": "Sebze",
     "unit": "kg", "unit_cost": 5.0, "unit_price": 9.0,
     "current_stock": 120.0, "critical_threshold": 40.0, "target_stock": 200.0,
     "season_start_month": 5, "season_end_month": 9,
     "shelf_life_days": 10, "is_perishable": True, "supplier_idx": 0},
    {"name": "Kırmızı Biber", "sku": "SBZ-003", "category": "Sebze",
     "unit": "kg", "unit_cost": 10.0, "unit_price": 18.0,
     "current_stock": 30.0, "critical_threshold": 25.0, "target_stock": 150.0,
     "season_start_month": 6, "season_end_month": 10,
     "shelf_life_days": 10, "is_perishable": True, "supplier_idx": 0},
    {"name": "Yeşil Biber", "sku": "SBZ-004", "category": "Sebze",
     "unit": "kg", "unit_cost": 7.0, "unit_price": 12.0,
     "current_stock": 85.0, "critical_threshold": 30.0, "target_stock": 150.0,
     "season_start_month": 5, "season_end_month": 10,
     "shelf_life_days": 10, "is_perishable": True, "supplier_idx": 0},
    {"name": "Patlıcan", "sku": "SBZ-005", "category": "Sebze",
     "unit": "kg", "unit_cost": 6.0, "unit_price": 11.0,
     "current_stock": 60.0, "critical_threshold": 20.0, "target_stock": 120.0,
     "season_start_month": 6, "season_end_month": 10,
     "shelf_life_days": 10, "is_perishable": True, "supplier_idx": 0},
    {"name": "Kabak", "sku": "SBZ-006", "category": "Sebze",
     "unit": "kg", "unit_cost": 4.0, "unit_price": 7.0,
     "current_stock": 90.0, "critical_threshold": 25.0, "target_stock": 150.0,
     "season_start_month": 5, "season_end_month": 9,
     "shelf_life_days": 12, "is_perishable": True, "supplier_idx": 0},
    {"name": "Marul", "sku": "SBZ-007", "category": "Sebze",
     "unit": "adet", "unit_cost": 3.0, "unit_price": 6.0,
     "current_stock": 40.0, "critical_threshold": 20.0, "target_stock": 100.0,
     "season_start_month": 3, "season_end_month": 6,
     "shelf_life_days": 5, "is_perishable": True, "supplier_idx": 0},
    {"name": "Soğan", "sku": "SBZ-008", "category": "Sebze",
     "unit": "kg", "unit_cost": 5.0, "unit_price": 9.0,
     "current_stock": 200.0, "critical_threshold": 50.0, "target_stock": 400.0,
     "season_start_month": None, "season_end_month": None,
     "shelf_life_days": 90, "is_perishable": False, "supplier_idx": 0},
    # Meyveler
    {"name": "Elma", "sku": "MYV-001", "category": "Meyve",
     "unit": "kg", "unit_cost": 9.0, "unit_price": 16.0,
     "current_stock": 150.0, "critical_threshold": 40.0, "target_stock": 250.0,
     "season_start_month": 8, "season_end_month": 11,
     "shelf_life_days": 30, "is_perishable": True, "supplier_idx": 2},
    {"name": "Armut", "sku": "MYV-002", "category": "Meyve",
     "unit": "kg", "unit_cost": 10.0, "unit_price": 18.0,
     "current_stock": 80.0, "critical_threshold": 30.0, "target_stock": 150.0,
     "season_start_month": 8, "season_end_month": 10,
     "shelf_life_days": 20, "is_perishable": True, "supplier_idx": 2},
    {"name": "Çilek", "sku": "MYV-003", "category": "Meyve",
     "unit": "kg", "unit_cost": 20.0, "unit_price": 35.0,
     "current_stock": 15.0, "critical_threshold": 20.0, "target_stock": 80.0,
     "season_start_month": 4, "season_end_month": 6,
     "shelf_life_days": 3, "is_perishable": True, "supplier_idx": 2},
    {"name": "Kayısı", "sku": "MYV-004", "category": "Meyve",
     "unit": "kg", "unit_cost": 15.0, "unit_price": 28.0,
     "current_stock": 55.0, "critical_threshold": 20.0, "target_stock": 100.0,
     "season_start_month": 6, "season_end_month": 7,
     "shelf_life_days": 5, "is_perishable": True, "supplier_idx": 2},
    {"name": "Karpuz", "sku": "MYV-005", "category": "Meyve",
     "unit": "adet", "unit_cost": 25.0, "unit_price": 45.0,
     "current_stock": 20.0, "critical_threshold": 5.0, "target_stock": 50.0,
     "season_start_month": 6, "season_end_month": 9,
     "shelf_life_days": 14, "is_perishable": True, "supplier_idx": 2},
    # Bakliyat
    {"name": "Yeşil Mercimek", "sku": "BKL-001", "category": "Bakliyat",
     "unit": "kg", "unit_cost": 22.0, "unit_price": 38.0,
     "current_stock": 300.0, "critical_threshold": 50.0, "target_stock": 500.0,
     "season_start_month": None, "season_end_month": None,
     "shelf_life_days": 730, "is_perishable": False, "supplier_idx": 1},
    {"name": "Nohut", "sku": "BKL-002", "category": "Bakliyat",
     "unit": "kg", "unit_cost": 25.0, "unit_price": 42.0,
     "current_stock": 180.0, "critical_threshold": 40.0, "target_stock": 300.0,
     "season_start_month": None, "season_end_month": None,
     "shelf_life_days": 730, "is_perishable": False, "supplier_idx": 1},
    {"name": "Bulgur", "sku": "BKL-003", "category": "Bakliyat",
     "unit": "kg", "unit_cost": 18.0, "unit_price": 30.0,
     "current_stock": 250.0, "critical_threshold": 60.0, "target_stock": 400.0,
     "season_start_month": None, "season_end_month": None,
     "shelf_life_days": 365, "is_perishable": False, "supplier_idx": 1},
    {"name": "Pirinç", "sku": "BKL-004", "category": "Bakliyat",
     "unit": "kg", "unit_cost": 30.0, "unit_price": 50.0,
     "current_stock": 120.0, "critical_threshold": 30.0, "target_stock": 200.0,
     "season_start_month": None, "season_end_month": None,
     "shelf_life_days": 365, "is_perishable": False, "supplier_idx": 1},
    # İşlenmiş
    {"name": "Domates Salçası", "sku": "ISL-001", "category": "İşlenmiş",
     "unit": "kg", "unit_cost": 35.0, "unit_price": 60.0,
     "current_stock": 80.0, "critical_threshold": 20.0, "target_stock": 150.0,
     "season_start_month": None, "season_end_month": None,
     "shelf_life_days": 365, "is_perishable": False, "supplier_idx": 0},
    {"name": "Çilek Reçeli", "sku": "ISL-002", "category": "İşlenmiş",
     "unit": "adet", "unit_cost": 45.0, "unit_price": 75.0,
     "current_stock": 35.0, "critical_threshold": 10.0, "target_stock": 80.0,
     "season_start_month": None, "season_end_month": None,
     "shelf_life_days": 365, "is_perishable": False, "supplier_idx": 2},
    {"name": "Üzüm Pekmezi", "sku": "ISL-003", "category": "İşlenmiş",
     "unit": "kg", "unit_cost": 50.0, "unit_price": 85.0,
     "current_stock": 45.0, "critical_threshold": 15.0, "target_stock": 100.0,
     "season_start_month": None, "season_end_month": None,
     "shelf_life_days": 730, "is_perishable": False, "supplier_idx": 2},
]

products = []
for p in products_data:
    supplier_idx = p.pop("supplier_idx")
    product = Product(**p, supplier_id=suppliers[supplier_idx].id, is_active=True)
    db.add(product)
    products.append(product)
db.commit()
print(f"✓ {len(products)} ürün eklendi")

# --- SATIŞ GEÇMİŞİ (120 günlük) ---
customers = [
    "Ankara Merkez Restoran", "Polatlı Bakkalı", "Haymana Market",
    "Sevinç Hanım", "Mehmet Bey", "Güneş Lokantası", "Çiftçi Kooperatifi",
    "Belediye Kantini", "Okul Kantini", "Elif Hanım", "Can Market",
    "Şehir Lokantası", "Toplu Alım A.Ş.", "Komşu Bakkalı"
]

# Her ürün için günlük satış paterni
def get_daily_sales(product_name: str, day_offset: int) -> float:
    """Gerçekçi satış paterni üretir"""
    date = datetime.utcnow() - timedelta(days=day_offset)
    dow = date.weekday()  # 0=Pzt, 6=Paz

    # Hafta sonu katsayısı
    weekend_factor = 1.4 if dow in [4, 5] else 1.0  # Cuma-Cumartesi yüksek

    base_sales = {
        "Domates": 15.0, "Salatalık": 10.0, "Kırmızı Biber": 7.0,
        "Yeşil Biber": 8.0, "Patlıcan": 5.0, "Kabak": 4.0,
        "Marul": 6.0, "Soğan": 12.0, "Elma": 8.0, "Armut": 5.0,
        "Çilek": 4.0, "Kayısı": 3.0, "Karpuz": 2.0,
        "Yeşil Mercimek": 6.0, "Nohut": 5.0, "Bulgur": 7.0, "Pirinç": 4.0,
        "Domates Salçası": 3.0, "Çilek Reçeli": 2.0, "Üzüm Pekmezi": 1.5
    }

    base = base_sales.get(product_name, 5.0)

    # Domates: son 14 günde artış trendi
    if product_name == "Domates" and day_offset < 14:
        base *= (1 + (14 - day_offset) * 0.03)

    # Salatalık: son 14 günde düşüş (sezon sonu)
    if product_name == "Salatalık" and day_offset < 14:
        base *= (1 - (14 - day_offset) * 0.02)

    # Soğan: Pazartesi yüksek (hafta sonu tükenmiş)
    if product_name == "Soğan" and dow == 0:
        base *= 1.5

    # 45 gün önce büyük toplu sipariş (düğün)
    if 44 <= day_offset <= 46 and product_name in ["Domates", "Biber", "Soğan"]:
        base *= 4.0

    # Gürültü ekle
    noise = random.uniform(0.75, 1.25)
    result = base * weekend_factor * noise

    return round(max(0.5, result), 1)

order_id_counter = 1
movements_to_add = []
orders_to_add = []
order_items_to_add = []

for day_offset in range(120, 0, -1):
    date = datetime.utcnow() - timedelta(days=day_offset)

    # Günde 3-8 sipariş
    num_orders = random.randint(3, 8)
    if date.weekday() in [4, 5]:  # Cuma-Cumartesi
        num_orders = random.randint(6, 12)

    for _ in range(num_orders):
        customer = random.choice(customers)
        order_time = date.replace(
            hour=random.randint(8, 18),
            minute=random.randint(0, 59)
        )

        # Her siparişte 1-4 ürün
        order_products = random.sample(products, random.randint(1, 4))
        order_total = 0
        items = []

        for product in order_products:
            qty = get_daily_sales(product.name, day_offset) / num_orders
            qty = round(max(0.5, qty), 1)
            subtotal = round(qty * product.unit_price, 2)
            order_total += subtotal
            items.append((product, qty, subtotal))

        # Sipariş oluştur
        order = Order(
            customer_name=customer,
            order_date=order_time,
            status="delivered",
            total_amount=round(order_total, 2),
            created_at=order_time
        )
        db.add(order)
        db.flush()  # ID al

        for product, qty, subtotal in items:
            item = OrderItem(
                order_id=order.id,
                product_id=product.id,
                quantity=qty,
                unit_price=product.unit_price,
                subtotal=subtotal
            )
            db.add(item)

            movement = StockMovement(
                product_id=product.id,
                movement_type="out",
                quantity=qty,
                reason="sale",
                reference_id=order.id,
                timestamp=order_time
            )
            db.add(movement)

db.commit()
print("✓ 120 günlük satış geçmişi eklendi")

# --- UYARILAR ---
critical_products = [p for p in products if p.current_stock <= p.critical_threshold]
for p in critical_products:
    alert = Alert(
        product_id=p.id,
        alert_type="low_stock",
        message=f"{p.name} kritik stok seviyesinde! Mevcut: {p.current_stock} {p.unit}",
        severity="critical" if p.current_stock <= p.critical_threshold * 0.5 else "warning",
        is_read=False
    )
    db.add(alert)

db.commit()
print(f"✓ {len(critical_products)} kritik stok uyarısı oluşturuldu")

print("\n✅ Seed data tamamlandı!")
print(f"   Tedarikçi: {len(suppliers)}")
print(f"   Ürün: {len(products)}")
print(f"   Kritik stok uyarısı: {len(critical_products)}")
db.close()