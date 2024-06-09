from app.db.database import Base
from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.orm import relationship

class Shop(Base):
    __tablename__ = 'shops'

    id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    location_code = Column(String, nullable=False)
    name = Column(String, unique=True, index=True, nullable=False)

    transactions = relationship('Transaction', back_populates='shop', cascade='all, delete-orphan')