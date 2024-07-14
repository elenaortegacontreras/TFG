from fastapi import FastAPI, status, Depends
from sqlalchemy.orm import Session
from app.core.models.database import engine, get_db, Base
from typing import List

from app.core.models.models import User, Category, Subcategory, Goal, Transaction, Shop
from app.core.schemas.schemas import UserRequest, UserResponse, CategoryRequest, CategoryResponse, SubcategoryRequest, SubcategoryResponse, GoalRequest, GoalResponse, TransactionRequest, TransactionResponse, ShopRequest, ShopResponse
from fastapi.middleware.cors import CORSMiddleware

# Shop.__table__.drop(bind=engine, checkfirst=True)
# Base.metadata.drop_all(bind=engine, checkfirst=True) # Borrar la tabla en la base de datos
# user_model.Base.metadata.create_all(bind=engine) # Crear la tabla en la base de datos

Base.metadata.create_all(bind=engine) # Crear la tabla en la base de datos

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8080",
    # URLs para el acceso CORS
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

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

    # Por cada usuario nuevo creado se crea una categoría de gastos llamada "Otros" para gastos generales con budget_amount = 0
    create_category(CategoryRequest(name="Otros", user_id=new_user.id), db)

    # TODO: Crear varias categorías (de gastos) por defecto para cada usuario nuevo
    return new_user

@app.delete("/users/{user_id}", status_code=status.HTTP_200_OK)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}

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

@app.delete("/categories/{category_id}", status_code=status.HTTP_200_OK)
def delete_category(category_id: int, db: Session = Depends(get_db)):
    # TODO if not in default categories: (list with default)
    category = db.query(Category).filter(Category.id == category_id).first()
    db.delete(category)
    db.commit()
    return {"message": "Category deleted successfully"}

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

@app.delete("/subcategories/{subcategory_id}", status_code=status.HTTP_200_OK)
def delete_subcategory(subcategory_id: int, db: Session = Depends(get_db)):
    # TODO if not in default subcategories: (list with default)
    subcategory = db.query(Subcategory).filter(Subcategory.id == subcategory_id).first()
    db.delete(subcategory)
    db.commit()
    return {"message": "Subcategory deleted successfully"}

# TRANSACTIONS
@app.get("/transactions", status_code=status.HTTP_200_OK, response_model=List[TransactionResponse])
def get_all_transactions(db: Session = Depends(get_db)):
    all_transactions = db.query(Transaction).all()
    return all_transactions

@app.post("/transactions", status_code=status.HTTP_201_CREATED, response_model=TransactionResponse)
def create_transaction(transaction: TransactionRequest, db: Session = Depends(get_db)):
    new_income = Transaction(**transaction.dict())
    db.add(new_income)
    db.commit()
    db.refresh(new_income)
    return new_income

@app.delete("/transactions/{transaction_id}", status_code=status.HTTP_200_OK)
def delete_transaction(transaction_id: int, db: Session = Depends(get_db)):
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    db.delete(transaction)
    db.commit()
    return {"message": "Transaction deleted successfully"}

    # income
@app.get("/incomes", status_code=status.HTTP_200_OK, response_model=List[TransactionResponse])
def get_all_incomes(db: Session = Depends(get_db)):
    all_incomes = db.query(Transaction).filter(Transaction.transaction_type == "Income").all()
    return all_incomes

    # expense
@app.get("/expenses", status_code=status.HTTP_200_OK, response_model=List[TransactionResponse])
def get_all_expenses(db: Session = Depends(get_db)):
    all_expenses = db.query(Transaction).filter(Transaction.transaction_type == "Expense").all()
    return all_expenses

    # saving
@app.get("/savings", status_code=status.HTTP_200_OK, response_model=List[TransactionResponse])
def get_all_savings(db: Session = Depends(get_db)):
    all_savings = db.query(Transaction).filter(Transaction.transaction_type == "Saving").all()
    return all_savings

# consultar la suma de los transactions de tipo expense
@app.get("/total_expenses", status_code=status.HTTP_200_OK)
def get_total_expenses(db: Session = Depends(get_db)):
    total_expenses = db.query(Transaction).filter(Transaction.transaction_type == "Expense").all()
    total_expenses_amount = sum([expense.amount for expense in total_expenses])
    total_expenses_card = sum([expense.amount for expense in total_expenses if expense.payment_method == "Card"])
    total_expenses_cash = sum([expense.amount for expense in total_expenses if expense.payment_method == "Cash"])
    return {"amount": total_expenses_amount, "card": total_expenses_card, "cash": total_expenses_cash}

# consultar la suma de los transactions de tipo income
@app.get("/total_incomes", status_code=status.HTTP_200_OK)
def get_total_incomes(db: Session = Depends(get_db)):
    total_incomes = db.query(Transaction).filter(Transaction.transaction_type == "Income").all()
    total_incomes_amount = sum([income.amount for income in total_incomes])
    total_incomes_card = sum([income.amount for income in total_incomes if income.payment_method == "Card"])
    total_incomes_cash = sum([income.amount for income in total_incomes if income.payment_method == "Cash"])
    return {"amount": total_incomes_amount, "card": total_incomes_card, "cash": total_incomes_cash}

# consultar la suma de los transactions de tipo saving
@app.get("/total_savings", status_code=status.HTTP_200_OK)
def get_total_savings(db: Session = Depends(get_db)):
    total_savings = db.query(Transaction).filter(Transaction.transaction_type == "Saving").all()
    total_savings_amount = sum([saving.amount for saving in total_savings])
    total_savings_card = sum([saving.amount for saving in total_savings if saving.payment_method == "Card"])
    total_savings_cash = sum([saving.amount for saving in total_savings if saving.payment_method == "Cash"])
    return {"amount": total_savings_amount, "card": total_savings_card, "cash": total_savings_cash}

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

@app.delete("/goals/{goal_id}", status_code=status.HTTP_200_OK)
def delete_goal(goal_id: int, db: Session = Depends(get_db)):
    goal = db.query(Goal).filter(Goal.id == goal_id).first()
    db.delete(goal)
    db.commit()
    return {"message": "Goal deleted successfully"}

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

@app.delete("/shops/{shop_id}", status_code=status.HTTP_200_OK)
def delete_shop(shop_id: int, db: Session = Depends(get_db)):
    shop = db.query(Shop).filter(Shop.id == shop_id).first()
    db.delete(shop)
    db.commit()
    return {"message": "Shop deleted successfully"}



