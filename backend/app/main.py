# app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.controllers import  categorias, transacciones, auth


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # puedes restringir a ["http://localhost:5500"] si quieres
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# Incluye los routers de tus controladores
# usuario
app.include_router(categorias.router)
app.include_router(transacciones.router)
app.include_router(auth.router)


@app.get("/")
def read_root():
    """Endpoint de prueba para verificar que la app está funcionando."""
    return {"message": "¡Servidor FastAPI funcionando!"}


