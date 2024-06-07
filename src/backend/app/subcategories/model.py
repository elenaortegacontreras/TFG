from app.db.database import Base
from sqlalchemy import Column, Integer, String, ForeignKey

class Subcategory(Base):
    __tablename__ = 'subcategories'

    id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    name = Column(String, unique=True, index=True, nullable=False)
    category_id = Column(Integer, ForeignKey('categories.id'))