from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    sku = Column(String, unique=True, nullable=False)
    category = Column(String, nullable=False)
    unit = Column(String, default="kg")
    unit_cost = Column(Float, default=0.0)
    unit_price = Column(Float, default=0.0)
    current_stock = Column(Float, default=0.0)
    critical_threshold = Column(Float, default=10.0)
    target_stock = Column(Float, default=100.0)
    season_start_month = Column(Integer, nullable=True)
    season_end_month = Column(Integer, nullable=True)
    shelf_life_days = Column(Integer, default=365)
    is_perishable = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    supplier_id = Column(Integer, ForeignKey("suppliers.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    supplier = relationship("Supplier")