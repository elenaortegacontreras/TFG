from fastapi import FastAPI, status, Depends
from sqlalchemy.orm import Session
from app.core.models.database import engine, get_db, Base
from typing import List
from sqlalchemy import func, extract

from app.core.models.models import User, Category, Subcategory, Goal, Transaction, Shop
from app.core.schemas.schemas import UserRequest, UserResponse, CategoryRequest, CategoryResponse, SubcategoryRequest, SubcategoryResponse, GoalRequest, GoalResponse, TransactionRequest, TransactionResponse, ShopRequest, ShopResponse
from fastapi.middleware.cors import CORSMiddleware

from app.scripts.ocr_ticket_extraction import extract_data
from fastapi import UploadFile, File
from sqlalchemy import text
from datetime import datetime

import bcrypt


# CUIDADO - NO BORRAR TABLA MUNICIPIOS (con drop_all)

# Transaction.__table__.drop(bind=engine, checkfirst=True)
# Subcategory.__table__.drop(bind=engine, checkfirst=True)
# Category.__table__.drop(bind=engine, checkfirst=True)
# Goal.__table__.drop(bind=engine, checkfirst=True)
# User.__table__.drop(bind=engine, checkfirst=True)
# Shop.__table__.drop(bind=engine, checkfirst=True)

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
def hash_password(plain_password):
    return bcrypt.hashpw(plain_password.encode('utf-8'), bcrypt.gensalt())

def check_password(plain_password, hashed_password):
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password)

@app.get("/users", tags=["Users"], status_code=status.HTTP_200_OK, response_model=List[UserResponse])
def get_all_users(db: Session = Depends(get_db)):
    all_users = db.query(User).all()
    return all_users

@app.post("/users", tags=["Users"], status_code=status.HTTP_201_CREATED, response_model=UserResponse)
def create_user(user: UserRequest, db: Session = Depends(get_db)):
    # Verifica si el email o el teléfono ya existen
    db_user = db.query(User).filter((User.email == user.email) | (User.phone == user.phone)).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email o teléfono ya registrado")

    # Cifra la contraseña
    hashed_password = hash_password(user.password)
    user.password = hashed_password

    # Crea el nuevo usuario
    new_user = User(**user.dict())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Por cada usuario nuevo creado se crea una categoría de gastos llamada "Otros" para gastos generales con budget_amount = 100 (y subcategoría "Otros" correspondiente)
    create_category(CategoryRequest(name="Otros", description="Otros gastos", budget_amount= 100, user_id=new_user.id), db)
    create_category(CategoryRequest(name="Alimentación", budget_amount= 100, user_id=new_user.id), db)
    create_category(CategoryRequest(name="Ocio", budget_amount= 100, user_id=new_user.id), db)
    create_category(CategoryRequest(name="Transporte", budget_amount= 100, user_id=new_user.id), db)

    # Por cada usuario nuevo creado se crea una meta de ahorro llamada "Otros" con target_amount = 1000 y hasta final de año
    current_year = datetime.now().year
    target_date = f"{current_year}-12-31"

    create_goal(GoalRequest(name="Otros", description="Otros ahorros", target_amount= 1000, user_id=new_user.id, target_date=target_date), db)
    create_goal(GoalRequest(name="Viaje", target_amount= 1000, user_id=new_user.id, target_date=target_date), db)

    return new_user

@app.delete("/users/{user_id}", tags=["Users"], status_code=status.HTTP_200_OK)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}

# CATEGORIES

@app.get("/categories", tags=["Categories"], status_code=status.HTTP_200_OK, response_model=List[CategoryResponse])
def get_all_categories(db: Session = Depends(get_db)):
    all_categories = db.query(Category).all()
    return all_categories

@app.get("/categories_with_amounts", tags=["Categories"], status_code=status.HTTP_200_OK)
def get_categories_with_amounts(db: Session = Depends(get_db)):
    categories_with_amounts_query = db.query(
        Category.id,
        Category.name,
        Category.description,
        Category.budget_amount,
        func.coalesce(func.sum(Transaction.amount), 0).label('current_amount_spent')
    ).join(Transaction, Transaction.category_id == Category.id, isouter=True).group_by(Category.id).all()

    categories_with_amounts = [row._asdict() for row in categories_with_amounts_query]
    return categories_with_amounts

@app.get("/categories_with_amounts/{month}", tags=["Categories"], status_code=status.HTTP_200_OK)
def get_categories_with_amounts_by_month(month: int, db: Session = Depends(get_db)):    
    categories_with_amounts_query = db.query(
        Category.id,
        Category.name,
        Category.description,
        Category.budget_amount,
        func.coalesce(func.sum(Transaction.amount), 0).label('current_amount_spent')
    ).join(Transaction, (Transaction.category_id == Category.id) & (func.extract('month', Transaction.insert_date) == month), isouter=True).group_by(Category.id).all()

    categories_with_amounts = [row._asdict() for row in categories_with_amounts_query]
    return categories_with_amounts

