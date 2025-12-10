export interface Todo {
  id: string
  title: string
  description?: string
  completed: boolean
  due_date?: string
  created_at: string
  updated_at: string
  user_id: string
}

export interface CreateTodoInput {
  title: string
  description?: string
  due_date?: string
}

export interface UpdateTodoInput {
  title?: string
  description?: string
  completed?: boolean
  due_date?: string
}
