from fastapi import FastAPI, status, Depends
from sqlalchemy.orm import Session
from app.db.database import engine, get_db
from typing import List

from app.users import model as user_model
from app.users.model import User
from app.users.schema import UserRequest, UserResponse

from app.categories import model as category_model
from app.categories.model import Category
from app.categories.schema import CategoryRequest, CategoryResponse

from app.subcategories import model as subcategory_model
from app.subcategories.model import Subcategory
from app.subcategories.schema import SubcategoryRequest, SubcategoryResponse

from app.savings import model as saving_model
from app.savings.model import Saving
from app.savings.schema import SavingRequest, SavingResponse

from app.budgets import model as budget_model
from app.budgets.model import Budget
from app.budgets.schema import BudgetRequest, BudgetResponse

from app.transactions import model as transaction_model
from app.transactions.model import Transaction
from app.transactions.schema import TransactionRequest, TransactionResponse

# Transaction.__table__.drop(bind=engine, checkfirst=True)
# Budget.__table__.drop(bind=engine, checkfirst=True)
# Saving.__table__.drop(bind=engine, checkfirst=True)
# Category.__table__.drop(bind=engine, checkfirst=True)
# Subcategory.__table__.drop(bind=engine, checkfirst=True)
# User.__table__.drop(bind=engine, checkfirst=True)

user_model.Base.metadata.create_all(bind=engine) # Crear la tabla en la base de datos
category_model.Base.metadata.create_all(bind=engine) # Crear la tabla en la base de datos
subcategory_model.Base.metadata.create_all(bind=engine) # Crear la tabla en la base de datos
saving_model.Base.metadata.create_all(bind=engine) # Crear la tabla en la base de datos
budget_model.Base.metadata.create_all(bind=engine) # Crear la tabla en la base de datos
transaction_model.Base.metadata.create_all(bind=engine) # Crear la tabla en la base de datos


app = FastAPI()

@app.get("/")
def root():
    return {"Funciona :)"}

@app.get("/users", status_code=status.HTTP_200_OK, response_model=List[UserResponse])
def get_all_users(db: Session = Depends(get_db)):
    all_users = db.query(User).all()
    return all_users

@app.post("/users", status_code=status.HTTP_201_CREATED, response_model=UserResponse)
def create_user(user: UserRequest, db: Session = Depends(get_db)):
    new_user = User(**user.dict())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user