# models/ingreso.py
from app.db import Base
from sqlalchemy import Column, Integer, Numeric, String, Text, Enum, Date, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

class MetodoPago(enum.Enum):
    efectivo = "efectivo"
    tarjeta = "tarjeta"
    transferencia = "transferencia"
    otro = "otro"

class Ingreso(Base):
    __tablename__ = "ingresos"

    id = Column(Integer, primary_key=True, autoincrement=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id", ondelete="CASCADE"), nullable=False)
    categoria_id = Column(Integer, ForeignKey("categorias.id"), nullable=False)
    monto = Column(Numeric(10, 2), nullable=False)
    origen = Column(String(150), nullable=False)
    descripcion = Column(Text, nullable=True)
    metodo_pago = Column(Enum(MetodoPago), nullable=False)
    fecha = Column(Date, nullable=False)
    recurrente = Column(Boolean, default=False)

    # Auditoría
    creado_en = Column(DateTime(timezone=True), server_default=func.now())

    # Relaciones
    usuario = relationship("Usuario", back_populates="ingresos")
    categoria = relationship("Categoria", back_populates="ingresos")