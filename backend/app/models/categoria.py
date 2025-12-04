# models/categoria.py
from sqlalchemy import Column, Integer, String, Enum
from app.db.base import Base
import enum
from sqlalchemy.orm import relationship


class TipoCategoria(enum.Enum):
    ingreso = "ingreso"
    gasto = "gasto"


class Categoria(Base):
    __tablename__ = "categorias"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(100), unique=True, nullable=False)
    tipo = Column(Enum(TipoCategoria), nullable=False)
    icono = Column(String(50), nullable=False)
    color = Column(String(20), nullable=False, default="#10b981")
    orden = Column(Integer, default=0)

    # Relación inversa
    transacciones = relationship("Transaccion", back_populates="categoria")