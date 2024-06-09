from app.db.database import Base
from datetime import datetime
from sqlalchemy import Column, Integer, String, ForeignKey, DECIMAL, TIMESTAMP
from sqlalchemy.orm import relationship

class Transaction(Base):
    __tablename__ = 'transactions'

    id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    category_id = Column(Integer, ForeignKey('categories.id', ondelete='CASCADE'), nullable=False)
    subcategory_id = Column(Integer, ForeignKey('subcategories.id', ondelete='CASCADE'), nullable=False)
    shop_id = Column(Integer, ForeignKey('shops.id', ondelete='CASCADE'))
    name = Column(String, nullable=False)
    amount = Column(DECIMAL(15,2), nullable=False)
    transaction_type = Column(String, nullable=False) # expense, income or saving
    description = Column(String)
    insert_date = Column(TIMESTAMP, default=datetime.utcnow)
    payment_method = Column(String) # cash, card, bank transfer, etc.

    user = relationship('User', back_populates='transactions')
    category = relationship('Category', back_populates='transactions')
    subcategory = relationship('Subcategory', back_populates='transactions')
    shop = relationship('Shop', back_populates='transactions')