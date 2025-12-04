# app/routers/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.dtos.usuario_dto import (
    UsuarioRegisterDTO, UsuarioLoginDTO,
    UsuarioResponseDTO, TokenResponseDTO
)
from app.services.usuario_service import UsuarioService

router = APIRouter(prefix="/auth", tags=["Autenticación"])

@router.post("/register", response_model=TokenResponseDTO)
def register(dto: UsuarioRegisterDTO, db: Session = Depends(get_db)):
    usuario = UsuarioService.registrar(db, dto)
    token = UsuarioService.login(db, dto.email, dto.password)["access_token"]
    
    return TokenResponseDTO(
        access_token=token,
        usuario=UsuarioResponseDTO.from_orm(usuario)
    )

@router.post("/login", response_model=TokenResponseDTO)
def login(dto: UsuarioLoginDTO, db: Session = Depends(get_db)):
    resultado = UsuarioService.login(db, dto.email, dto.password)
    return TokenResponseDTO(
        access_token=resultado["access_token"],
        usuario=UsuarioResponseDTO.from_orm(resultado["usuario"])
    )