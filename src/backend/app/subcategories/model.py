from app.db.database import Base
from sqlalchemy import Column, Integer, String, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship

class Subcategory(Base):
    __tablename__ = 'expenditure_subcategories'

    id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    name = Column(String, nullable=False, index=True)
    category_id = Column(Integer, ForeignKey('expenditure_categories.id', ondelete='CASCADE'), nullable=False, index=True)

    category = relationship('Category', back_populates='subcategories')

    transactions = relationship('Transaction', back_populates='subcategory', cascade='all, delete-orphan')
   
    __table_args__ = ( UniqueConstraint('name', 'category_id'), )