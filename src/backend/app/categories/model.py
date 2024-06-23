from app.db.database import Base
from sqlalchemy import Column, Integer, String, ForeignKey, DECIMAL, UniqueConstraint, CheckConstraint
from sqlalchemy.orm import relationship

class Category(Base):
    __tablename__ = 'expenditure_categories'

    id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    name = Column(String, nullable=False, index=True)
    description = Column(String)
    budget_amount = Column(Integer, nullable=False, default=0)
    current_amount_spent = Column(DECIMAL(15,2), default=0.00)

    transactions = relationship('Transaction', back_populates='category', cascade='all, delete-orphan')
    subcategories = relationship('Subcategory', back_populates='category', cascade='all, delete-orphan')

    user = relationship('User', back_populates='categories')

    __table_args__ = ( 
        UniqueConstraint('name', 'user_id'), 
        CheckConstraint(budget_amount >= 0, name='budget_amount_positive'),
        CheckConstraint(current_amount_spent >= 0.00, name='current_amount_spent_positive'),
        CheckConstraint(budget_amount >= current_amount_spent, name='budget_amount_greater_than_current_amount_spent'),
    )