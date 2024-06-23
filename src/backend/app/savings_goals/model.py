from app.db.database import Base
from sqlalchemy import Column, Integer, String, ForeignKey, DECIMAL, Date, func, UniqueConstraint, CheckConstraint
from sqlalchemy.orm import relationship

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