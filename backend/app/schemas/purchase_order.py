from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime

class PurchaseOrderItem(BaseModel):
    product_id: int
    product_name: str
    quantity: float
    unit: str
    unit_cost: Optional[float] = None

class PurchaseOrderCreate(BaseModel):
    supplier_id: int
    items: List[PurchaseOrderItem]
    notes: Optional[str] = None

class PurchaseOrderResponse(BaseModel):
    id: int
    supplier_id: int
    status: str
    items: List[Any]
    total_estimated_cost: float
    ai_generated_email: Optional[str] = None
    notes: Optional[str] = None
    expected_delivery: Optional[datetime] = None
    created_at: datetime
    sent_at: Optional[datetime] = None

    class Config:
        from_attributes = True