from pydantic import BaseModel

class SavingBase(BaseModel):
    user_id: int
    category_id: int
    subcategory_id: int
    name: str
    description: str = None
    target_amount: float
    current_amount: float = 0.00
    target_date: str = None

    class Config:
        orm_mode = True
        
class SavingRequest(SavingBase):
    class Config:
        orm_mode = True

class SavingResponse(SavingBase):
    id: int
    insert_date: str

    class Config:
        orm_mode = True

