# CoinControl

**CoinControl** aplicativo web de control de finanzas con predicciones.

hecho con figma make (frontend) https://www.figma.com/design/vkvgUj8eqr8gD3EUYs4RrH/Ecommerce-Movie-Store. 

---

# Instrucciones de uso

1. **Clona el repositorio y entra al proyecto:**
   ```bash
   git clone https://github.com/11Nataly/CoinControl.git
   cd coincontrol
   ```

## FRONTEND

1. **Entra a la carpeta `frontend`:**

   ```bash
   cd frontend
   ```
2. **Instala las dependencias de Node.js:**Este proyecto usa React, por lo que necesitarás instalar todas las librerías y dependencias necesarias.

   ```bash
   npm i
   ```

   Esto descargará las dependencias definidas en `package.json`.
3. **Inicia el servidor de desarrollo:**

   ```bash
   npm run dev
   ```

   Esto abrirá tu aplicación en el navegador en [http://localhost:4000](http://localhost:4000).

---

## BACKEND

1. **Entra a la carpeta `backend`:**

   ```bash
   cd backend
   ```
2. **Crea y activa un entorno virtual (Windows):**

   ```bash
   python -m venv venv
   ```
   ```bash
   source venv/Scripts/activate
   ```

   *(En Linux/Mac: `python3 -m venv venv && source venv/bin/activate`)*
3. **Instala las dependencias:**

   ```bash
   pip install -r requirements.txt
   ```

---

## Configuración de la base de datos

> Asegúrate de tener **HeidiSQL** o un cliente MySQL accesible y un usuario con permisos.También debes haber creado una base de datos llamada `coincontrol` antes de continuar.
> <<<<<<< HEAD
> Debes crear dentro de la carpeta `alembic/` una carpeta vacía llamada `versions` para guardar las migraciones.


1. **Archivo `db/database.py`**Dentro de la carpeta `db`, abre `database.py` y verifica/ajusta la cadena de conexión. Ejemplo:

   ```bash
   sqlalchemy.url = mysql+pymysql://root:admin@localhost:3315/coincontrol
   ```

   Actualízala con:

   - Usuario (`root`)
   - Contraseña (`admin`)
   - Host (`localhost`)
   - Puerto (`3315`)
   - Nombre de base de datos (`coincontrol`)
2. **Archivo `alembic.ini` (en la carpeta principal del backend)**Abre `alembic.ini` y confirma que la cadena de conexión sea la misma:

   ```bash
   sqlalchemy.url = mysql+pymysql://root:admin@localhost:3315/coincontrol
   ```
3. **Generar un mensaje de migración con Alembic:**

   ```bash
   alembic revision --autogenerate -m "mensaje"
   ```

   > Asegúrate de tener el entorno virtual activado.
   >
4. **Ejecutar migraciones con Alembic:**

   ```bash
   alembic upgrade head
   ```

   > Haz esto cada vez que haya cambios en los modelos para mantener la base de datos actualizada.

---

## Ejecutar el servidor FastAPI

Para iniciar el backend y recargar automáticamente cuando haya cambios:

```bash
uvicorn app.main:app --reload
```
  
