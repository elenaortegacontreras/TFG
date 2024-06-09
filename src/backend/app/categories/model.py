from app.db.database import Base
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

class Category(Base):
    __tablename__ = 'categories'

    id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    name = Column(String, unique=True, index=True, nullable=False)

    budgets = relationship('Budget', back_populates='category', cascade='all, delete-orphan')
    savings_goals = relationship('Goal', back_populates='category', cascade='all, delete-orphan')
    transactions = relationship('Transaction', back_populates='category', cascade='all, delete-orphan')
    subcategories = relationship('Subcategory', back_populates='category', cascade='all, delete-orphan')

    user = relationship('User', back_populates='categories')