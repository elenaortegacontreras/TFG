from pydantic import BaseModel

class GoalBase(BaseModel):
    user_id: int
    category_id: int
    name: str
    description: str = None
    target_amount: float
    current_amount: float = 0.00
    target_date: str = None

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

