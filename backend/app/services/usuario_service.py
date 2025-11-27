# app/services/usuario_service.py
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.usuario import Usuario
from app.dtos.usuario_dto import UsuarioRegisterDTO
from app.core.security import get_password_hash, verify_password, create_access_token

class UsuarioService:

    @staticmethod
    def registrar(db: Session, dto: UsuarioRegisterDTO):
        # Verificar si ya existe
        existe = db.query(Usuario).filter(Usuario.email == dto.email).first()
        if existe:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El email ya está registrado"
            )

        # Crear usuario
        hashed = get_password_hash(dto.password)
        nuevo_usuario = Usuario(
            nombre=dto.nombre,
            email=dto.email,
            password_hash=hashed,
            moneda_preferida=dto.moneda_preferida
        )
        db.add(nuevo_usuario)
        db.commit()
        db.refresh(nuevo_usuario)
        return nuevo_usuario

    @staticmethod
    def login(db: Session, email: str, password: str):
        usuario = db.query(Usuario).filter(Usuario.email == email).first()
        if not usuario or not verify_password(password, usuario.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email o contraseña incorrectos"
            )

        token = create_access_token({"sub": str(usuario.id)})
        return {"usuario": usuario, "access_token": token}