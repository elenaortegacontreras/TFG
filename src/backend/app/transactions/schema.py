from pydantic import BaseModel

class TransactionBase(BaseModel):
    user_id: int
    category_id: int
    subcategory_id: int
    name: str
    amount: float
    transaction_type: str
    description: str = None

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