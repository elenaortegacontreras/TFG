from pydantic import BaseModel

class SubcategoryBase(BaseModel):
    name: str
    category_id: int

    class Config:
        orm_mode = True
        
class SubcategoryRequest(SubcategoryBase):
    class Config:
        orm_mode = True

class SubcategoryResponse(SubcategoryBase):
    id: int

    class Config:
        orm_mode = True

