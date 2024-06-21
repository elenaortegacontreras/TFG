from app.db.database import Base
from datetime import datetime
from sqlalchemy import Column, Integer, String, ForeignKey, DECIMAL, TIMESTAMP, func
from sqlalchemy.orm import relationship

class Transaction(Base):
    __tablename__ = 'transactions'

    id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    category_id = Column(Integer, ForeignKey('categories.id', ondelete='CASCADE'), nullable=False, default=0)
    subcategory_id = Column(Integer, ForeignKey('subcategories.id', ondelete='CASCADE'), nullable=False, default=0)
    saving_goal_id = Column(Integer, ForeignKey('savings_goals.id', ondelete='CASCADE'), nullable=False, default=0)
    shop_id = Column(Integer, ForeignKey('shops.id', ondelete='CASCADE'))
    name = Column(String, nullable=False)
    amount = Column(DECIMAL(15,2), nullable=False)
    transaction_type = Column(String, nullable=False, default="") # 'Expense', 'Income' or 'Saving'
    description = Column(String, default="")
    insert_date = Column(TIMESTAMP(timezone=True), nullable=False, server_default=func.now())
    payment_method = Column(String, nullable=False, default="") # 'Cash' or 'Digital'.

    user = relationship('User', back_populates='transactions')
    category = relationship('Category', back_populates='transactions')
    subcategory = relationship('Subcategory', back_populates='transactions')
    shop = relationship('Shop', back_populates='transactions')
    saving_goal = relationship('Goal', back_populates='transactions')