@app.post("/categories", tags=["Categories"], status_code=status.HTTP_201_CREATED, response_model=CategoryResponse)
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

@app.delete("/categories/{category_id}", tags=["Categories"], status_code=status.HTTP_200_OK)
def delete_category(category_id: int, db: Session = Depends(get_db)):
    # TODO if not in default categories: (list with default)
    category = db.query(Category).filter(Category.id == category_id).first()
    db.delete(category)
    db.commit()
    return {"message": "Category deleted successfully"}

@app.get("/category/{category_id}", tags=["Categories"], status_code=status.HTTP_200_OK, response_model=CategoryResponse)
def get_category_by_id(category_id: int, db: Session = Depends(get_db)):
    category = db.query(Category).filter(Category.id == category_id).first()
    return category

@app.put("/category/{category_id}", tags=["Categories"], status_code=status.HTTP_200_OK, response_model=CategoryResponse)
def update_category(category_id: int, category: CategoryRequest, db: Session = Depends(get_db)):
    existing_category = db.query(Category).filter(Category.id == category_id).first()
    if existing_category:
        category_dict = category.dict()
        for key, value in category_dict.items():
            setattr(existing_category, key, value)
        db.commit()
        db.refresh(existing_category)
        return existing_category
    else:
        return {"message": "Category not found"}

# Endpoint para borrar una categoría y también antes eliminar todas las transacciones asociadas a esa categoría
@app.delete("/categories/{category_id}/delete_transactions", tags=["Categories"], status_code=status.HTTP_200_OK)
def delete_category_and_transactions(category_id: int, db: Session = Depends(get_db)):
    category = db.query(Category).filter(Category.id == category_id).first()
    db.query(Transaction).filter(Transaction.category_id == category_id).delete()
    db.delete(category)
    db.commit()
    return {"message": "Category and transactions deleted successfully"}

# Endpoint para borrar una categoría pero antes pasar todas las transacciones asociadas a otra categoría
# para cambiar a otra categoría se hace así:
# la nueva categoría será siempre la categoría con name == "Otros" y subcategoría con name == "Otros"
@app.delete("/categories/{category_id}/move_transactions", tags=["Categories"], status_code=status.HTTP_200_OK)
def move_transactions_to_another_category(category_id: int, db: Session = Depends(get_db)):
    category = db.query(Category).filter(Category.name == "Otros").first()
    subcategory = db.query(Subcategory).filter(Subcategory.name == "Otros", Subcategory.category_id == category.id).first()
    db.query(Transaction).filter(Transaction.category_id == category_id).update({Transaction.category_id: category.id, Transaction.subcategory_id: subcategory.id})
    db.query(Category).filter(Category.id == category_id).delete()
    db.commit()
    return {"message": "Category deleted and transactions moved successfully"}

# SUBCATEGORIES

@app.get("/subcategories", tags=["Subcategories"], status_code=status.HTTP_200_OK, response_model=List[SubcategoryResponse])
def get_all_subcategories(db: Session = Depends(get_db)):
    all_subcategories = db.query(Subcategory).all()
    return all_subcategories

@app.get("/subcategories/{category_id}", tags=["Subcategories"], status_code=status.HTTP_200_OK)
def get_subcategories_by_category(category_id: int, db: Session = Depends(get_db)):
    subcategories = db.query(Subcategory).filter(Subcategory.category_id == category_id).all()
    return subcategories

@app.get("/subcategories_with_amounts/{category_id}", tags=["Subcategories"], status_code=status.HTTP_200_OK)
def get_subcategories_with_amounts(category_id: int, db: Session = Depends(get_db)):
    subcategories_with_amounts_query = db.query(
        Subcategory.id,
        Subcategory.name,
        Subcategory.category_id,
        func.coalesce(func.sum(Transaction.amount), 0).label('current_amount_spent')
    ).join(Transaction, Transaction.subcategory_id == Subcategory.id, isouter=True).filter(Subcategory.category_id == category_id).group_by(Subcategory.id).all()

    subcategories_with_amounts = [row._asdict() for row in subcategories_with_amounts_query]
    return subcategories_with_amounts

@app.get("/subcategories_with_amounts/{category_id}/{month}", tags=["Subcategories"], status_code=status.HTTP_200_OK)
def get_subcategories_with_amounts_by_month(category_id: int, month: int, db: Session = Depends(get_db)):
    subcategories_with_amounts_query = db.query(
        Subcategory.id,
        Subcategory.name,
        Subcategory.category_id,
        func.coalesce(func.sum(Transaction.amount), 0).label('current_amount_spent')
    ).join(Transaction, (Transaction.subcategory_id == Subcategory.id) & (Transaction.category_id == Subcategory.category_id) & (func.extract('month', Transaction.insert_date) == month), isouter=True).filter(Subcategory.category_id == category_id).group_by(Subcategory.id, Subcategory.name, Subcategory.category_id).all()

    subcategories_with_amounts = [{'id': row.id, 'name': row.name, 'category_id': row.category_id, 'current_amount_spent': row.current_amount_spent} for row in subcategories_with_amounts_query]
    return subcategories_with_amounts

