# app/routers/transacciones.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.services.transaccion_service import TransaccionService
from app.dtos.transaccion_dto import TransaccionCreateDTO, TransaccionResponseDTO, MetodosPago
from typing import List

router = APIRouter(prefix="/transacciones", tags=["Transacciones"])

@router.post("/", response_model=TransaccionResponseDTO)
def crear_transaccion(
    dto: TransaccionCreateDTO,
    usuario_id: int = 1,  # En producción: sacarlo del token JWT
    db: Session = Depends(get_db)
):
    return TransaccionService.crear(db, dto, usuario_id)

@router.get("/", response_model=List[TransaccionResponseDTO])
def listar_transacciones(
    usuario_id: int = 1,  # En producción: sacarlo del token
    db: Session = Depends(get_db)
):
    return TransaccionService.listar_por_usuario(db, usuario_id)

@router.delete("/{transaccion_id}")
def eliminar_transaccion(
    transaccion_id: str,
    usuario_id: int = 1,
    db: Session = Depends(get_db)
):
    return TransaccionService.eliminar(db, transaccion_id, usuario_id)

@router.get("/metodos-pago", response_model=MetodosPago)
def obtener_metodos_pago():
    return TransaccionService.obtener_metodos_pago()
