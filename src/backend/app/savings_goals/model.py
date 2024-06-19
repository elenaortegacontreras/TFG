from app.db.database import Base
from sqlalchemy import Column, Integer, String, ForeignKey, DECIMAL, Date, func
from sqlalchemy.orm import relationship

class Goal(Base):
    __tablename__ = 'savings_goals'

    id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    category_id = Column(Integer, ForeignKey('categories.id', ondelete='CASCADE'), nullable=False)
    name = Column(String, nullable=False)
    description = Column(String, default="")
    target_amount = Column(DECIMAL(15,2), nullable=False)
    current_amount = Column(DECIMAL(15,2), default=0.00)
    insert_date = Column(Date, default=func.current_date(), nullable=False)
    target_date = Column(Date, nullable=False)

    user = relationship('User', back_populates='savings_goals')
    category = relationship('Category', back_populates='savings_goals')