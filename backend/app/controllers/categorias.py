# app/routers/categorias.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.services.categoria_service import CategoriaService
from app.dtos.categoria_dtos import CategoriaResponseDTO
from typing import List

router = APIRouter(prefix="/categorias", tags=["Categorías"])

@router.get("/", response_model=List[CategoriaResponseDTO])
def obtener_todas(db: Session = Depends(get_db)):
    return CategoriaService.listar_todas(db)

@router.get("/gastos", response_model=List[CategoriaResponseDTO])
def obtener_gastos(db: Session = Depends(get_db)):
    return CategoriaService.listar_por_tipo(db, "gasto")

@router.get("/ingresos", response_model=List[CategoriaResponseDTO])
def obtener_ingresos(db: Session = Depends(get_db)):
    return CategoriaService.listar_por_tipo(db, "ingreso")