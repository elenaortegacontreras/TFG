from pydantic import BaseModel

class CategoryBase(BaseModel):
    user_id: int
    name: str
    budget_amount: int = 0

    class Config:
        orm_mode = True
        
class CategoryRequest(CategoryBase):
    class Config:
        orm_mode = True

class CategoryResponse(CategoryBase):
    id: int

    class Config:
        orm_mode = True

