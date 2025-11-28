# app/services/dashboard_service.py
# VERSIÓN FINAL - 100% COMPATIBLE CON SQLALCHEMY 2.0+
# SIN ERRORES DE SINTAXIS NI DE FUNC.CASE

from sqlalchemy.orm import Session
from sqlalchemy import func, and_, case, nullsfirst
from datetime import datetime
from dateutil.relativedelta import relativedelta
from app.models.transaccion import Transaccion
from app.models.categoria import Categoria


class DashboardService:

    @staticmethod
    def get_stats(db: Session, usuario_id: int):
        # SINTAXIS CORRECTA PARA SQLALCHEMY 2.0
        resultado = db.query(
            func.coalesce(
                func.sum(
                    case(
                        (Categoria.tipo == "ingreso", Transaccion.monto),
                        else_=0
                    )
                ), 0
            ).label("ingresos"),
            func.coalesce(
                func.sum(
                    case(
                        (Categoria.tipo == "gasto", Transaccion.monto),
                        else_=0
                    )
                ), 0
            ).label("gastos"),
            func.coalesce(
                func.sum(
                    case(
                        (and_(Categoria.tipo == "gasto", Transaccion.es_recurrente == True), Transaccion.monto),
                        else_=0
                    )
                ), 0
            ).label("recurrentes"),
            func.count(Transaccion.id).label("count")
        ).join(Categoria, Transaccion.categoria_id == Categoria.id)\
         .filter(Transaccion.usuario_id == usuario_id)\
         .first()

        ingresos = float(resultado.ingresos or 0)
        gastos = float(resultado.gastos or 0)
        recurrentes = float(resultado.recurrentes or 0)

        return {
            "saldo_actual": round(ingresos - gastos, 2),
            "total_ingresos": round(ingresos, 2),
            "total_gastos": round(gastos, 2),
            "gastos_recurrentes": round(recurrentes, 2),
            "transacciones_count": resultado.count or 0
        }

    @staticmethod
    def get_predicciones(db: Session, usuario_id: int, meses: int = 6):
        hoy = datetime.now()

        stats = db.query(
            func.coalesce(
                func.avg(
                    case((Categoria.tipo == "ingreso", Transaccion.monto), else_=None)
                ), 5200000
            ).label("promedio_ingreso"),
            func.coalesce(
                func.avg(
                    case((Categoria.tipo == "gasto", Transaccion.monto), else_=None)
                ), 2000000
            ).label("promedio_gasto")
        ).join(Categoria, Transaccion.categoria_id == Categoria.id)\
         .filter(Transaccion.usuario_id == usuario_id)\
         .first()

        ingreso_mensual = float(stats.promedio_ingreso or 5200000)
        gasto_mensual = float(stats.promedio_gasto or 2000000)

        saldo_actual = DashboardService.get_stats(db, usuario_id)["saldo_actual"]
        saldo_proyectado = saldo_actual

        predicciones = []
        for i in range(1, meses + 1):
            mes = hoy + relativedelta(months=i)
            saldo_proyectado = saldo_proyectado + ingreso_mensual - gasto_mensual
            confianza = "Alta" if i <= 2 else "Media" if i <= 4 else "Baja"

            predicciones.append({
                "mes": mes.strftime("%b %Y"),
                "saldo_proyectado": round(saldo_proyectado, 2),
                "ingreso_estimado": round(ingreso_mensual, 2),
                "gasto_estimado": round(gasto_mensual, 2),
                "confianza": confianza
            })

        return predicciones

    @staticmethod
    def get_gastos_por_categoria(db: Session, usuario_id: int):
        resultados = db.query(
            Categoria.nombre,
            Categoria.icono,
            Categoria.color,
            func.sum(Transaccion.monto).label("total"),
            func.count(Transaccion.id).label("cantidad")
        ).join(Categoria, Transaccion.categoria_id == Categoria.id)\
         .filter(Transaccion.usuario_id == usuario_id, Categoria.tipo == "gasto")\
         .group_by(Categoria.id, Categoria.nombre, Categoria.icono, Categoria.color)\
         .order_by(func.sum(Transaccion.monto).desc())\
         .all()

        total_gastos = sum(float(r.total or 0) for r in resultados) or 1

        return [
            {
                "categoria": r.nombre,
                "icono": r.icono,
                "color": r.color,
                "monto": round(float(r.total or 0), 2),
                "porcentaje": round((float(r.total or 0) / total_gastos) * 100, 1),
                "transacciones": int(r.cantidad)
            }
            for r in resultados
        ]

    @staticmethod
    def get_ingresos_por_categoria(db: Session, usuario_id: int):
        resultados = db.query(
            Categoria.nombre,
            Categoria.icono,
            Categoria.color,
            func.sum(Transaccion.monto).label("total")
        ).join(Categoria, Transaccion.categoria_id == Categoria.id)\
         .filter(Transaccion.usuario_id == usuario_id, Categoria.tipo == "ingreso")\
         .group_by(Categoria.id, Categoria.nombre, Categoria.icono, Categoria.color)\
         .order_by(func.sum(Transaccion.monto).desc())\
         .all()

        total_ingresos = sum(float(r.total or 0) for r in resultados) or 1

        return [
            {
                "categoria": r.nombre,
                "icono": r.icono,
                "color": r.color,
                "monto": round(float(r.total or 0), 2),
                "porcentaje": round((float(r.total or 0) / total_ingresos) * 100, 1)
            }
            for r in resultados
        ]

    @staticmethod
    def get_gastos_por_metodo(db: Session, usuario_id: int):
        resultados = db.query(
            Transaccion.metodo_pago,
            func.sum(Transaccion.monto).label("total")
        ).join(Categoria, Transaccion.categoria_id == Categoria.id)\
         .filter(Transaccion.usuario_id == usuario_id, Categoria.tipo == "gasto")\
         .group_by(Transaccion.metodo_pago)\
         .order_by(func.sum(Transaccion.monto).desc())\
         .all()

        return [
            {
                "metodo": r.metodo_pago or "Sin especificar",
                "monto": round(float(r.total or 0), 2)
            }
            for r in resultados
        ]