@app.post("/subcategories", tags=["Subcategories"], status_code=status.HTTP_201_CREATED, response_model=SubcategoryResponse)
def create_subcategory(subcategory: SubcategoryRequest, db: Session = Depends(get_db)):
    new_subcategory = Subcategory(**subcategory.dict())
    db.add(new_subcategory)
    db.commit()
    db.refresh(new_subcategory)
    return new_subcategory

@app.delete("/subcategories/{subcategory_id}", tags=["Subcategories"], status_code=status.HTTP_200_OK)
def delete_subcategory(subcategory_id: int, db: Session = Depends(get_db)):
    # TODO if not in default subcategories: (list with default)
    subcategory = db.query(Subcategory).filter(Subcategory.id == subcategory_id).first()
    db.delete(subcategory)
    db.commit()
    return {"message": "Subcategory deleted successfully"}

@app.delete("/subcategories/{subcategory_id}/move_transactions", tags=["Subcategories"], status_code=status.HTTP_200_OK)
def move_transactions_to_another_subcategory(subcategory_id: int, db: Session = Depends(get_db)):
    new_subcategory_id = db.query(Subcategory).filter(Subcategory.name == "Otros").first().id
    subcategory = db.query(Subcategory).filter(Subcategory.id == subcategory_id).first()
    category_id = subcategory.category_id
    db.query(Transaction).filter(Transaction.subcategory_id == subcategory_id, Transaction.category_id == category_id).update({Transaction.subcategory_id: new_subcategory_id})
    db.query(Subcategory).filter(Subcategory.id == subcategory_id).delete()
    db.commit()
    return {"message": "Subcategory deleted and transactions moved successfully"}

# TRANSACTIONS
@app.get("/transactions", status_code=status.HTTP_200_OK, tags=["Transactions"], response_model=List[TransactionResponse])
def get_all_transactions(db: Session = Depends(get_db)):
    all_transactions = db.query(Transaction).order_by(Transaction.insert_date.desc()).all()
    return all_transactions

@app.get("/transaction/{transaction_id}", tags=["Transactions"], status_code=status.HTTP_200_OK, response_model=TransactionResponse)
def get_transaction_by_id(transaction_id: int, db: Session = Depends(get_db)):
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    return transaction

@app.post("/transactions", tags=["Transactions"], status_code=status.HTTP_201_CREATED, response_model=TransactionResponse)
def create_transaction(transaction: TransactionRequest, db: Session = Depends(get_db)):
    transaction_dict = transaction.dict()
    if transaction_dict.get("insert_date") is None:
        # Si insert_date no se proporciona, se omitirá y se usará el valor predeterminado del modelo
        del transaction_dict["insert_date"]
    new_transaction = Transaction(**transaction_dict)
    db.add(new_transaction)
    db.commit()
    db.refresh(new_transaction)
    return new_transaction

@app.put("/transaction/{transaction_id}", tags=["Transactions"], status_code=status.HTTP_200_OK, response_model=TransactionResponse)
def update_transaction(transaction_id: int, transaction: TransactionRequest, db: Session = Depends(get_db)):
    existing_transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if existing_transaction:
        transaction_dict = transaction.dict()
        if transaction_dict.get("insert_date") is None:
            # Si insert_date no se proporciona, se omitirá y se usará el valor existente en la base de datos
            del transaction_dict["insert_date"]
        for key, value in transaction_dict.items():
            setattr(existing_transaction, key, value)
        db.commit()
        db.refresh(existing_transaction)
        return existing_transaction
    else:
        return {"message": "Transaction not found"}

@app.delete("/transactions/{transaction_id}", tags=["Transactions"], status_code=status.HTTP_200_OK)
def delete_transaction(transaction_id: int, db: Session = Depends(get_db)):
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    db.delete(transaction)
    db.commit()
    return {"message": "Transaction deleted successfully"}

    # income
@app.get("/incomes", tags=["Incomes"], status_code=status.HTTP_200_OK, response_model=List[TransactionResponse])
def get_all_incomes(db: Session = Depends(get_db), month: int = None):
    if month:
        all_incomes = db.query(Transaction).filter(Transaction.transaction_type == "Income", func.extract('month', Transaction.insert_date) == month).order_by(Transaction.insert_date.desc()).all()
    else:
        all_incomes = db.query(Transaction).filter(Transaction.transaction_type == "Income").order_by(Transaction.insert_date.desc()).all()
    return all_incomes

