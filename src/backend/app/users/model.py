from app.db.database import Base
from sqlalchemy import Column, Integer, String

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    phone = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=True)