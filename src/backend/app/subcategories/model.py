from app.db.database import Base
from sqlalchemy import Column, Integer, String, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship

class Subcategory(Base):
    __tablename__ = 'subcategories'

    id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    name = Column(String, index=True, nullable=False)
    category_id = Column(Integer, ForeignKey('categories.id', ondelete='CASCADE'), nullable=False)

    category = relationship('Category', back_populates='subcategories')

    transactions = relationship('Transaction', back_populates='subcategory', cascade='all, delete-orphan')
   
    __table_args__ = ( UniqueConstraint('name', 'category_id'), )