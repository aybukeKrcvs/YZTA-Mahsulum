from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base

# Tüm modelleri import et
import app.models

# Veritabanı tablolarını oluştur
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.app_name,
    description="Tarım kooperatifleri için yapay zeka destekli stok ve sipariş yönetimi",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Router'ları kaydet
from app.routers import products, suppliers, orders, analytics, alerts, purchase_orders, ai_router

app.include_router(products.router)
app.include_router(suppliers.router)
app.include_router(orders.router)
app.include_router(analytics.router)
app.include_router(alerts.router)
app.include_router(purchase_orders.router)
app.include_router(ai_router.router)

@app.get("/")
def root():
    return {"message": "Mahsulüm API çalışıyor", "version": "1.0.0", "docs": "/docs"}

@app.get("/health")
def health():
    return {"status": "ok"}