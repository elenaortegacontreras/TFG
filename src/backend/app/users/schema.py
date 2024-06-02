from pydantic import BaseModel

class UserBase(BaseModel):
    name: str
    email: str
    phone: str = None
    email: str
    password: str

    class Config:
        orm_mode = True
        
class UserRequest(UserBase):
    class Config:
        orm_mode = True

class UserResponse(UserBase):
    id: int

    class Config:
        orm_mode = True