# consultar la suma de los transactions de tipo income
@app.get("/total_incomes/", tags=["Incomes"], status_code=status.HTTP_200_OK)
def get_total_incomes(db: Session = Depends(get_db), month: int = None):
    if month:
        all_incomes = get_all_incomes(db, month)
    else:
        all_incomes = get_all_incomes(db)
    total_incomes_amount = sum([income.amount for income in all_incomes])
    total_incomes_card = sum([income.amount for income in all_incomes if income.payment_method == "Card"])
    total_incomes_cash = sum([income.amount for income in all_incomes if income.payment_method == "Cash"])
    return {"amount": total_incomes_amount, "card": total_incomes_card, "cash": total_incomes_cash, "incomes": all_incomes}

@app.get("/total_incomes/{month}", tags=["Incomes"], status_code=status.HTTP_200_OK)
def get_total_incomes_by_month(month: int, db: Session = Depends(get_db)):
    all_incomes = get_total_incomes(db, month)
    return all_incomes

    # expense
@app.get("/expenses", tags=["Expenses"], status_code=status.HTTP_200_OK, response_model=List[TransactionResponse])
def get_all_expenses(db: Session = Depends(get_db), month: int = None):
    if month:
        all_expenses = db.query(Transaction).filter(Transaction.transaction_type == "Expense", func.extract('month', Transaction.insert_date) == month).order_by(Transaction.insert_date.desc()).all()
    else:
        all_expenses = db.query(Transaction).filter(Transaction.transaction_type == "Expense").order_by(Transaction.insert_date.desc()).all()
    return all_expenses

@app.get("/total_expenses", tags=["Expenses"], status_code=status.HTTP_200_OK)
def get_total_expenses(db: Session = Depends(get_db), month: int = None):
    if month:
        all_expenses = get_all_expenses(db, month)
    else:
        all_expenses = get_all_expenses(db)
    total_expenses_amount = sum([expense.amount for expense in all_expenses])
    total_expenses_card = sum([expense.amount for expense in all_expenses if expense.payment_method == "Card"])
    total_expenses_cash = sum([expense.amount for expense in all_expenses if expense.payment_method == "Cash"])
    return {"amount": total_expenses_amount, "card": total_expenses_card, "cash": total_expenses_cash, "expenses": all_expenses}

@app.get("/total_expenses/{month}", tags=["Expenses"], status_code=status.HTTP_200_OK)
def get_total_expenses_by_month(month: int, db: Session = Depends(get_db)):
    all_expenses = get_total_expenses(db, month)
    return all_expenses

@app.get("/expenses_with_names", tags=["Expenses"], status_code=status.HTTP_200_OK)
def get_all_expenses_with_categories_names(db: Session = Depends(get_db)):
    all_expenses = db.query(
        Transaction, 
        Category.name.label("category_name"), 
        Subcategory.name.label("subcategory_name")
        ).join(Category, Transaction.category_id == Category.id
        ).join(Subcategory, Transaction.subcategory_id == Subcategory.id
        ).filter(Transaction.transaction_type == "Expense"
        ).order_by(Transaction.insert_date.desc()).all()
    
    expenses = []
    for expense in all_expenses:
        # Copia todas las columnas de Transaction a un diccionario
        expense_dict = expense.Transaction.__dict__.copy()
        # Añade las columnas adicionales de los joins
        expense_dict["category_name"] = expense.category_name
        expense_dict["subcategory_name"] = expense.subcategory_name
        # Elimina cualquier atributo interno de SQLAlchemy
        expense_dict.pop("_sa_instance_state", None)
        expenses.append(expense_dict)
    return expenses

@app.get("/expenses/{category_id}", tags=["Expenses"], status_code=status.HTTP_200_OK)
def get_expenses_by_category(category_id: int, db: Session = Depends(get_db)):
    expenses_query = db.query(
        Transaction, 
        Category.name.label("category_name"), 
        Subcategory.name.label("subcategory_name")
    ).join(Category, Transaction.category_id == Category.id
    ).join(Subcategory, Transaction.subcategory_id == Subcategory.id
    ).filter(Transaction.transaction_type == "Expense", Transaction.category_id == category_id
    ).order_by(Transaction.insert_date.desc()
    ).all()

    expenses = []
    for expense in expenses_query:
        # Copia todas las columnas de Transaction a un diccionario
        expense_dict = expense.Transaction.__dict__.copy()
        # Añade las columnas adicionales de los joins
        expense_dict["category_name"] = expense.category_name
        expense_dict["subcategory_name"] = expense.subcategory_name
        # Elimina cualquier atributo interno de SQLAlchemy
        expense_dict.pop("_sa_instance_state", None)
        expenses.append(expense_dict)

    return expenses

    # saving
