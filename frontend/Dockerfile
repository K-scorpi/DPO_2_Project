# Build stage
FROM node:18

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package.json package-lock.json ./
COPY .env.production .env

RUN npm cache clean --force

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы проекта
COPY . .

# Собираем проект
RUN npm run build

# Установим serve для раздачи build
RUN npm install -g serve

CMD ["serve", "-s", "build", "-l", "3001"]