# Task Management REST API

It is a lightweight RESTful API designed for managing task workflows. It has been developed using Node.js, Express, SQLite, and Zod for input validation. The API includes features such as database persistence, validation of request schemas, structured error responses, and automated integration tests.

---

## Features

- **CRUD Operations**: The endpoint provides full support for creating, reading, updating, and deleting tasks.
- **Persistent Data Storage**: A file-based SQLite database, which creates its tables automatically when the system boots.
- **Request Validation**: The use of Zod for payload validation based on a schema.
- **Status Patching**: There is a dedicated endpoint which allows for quick status transitions (from `pending` to `in-progress` to `completed`).
- **Query Filtering**: Filter task lists by status or priority.
- **Centralized Error Handling**: The system uses standardized JSON responses for errors corresponding to a 400 Bad Request, a 404 Not Found, and a 500 Internal Server Error.
- **HTTP Logging**: Morgan automatically logs requests.

---

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite (`sqlite` & `sqlite3`)
- **Validation**: Zod
- **Testing**: Jest & Supertest
- **Utilities**: `dotenv`, `cors`, `morgan`

---

## Project Structure

```
task-management-api/
├── data/
│   └── tasks.db           # The SQLite database file (created automatically)
├── src/
│   ├── config/
│   │   └── db.js          # Sets up SQLite connection and table structure
│   ├── controllers/
│   │   └── taskController.js # Handles route requests
│   ├── middleware/
│   │   ├── errorHandler.js   # Handles all errors and 404s
│   │   └── validate.js       # Zod schema check middleware
│   ├── routes/
│   │   └── taskRoutes.js     # API route mappings
│   ├── schemas/
│   │   └── taskSchema.js     # Zod payload schemas
│   ├── services/
│   │   └── taskService.js    # Business logic and SQL queries
│   ├── app.js             # Sets up the Express app
│   └── server.js          # Main file that starts the app
├── tests/
│   └── tasks.test.js      # Integration test files
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

Make sure you have Node.js version 18 or higher and npm installed.

### Installation

First, clone the repository and then go into the folder:
   ```bash
   git clone https://github.com/vita1288/task-management-api.git
   cd task-management-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment configuration:
   ```bash
   cp .env.example .env
   ```

4. Begin the development server:
   ```bash
   npm run dev
   ```

The API server can be accessed via `http://localhost:3000`.

---

## Task Data Model

Every task contains the following properties:

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique UUID v4 identifier |
| `title` | `string` | Task title (Required) |
| `description` | `string` | Detailed task description (Optional, default `""`) |
| `status` | `string` | Enum: `'pending'`, `'in-progress'`, `'completed'` (Default `'pending'`) |
| `priority` | `string` | Enum: `'low'`, `'medium'`, `'high'` (Default `'medium'`) |
| `createdAt` | `string` | ISO 8601 timestamp |
| `updatedAt` | `string` | ISO 8601 timestamp |

---

## API Endpoints

### 1. Get All Tasks
- **URL**: `GET /api/tasks`
- **Query Parameters (Optional)**:
  - `status`: Filter by status (`pending`, `in-progress`, `completed`)
  - `priority`: Filter by priority (`low`, `medium`, `high`)
- **Example Request**:
  ```bash
  curl -X GET "http://localhost:3000/api/tasks?status=pending&priority=high"
  ```
- **Response (200 OK)**:
  ```json
  {
    "status": "success",
    "results": 1,
    "data": [
      {
        "id": "e9b4d8a2-7104-4e2b-b650-8b1c4e123456",
        "title": "Set up production DB",
        "description": "Configure SQLite persistence and backup strategy",
        "status": "pending",
        "priority": "high",
        "createdAt": "2026-09-25T19:50:00.000Z",
        "updatedAt": "2026-09-25T19:50:00.000Z"
      }
    ]
  }
  ```

---

### 2. Get Task by ID
- **URL**: `GET /api/tasks/:id`
- **Example Request**:
  ```bash
  curl -X GET http://localhost:3000/api/tasks/e9b4d8a2-7104-4e2b-b650-8b1c4e123456
  ```
