from pydantic import BaseModel

class CategoryBase(BaseModel):
    user_id: int
    name: str

    class Config:
        orm_mode = True
        
class CategoryRequest(CategoryBase):
    class Config:
        orm_mode = True

class CategoryResponse(CategoryBase):
    id: int

    class Config:
        orm_mode = True