@app.get("/savings", tags=["Savings"], status_code=status.HTTP_200_OK, response_model=List[TransactionResponse])
def get_all_savings(db: Session = Depends(get_db), month: int = None):
    if month:
        all_savings = db.query(Transaction).filter(Transaction.transaction_type == "Saving", func.extract('month', Transaction.insert_date) == month).order_by(Transaction.insert_date.desc()).all()
    else:
        all_savings = db.query(Transaction).filter(Transaction.transaction_type == "Saving").order_by(Transaction.insert_date.desc()).all()
    return all_savings

# consultar la suma de los transactions de tipo saving
@app.get("/total_savings", tags=["Savings"], status_code=status.HTTP_200_OK)
def get_total_savings(db: Session = Depends(get_db), month: int = None):
    if month:
        all_savings = get_all_savings(db, month)
    else:
        all_savings = get_all_savings(db)
    total_savings_amount = sum([saving.amount for saving in all_savings])
    total_savings_card = sum([saving.amount for saving in all_savings if saving.payment_method == "Card"])
    total_savings_cash = sum([saving.amount for saving in all_savings if saving.payment_method == "Cash"])
    return {"amount": total_savings_amount, "card": total_savings_card, "cash": total_savings_cash, "savings": all_savings}

@app.get("/total_savings/{month}", tags=["Savings"], status_code=status.HTTP_200_OK)
def get_total_savings_by_month(month: int, db: Session = Depends(get_db)):
    all_savings = get_total_savings(db, month)
    return all_savings


@app.get("/total_savings_goal/{saving_goal_id}/{month}", tags=["Savings"], status_code=status.HTTP_200_OK)
def get_total_savings_by_month_and_goal(month: int, saving_goal_id: int, db: Session = Depends(get_db)):
    all_savings = db.query(Transaction).filter(Transaction.transaction_type == "Saving", func.extract('month', Transaction.insert_date) == month, Transaction.saving_goal_id == saving_goal_id).order_by(Transaction.insert_date.desc()).all()
    total_savings_amount = sum([saving.amount for saving in all_savings])
    total_savings_card = sum([saving.amount for saving in all_savings if saving.payment_method == "Card"])
    total_savings_cash = sum([saving.amount for saving in all_savings if saving.payment_method == "Cash"])
    return {"amount": total_savings_amount, "card": total_savings_card, "cash": total_savings_cash, "savings": all_savings}


@app.get("/savings_with_names", tags=["Savings"], status_code=status.HTTP_200_OK)
def get_all_savings_with_categories_names(db: Session = Depends(get_db)):
    all_savings = db.query(
        Transaction, 
        Goal.name.label("saving_goal_name")
        ).join(Goal, Transaction.saving_goal_id == Goal.id
        ).filter(Transaction.transaction_type == "Saving"
        ).order_by(Transaction.insert_date.desc()
        ).all()
    
    savings = []
    for saving in all_savings:
        # Copia todas las columnas de Transaction a un diccionario
        saving_dict = saving.Transaction.__dict__.copy()
        # Añade las columnas adicionales de los joins
        saving_dict["saving_goal_name"] = saving.saving_goal_name
        # Elimina cualquier atributo interno de SQLAlchemy
        saving_dict.pop("_sa_instance_state", None)
        savings.append(saving_dict)
    return savings

@app.get("/savings/{saving_goal_id}", tags=["Savings"], status_code=status.HTTP_200_OK)
def get_savings_by_category(saving_goal_id: int, db: Session = Depends(get_db)):
    savings_query = db.query(
        Transaction,
        Goal.name.label("saving_goal_name")
    ).join(Goal, Transaction.saving_goal_id == Goal.id
    ).filter(Transaction.transaction_type == "Saving", Transaction.saving_goal_id == saving_goal_id
    ).order_by(Transaction.insert_date.desc()
    ).all()

    savings = []
    for saving in savings_query:
        # Copia todas las columnas de Transaction a un diccionario
        saving_dict = saving.Transaction.__dict__.copy()
        # Añade las columnas adicionales de los joins
        saving_dict["saving_goal_name"] = saving.saving_goal_name
        # Elimina cualquier atributo interno de SQLAlchemy
        saving_dict.pop("_sa_instance_state", None)
        savings.append(saving_dict)
    return savings

# SAVINGS GOALS

@app.get("/goals", tags=["Saving Goals"], status_code=status.HTTP_200_OK, response_model=List[GoalResponse])
def get_all_goals(db: Session = Depends(get_db)):
    all_goals = db.query(Goal).all()
    return all_goals

@app.post("/goals", tags=["Saving Goals"], status_code=status.HTTP_201_CREATED, response_model=GoalResponse)
def create_goal(goal: GoalRequest, db: Session = Depends(get_db)):
    new_goal = Goal(**goal.dict())
    db.add(new_goal)
    db.commit()
    db.refresh(new_goal)
    return new_goal

