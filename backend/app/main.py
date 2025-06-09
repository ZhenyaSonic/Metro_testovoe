# E:\testovoe_metro\test_task\backend\app\main.py

from dotenv import load_dotenv # Импортируем саму функцию

# ВАЖНО: Вызовите load_dotenv() ЗДЕСЬ, в самом начале
load_dotenv()

# Теперь можно импортировать модули, которые полагаются на переменные окружения
import os
from fastapi import FastAPI

loaded_db_url = os.getenv('DATABASE_URL')
print(f"DEBUG [main.py]: DATABASE_URL after load_dotenv(): '{loaded_db_url}'")
if not loaded_db_url:
    print("WARNING [main.py]: DATABASE_URL is still None or empty after load_dotenv(). Check .env path and content.")

from app.api import posts, users
from app.db.session import engine
from app.models import post, user

app = FastAPI()

# Подключаем роутеры
app.include_router(posts.router, prefix="/api/posts", tags=["posts"])
app.include_router(users.router, prefix="/api/users", tags=["users"])


# Создаем таблицы
@app.on_event("startup")
def startup():
    # Убедитесь, что Base из post и user - это тот же Base, что и в session.py
    # или что они оба наследуются от одного и того же declarative_base()
    # Обычно все модели наследуются от одного Base, объявленного в session.py или db.base_class
    post.Base.metadata.create_all(bind=engine)
    user.Base.metadata.create_all(bind=engine)
