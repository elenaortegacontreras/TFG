from app.db.database import Base
from datetime import datetime
from sqlalchemy import Column, Integer, String, ForeignKey, DECIMAL, TIMESTAMP, Date
from sqlalchemy.orm import relationship

class Goal(Base):
    __tablename__ = 'savings_goals'

    id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    category_id = Column(Integer, ForeignKey('categories.id', ondelete='CASCADE'), nullable=False)
    name = Column(String, nullable=False)
    description = Column(String)
    target_amount = Column(DECIMAL(15,2), nullable=False)
    current_amount = Column(DECIMAL(15,2), default=0.00)
    insert_date = Column(TIMESTAMP, default=datetime.utcnow)
    target_date = Column(Date)

    user = relationship('User', back_populates='savings_goals')
    category = relationship('Category', back_populates='savings_goals')