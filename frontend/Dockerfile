# Используем официальный образ Node
FROM node:14

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package.json package-lock.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы проекта
COPY . .

# Сборка фронтенда
RUN npm run build

# Устанавливаем serve для запуска статических файлов
RUN npm install -g serve

# Команда для запуска фронтенда
CMD ["serve", "-s", "build", "-l", "3000"]