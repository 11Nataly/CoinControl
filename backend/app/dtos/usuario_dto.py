# app/dtos/usuario_dto.py
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UsuarioRegisterDTO(BaseModel):
    nombre: str
    email: EmailStr
    password: str
    confirm_password: str
    moneda_preferida: Optional[str] = "COP"  # Colombia por defecto

class UsuarioLoginDTO(BaseModel):
    email: EmailStr
    password: str

class UsuarioResponseDTO(BaseModel):
    id: int
    nombre: str
    email: EmailStr
    moneda_preferida: str
    creado_en: datetime

    class Config:
        from_attributes = True

class TokenResponseDTO(BaseModel):
    access_token: str
    token_type: str = "bearer"
    usuario: UsuarioResponseDTO