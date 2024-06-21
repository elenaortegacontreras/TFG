from pydantic import BaseModel

class TransactionBase(BaseModel):
    user_id: int
    category_id: int = 0
    subcategory_id: int = 0
    name: str
    amount: float
    transaction_type: str = "" # 'Expense', 'Income' or 'Saving'
    description: str
    shop_id: int = None
    payment_method: str = ""

    class Config:
        orm_mode = True
        
class TransactionRequest(TransactionBase):
    class Config:
        orm_mode = True

class TransactionResponse(TransactionBase):
    id: int
    insert_date: str

    class Config:
        orm_mode = True