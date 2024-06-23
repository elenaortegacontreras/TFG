from pydantic import BaseModel
from typing import Optional
from datetime import datetime

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