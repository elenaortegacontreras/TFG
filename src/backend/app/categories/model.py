from app.db.database import Base
from sqlalchemy import Column, Integer, String, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship

class Category(Base):
    __tablename__ = 'categories'

    id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    name = Column(String, index=True, nullable=False)
    budget_amount = Column(Integer, nullable=False, default=0)

    transactions = relationship('Transaction', back_populates='category', cascade='all, delete-orphan')
    subcategories = relationship('Subcategory', back_populates='category', cascade='all, delete-orphan')

    user = relationship('User', back_populates='categories')

    __table_args__ = ( UniqueConstraint('name', 'user_id'), )