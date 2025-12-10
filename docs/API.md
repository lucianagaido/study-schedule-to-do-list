# API Routes Documentation

## Todo Endpoints

All endpoints require user authentication via Supabase.

### Get Todos

Fetch all todos for the authenticated user.

```typescript
const todos = await todoAPI.getTodos(userId: string): Promise<Todo[]>
```

**Returns:** Array of Todo objects sorted by creation date (newest first)

### Create Todo

Create a new todo for the authenticated user.

```typescript
const todo = await todoAPI.createTodo(
  userId: string,
  input: CreateTodoInput
): Promise<Todo>
```

**Input:**
```typescript
{
  title: string          // Required
  description?: string   // Optional
  due_date?: string      // Optional (ISO 8601 date format)
}
```

### Update Todo

Update an existing todo.

```typescript
const todo = await todoAPI.updateTodo(
  todoId: string,
  input: UpdateTodoInput
): Promise<Todo>
```

**Input:**
```typescript
{
  title?: string         // Optional
  description?: string   // Optional
  completed?: boolean    // Optional
  due_date?: string      // Optional (ISO 8601 date format)
}
```

### Delete Todo

Delete a todo.

```typescript
await todoAPI.deleteTodo(todoId: string): Promise<void>
```

### Toggle Todo

Mark a todo as complete or incomplete.

```typescript
const todo = await todoAPI.toggleTodo(
  todoId: string,
  completed: boolean
): Promise<Todo>
```

## Todo Type

```typescript
interface Todo {
  id: string              // UUID
  title: string
  description?: string
  completed: boolean
  due_date?: string       // ISO 8601 timestamp
  created_at: string      // ISO 8601 timestamp
  updated_at: string      // ISO 8601 timestamp
  user_id: string         // UUID of the owner
}
```

## Error Handling

All API functions throw errors if the operation fails. Handle them as follows:

```typescript
try {
  const todos = await todoAPI.getTodos(userId)
} catch (err: any) {
  console.error('Failed to fetch todos:', err.message)
  // Handle error appropriately
}
```

## Authentication

All operations are automatically scoped to the authenticated user via Supabase Row-Level Security (RLS) policies. Users can only access their own todos.

## Rate Limiting

Supabase has rate limiting on the free tier. For production use, consider upgrading to a paid plan.
