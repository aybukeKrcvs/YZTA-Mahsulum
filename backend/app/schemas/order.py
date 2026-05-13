from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class OrderItemBase(BaseModel):
    product_id: int
    quantity: float
    unit_price: float
    subtotal: float

class OrderItemResponse(OrderItemBase):
    id: int
    class Config:
        from_attributes = True

class OrderBase(BaseModel):
    customer_name: str
    customer_contact: Optional[str] = None
    status: str = "pending"
    total_amount: float = 0.0
    shipping_address: Optional[str] = None
    notes: Optional[str] = None

class OrderCreate(OrderBase):
    items: List[OrderItemBase] = []

class OrderResponse(OrderBase):
    id: int
    order_date: datetime
    created_at: datetime
    items: List[OrderItemResponse] = []

    class Config:
        from_attributes = True