@app.delete("/goals/{goal_id}", tags=["Saving Goals"], status_code=status.HTTP_200_OK)
def delete_goal(goal_id: int, db: Session = Depends(get_db)):
    goal = db.query(Goal).filter(Goal.id == goal_id).first()
    db.delete(goal)
    db.commit()
    return {"message": "Goal deleted successfully"}

@app.get("/goal/{goal_id}", tags=["Saving Goals"], status_code=status.HTTP_200_OK, response_model=GoalResponse)
def get_goal_by_id(goal_id: int, db: Session = Depends(get_db)):
    goal = db.query(Goal).filter(Goal.id == goal_id).first()
    return goal

@app.put("/goal/{goal_id}", tags=["Saving Goals"], status_code=status.HTTP_200_OK, response_model=GoalResponse)
def update_goal(goal_id: int, goal: GoalRequest, db: Session = Depends(get_db)):
    existing_goal = db.query(Goal).filter(Goal.id == goal_id).first()
    if existing_goal:
        goal_dict = goal.dict()
        for key, value in goal_dict.items():
            setattr(existing_goal, key, value)
        db.commit()
        db.refresh(existing_goal)
        return existing_goal
    else:
        return {"message": "Goal not found"}

@app.get("/goals_with_amounts", tags=["Saving Goals"], status_code=status.HTTP_200_OK)
def get_goals_with_amounts(db: Session = Depends(get_db)):
    goals_with_amounts_query = db.query(
        Goal.id,
        Goal.name,
        Goal.description,
        Goal.target_amount,
        Goal.insert_date,
        Goal.target_date,
        func.coalesce(func.sum(Transaction.amount), 0).label('current_amount_saved')
    ).join(Transaction, Transaction.saving_goal_id == Goal.id, isouter=True).group_by(Goal.id).all()

    goals_with_amounts = [row._asdict() for row in goals_with_amounts_query]
    return goals_with_amounts

# Endpoint para borrar un ojetivo de ahorro y también antes eliminar todas las transacciones asociadas a ese objetivo
@app.delete("/goals/{goal_id}/delete_transactions", tags=["Saving Goals"], status_code=status.HTTP_200_OK)
def delete_goal_and_transactions(goal_id: int, db: Session = Depends(get_db)):
    goal = db.query(Goal).filter(Goal.id == goal_id).first()
    db.query(Transaction).filter(Transaction.saving_goal_id == goal_id).delete()
    db.delete(goal)
    db.commit()
    return {"message": "Goal and transactions deleted successfully"}

# Endpoint para borrar un ojetivo de ahorro pero antes pasar todos los transactions asociados a otro objetivo
# para cambiar a otro objetivo se hace así:
# el nuevo objetivo de ahorro será siempre el objetivo con name == "Otros"
@app.delete("/goals/{goal_id}/move_transactions", tags=["Saving Goals"], status_code=status.HTTP_200_OK)
def move_transactions_to_another_goal(goal_id: int, db: Session = Depends(get_db)):
    goal = db.query(Goal).filter(Goal.name == "Otros").first()
    db.query(Transaction).filter(Transaction.saving_goal_id == goal_id).update({Transaction.saving_goal_id: goal.id})
    db.query(Goal).filter(Goal.id == goal_id).delete()
    db.commit()
    return {"message": "Goal deleted and transactions moved successfully"}

# SHOPS
@app.get("/shops", tags=["Shops"], status_code=status.HTTP_200_OK, response_model=List[ShopResponse])
def get_all_shops(db: Session = Depends(get_db)):
    all_shops = db.query(Shop).all()
    return all_shops

@app.post("/shops", tags=["Shops"], status_code=status.HTTP_201_CREATED, response_model=ShopResponse)
def create_shop(shop: ShopRequest, db: Session = Depends(get_db)):
    new_shop = Shop(**shop.dict())
    db.add(new_shop)
    db.commit()
    db.refresh(new_shop)
    return new_shop

# SHOPS (expenses by shop)
# @app.get("/expenses_by_shop", tags=["Shops"], status_code=status.HTTP_200_OK)
# def get_expenses_by_shop(db: Session = Depends(get_db)):
#     expenses_by_shop_query = db.query(
#         Transaction.shop_id,
#         func.coalesce(func.sum(Transaction.amount), 0).label('current_amount_spent')
#     ).filter(Transaction.shop_id != None).group_by(Transaction.shop_id).all()

#     expenses_by_shop = [row._asdict() for row in expenses_by_shop_query]

#     expenses_with_shop_info = []
#     for expense in expenses_by_shop:
#         shop_id = expense['shop_id']
#         shop = db.query(Shop).filter(Shop.id == shop_id).first()
#         if shop:
#             expense['shop_name'] = shop.name
#             expense['shop_latitude'] = shop.lat
#             expense['shop_longitude'] = shop.lon
#             expenses_with_shop_info.append(expense)        

