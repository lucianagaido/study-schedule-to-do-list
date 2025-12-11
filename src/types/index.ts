export interface Folder {
  id: string
  name: string
  color: string
  user_id: string
  created_at: string
  updated_at: string
}

export interface Todo {
  id: string
  title: string
  description?: string
  completed: boolean
  due_date?: string
  folder_id?: string
  created_at: string
  updated_at: string
  user_id: string
}

export interface CreateTodoInput {
  title: string
  description?: string
  due_date?: string
  folder_id?: string
}

export interface UpdateTodoInput {
  title?: string
  description?: string
  completed?: boolean
  due_date?: string
  folder_id?: string
}

export interface CreateFolderInput {
  name: string
  color: string
}

export interface UpdateFolderInput {
  name?: string
  color?: string
}
