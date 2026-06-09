# LearnHub — Интерактивная платформа для обучения

Полнофункциональная веб-платформа дистанционного обучения компьютерным дисциплинам. Реализована на чистом JavaScript (vanilla JS) с бэкендом на Node.js/Express и MongoDB.

---

## Стек технологий

| Компонент | Технология |
|-----------|-----------|
| Frontend | HTML5, CSS3, JavaScript (ES6+) |
| Backend | Node.js, Express.js |
| База данных | MongoDB, Mongoose ODM |
| Аутентификация | JWT (JSON Web Tokens) |
| Шифрование паролей | bcryptjs |
| Безопасность | Helmet, CORS |
| Загрузка файлов | Multer |

---

## Возможности

### Студент
- Регистрация и авторизация
- Просмотр и редактирование профиля
- Запись на курсы
- Просмотр учебных материалов (видео, документы)
- Загрузка и выполнение практических работ
- Прохождение тестов с автоматической проверкой
- Просмотр оценок и статистики успеваемости
- Участие в форуме (создание тем, ответы)
- Календарь событий и дедлайнов
- Система уведомлений

### Преподаватель
- Создание и редактирование курсов
- Добавление модулей и учебных материалов
- Создание практических заданий
- Создание тестов и вопросов
- Проверка работ и выставление оценок
- Создание тем на форуме
- Модерирование обсуждений

### Администратор
- Управление пользователями (роли, статус)
- Блокировка/активация пользователей
- Просмотр всех курсов платформы
- Статистика использования системы

---

## Установка и запуск

### 1. Требования

