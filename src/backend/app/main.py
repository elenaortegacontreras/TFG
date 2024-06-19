from fastapi import FastAPI, status, Depends
from sqlalchemy.orm import Session
from app.db.database import engine, get_db, Base
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

from app.savings_goals import model as goal_model
from app.savings_goals.model import Goal
from app.savings_goals.schema import GoalRequest, GoalResponse

from app.budgets import model as budget_model
from app.budgets.model import Budget
from app.budgets.schema import BudgetRequest, BudgetResponse

from app.transactions import model as transaction_model
from app.transactions.model import Transaction
from app.transactions.schema import TransactionRequest, TransactionResponse

from app.shops import model as shop_model
from app.shops.model import Shop
from app.shops.schema import ShopRequest, ShopResponse

# Shop.__table__.drop(bind=engine, checkfirst=True)

# Base.metadata.drop_all(bind=engine, checkfirst=True) # Borrar la tabla en la base de datos
Base.metadata.create_all(bind=engine) # Crear la tabla en la base de datos

# user_model.Base.metadata.create_all(bind=engine) # Crear la tabla en la base de datos

app = FastAPI()

@app.get("/")
def root():
    return {"Funciona :)"}

# USERS

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

# CATEGORIES

@app.get("/categories", status_code=status.HTTP_200_OK, response_model=List[CategoryResponse])
def get_all_categories(db: Session = Depends(get_db)):
    all_categories = db.query(Category).all()
    return all_categories

@app.post("/categories", status_code=status.HTTP_201_CREATED, response_model=CategoryResponse)
def create_category(category: CategoryRequest, db: Session = Depends(get_db)):
    new_category = Category(**category.dict())
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return new_category

# SUBCATEGORIES

@app.get("/subcategories", status_code=status.HTTP_200_OK, response_model=List[SubcategoryResponse])
def get_all_subcategories(db: Session = Depends(get_db)):
    all_subcategories = db.query(Subcategory).all()
    return all_subcategories

@app.post("/subcategories", status_code=status.HTTP_201_CREATED, response_model=SubcategoryResponse)
def create_subcategory(subcategory: SubcategoryRequest, db: Session = Depends(get_db)):
    new_subcategory = Subcategory(**subcategory.dict())
    db.add(new_subcategory)
    db.commit()
    db.refresh(new_subcategory)
    return new_subcategory

# TRANSACTIONS

@app.get("/transactions", status_code=status.HTTP_200_OK, response_model=List[TransactionResponse])
def get_all_transactions(db: Session = Depends(get_db)):
    all_transactions = db.query(Transaction).all()
    return all_transactions

@app.post("/transactions", status_code=status.HTTP_201_CREATED, response_model=TransactionResponse)
def create_transaction(transaction: TransactionRequest, db: Session = Depends(get_db)):
    new_transaction = Transaction(**transaction.dict())
    db.add(new_transaction)
    db.commit()
    db.refresh(new_transaction)
    return new_transaction

# BUDGETS

@app.get("/budgets", status_code=status.HTTP_200_OK, response_model=List[BudgetResponse])
def get_all_budgets(db: Session = Depends(get_db)):
    all_budgets = db.query(Budget).all()
    return all_budgets

@app.post("/budgets", status_code=status.HTTP_201_CREATED, response_model=BudgetResponse)
def create_budget(budget: BudgetRequest, db: Session = Depends(get_db)):
    new_budget = Budget(**budget.dict())
    db.add(new_budget)
    db.commit()
    db.refresh(new_budget)
    return new_budget

# SAVINGS GOALS

@app.get("/goals", status_code=status.HTTP_200_OK, response_model=List[GoalResponse])
def get_all_goals(db: Session = Depends(get_db)):
    all_goals = db.query(Goal).all()
    return all_goals

@app.post("/goals", status_code=status.HTTP_201_CREATED, response_model=GoalResponse)
def create_goal(goal: GoalRequest, db: Session = Depends(get_db)):
    new_goal = Goal(**goal.dict())
    db.add(new_goal)
    db.commit()
    db.refresh(new_goal)
    return new_goal

# SHOPS

@app.get("/shops", status_code=status.HTTP_200_OK, response_model=List[ShopResponse])
def get_all_shops(db: Session = Depends(get_db)):
    all_shops = db.query(Shop).all()
    return all_shops

@app.post("/shops", status_code=status.HTTP_201_CREATED, response_model=ShopResponse)
def create_shop(shop: ShopRequest, db: Session = Depends(get_db)):
    new_shop = Shop(**shop.dict())
    db.add(new_shop)
    db.commit()
    db.refresh(new_shop)
    return new_shop