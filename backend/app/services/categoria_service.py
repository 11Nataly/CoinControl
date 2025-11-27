# app/services/categoria_service.py
from sqlalchemy.orm import Session
from app.models.categoria import Categoria


class CategoriaService:

    @staticmethod
    def listar_todas(db: Session):
        return db.query(Categoria).order_by(Categoria.orden).all()

    @staticmethod
    def listar_por_tipo(db: Session, tipo: str):
        return db.query(Categoria).filter(Categoria.tipo == tipo).order_by(Categoria.orden).all()