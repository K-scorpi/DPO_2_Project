# Установите Poetry
curl -sSL https://install.python-poetry.org | python3 -

# Установите зависимости backend
cd backend
poetry install

# Установите зависимости frontend
cd ../frontend
npm install

# Запустите проект через Docker Compose
cd ..
docker-compose up --build


# Backend
cd backend
poetry run black .
poetry run isort .
poetry run flake8 .
poetry run mypy .

# Frontend
cd frontend
npm run lint