# Используем официальный образ Python
FROM python:3.10-slim

# Устанавливаем рабочую директорию
WORKDIR /app

# Устанавливаем Poetry
RUN pip install poetry

# Копируем файлы pyproject.toml и poetry.lock
COPY pyproject.toml poetry.lock ./

# Устанавливаем зависимости с помощью Poetry
RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi

# Копируем остальные файлы проекта
COPY . .

# Команда для запуска приложения
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "my_project.wsgi:application"]