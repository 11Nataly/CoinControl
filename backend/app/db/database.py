
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import logging 

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Cadena de conexión
DATABASE_URL = 'mysql+pymysql://root:admin@localhost:3315/coincontrol-2'


# Crear el objeto de conexión
engine = create_engine(DATABASE_URL)

# Crear una fábrica de sesiones
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para los modelos de SQLAlchemy
Base = declarative_base()

# Función get_db para inyección de dependencias
def get_db():
    db = None
    try:
        db = SessionLocal()
        yield db
    except Exception as e:
        logger.error(f"Error en la conexión a la base de datos: {e}")
        raise
    finally:
        if db:
            db.close()