#     return expenses_with_shop_info

@app.get("/expenses_by_shop", tags=["Shops"], status_code=status.HTTP_200_OK)
def get_expenses_by_shop(db: Session = Depends(get_db)):
    current_month = datetime.now().month
    current_year = datetime.now().year

    expenses_by_shop_query = db.query(
        Transaction.shop_id,
        func.coalesce(func.sum(Transaction.amount), 0).label('current_amount_spent')
    ).filter(
        Transaction.shop_id != None,
        extract('month', Transaction.insert_date) == current_month,
        extract('year', Transaction.insert_date) == current_year
    ).group_by(Transaction.shop_id).all()

    expenses_by_shop = [row._asdict() for row in expenses_by_shop_query]

    expenses_with_shop_info = []
    for expense in expenses_by_shop:
        shop_id = expense['shop_id']
        shop = db.query(Shop).filter(Shop.id == shop_id).first()
        if shop:
            expense['shop_name'] = shop.name
            expense['shop_latitude'] = shop.lat
            expense['shop_longitude'] = shop.lon
            expenses_with_shop_info.append(expense)        

    return expenses_with_shop_info

    # obtener transacciones con transaction_type = "GlobalSaving"
@app.get("/global_savings", tags=["Global savings"], status_code=status.HTTP_200_OK, response_model=List[TransactionResponse])
def get_global_savings_transactions(db: Session = Depends(get_db), month: int = None):
    if month:
        all_global_savings = db.query(Transaction).filter(Transaction.transaction_type == "GlobalSaving", func.extract('month', Transaction.insert_date) == month).order_by(Transaction.insert_date.desc()).all()
    else:
        all_global_savings = db.query(Transaction).filter(Transaction.transaction_type == "GlobalSaving").order_by(Transaction.insert_date.desc()).all()
    return all_global_savings

# consultar la suma de los transactions de tipo GlobalSaving
@app.get("/total_global_savings/", tags=["Global savings"], status_code=status.HTTP_200_OK)
def get_total_global_savings(db: Session = Depends(get_db), month: int = None):
    if month:
        all_global_savings = get_global_savings_transactions(db, month)
    else:
        all_global_savings = get_global_savings_transactions(db)
    total_global_savings_amount = sum([global_saving.amount for global_saving in all_global_savings])
    total_global_savings_card = sum([global_saving.amount for global_saving in all_global_savings if global_saving.payment_method == "Card"])
    total_global_savings_cash = sum([global_saving.amount for global_saving in all_global_savings if global_saving.payment_method == "Cash"])
    return {"amount": total_global_savings_amount, "card": total_global_savings_card, "cash": total_global_savings_cash, "global_savings": all_global_savings}

@app.get("/total_global_savings/{month}", tags=["Global savings"], status_code=status.HTTP_200_OK)
def get_total_global_savings_by_month(month: int, db: Session = Depends(get_db)):
    all_global_savings = get_total_global_savings(db, month)
    return all_global_savings


@app.get("/global_savings_by_month", tags=["Wallet"], status_code=status.HTTP_200_OK)
def get_global_wallet_transactions(db: Session = Depends(get_db)):
    first_transaction_date = db.query(func.min(Transaction.insert_date)).scalar()
    current_month = datetime.now().month
    current_year = datetime.now().year
    months = range(first_transaction_date.month, current_month) # sin incluir el mes actual
    wallet_savings_by_month = []

    savings = []
    global_savings_transactions = get_global_savings_transactions(db, current_month)
    for saving in global_savings_transactions:
            savings.append(saving)
    wallet_savings_by_month.append({
            "month": current_month,
            "year": current_year,
            "global_savings": savings
    })
    for month in reversed(months):
        wallet = get_wallet_balance_by_month(month, db)
        savings = []
        global_savings_transactions = get_global_savings_transactions(db, month)
        for saving in global_savings_transactions:
            savings.append(saving)
        wallet_savings_by_month.append({
            "month": month,
            "year": current_year,
            "wallet": wallet,
            "global_savings": savings
        })
    return wallet_savings_by_month

# WALLET
# el monedero global incluye todos los monederos de todos los meses anteriores al actual
# pero excluye al monedero del mes actual
@app.get("/global_wallet", tags=["Wallet"], status_code=status.HTTP_200_OK)
def get_wallet_balance(db: Session = Depends(get_db)):

    total_incomes = get_total_incomes(db)
    total_expenses = get_total_expenses(db)
    total_savings = get_total_savings(db)
    
    current_month_wallet = get_wallet_balance_by_month(datetime.now().month, db)

    amount = total_incomes['amount'] - total_expenses['amount'] - total_savings['amount'] - current_month_wallet['amount']
    cash = total_incomes['cash'] - total_expenses['cash'] - total_savings['cash'] - current_month_wallet['cash']
    card = total_incomes['card'] - total_expenses['card'] - total_savings['card'] - current_month_wallet['card']

    return {"amount": amount, "cash": cash, "card": card}


