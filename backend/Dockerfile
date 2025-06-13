FROM python:3.10.11-slim

WORKDIR /app

# Создаем папку для загрузок
RUN mkdir -p /app/uploads

COPY ./requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Запускаем uvicorn без --host и --port, так как он будет в приватной сети Docker
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]