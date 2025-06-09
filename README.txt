Структура проекта:
Metro_testovoe/
├── backend/
│   ├── app/
│   ├── Dockerfile.backend
├── frontend/
│   ├── index.html
│   ├── script.js
│   ├── styles.css
│   └── Dockerfile.frontend
├── docker-compose.yml
└── nginx/
    └── nginx.conf


Пошаговая настройка:
Установка зависимостей:


cd backend
pip install -r requirements.txt
Настройка окружения:
Создайте файл .env в папке backend:

Обычный запуск 
uvicorn app.main:app --reload
Сервер будет доступен по адресу: http://localhost:8000
И открыть файл index.html в браузере 


Проверка API:
Откройте http://localhost:8000/docs для доступа к Swagger UI

Либо полный запуск происходит через Docker
Для запуска проекта 
docker-compose up --build
