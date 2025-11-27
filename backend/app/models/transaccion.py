# models/transaccion.py
from sqlalchemy import Column, CHAR, Integer, Numeric, Text, Enum, Date, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base
import uuid
import enum


class MetodoPago(enum.Enum):
    efectivo = "efectivo"
    tarjeta = "tarjeta"
    transferencia = "transferencia"
    otro = "otro"


class Transaccion(Base):
    __tablename__ = "transacciones"

    id = Column(CHAR(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    usuario_id = Column(Integer, ForeignKey("usuarios.id", ondelete="CASCADE"), nullable=False)
    categoria_id = Column(Integer, ForeignKey("categorias.id"), nullable=False)

    monto = Column(Numeric(12, 2), nullable=False)
    descripcion = Column(Text, nullable=True)
    metodo_pago = Column(Enum(MetodoPago), default=MetodoPago.efectivo)
    fecha = Column(Date, nullable=False)

    es_recurrente = Column(Boolean, default=False)
    dia_recurrente = Column(Integer, nullable=True)  # 1-31

    creado_en = Column(DateTime(timezone=True), server_default=func.now())

    # Relaciones
    usuario = relationship("Usuario", back_populates="transacciones")
    categoria = relationship("Categoria", back_populates="transacciones")