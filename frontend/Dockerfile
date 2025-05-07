# Используем официальный образ Node
FROM node:14

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы package.json и устанавливаем зависимости
COPY package.json .
RUN npm install

# Копируем остальные файлы проекта
COPY . .

# Команда для запуска приложения
CMD ["npm", "start"]