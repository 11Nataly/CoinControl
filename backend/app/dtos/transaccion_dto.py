# app/dtos/transaccion_dto.py
from pydantic import BaseModel
from datetime import date
from typing import Optional


class TransaccionCreateDTO(BaseModel):
    categoria_id: int
    monto: float
    descripcion: Optional[str] = None
    
    # Uno de los dos será obligatorio según el tipo
    origen: Optional[str] = None      # ← Solo para ingresos
    destino: Optional[str] = None     # ← Solo para gastos

    metodo_pago: Optional[str] = "efectivo"
    fecha: date
    es_recurrente: Optional[bool] = False
    dia_recurrente: Optional[int] = None


class TransaccionResponseDTO(BaseModel):
    id: str
    categoria_id: int
    categoria: "CategoriaResponseDTO"
    monto: float
    descripcion: Optional[str]
    origen: Optional[str] = None      # ← Aparece si es ingreso
    destino: Optional[str] = None     # ← Aparece si es gasto
    metodo_pago: str
    fecha: date
    es_recurrente: bool
    dia_recurrente: Optional[int]

    class Config:
        from_attributes = True


from .categoria_dtos import CategoriaResponseDTO
TransaccionResponseDTO.model_rebuild()