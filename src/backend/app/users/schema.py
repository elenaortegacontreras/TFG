from typing import Optional
from pydantic import BaseModel

class UserBase(BaseModel):
    email: str
    phone: str
    email: str
    password: str
    first_name: str
    last_name: Optional[str] = None

    class Config:
        orm_mode = True
        
class UserRequest(UserBase):
    class Config:
        orm_mode = True

class UserResponse(UserBase):
    id: int

    class Config:
        orm_mode = True

