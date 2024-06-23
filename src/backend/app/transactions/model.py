from app.db.database import Base
from datetime import datetime
from sqlalchemy import Column, Integer, String, ForeignKey, DECIMAL, TIMESTAMP, func, CheckConstraint
from sqlalchemy.orm import relationship

class Transaction(Base):
    __tablename__ = 'transactions'

    id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    category_id = Column(Integer, ForeignKey('expenditure_categories.id', ondelete='CASCADE'), index=True)
    subcategory_id = Column(Integer, ForeignKey('expenditure_subcategories.id', ondelete='CASCADE'), index=True)
    saving_goal_id = Column(Integer, ForeignKey('savings_goals.id', ondelete='CASCADE'), index=True)
    shop_id = Column(Integer, ForeignKey('shops.id', ondelete='CASCADE'))
    name = Column(String, nullable=False)
    amount = Column(DECIMAL(15,2), nullable=False)
    transaction_type = Column(String, nullable=False, index=True) # 'Expense', 'Income' or 'Saving'
    insert_date = Column(TIMESTAMP(timezone=True), nullable=False, default=func.now())
    payment_method = Column(String, nullable=False) # 'Cash' or 'Card'.

    user = relationship('User', back_populates='transactions')
    category = relationship('Category', back_populates='transactions')
    subcategory = relationship('Subcategory', back_populates='transactions')
    shop = relationship('Shop', back_populates='transactions')
    saving_goal = relationship('Goal', back_populates='transactions')

    __table_args__ = (
        CheckConstraint(transaction_type.in_(['Expense', 'Income', 'Saving']), name='check_transaction_type'),
        CheckConstraint(payment_method.in_(['Cash', 'Card']), name='check_payment_method'),
    )

    # transaction_type=='Expense' should have: user_id, category_name, subcategory_name<, shop_id, name, amount, description, insert_date, payment_method
    # transaction_type=='Income' should have: user_id, category_NAME='Income', subcategory_id, shop_id?, name, amount, description, insert_date, payment_method
    # transaction_type=='Saving' should have: user_id, saving_goal_NAME, name, amount, description ,insert_date, payment_method