- **Response (200 OK)**:
  ```json
  {
    "status": "success",
    "data": {
      "id": "e9b4d8a2-7104-4e2b-b650-8b1c4e123456",
      "title": "Set up production DB",
      "description": "Configure SQLite persistence and backup strategy",
      "status": "pending",
      "priority": "high",
      "createdAt": "2026-09-25T19:50:00.000Z",
      "updatedAt": "2026-09-25T19:50:00.000Z"
    }
  }
  ```
- **Error Response (404 Not Found)**:
  ```json
  {
    "status": "fail",
    "message": "Task with ID e9b4d8a2-7104-4e2b-b650-8b1c4e123456 not found"
  }
  ```

---

### 3. Create Task
- **URL**: `POST /api/tasks`
- **Headers**: `Content-Type: application/json`
- **Body Payload**:
  ```json
  {
    "title": "Implement authentication middleware",
    "description": "JWT-based endpoint protection",
    "priority": "high"
  }
  ```
- **Example Request**:
  ```bash
  curl -X POST http://localhost:3000/api/tasks \
    -H "Content-Type: application/json" \
    -d '{"title": "Implement auth", "priority": "high"}'
  ```
- **Response (201 Created)**:
  ```json
  {
    "status": "success",
    "message": "Task created successfully",
    "data": {
      "id": "a1c2e3f4-5678-90ab-cdef-1234567890ab",
      "title": "Implement auth",
      "description": "",
      "status": "pending",
      "priority": "high",
      "createdAt": "2026-09-25T19:55:00.000Z",
      "updatedAt": "2026-09-25T19:55:00.000Z"
    }
  }
  ```

---

### 4. Update Full Task
- **URL**: `PUT /api/tasks/:id`
- **Headers**: `Content-Type: application/json`
- **Body Payload**:
  ```json
  {
    "title": "Implement JWT authentication middleware",
    "description": "Added user validation logic",
    "status": "in-progress",
    "priority": "high"
  }
  ```
- **Example Request**:
  ```bash
  curl -X PUT http://localhost:3000/api/tasks/a1c2e3f4-5678-90ab-cdef-1234567890ab \
    -H "Content-Type: application/json" \
    -d '{"title": "Updated Auth Title", "status": "in-progress"}'
  ```
- **Response (200 OK)**:
  ```json
  {
    "status": "success",
    "message": "Task updated successfully",
    "data": {
      "id": "a1c2e3f4-5678-90ab-cdef-1234567890ab",
      "title": "Updated Auth Title",
      "description": "",
      "status": "in-progress",
      "priority": "high",
      "createdAt": "2026-09-25T19:55:00.000Z",
      "updatedAt": "2026-09-25T20:00:00.000Z"
    }
  }
  ```

---

### 5. Only Update Task Status
- **URL**: `PATCH /api/tasks/:id/status`
- **Headers**: `Content-Type: application/json`
- **Body Payload**:
  ```json
  {
    "status": "completed"
  }
  ```
- **Example Request**:
  ```bash
  curl -X PATCH http://localhost:3000/api/tasks/a1c2e3f4-5678-90ab-cdef-1234567890ab/status \
    -H "Content-Type: application/json" \
    -d '{"status": "completed"}'
  ```
- **Response (200 OK)**:
  ```json
  {
    "status": "success",
    "message": "Task status updated successfully",
    "data": {
      "id": "a1c2e3f4-5678-90ab-cdef-1234567890ab",
      "title": "Updated Auth Title",
      "description": "",
      "status": "completed",
      "priority": "high",
      "createdAt": "2026-09-25T19:55:00.000Z",
      "updatedAt": "2026-09-25T20:05:00.000Z"
    }
  }
  ```

---

### 6. Delete Task
- **URL**: `DELETE /api/tasks/:id`
- **Example Request**:
  ```bash
  curl -X DELETE http://localhost:3000/api/tasks/a1c2e3f4-5678-90ab-cdef-1234567890ab
  ```
- **Response**: `204 No Content`

---

## Error Handling & Validation

When a request fails validation or an error occurs, the API returns standard HTTP status codes and structured JSON errors:

### Validation Error (400 Bad Request)
```json
{
  "status": "fail",
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "Title is required"
    },
    {
      "field": "status",
      "message": "Status must be one of: pending, in-progress, completed"
    }
  ]
}
