# 📚 TaskZen API Reference

🌐 Base URL: `https://api-todo.up.railway.app/api`

## 🔑 Headers

All protected routes require:

```
Content-Type: application/json
Authorization: Bearer <token>
```

---

# 🔐 Authentication

## POST /auth/register

Register a new user.

### Request

```json
{
  "name": "Ahmed Mohamed",
  "email": "user@example.com",
  "password": "123456"
}
```

### Responses

**201 - Created**

```json
{
  "token": "eyJhbGc...",
  "message": "Account created successfully",
  "user": {
    "id": 1,
    "name": "Ahmed Mohamed",
    "email": "user@example.com"
  }
}
```

**400 - Bad Request**

```json
{
  "message": "Please fill in all fields"
}
```

**409 - Conflict**

```json
{
  "message": "This email is already registered"
}
```

**500 - Server Error**

```json
{
  "message": "Server error"
}
```

---

## POST /auth/login

Authenticate user.

### Request

```json
{
  "email": "user@example.com",
  "password": "123456"
}
```

### Responses

**200 - OK**

```json
{
  "token": "eyJhbGc...",
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "Ahmed Mohamed",
    "email": "user@example.com"
  }
}
```

**400 - Bad Request**

```json
{
  "message": "Please enter your email and password"
}
```

**401 - Unauthorized**

```json
{
  "message": "Incorrect login details"
}
```

**500 - Server Error**

```json
{
  "message": "Server error"
}
```

---

# 📝 Todos

## GET /todos

Get all todos for authenticated user.

### Response

**200 - OK**

```json
{
  "todos": [
    {
      "id": 1,
      "title": "Buy groceries",
      "completed": false,
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

---

## POST /todos

Create a new todo.

### Request

```json
{
  "title": "First try as Bakiro",
  "description": "Just for testing",
  "due_date": "2025-03-09T00:00:00.000Z",
  "status": "not_completed"
}
```

### Response

**201 - Created**

```json
{
  "message": "The task was successfully created",
  "todo": {
    "id": 1,
    "title": "First try as Bakiro",
    "description": "Just for testing",
    "status": "not_completed",
    "due_date": "2025-03-09T00:00:00.000Z",
    "user_id": 213
  }
}
```

---

## PUT /todos/:id

Update a todo.

### Request

```json
{
  "title": "Buy groceries",
  "completed": true
}
```

### Response

**200 - OK**

```json
{
  "message": "Todo has been updated",
  "todo": {
    "id": 1018,
    "title": "First try as Bakiro",
    "description": "Just for testing",
    "due_date": "2025-03-09T00:00:00.000Z",
    "status": "not_completed"
  }
}
```

---

## DELETE /todos/:id

Delete a todo.

### Response

**200 - OK**

```json
{
  "message": "Todo deleted successfully"
}
```

---

## 🔐 Authentication Headers

All protected endpoints require:

- Header Name: `x-auth-token`
- Header Value: `<jwt_token>` (without "Bearer" prefix)

Example: x-auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
