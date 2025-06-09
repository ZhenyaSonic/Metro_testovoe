# app/routers/posts.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from .. import crud, models, schemas
from ..database import get_db

router = APIRouter(
    prefix="/posts",
    tags=["posts"],
    responses={404: {"description": "Not found"}},
)


@router.get("/", response_model=List[schemas.Post])
def read_posts_endpoint(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    posts = crud.get_posts(db, skip=skip, limit=limit)
    return posts


@router.get("/{post_id}", response_model=schemas.Post)
def read_post_endpoint(post_id: int, db: Session = Depends(get_db)):
    db_post = crud.get_post(db, post_id=post_id)
    if db_post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    return db_post


@router.put("/{post_id}", response_model=schemas.Post)
def update_post_endpoint(
    post_id: int,
    post_update: schemas.PostUpdate,
    db: Session = Depends(get_db)
):
    db_post = crud.update_post(db, post_id=post_id, post_update=post_update)
    if db_post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    return db_post


@router.delete("/{post_id}", response_model=schemas.Post)
def delete_post_endpoint(post_id: int, db: Session = Depends(get_db)):
    db_post = crud.delete_post(db, post_id=post_id)
    if db_post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    return db_post
