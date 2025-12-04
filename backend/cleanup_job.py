# cleanup_job.py
import time
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.services.loginRegister_service import cleanup_inactive_users_service

def run_cleanup():
    """
    Función que crea una sesión de base de datos y llama al servicio de limpieza.
    """
    db: Session = SessionLocal()
    try:
        cleanup_inactive_users_service(db)
    finally:
        db.close()

if __name__ == "__main__":
    while True:
        print("Ejecutando la tarea de limpieza...")
        run_cleanup()
        # Espera 15 minutos (900 segundos) antes de la próxima ejecución
        time.sleep(20)