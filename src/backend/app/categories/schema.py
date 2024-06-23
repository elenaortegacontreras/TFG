from pydantic import BaseModel
from typing import Optional

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

