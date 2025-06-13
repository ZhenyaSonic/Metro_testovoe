# app/schemas.py
from pydantic import BaseModel, EmailStr
from typing import List, Optional


# --- Token Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


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
        from_attributes = True


# --- User Schemas ---
class UserBase(BaseModel):
    fio: str
    email: EmailStr
    address: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    fio: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None


class User(UserBase):
    id: int
    avatar_url: Optional[str] = None
    posts: List[Post] = []

    class Config:
        from_attributes = True
