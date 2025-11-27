# app/services/transaccion_service.py
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.transaccion import Transaccion
from app.dtos.transaccion_dto import TransaccionCreateDTO
import uuid


class TransaccionService:

    @staticmethod
    def crear(db: Session, dto: TransaccionCreateDTO, usuario_id: int):
        transaccion = Transaccion(
            id=str(uuid.uuid4()),
            usuario_id=usuario_id,
            categoria_id=dto.categoria_id,
            monto=dto.monto,
            descripcion=dto.descripcion,
            metodo_pago=dto.metodo_pago,
            fecha=dto.fecha,
            es_recurrente=dto.es_recurrente,
            dia_recurrente=dto.dia_recurrente if dto.es_recurrente else None
        )
        db.add(transaccion)
        db.commit()
        db.refresh(transaccion)
        return transaccion

    @staticmethod
    def listar_por_usuario(db: Session, usuario_id: int):
        return db.query(Transaccion).filter(Transaccion.usuario_id == usuario_id)\
               .order_by(Transaccion.fecha.desc(), Transaccion.creado_en.desc()).all()

    @staticmethod
    def eliminar(db: Session, transaccion_id: str, usuario_id: int):
        transaccion = db.query(Transaccion).filter(
            Transaccion.id == transaccion_id,
            Transaccion.usuario_id == usuario_id
        ).first()
        if not transaccion:
            raise HTTPException(status_code=404, detail="Transacción no encontrada")
        db.delete(transaccion)
        db.commit()
        return {"detail": "Transacción eliminada"}