- **Node.js** версии 18 или выше
- **MongoDB** — локально (через `mongod`) или облачный кластер [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Git** (опционально, для клонирования)

### 2. Клонирование

```bash
git clone <url-репозитория>
cd learning-platform
```

### 3. Установка зависимостей

```bash
npm install
```

### 4. Настройка окружения

Отредактируйте файл `.env` в корне проекта:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/learning-platform
JWT_SECRET=ваш-секретный-ключ-смените-в-продакшене
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

Параметры:
- `PORT` — порт, на котором запустится сервер (по умолчанию 5000)
- `MONGODB_URI` — строка подключения к MongoDB:
  - Локально: `mongodb://localhost:27017/learning-platform`
  - Atlas: `mongodb+srv://user:pass@cluster.xxxxx.mongodb.net/learning-platform`
- `JWT_SECRET` — секретный ключ для подписи JWT-токенов
- `JWT_EXPIRES_IN` — срок действия токена (7d = 7 дней)

### 5. Запуск MongoDB

**Локально:**
```bash
# Windows (если MongoDB установлена как служба)
net start MongoDB

# macOS (через Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

**Docker:**
```bash
docker run -d -p 27017:27017 --name mongo mongo:7
```

### 6. Запуск сервера

**Режим разработки** (с авто-перезагрузкой через Nodemon):
```bash
npm run dev
```

**Продакшен-режим:**
```bash
npm start
```

Сервер запустится на `http://localhost:5000`.

Успешный запуск выглядит так:
```
Server running on port 5000
MongoDB connected: localhost
```

### 7. Открытие frontend

Файлы frontend находятся в `frontend/pages/`. Откройте в браузере:

- `http://localhost:5000` — API будет отвечать JSON
- `frontend/pages/index.html` — напрямую через файловую систему (или через любой статический сервер)

**Рекомендуемый способ:** используйте Live Server (VS Code) или любой HTTP-сервер:
```bash
npx serve frontend
```

---

## API Эндпоинты

### Аутентификация
| Метод | Путь | Описание |
|-------|------|----------|
| POST | `/api/auth/register` | Регистрация |
| POST | `/api/auth/login` | Вход |
| GET | `/api/auth/me` | Текущий пользователь |

### Пользователи
| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/api/users/profile/:id` | Профиль пользователя |
| PUT | `/api/users/profile` | Обновление профиля |
| PUT | `/api/users/password` | Смена пароля |
| POST | `/api/users/enroll` | Запись на курс |

### Курсы
| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/api/courses` | Список курсов (с фильтрацией) |
| GET | `/api/courses/my` | Мои курсы (преподаватель) |
| GET | `/api/courses/:id` | Детали курса |
| POST | `/api/courses` | Создание курса |
| PUT | `/api/courses/:id` | Обновление курса |
| DELETE | `/api/courses/:id` | Удаление курса |
| POST | `/api/courses/:courseId/modules` | Создание модуля |

### Материалы
| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/api/materials/module/:moduleId` | Материалы модуля |
| POST | `/api/materials/module/:moduleId` | Добавить материал |

### Задания
| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/api/assignments/course/:courseId` | Задания курса |
| POST | `/api/assignments` | Создать задание |
| POST | `/api/assignments/submit` | Отправить работу |
| PUT | `/api/assignments/:id/grade` | Оценить работу |

### Тесты
| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/api/tests/course/:courseId` | Тесты курса |
| POST | `/api/tests/:testId/questions` | Добавить вопрос |
| POST | `/api/tests/:testId/submit` | Отправить ответы |

### Оценки
| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/api/grades/my` | Мои оценки |
| GET | `/api/grades/statistics` | Статистика успеваемости |

### Форум
| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/api/forum/course/:courseId` | Темы форума |
| POST | `/api/forum/topics` | Создать тему |
| POST | `/api/forum/posts` | Ответить в теме |

### Календарь
| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/api/calendar` | События (с фильтром по дате) |
| POST | `/api/calendar` | Создать событие |

### Уведомления
| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/api/notifications` | Мои уведомления |
| PUT | `/api/notifications/read-all` | Отметить все прочитанными |

### Администрирование
| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/api/admin/users` | Список пользователей |
| PUT | `/api/admin/users/:id/role` | Сменить роль |
| PUT | `/api/admin/users/:id/toggle-status` | Блокировать/активировать |
| DELETE | `/api/admin/users/:id` | Удалить пользователя |
| GET | `/api/admin/statistics` | Статистика платформы |

---

## Структура проекта

```
learning-platform/
│
├── backend/
│   └── src/
│       ├── config/          # Подключение БД и JWT
│       │   ├── db.js
│       │   └── jwt.js
│       ├── controllers/     # Логика обработки запросов
│       │   ├── authController.js
│       │   ├── userController.js
│       │   ├── courseController.js
│       │   ├── materialController.js
│       │   ├── assignmentController.js
│       │   ├── testController.js
│       │   ├── gradeController.js
│       │   ├── forumController.js
│       │   ├── notificationController.js
│       │   ├── calendarController.js
│       │   └── adminController.js
│       ├── models/          # Mongoose-схемы (14 моделей)
│       ├── routes/          # Express-маршруты (11 файлов)
│       ├── middleware/       # auth, roles, upload, errors
│       └── server.js
│
├── frontend/
│   ├── pages/               # 13 HTML-страниц
│   ├── css/                 # 6 таблиц стилей
│   ├── js/                  # 9 клиентских скриптов
│   ├── components/          # 4 HTML-компонента
│   └── assets/              # изображения, иконки, файлы
│
├── .env                     # переменные окружения
├── package.json
└── README.md
```

---

## Тестовые сценарии

### Регистрация и вход
1. Откройте `register.html` — создайте аккаунт студента
2. После регистрации произойдёт автоматический вход
3. Откройте `login.html` — войдите с созданными credentials

### Студент
1. На главной (`index.html`) — просмотр статистики и курсов
2. `courses.html` — просмотр доступных курсов, фильтрация
3. `course-details.html?id=...` — детали курса, модули, материалы
4. `assignments.html?courseId=...` — просмотр и отправка заданий
5. `tests.html?courseId=...` — прохождение тестов
6. `grades.html` — просмотр оценок и статистики
7. `forum.html?courseId=...` — форум курса
8. `calendar.html` — календарь событий
9. `notifications.html` — уведомления
10. `profile.html` — редактирование профиля

### Преподаватель
1. При регистрации выберите роль "Teacher"
2. Создавайте курсы, модули, материалы, задания, тесты
3. Оценивайте работы студентов

### Администратор
1. Смените роль пользователя на `admin` через БД напрямую:
   ```javascript
   db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })
   ```
2. `admin.html` — управление пользователями, курсами, статистика
