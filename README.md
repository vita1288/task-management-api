# Task Management REST API

A lightweight RESTful API for managing task workflows. Built with Node.js, Express, SQLite, and Zod for input validation. Includes database persistence, request schema validation, structured error responses, and automated integration tests.

---

## Features

- **CRUD Operations**: Complete endpoint coverage for creating, reading, updating, and deleting tasks.
- **Persistent Data Storage**: File-based SQLite database with auto-created tables on boot.
- **Request Validation**: Schema-based payload validation using Zod.
- **Status Patching**: Dedicated endpoint for fast status transitions (`pending` -> `in-progress` -> `completed`).
- **Query Filtering**: Filter task lists by status or priority.
- **Centralized Error Handling**: Standardized JSON responses for 400 Bad Request, 404 Not Found, and 500 Internal Server Error.
- **HTTP Logging**: Automated request logging using Morgan.

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
│   └── tasks.db           # SQLite database file (created automatically)
├── src/
│   ├── config/
│   │   └── db.js          # SQLite connection setup & table schema
│   ├── controllers/
│   │   └── taskController.js # Route request handlers
│   ├── middleware/
│   │   ├── errorHandler.js   # Global error handling & 404 handler
│   │   └── validate.js       # Zod schema validation middleware
│   ├── routes/
│   │   └── taskRoutes.js     # API route mappings
│   ├── schemas/
│   │   └── taskSchema.js     # Zod payload schemas
│   ├── services/
│   │   └── taskService.js    # Business logic & SQL queries
│   ├── app.js             # Express app setup
│   └── server.js          # App entrypoint
├── tests/
│   └── tasks.test.js      # Integration test suite
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

Make sure you have Node.js (v18 or higher) and npm installed.

### Installation

1. Clone the repository and navigate into the folder:
   ```bash
   git clone <your-repository-url>
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

4. Start the development server:
   ```bash
   npm run dev
   ```

The API server will run at `http://localhost:3000`.

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

### 5. Update Task Status Only
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
```

---

## Running Tests

Run the full integration test suite with Jest:

```bash
npm test
```

Tests use an in-memory SQLite instance to ensure clean, isolated execution without touching the local disk file.

---

## GitHub Deployment Guide

To push this repository to your GitHub account:

1. Initialize git and make your first commit:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Task Management REST API implementation"
   ```

2. Set the default branch name to `main`:
   ```bash
   git branch -M main
   ```

3. Link your GitHub remote repository:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/task-management-api.git
   ```

4. Push code to GitHub:
   ```bash
   git push -u origin main
   ```

---

## License

This project is licensed under the [MIT License](LICENSE).
