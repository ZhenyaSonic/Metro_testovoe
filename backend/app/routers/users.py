# app/routers/users.py
import shutil
from pathlib import Path
from typing import List

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from .. import auth, crud, models, schemas
from ..database import get_db

router = APIRouter(
    prefix="/users",
    tags=["users"],
    responses={404: {"description": "Not found"}},
)

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


async def get_current_active_user(
    token: str = Depends(auth.oauth2_scheme), db: Session = Depends(get_db)
):
    return auth.get_user_from_token(token, db)


@router.post(
        "/",
        response_model=schemas.User,
        status_code=status.HTTP_201_CREATED
    )
def create_user_endpoint(
    user: schemas.UserCreate,
    db: Session = Depends(get_db)
):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)


@router.get("/me", response_model=schemas.User)
async def read_users_me(
    current_user: models.User =
    Depends(get_current_active_user)
):
    return current_user


@router.get("/", response_model=List[schemas.User])
def read_users_endpoint(
    skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users


@router.get("/{user_id}", response_model=schemas.User)
def read_user_endpoint(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@router.put("/me/avatar", response_model=schemas.User)
async def upload_avatar(
    file: UploadFile = File(...),
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    file_extension = Path(file.filename).suffix
    file_path = UPLOAD_DIR / f"user_{current_user.id}_avatar{file_extension}"

    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    current_user.avatar_url = f"/{UPLOAD_DIR.name}/{file_path.name}"
    db.commit()
    db.refresh(current_user)
    return current_user


@router.put("/{user_id}", response_model=schemas.User)
def update_user_endpoint(
    user_id: int,
    user_update: schemas.UserUpdate,
    db: Session = Depends(get_db)
):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    if user_update.email:
        existing_user = crud.get_user_by_email(db, email=user_update.email)
        if existing_user and existing_user.id != user_id:
            raise HTTPException(
                status_code=400,
                detail="Email already registered by another user"
            )

    updated_user = crud.update_user(
        db,
        user_id=user_id,
        user_update=user_update
    )
    return updated_user


@router.delete("/{user_id}", response_model=schemas.User)
def delete_user_endpoint(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.delete_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@router.post(
        "/{user_id}/posts/",
        response_model=schemas.Post,
        status_code=status.HTTP_201_CREATED
    )
def create_post_for_user_endpoint(
    user_id: int,
    post: schemas.PostCreate,
    db: Session = Depends(get_db)
):
    db_user = crud.get_user(db, user_id=user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return crud.create_user_post(db=db, post=post, user_id=user_id)
