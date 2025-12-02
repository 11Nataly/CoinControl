# models/__init__.py

from .usuario import Usuario
from .categoria import Categoria
from .transaccion import Transaccion

# Esto permite hacer: from models import *
__all__ = [
    "Usuario",
    "Categoria",
    "Transaccion",
]