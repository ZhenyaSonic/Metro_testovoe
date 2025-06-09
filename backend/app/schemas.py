# app/schemas.py
from pydantic import BaseModel, EmailStr
from typing import List, Optional


# --- Post Schemas ---
class PostBase(BaseModel):
    title: str
    content: str


class PostCreate(PostBase):
    pass


class PostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None


class Post(PostBase):
    id: int
    owner_id: int

    class Config:
        orm_mode = True


# --- User Schemas ---
class UserBase(BaseModel):
    fio: str
    email: EmailStr
    address: Optional[str] = None


class UserCreate(UserBase):
    pass


class UserUpdate(BaseModel):
    fio: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None


class User(UserBase):
    id: int
    posts: List[Post] = []

    class Config:
        orm_mode = True
