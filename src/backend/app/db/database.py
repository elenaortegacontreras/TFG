from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

SQLALCHEMY_DATABASE_URL = (
    f'postgresql://postgres:Bright#1270@postgres-db:5432/dockert')
# f'postgresql://user:password@hostname:port/database')

engine = create_engine(SQLALCHEMY_DATABASE_URL, echo=True)

# Crear una sesión de base de datos
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()