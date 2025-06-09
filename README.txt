backend/
├── .env                     # Файл переменных окружения
├── alembic.ini             # Конфигурация Alembic
├── requirements.txt        # Зависимости Python
├── Dockerfile              # Конфигурация Docker
└── app/
    ├── __init__.py
    ├── main.py             # Точка входа
    ├── core/               # Базовые настройки
    │   ├── __init__.py
    │   └── config.py       # Конфигурация приложения
    ├── db/                 # Работа с БД
    │   ├── __init__.py
    │   ├── base.py         # Базовый класс моделей
    │   ├── base_class.py   # Базовый класс для моделей
    │   └── session.py      # Генератор сессий БД
    ├── models/             # Модели SQLAlchemy
    │   ├── __init__.py
    │   ├── post.py         # Модель поста
    │   └── user.py         # Модель пользователя
    ├── schemas/            # Pydantic схемы
    │   ├── __init__.py
    │   ├── post.py         # Схемы постов
    │   └── user.py         # Схемы пользователей
    ├── api/                # API endpoints
    │   ├── __init__.py
    │   ├── posts.py        # API постов
    │   └── users.py        # API пользователей
    └── alembic/            # Миграции
        ├── versions/       # Файлы миграций
        ├── env.py
        └── script.py.mako


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



frontend/
├── public/                 # Статические файлы
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── api/                # API клиент
│   │   ├── posts.ts        # API постов
│   │   └── users.ts        # API пользователей
│   ├── components/         # UI компоненты
│   │   ├── Layout/
│   │   │   └── Navbar.tsx  # Навигационная панель
│   │   └── User/
│   │       └── UserCard.tsx # Карточка пользователя
│   ├── pages/              # Страницы
│   │   ├── Posts/
│   │   │   └── Posts.tsx   # Страница постов
│   │   └── Users/
│   │       └── Users.tsx   # Страница пользователей
│   ├── types/              # Типы TypeScript
│   │   ├── post.ts         # Типы для постов
│   │   └── user.ts         # Типы для пользователей
│   ├── App.tsx             # Основной компонент
│   └── index.tsx           # Точка входа
├── package.json            # Зависимости
├── tsconfig.json           # Конфигурация TypeScript
└── Dockerfile              # Конфигурация Docker


Пошаговая настройка:
Установка зависимостей:

cd frontend
npm install
Настройка API URL:
В файле src/api/base.ts укажите URL бэкенда:

export const API_URL = 'http://localhost:8000/api';
Запуск сервера:

npm start
Приложение будет доступно по адресу: http://localhost:3000