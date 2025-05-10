# Используем официальный образ Python 3.10
FROM python:3.10-slim

# Устанавливаем необходимые зависимости
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Устанавливаем Poetry
RUN pip install poetry

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы проекта в рабочую директорию
COPY . /app

# Устанавливаем зависимости с помощью Poetry
RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi

# Устанавливаем переменные окружения
ENV PYTHONPATH=/app

# Команда для запуска приложения
CMD ["gunicorn", "--bind", "0.0.0.0:8001", "booking.wsgi:application"]