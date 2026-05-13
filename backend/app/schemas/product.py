try:
    from pydantic import BaseModel  # pyright: ignore[reportMissingImports]
except ImportError:  # pragma: no cover
    from dataclasses import dataclass

    class BaseModel:  # minimal fallback for environments without pydantic
        def __init_subclass__(cls, **kwargs):
            return super().__init_subclass__(**kwargs)

        def model_dump(self):
            return self.__dict__
from typing import Optional
from datetime import datetime

class ProductBase(BaseModel):
    name: str
    sku: str
    category: str
    unit: str = "kg"
    unit_cost: float = 0.0
    unit_price: float = 0.0
    current_stock: float = 0.0
    critical_threshold: float = 10.0
    target_stock: float = 100.0
    season_start_month: Optional[int] = None
    season_end_month: Optional[int] = None
    shelf_life_days: int = 365
    is_perishable: bool = False

class ProductCreate(ProductBase):
    supplier_id: Optional[int] = None

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    current_stock: Optional[float] = None
    critical_threshold: Optional[float] = None
    target_stock: Optional[float] = None
    unit_price: Optional[float] = None
    unit_cost: Optional[float] = None

class ProductResponse(ProductBase):
    id: int
    supplier_id: Optional[int] = None
    is_active: bool
    created_at: datetime
    stock_status: Optional[str] = None
    days_until_stockout: Optional[float] = None

    class Config:
        from_attributes = True