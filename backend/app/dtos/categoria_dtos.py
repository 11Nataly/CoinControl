# app/dtos/categoria_dto.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CategoriaResponseDTO(BaseModel):
    id: int
    nombre: str
    tipo: str  # "ingreso" o "gasto"
    icono: str
    color: str
    orden: int

    class Config:
        from_attributes = True  # permite usar orm_mode en Pydantic v2