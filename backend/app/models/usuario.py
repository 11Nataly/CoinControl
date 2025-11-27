# models/usuario.py
from sqlalchemy import Column, Integer, String, Enum, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base
import enum


class MonedaPreferida(enum.Enum):
    USD = "USD"
    EUR = "EUR"
    ARS = "ARS"
    MXN = "MXN"
    COP = "COP"
    CLP = "CLP"


class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(100), nullable=False)
    email = Column(String(120), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    moneda_preferida = Column(Enum(MonedaPreferida), default=MonedaPreferida.USD)
    creado_en = Column(DateTime(timezone=True), server_default=func.now())

    # Relaciones
    transacciones = relationship("Transaccion", back_populates="usuario", cascade="all, delete-orphan")