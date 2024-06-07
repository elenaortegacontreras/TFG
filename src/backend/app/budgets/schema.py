from pydantic import BaseModel

class BudgetBase(BaseModel):
    user_id: int
    category_id: int
    amount: float

    class Config:
        orm_mode = True
        
class BudgetRequest(BudgetBase):
    class Config:
        orm_mode = True

class BudgetResponse(BudgetBase):
    id: int

    class Config:
        orm_mode = True