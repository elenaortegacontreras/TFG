from pydantic import BaseModel, root_validator
from datetime import date, datetime

class GoalBase(BaseModel):
    user_id: int
    category_id: int
    name: str
    description: str = ""
    target_amount: float
    current_amount: float = 0.00
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

