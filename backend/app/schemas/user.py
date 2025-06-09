from pydantic import BaseModel, EmailStr
from datetime import datetime


class UserBase(BaseModel):
    full_name: str
    email: EmailStr


class UserCreate(UserBase):
    address: str | None = None


class User(UserBase):
    id: int
    address: str | None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
