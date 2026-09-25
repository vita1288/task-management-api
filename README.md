<h1>Task Management REST API</h1>
<p>
  It is a lightweight RESTful API for managing task workflows. It has been developed using Node.js, Express, SQLite and Zod for input validation. The API provides database persistence, request schema validation, structured error responses and automated integration tests.
</p>
<hr>
<h2>Features</h2>
<ul>
  <li><strong>CRUD Operations</strong>: The endpoint supports full CRUD operations (create, read, update and delete).</li>
  <li><strong>Persistent data storage</strong>: A file based SQLite database which automatically creates its tables on boot.</li>
  <li><strong>Request Validation</strong>: Zod is used for payload validation based on schema.</li>
  <li><strong>Status Patching</strong>: There is a dedicated endpoint for status patches (from pending to in-progress to completed).</li>
  <li><strong>Query Filtering</strong>: Filter task lists by status or priority.</li>
  <li><strong>Centralized Error Handling</strong>: JSON responses are standardized for errors corresponding to a 400 Bad Request, a 404 Not Found and a 500 Internal Server Error.</li>
  <li><strong>HTTP Logging</strong>: Morgan automatically logs requests.</li>
</ul>
<hr>
<h2>Tech Stack</h2>
<ul>
  <li><strong>Runtime</strong>: Node.js</li>
  <li><strong>Framework</strong>: Express.js</li>
  <li><strong>Database</strong>: SQLite (<code>sqlite</code> &amp; <code>sqlite3</code>)</li>
  <li><strong>Validation</strong>: Zod</li>
  <li><strong>Testing</strong>: Jest &amp; Supertest</li>
  <li><strong>Utilities</strong>: <code>dotenv</code>, <code>cors</code>, <code>morgan</code></li>
</ul>
<hr>
<h2>Project Structure</h2>
<pre><code>task-management-api/
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
└── README.md</code></pre>
<hr>
<h2>Getting Started</h2>
<h3>Prerequisites</h3>
<p>Make sure you have Node.js version 18 or higher installed and npm is installed too.</p>
<h3>Installation</h3>
<ol>
  <li>
    <p>Clone the repository first and then go into the folder:</p>
    <pre><code>git clone https://github.com/vita1288/task-management-api.git
cd task-management-api</code></pre>
  </li>
  <li>
    <p>Install dependencies:</p>
    <pre><code>npm install</code></pre>
  </li>
  <li>
    <p>Create environment configuration:</p>
    <pre><code>cp .env.example .env</code></pre>
  </li>
  <li>
    <p>Start the development server:</p>
    <pre><code>npm run dev</code></pre>
  </li>
</ol>
<p>The API server can be accessed via <code>http://localhost:3000</code>.</p>
<hr>
<h2>Task Data Model</h2>
<p>Every task contains the following properties:</p>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>id</code></td>
      <td><code>string</code></td>
      <td>Unique UUID v4 identifier</td>
    </tr>
    <tr>
      <td><code>title</code></td>
      <td><code>string</code></td>
      <td>Task title (Required)</td>
    </tr>
    <tr>
      <td><code>description</code></td>
      <td><code>string</code></td>
      <td>Detailed task description (Optional, default <code>""</code>)</td>
    </tr>
    <tr>
      <td><code>status</code></td>
      <td><code>string</code></td>
      <td>Enum: <code>'pending'</code>, <code>'in-progress'</code>, <code>'completed'</code> (Default <code>'pending'</code>)</td>
    </tr>
    <tr>
      <td><code>priority</code></td>
      <td><code>string</code></td>
      <td>Enum: <code>'low'</code>, <code>'medium'</code>, <code>'high'</code> (Default <code>'medium'</code>)</td>
    </tr>
    <tr>
      <td><code>createdAt</code></td>
      <td><code>string</code></td>
      <td>ISO 8601 timestamp</td>
    </tr>
    <tr>
      <td><code>updatedAt</code></td>
      <td><code>string</code></td>
      <td>ISO 8601 timestamp</td>
    </tr>
  </tbody>
