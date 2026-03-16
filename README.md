## todo-web-application

**Full-stack to-do web application built with Angular, NestJS, TypeORM, and MySQL.**

This project provides a clean, developer-friendly stack to help users manage their daily tasks — create, update, complete, and delete to-dos — with a simple Angular frontend consuming a NestJS REST API backed by a MySQL database.

---

### Visuals

---

### Features

- **Task Management**: Create, update, complete, and delete tasks with title, description, and due date.
- **Frontend Validation**: Client-side validation with error messages for required fields and invalid dates.
- **RESTful API**: JSON-based endpoints for full CRUD operations on todos.
- **Database Persistence**: Tasks are stored in MySQL via TypeORM and persist across sessions.
- **CORS Enabled**: Frontend and backend communicate seamlessly on separate ports.

---

### Getting Started

#### Prerequisites

- **Node.js**: v18 or later
- **npm**: bundled with Node.js
- **MySQL**: v8.0 or later (local instance)
- **Angular CLI**: `npm install -g @angular/cli`
- **NestJS CLI**: `npm install -g @nestjs/cli`

#### Database Setup

Start your MySQL server and create the database:

```sql
CREATE DATABASE todo_db;
```

#### Backend Setup

Navigate to the backend folder and install dependencies:

```bash
cd todo-backend
npm install
```

Open `src/app.module.ts` and update the database credentials:

```typescript
TypeOrmModule.forRoot({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "your_password_here",
  database: "todo_db",
  autoLoadEntities: true,
  synchronize: true,
});
```

Start the backend server:

```bash
npm run start
```

The API will be available at `http://localhost:3000`.

#### Frontend Setup

Navigate to the frontend folder and install dependencies:

```bash
cd todo-frontend
npm install
```

Start the Angular development server:

```bash
ng serve
```

Then open `http://localhost:4200` in your browser.

---

### Usage

The most common use case is creating and managing todos through the Angular UI, which communicates with the NestJS API.

**Example: Create a new todo using the API directly:**

```javascript
const response = await fetch("http://localhost:3000/todos", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    title: "Buy groceries",
    description: "Milk, eggs, bread",
    dueDate: "2026-03-20",
  }),
});

const todo = await response.json();
console.log("Created todo:", todo);
```

---

### API Endpoints

| Method | Endpoint     | Description             |
| ------ | ------------ | ----------------------- |
| GET    | `/todos`     | Get all todos           |
| GET    | `/todos/:id` | Get a single todo       |
| POST   | `/todos`     | Create a new todo       |
| PATCH  | `/todos/:id` | Update an existing todo |
| DELETE | `/todos/:id` | Delete a todo           |

---

### Configuration

Backend configuration is managed directly in `src/app.module.ts`.

| Setting    | Default     | Description    | Required |
| ---------- | ----------- | -------------- | -------- |
| `host`     | `localhost` | MySQL host     | Yes      |
| `port`     | `3306`      | MySQL port     | Yes      |
| `username` | `root`      | MySQL username | Yes      |
| `password` | _(none)_    | MySQL password | Yes      |
| `database` | `todo_db`   | Database name  | Yes      |

---

### Project Structure

```
todo-backend/
└── src/
    ├── app.module.ts         # TypeORM and app configuration
    ├── main.ts               # Entry point, CORS, validation pipe
    └── todo/
        ├── todo.entity.ts    # Database table definition
        ├── todo.module.ts    # Todo module
        ├── todo.controller.ts # API route handlers
        ├── todo.service.ts   # Business logic
        └── dto/
            ├── create-todo.dto.ts
            └── update-todo.dto.ts

todo-frontend/
└── src/app/
    ├── app.ts                # Main component with CRUD logic
    ├── app.html              # Template
    ├── app.css               # Component styles
    ├── app.config.ts         # Angular app configuration
    ├── todo.model.ts         # Todo interface
    └── todo.service.ts       # HTTP service for API calls
```

---

### Contributing

Contributions are welcome. To propose a change:

1. **Fork** the repository on GitHub.
2. **Create a feature branch** from `main` (for example, `feature/add-auth`).
3. **Implement your changes** with clear commits.
4. **Open a Pull Request** against `main`, describing the change and motivation.
5. Be ready to address review comments and keep the branch up to date with `main`.

---

### License

This project is licensed under the **MIT License**. See the `LICENSE` file in this repository for full details.
