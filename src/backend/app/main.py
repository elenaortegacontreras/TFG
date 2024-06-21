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

    # por cada categoría nueva creada se crea una subcategoría llamada "Otros" (Subcategoría por defecto)
    new_subcategory = Subcategory(name="Otros", category_id=new_category.id)
    db.add(new_subcategory)
    db.commit()
    db.refresh(new_subcategory)
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
    # income
@app.get("/incomes", status_code=status.HTTP_200_OK, response_model=List[TransactionResponse])
def get_all_incomes(db: Session = Depends(get_db)):
    all_incomes = db.query(Transaction).filter(Transaction.transaction_type == "income").all()
    return all_incomes

@app.post("/incomes", status_code=status.HTTP_201_CREATED, response_model=TransactionResponse)
def create_income(transaction: TransactionRequest, db: Session = Depends(get_db)):
    transaction.transaction_type = "Income"
    # Si no se pone category_id, se incluye en la categoria de "Otros"
    if transaction.category_id == 0:
        transaction.category_id = db.query(Category).filter(Category.name == "Otros").first().id
    # si no se indica subcategory_id, se incluye en la subcategoria de "Otros" dentro de la categoría seleccionada antes
    if transaction.subcategory_id == 0:
        transaction.subcategory_id = db.query(Subcategory).filter(Subcategory.category_id == transaction.category_id).filter(Subcategory.name == "Otros").first().id
    new_income = Transaction(**transaction.dict())
    db.add(new_income)
    db.commit()
    db.refresh(new_income)
    return new_income

    # expense
@app.get("/expenses", status_code=status.HTTP_200_OK, response_model=List[TransactionResponse])
def get_all_expenses(db: Session = Depends(get_db)):
    all_expenses = db.query(Transaction).filter(Transaction.transaction_type == "expense").all()
    return all_expenses

@app.post("/expenses", status_code=status.HTTP_201_CREATED, response_model=TransactionResponse)
def create_expense(transaction: TransactionRequest, db: Session = Depends(get_db)):
    new_expense = Transaction(**transaction.dict())
    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)
    return new_expense

    # saving
@app.get("/savings", status_code=status.HTTP_200_OK, response_model=List[TransactionResponse])
def get_all_savings(db: Session = Depends(get_db)):
    all_savings = db.query(Transaction).filter(Transaction.transaction_type == "saving").all()
    return all_savings

@app.post("/savings", status_code=status.HTTP_201_CREATED, response_model=TransactionResponse)
def create_saving(transaction: TransactionRequest, db: Session = Depends(get_db)):
    new_saving = Transaction(**transaction.dict())
    db.add(new_saving)
    db.commit()
    db.refresh(new_saving)
    return new_saving

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