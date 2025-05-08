# Установите Poetry
curl -sSL https://install.python-poetry.org | python3 -

# Установка и запуск зависимости backend 
cd backend
poetry install
poetry run python3 manage.py runserver

# Установка и запуск зависимости frontend
cd ../frontend
npm install
npm start

# Запустите проект через Docker Compose
cd ..
docker-compose up --build