@app.get("/wallet/{month}", tags=["Wallet"], status_code=status.HTTP_200_OK)
def get_wallet_balance_by_month(month: int, db: Session = Depends(get_db)):
    incomes = get_total_incomes_by_month(month, db)
    expenses = get_total_expenses_by_month(month, db)
    savings = get_total_savings_by_month(month, db)
    global_savings = get_total_global_savings_by_month(month, db)

    amount = incomes['amount'] - expenses['amount'] - savings['amount'] + global_savings['amount']
    cash = incomes['cash'] - expenses['cash'] - savings['cash'] + global_savings['cash']
    card = incomes['card'] - expenses['card'] - savings['card'] + global_savings['card']

    return {"amount": amount, "cash": cash, "card": card}

# OCR Ticket Data Extraction
@app.post("/extract_text", tags=["Ticket extraction"],)
def extract_text(file: UploadFile = File(...)):

    if file.filename.endswith('.pdf'):
        with open(f'app/tests/tickets_PDFs/{file.filename}', "wb") as f:
            f.write(file.file.read())

    else:
        with open(f'app/tests/tickets_images/{file.filename}', "wb") as f:
            f.write(file.file.read())

    result = extract_data(file.filename)

    return {"result": result}    


# Map (expenses by location)

@app.get("/location/{postal_code}", tags=["Map"], status_code=status.HTTP_200_OK)
def get_location_by_postal_code(postal_code: str, db: Session = Depends(get_db)):
    query = text("SELECT latitud, longitud, coords_elegidas, provincia_nombre, entidad_nombre FROM es_municipios_cp WHERE codigo_postal = :postal_code")
    result = db.execute(query, {"postal_code": postal_code}).fetchone()
    if result:
        if result[2] == True:
            latitude = result[0]
            longitude = result[1]
            entidad_nombre = result[4]
            return {"latitude": latitude, "longitude": longitude, "entidad_nombre": entidad_nombre}
        else:
            query = text("SELECT latitud, longitud, entidad_nombre FROM es_municipios_cp WHERE provincia_nombre = :provincia_nombre AND entidad_nombre = :entidad_nombre AND coords_elegidas = true")
            result = db.execute(query, {"provincia_nombre": result[3], "entidad_nombre": result[4]}).fetchone()
            if result:
                latitude = result[0]
                longitude = result[1]
                entidad_nombre = result[2]
                return {"latitude": latitude, "longitude": longitude, "entidad_nombre": entidad_nombre}   
    return {"desconocido"}
    

@app.get("/expenses_by_location", tags=["Map"], status_code=status.HTTP_200_OK)
def get_expenses_by_location(db: Session = Depends(get_db)):
    current_month = datetime.now().month
    current_year = datetime.now().year

    expenses_by_location_query = db.query(
        Transaction.shop_location_pc,
        func.coalesce(func.sum(Transaction.amount), 0).label('current_amount_spent')
    ).filter(
        Transaction.shop_location_pc != None,
        extract('month', Transaction.insert_date) == current_month,
        extract('year', Transaction.insert_date) == current_year
    ).group_by(Transaction.shop_location_pc).all()

    expenses_by_location = [row._asdict() for row in expenses_by_location_query]

    expenses_with_coordinates = []
    for expense in expenses_by_location:
        postal_code = expense['shop_location_pc']
        coordinates = get_location_by_postal_code(postal_code, db)
        if coordinates != {"desconocido"}:
            existing_expense = next((exp for exp in expenses_with_coordinates if exp['entidad_nombre'] == coordinates['entidad_nombre']), None)
            if existing_expense:
                existing_expense['current_amount_spent'] += expense['current_amount_spent']
                existing_expense['postal_codes'].append(postal_code)
            else:
                expense_by_loc = {
                    'postal_codes': [postal_code],
                    'latitude': coordinates['latitude'],
                    'longitude': coordinates['longitude'],
                    'entidad_nombre': coordinates['entidad_nombre'],
                    'current_amount_spent': expense['current_amount_spent']
                }
                expenses_with_coordinates.append(expense_by_loc)

    return expenses_with_coordinates

@app.get("/latlon/{postal_code}", tags=["Map"], status_code=status.HTTP_200_OK)
def get_coords_by_postal_code(postal_code: str, db: Session = Depends(get_db)):
    query = text("SELECT latitud, longitud FROM es_municipios_cp WHERE codigo_postal = :postal_code")
    result = db.execute(query, {"postal_code": postal_code}).fetchone()
    if result:
        latitude = result[0]
        longitude = result[1]
        return {"latitude": latitude, "longitude": longitude}
    return {"latitude": None, "longitude": None}