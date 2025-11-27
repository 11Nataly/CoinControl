# app/routers/dashboard.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.services.dashboard_service import DashboardService

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/stats")
def get_stats(usuario_id: int = 1, db: Session = Depends(get_db)):
    return DashboardService.get_stats(db, usuario_id)

@router.get("/predicciones")
def get_predicciones(usuario_id: int = 1, db: Session = Depends(get_db)):
    return DashboardService.get_predicciones(db, usuario_id)

@router.get("/gastos-categoria")
def gastos_por_categoria(usuario_id: int = 1, db: Session = Depends(get_db)):
    return DashboardService.get_gastos_por_categoria(db, usuario_id)