from app.core.models.database import Base
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DECIMAL, Date, TIMESTAMP, func, UniqueConstraint, CheckConstraint
from sqlalchemy.orm import relationship

# User model -----------------------------------------------------------------
class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    phone = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    password = Column(String, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String)

    savings_goals = relationship('Goal', back_populates='user', cascade='all, delete-orphan')
    transactions = relationship('Transaction', back_populates='user', cascade='all, delete-orphan')
    categories = relationship('Category', back_populates='user', cascade='all, delete-orphan')

# Saving goal model -----------------------------------------------------------------
class Goal(Base):
    __tablename__ = 'savings_goals'

    id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    name = Column(String, nullable=False, index=True)
    description = Column(String)
    target_amount = Column(DECIMAL(15,2), nullable=False)
    current_amount_saved = Column(DECIMAL(15,2), default=0.00)
    insert_date = Column(Date, default=func.current_date(), nullable=False)
    target_date = Column(Date, nullable=False)

    transactions = relationship('Transaction', back_populates='saving_goal', cascade='all, delete-orphan')

    user = relationship('User', back_populates='savings_goals')

    __table_args__ = ( 
        UniqueConstraint('name', 'user_id'), 
        CheckConstraint(target_amount >= 0.00, name='target_amount_positive'),
        CheckConstraint(current_amount_saved >= 0.00, name='current_amount_saved_positive'),
        CheckConstraint(target_amount >= current_amount_saved, name='target_amount_greater_than_current_amount_saved'),
        CheckConstraint(target_date >= insert_date, name='target_date_after_insert_date'),
    )

# Expenditure category model -----------------------------------------------------------------
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

# Expenditure subcategory model -----------------------------------------------------------------
class Subcategory(Base):
    __tablename__ = 'expenditure_subcategories'

    id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    name = Column(String, nullable=False, index=True)
    category_id = Column(Integer, ForeignKey('expenditure_categories.id', ondelete='CASCADE'), nullable=False, index=True)

    category = relationship('Category', back_populates='subcategories')

    transactions = relationship('Transaction', back_populates='subcategory', cascade='all, delete-orphan')
   
    __table_args__ = ( UniqueConstraint('name', 'category_id'), )

# Transaction model -----------------------------------------------------------------
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

    # 'Expense' should have: user_id, category_id, subcategory_id, shop_id,                 name, amount, description, insert_date, payment_method
    # 'Income' should have: user_id,                                                        name, amount, description, insert_date, payment_method
    # 'Saving' should have: user_id,                                        saving_goal_id, name, amount, description ,insert_date, payment_method

# Shop model -----------------------------------------------------------------
class Shop(Base):
    __tablename__ = 'shops'

    id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    location_code = Column(String, nullable=False)
    name = Column(String, unique=True, index=True, nullable=False)

    transactions = relationship('Transaction', back_populates='shop', cascade='all, delete-orphan')