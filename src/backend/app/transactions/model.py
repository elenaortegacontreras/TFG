from app.db.database import Base
from sqlalchemy import Column, Integer, String, ForeignKey, DECIMAL, Date, TIMESTAMP

class Transaction(Base):
    __tablename__ = 'transaction'

    id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    category_id = Column(Integer, ForeignKey('categories.id'))
    name = Column(String, nullable=False)
    amount = Column(DECIMAL(15,2), nullable=False)
    transaction_type = Column(String, nullable=False) # expense or income
    description = Column(String)
    insert_date = Column(TIMESTAMP, default=datetime.datetime.utcnow)