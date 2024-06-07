from app.db.database import Base
from sqlalchemy import Column, Integer, String, ForeignKey, DECIMAL, Date, TIMESTAMP

class Saving(Base):
    __tablename__ = 'saving'

    id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    category_id = Column(Integer, ForeignKey('categories.id'))
    name = Column(String, nullable=False)
    description = Column(String)
    target_amount = Column(DECIMAL(15,2), nullable=False)
    current_amount = Column(DECIMAL(15,2), default=0.00)
    insert_date = Column(TIMESTAMP, default=datetime.datetime.utcnow)
    target_date = Column(Date)