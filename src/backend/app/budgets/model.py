from app.db.database import Base
from sqlalchemy import Column, Integer, String, ForeignKey, DECIMAL, Date, TIMESTAMP
from sqlalchemy.orm import relationship

class Budget(Base): # monthly budget
    __tablename__ = 'budgets'

    id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    category_id = Column(Integer, ForeignKey('categories.id', ondelete='CASCADE'), nullable=False)
    amount = Column(DECIMAL(15,2), nullable=False)

    user = relationship('User', back_populates='budgets')
    category = relationship('Category', back_populates='budgets')