from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import PurchaseOrder, Supplier
from app.schemas.purchase_order import PurchaseOrderCreate, PurchaseOrderResponse
from app.ai.insights import generate_email_draft
from datetime import datetime, timedelta

router = APIRouter(prefix="/api/purchase-orders", tags=["purchase-orders"])

@router.get("/", response_model=List[PurchaseOrderResponse])
def get_purchase_orders(db: Session = Depends(get_db)):
    return db.query(PurchaseOrder).order_by(PurchaseOrder.created_at.desc()).all()

@router.post("/draft")
def create_draft(data: PurchaseOrderCreate, db: Session = Depends(get_db)):
    supplier = db.query(Supplier).filter(Supplier.id == data.supplier_id).first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Tedarikçi bulunamadı")

    expected_date = (datetime.utcnow() + timedelta(days=supplier.lead_time_days)).strftime("%d.%m.%Y")

    items_data = [item.model_dump() for item in data.items]

    email_draft = generate_email_draft(
        supplier_name=supplier.name,
        supplier_email=supplier.email,
        items=items_data,
        expected_date=expected_date
    )

    total_cost = sum(
        item.quantity * (item.unit_cost or 0) for item in data.items
    )

    po = PurchaseOrder(
        supplier_id=data.supplier_id,
        status="draft",
        items=items_data,
        total_estimated_cost=total_cost,
        ai_generated_email=email_draft,
        expected_delivery=datetime.utcnow() + timedelta(days=supplier.lead_time_days),
        notes=data.notes
    )
    db.add(po)
    db.commit()
    db.refresh(po)
    return po

@router.post("/{po_id}/send")
def send_purchase_order(po_id: int, db: Session = Depends(get_db)):
    po = db.query(PurchaseOrder).filter(PurchaseOrder.id == po_id).first()
    if not po:
        raise HTTPException(status_code=404, detail="Sipariş bulunamadı")
    po.status = "sent"
    po.sent_at = datetime.utcnow()
    db.commit()
    return {"message": "Sipariş gönderildi (simülasyon)", "po_id": po_id}