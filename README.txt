Пошаговая настройка:
Установка зависимостей:


cd backend
pip install -r requirements.txt
Настройка окружения:
Создайте файл .env в папке backend:


DATABASE_URL=postgresql://user:password@localhost:5432/test_task
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

Настройка базы данных:

Создайте БД PostgreSQL с именем test_task

Обновите DATABASE_URL в .env с вашими учетными данными

Применение миграций:


alembic upgrade head
Запуск сервера:


uvicorn app.main:app --reload
Сервер будет доступен по адресу: http://localhost:8000

Проверка API:
Откройте http://localhost:8000/docs для доступа к Swagger UI
