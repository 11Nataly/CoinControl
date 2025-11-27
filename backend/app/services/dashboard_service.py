# app/services/dashboard_service.py
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from datetime import datetime
from dateutil.relativedelta import relativedelta
from collections import defaultdict
from app.models.transaccion import Transaccion
from app.models.categoria import Categoria


class DashboardService:

    @staticmethod
    def get_stats(db: Session, usuario_id: int):
        # FORZAMOS que traiga la categoría siempre
        transacciones = db.query(Transaccion).options(
            joinedload(Transaccion.categoria)
        ).filter(Transaccion.usuario_id == usuario_id).all()

        total_ingresos = 0.0
        total_gastos = 0.0
        total_recurrente = 0.0

        for t in transacciones:
            # Si por alguna razón no tiene categoría, la cargamos manualmente
            if not t.categoria:
                t.categoria = db.query(Categoria).filter(Categoria.id == t.categoria_id).first()
            
            if not t.categoria:
                continue

            monto = float(t.monto)

            if t.categoria.tipo == "ingreso":
                total_ingresos += monto
            elif t.categoria.tipo == "gasto":
                total_gastos += monto
                if t.es_recurrente:
                    total_recurrente += monto

        saldo_actual = total_ingresos - total_gastos

        return {
            "saldo_actual": round(saldo_actual, 2),
            "total_ingresos": round(total_ingresos, 2),
            "total_gastos": round(total_gastos, 2),
            "gastos_recurrentes": round(total_recurrente, 2),
            "transacciones_count": len(transacciones)
        }

    @staticmethod
    def get_predicciones(db: Session, usuario_id: int, meses: int = 6):
        hoy = datetime.now()

        transacciones = db.query(Transaccion).options(
            joinedload(Transaccion.categoria)
        ).filter(Transaccion.usuario_id == usuario_id).all()

        ingresos = []
        gastos = []

        for t in transacciones:
            if not t.categoria:
                t.categoria = db.query(Categoria).filter(Categoria.id == t.categoria_id).first()
            if t.categoria:
                monto = float(t.monto)
                if t.categoria.tipo == "ingreso":
                    ingresos.append(monto)
                elif t.categoria.tipo == "gasto":
                    gastos.append(monto)

        # Promedio mensual REAL
        ingreso_mensual = sum(ingresos) / max(1, len(ingresos)) if ingresos else 5200000
        gasto_mensual = sum(gastos) / max(1, len(gastos)) if gastos else 489900

        saldo_actual = DashboardService.get_stats(db, usuario_id)["saldo_actual"]
        saldo_proyectado = saldo_actual

        predicciones = []
        for i in range(meses):
            mes = hoy + relativedelta(months=i)
            saldo_proyectado -= (gasto_mensual - ingreso_mensual)

            predicciones.append({
                "mes": mes.strftime("%b %y"),
                "saldo_proyectado": round(saldo_proyectado, 2),
                "ingreso_estimado": round(ingreso_mensual, 2),
                "gasto_estimado": round(gasto_mensual, 2),
                "confianza": "Alta" if i < 2 else "Media" if i < 4 else "Baja"
            })

        return predicciones

    @staticmethod
    def get_gastos_por_categoria(db: Session, usuario_id: int):
        resultados = db.query(Transaccion, Categoria).options(
            joinedload(Transaccion.categoria)
        ).join(Categoria, Transaccion.categoria_id == Categoria.id).filter(
            Transaccion.usuario_id == usuario_id,
            Categoria.tipo == "gasto"
        ).all()

        total = sum(float(t.monto) for t, c in resultados)
        por_categoria = defaultdict(float)

        for t, c in resultados:
            por_categoria[c.nombre] += float(t.monto)

        resultado = []
        for nombre, monto in por_categoria.items():
            porcentaje = round((monto / total) * 100, 1) if total > 0 else 0
            resultado.append({
                "categoria": nombre,
                "monto": round(monto, 2),
                "porcentaje": porcentaje
            })

        resultado.sort(key=lambda x: x["monto"], reverse=True)
        return resultado

    @staticmethod
    def get_ingresos_por_categoria(db: Session, usuario_id: int):
        resultados = db.query(Transaccion, Categoria).options(
            joinedload(Transaccion.categoria)
        ).join(Categoria, Transaccion.categoria_id == Categoria.id).filter(
            Transaccion.usuario_id == usuario_id,
            Categoria.tipo == "ingreso"
        ).all()

        total = sum(float(t.monto) for t, c in resultados)
        por_categoria = defaultdict(float)

        for t, c in resultados:
            por_categoria[c.nombre] += float(t.monto)

        resultado = []
        for nombre, monto in por_categoria.items():
            porcentaje = round((monto / total) * 100, 1) if total > 0 else 0
            resultado.append({
                "categoria": nombre,
                "monto": round(monto, 2),
                "porcentaje": porcentaje
            })

        resultado.sort(key=lambda x: x["monto"], reverse=True)
        return resultado

    @staticmethod
    def get_gastos_por_metodo(db: Session, usuario_id: int):
        gastos = db.query(Transaccion).options(
            joinedload(Transaccion.categoria)
        ).join(Categoria, Transaccion.categoria_id == Categoria.id).filter(
            Transaccion.usuario_id == usuario_id,
            Categoria.tipo == "gasto"
        ).all()

        por_metodo = defaultdict(float)
        for t in gastos:
            por_metodo[t.metodo_pago] += float(t.monto)

        return sorted([
            {"metodo": k, "monto": round(v, 2)}
            for k, v in por_metodo.items()
        ], key=lambda x: x["monto"], reverse=True)