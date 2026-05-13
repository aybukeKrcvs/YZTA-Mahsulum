from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class PurchaseOrder(Base):
    __tablename__ = "purchase_orders"

    id = Column(Integer, primary_key=True, index=True)
    supplier_id = Column(Integer, ForeignKey("suppliers.id"), nullable=False)
    status = Column(String, default="draft")
    # draft / sent / received / cancelled
    items = Column(JSON, nullable=False)
    # [{"product_id": 1, "product_name": "Domates", "quantity": 100, "unit": "kg"}]
    total_estimated_cost = Column(Float, default=0.0)
    ai_generated_email = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    expected_delivery = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    sent_at = Column(DateTime(timezone=True), nullable=True)

    supplier = relationship("Supplier")