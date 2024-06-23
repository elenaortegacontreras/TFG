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
    target_date: str

    class Config:
        orm_mode = True
        
class GoalRequest(GoalBase):
    class Config:
        orm_mode = True

class GoalResponse(GoalBase):
    id: int
    insert_date: str

    class Config:
        orm_mode = True

    @root_validator(pre=True)
    def convert_dates_to_str(cls, values):
        target_date = values.target_date
        insert_date = values.insert_date

        if isinstance(target_date, date):
            values.target_date = target_date.isoformat()
        
        if isinstance(insert_date, (datetime, date)):
            values.insert_date = insert_date.isoformat()
        
        return values
    
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
    class Config:
        orm_mode = True

class TransactionResponse(TransactionBase):
    id: int
    insert_date: datetime

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
