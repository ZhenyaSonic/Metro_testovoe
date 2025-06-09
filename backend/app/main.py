# app/main.py
from fastapi import FastAPI
from . import models
from .database import engine
from .routers import users, posts
from fastapi.middleware.cors import CORSMiddleware # <--- Добавить

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Московский Транспорт API",
    description="Тестовое задание - Бэкенд API",
    version="0.1.0"
)


origins = [
    "http://localhost",  # Если вы будете использовать локальный сервер для фронтенда
    "http://127.0.0.1",  # Для доступа с этого же IP
    "null",  # Для разрешения запросов от file:/// (для локальной разработки)
    # "http://your-frontend-domain.com", # Если будете деплоить фронтенд
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Разрешенные источники
    allow_credentials=True,
    allow_methods=["*"],  # Разрешить все методы (GET, POST, PUT, DELETE и т.д.)
    allow_headers=["*"],  # Разрешить все заголовки
)

app.include_router(users.router)
app.include_router(posts.router)


@app.get("/")
async def root():
    return {"message": "Welcome to the Московский Транспорт API. Visit /docs for API documentation."}
