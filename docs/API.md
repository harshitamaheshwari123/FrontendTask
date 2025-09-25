API Reference

Base URL: http://localhost:5000/api

Auth

- POST /auth/signup
  - body: { name: string, email: string, password: string }
  - 201: { token, user }
- POST /auth/login
  - body: { email: string, password: string }
  - 200: { token, user }

Profile (requires Bearer token)

- GET /profile
  - 200: { user }
- PUT /profile
  - body: { name?: string }
  - 200: { user }

Tasks (requires Bearer token)

- GET /tasks
  - query: q?: string, status?: "todo"|"in_progress"|"done"
  - 200: { tasks: Task[] }
- POST /tasks
  - body: { title: string, description?: string, status?: enum, dueDate?: ISO8601 }
  - 201: { task }
- PUT /tasks/:id
  - body: { title?, description?, status?, dueDate? }
  - 200: { task }
- DELETE /tasks/:id
  - 204: no content

Shared types

- User: { id, name, email, createdAt }
- Task: { \_id, userId, title, description, status, dueDate, createdAt, updatedAt }

Auth header

- Authorization: Bearer <JWT>

Validation

- 400: { errors: [ { msg, path } ], message? }
- 401/404: { message }

Health

- GET /health → { status: "ok" }
