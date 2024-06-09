from pydantic import BaseModel

class ShopBase(BaseModel):
    latitude: float
    longitude: float
    location_code: str
    name: str

    class Config:
        orm_mode = True
        
class ShopRequest(ShopBase):
    class Config:
        orm_mode = True

class ShopResponse(ShopBase):
    id: int

    class Config:
        orm_mode = True

