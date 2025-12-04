from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    SENDGRID_API_KEY: str
    SECRET_KEY: str
    
    # Credenciales Cloudinary
    CLOUDINARY_CLOUD_NAME: str
    CLOUDINARY_API_KEY: str
    CLOUDINARY_API_SECRET: str

    #Esto le indica a Pydantic que busque las variables en .env.
    class Config:
        env_file = ".env"

settings = Settings()
