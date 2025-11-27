# app/dtos/transaccion_dto.py

from pydantic import BaseModel
from datetime import date
from typing import Optional


class TransaccionCreateDTO(BaseModel):
    categoria_id: int
    monto: float
    descripcion: Optional[str] = None
    metodo_pago: Optional[str] = "efectivo"
    fecha: date
    es_recurrente: Optional[bool] = False
    dia_recurrente: Optional[int] = None  # 1-31


class TransaccionResponseDTO(BaseModel):
    id: str
    categoria_id: int
    categoria: "CategoriaResponseDTO"  # ← Forward reference
    monto: float
    descripcion: Optional[str]
    metodo_pago: str
    fecha: date
    es_recurrente: bool
    dia_recurrente: Optional[int]

    class Config:
        from_attributes = True  # ← Esto es obligatorio en Pydantic v2


# ← ¡ESTO ES LO QUE TE FALTABA! Importar al final para resolver el forward reference
from .categoria_dtos import CategoriaResponseDTO

# Esto le dice a Pydantic que resuelva la referencia circular
TransaccionResponseDTO.model_rebuild()