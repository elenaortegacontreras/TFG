from pydantic import BaseModel, root_validator
from typing import Optional
from datetime import date, datetime

# User schema -----------------------------------------------------------------
class UserBase(BaseModel):
    email: str
    phone: str
    email: str
    password: str
    first_name: str
    last_name: Optional[str] = None

    class Config:
        orm_mode = True
        
class UserRequest(UserBase):
    class Config:
        orm_mode = True

class UserResponse(UserBase):
    id: int

    class Config:
        orm_mode = True

# Goal schema -----------------------------------------------------------------
class GoalBase(BaseModel):
    user_id: int
    name: str
    description: Optional[str] = None
    target_amount: float
    current_amount_saved: float = 0.00
    target_date: date

    class Config:
        orm_mode = True
        
class GoalRequest(GoalBase):
    class Config:
        orm_mode = True

class GoalResponse(GoalBase):
    id: int
    insert_date: date

    class Config:
        orm_mode = True
    
# Category schema -----------------------------------------------------------------
class CategoryBase(BaseModel):
    user_id: int
    name: str
    description: Optional[str] = None
    budget_amount: int = 0
    current_amount_spent: float = 0.00

    class Config:
        orm_mode = True
        
class CategoryRequest(CategoryBase):
    class Config:
        orm_mode = True

class CategoryResponse(CategoryBase):
    id: int

    class Config:
        orm_mode = True


# Subcategory schema -----------------------------------------------------------------
class SubcategoryBase(BaseModel):
    name: str
    category_id: int

    class Config:
        orm_mode = True
        
class SubcategoryRequest(SubcategoryBase):
    class Config:
        orm_mode = True

class SubcategoryResponse(SubcategoryBase):
    id: int

    class Config:
        orm_mode = True

# Transaction schema -----------------------------------------------------------------
class TransactionBase(BaseModel):
    user_id: int
    category_id: Optional[int] = None
    subcategory_id: Optional[int] = None
    saving_goal_id: Optional[int] = None
    name: str
    amount: float
    transaction_type: str # 'Expense', 'Income' or 'Saving'
    shop_id: Optional[int] = None
    payment_method: str # 'Cash' or 'Card'.

    class Config:
        orm_mode = True
        
class TransactionRequest(TransactionBase):
    @root_validator(pre=True)
    def check_transaction_type(cls, values):
        transaction_type = values.get('transaction_type')
        if transaction_type == 'Expense':
            assert 'category_id' in values, 'category_id is required for Expense transactions'
            assert 'subcategory_id' in values, 'subcategory_id is required for Expense transactions'
            # assert 'shop_id' in values, 'shop_id is required for Expense transactions'
        elif transaction_type == 'Saving':
            assert 'saving_goal_id' in values, 'saving_goal_id is required for Saving transactions'
        return values
    
    class Config:
        orm_mode = True

class TransactionResponse(TransactionBase):
    id: int
    insert_date: datetime

    class Config:
        orm_mode = True

class ExpenseTransaction(TransactionBase):
    category_id: int
    subcategory_id: int
    shop_id: int

    class Config:
        orm_mode = True


# Shop schema -----------------------------------------------------------------
class ShopBase(BaseModel):
    latitude: float
    longitude: float
    location_code: str
    name: str

    class Config:
        orm_mode = True
        
class ShopRequest(ShopBase):
    class Config:
        orm_mode = True

class ShopResponse(ShopBase):
    id: int

    class Config:
        orm_mode = True