</table>
<hr>
<h2>API Endpoints</h2>
<h3>1. Get All Tasks</h3>
<ul>
  <li><strong>URL</strong>: <code>GET /api/tasks</code></li>
  <li><strong>Query Parameters (Optional)</strong>:
    <ul>
      <li><code>status</code>: Filter by status (<code>pending</code>, <code>in-progress</code>, <code>completed</code>)</li>
      <li><code>priority</code>: Filter by priority (<code>low</code>, <code>medium</code>, <code>high</code>)</li>
    </ul>
  </li>
  <li><strong>Example Request</strong>:
    <pre><code>curl -X GET "http://localhost:3000/api/tasks?status=pending&amp;priority=high"</code></pre>
  </li>
  <li><strong>Response (200 OK)</strong>:
    <pre><code>{
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
}</code></pre>
  </li>
</ul>
<hr>
<h3>2. Get Task by ID</h3>
<ul>
  <li><strong>URL</strong>: <code>GET /api/tasks/:id</code></li>
  <li><strong>Example Request</strong>:
    <pre><code>curl -X GET http://localhost:3000/api/tasks/e9b4d8a2-7104-4e2b-b650-8b1c4e123456</code></pre>
  </li>
  <li><strong>Response (200 OK)</strong>:
    <pre><code>{
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
}</code></pre>
  </li>
  <li><strong>Error Response (404 Not Found)</strong>:
    <pre><code>{
  "status": "fail",
  "message": "Task with ID e9b4d8a2-7104-4e2b-b650-8b1c4e123456 not found"
}</code></pre>
  </li>
</ul>
<hr>
<h3>3. Create Task</h3>
<ul>
  <li><strong>URL</strong>: <code>POST /api/tasks</code></li>
  <li><strong>Headers</strong>: <code>Content-Type: application/json</code></li>
  <li><strong>Body Payload</strong>:
    <pre><code>{
  "title": "Add authentication middleware",
  "description": "JWT based endpoint protection",
  "priority": "high"
}</code></pre>
  </li>
  <li><strong>Example Request</strong>:
    <pre><code>curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Implement auth", "priority": "high"}'</code></pre>
  </li>
  <li><strong>Response (201 Created)</strong>:
    <pre><code>{
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
}</code></pre>
  </li>
</ul>
<hr>
<h3>4. Update Full Task</h3>
<ul>
  <li><strong>URL</strong>: <code>PUT /api/tasks/:id</code></li>
  <li><strong>Headers</strong>: <code>Content-Type: application/json</code></li>
  <li><strong>Body Payload</strong>:
    <pre><code>{
  "title": "Implement JWT authentication middleware",
  "description": "Added user validation logic",
  "status": "in-progress",
  "priority": "high"
}</code></pre>
  </li>
  <li><strong>Example Request</strong>:
    <pre><code>curl -X PUT http://localhost:3000/api/tasks/a1c2e3f4-5678-90ab-cdef-1234567890ab \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Auth Title","status":"in-progress"}'</code></pre>
  </li>
  <li><strong>Response (200 OK)</strong>:
    <pre><code>{
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
}</code></pre>
  </li>
</ul>
<hr>
<h3>5. Only Update Task Status</h3>
<ul>
  <li><strong>URL</strong>: <code>PATCH /api/tasks/:id/status</code></li>
  <li><strong>Headers</strong>: <code>Content-Type: application/json</code></li>
  <li><strong>Body Payload</strong>:
    <pre><code>{
  "status": "completed"
}</code></pre>
  </li>
  <li><strong>Example Request</strong>:
    <pre><code>curl -X PATCH http://localhost:3000/api/tasks/a1c2e3f4-5678-90ab-cdef-1234567890ab/status \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'</code></pre>
  </li>
  <li><strong>Response (200 OK)</strong>:
    <pre><code>{
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
}</code></pre>
  </li>
</ul>
<hr>
<h3>6. Delete Task</h3>
<ul>
  <li><strong>URL</strong>: <code>DELETE /api/tasks/:id</code></li>
  <li><strong>Example Request</strong>:
    <pre><code>curl -X DELETE http://localhost:3000/api/tasks/a1c2e3f4-5678-90ab-cdef-1234567890ab</code></pre>
  </li>
  <li><strong>Response</strong>: <code>204 No Content</code></li>
</ul>
<hr>
<h2>Error Handling &amp; Validation</h2>
<p>If a request fails validation or an error happens, the API returns standard HTTP status codes and structured JSON errors:</p>
<h3>Validation Error (400 Bad Request)</h3>
<pre><code>{
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
}</code></pre>
