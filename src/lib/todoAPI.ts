import { getSupabaseClient } from '@/lib/supabaseClient'
import { Todo, CreateTodoInput, UpdateTodoInput } from '@/types'

export const todoAPI = {
  async getTodos(userId: string): Promise<Todo[]> {
    const supabase = getSupabaseClient()
    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      // merge server todos with any local todos (local first)
      if (typeof window !== 'undefined') {
        const raw = window.localStorage.getItem(`local_todos_${userId}`)
        const local: Todo[] = raw ? JSON.parse(raw) : []
        return [...local, ...(data || [])]
      }
      return data || []
    } catch (err) {
      // fallback to localStorage only
      if (typeof window !== 'undefined') {
        const raw = window.localStorage.getItem(`local_todos_${userId}`)
        return raw ? JSON.parse(raw) : []
      }
      throw err
    }
  },

  async createTodo(userId: string, input: CreateTodoInput): Promise<Todo> {
    const supabase = getSupabaseClient()
    try {
      const { data, error } = await supabase
        .from('todos')
        .insert({
          ...input,
          user_id: userId,
          completed: false,
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (err: any) {
      // fallback: persist locally when RLS blocks or network fails
      if (typeof window !== 'undefined') {
        const todo: Todo = {
          id: `local-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
          title: input.title,
          description: input.description || undefined,
          completed: false,
          due_date: input.due_date || undefined,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_id: userId,
        }
        const key = `local_todos_${userId}`
        const raw = window.localStorage.getItem(key)
        const arr: Todo[] = raw ? JSON.parse(raw) : []
        arr.unshift(todo)
        window.localStorage.setItem(key, JSON.stringify(arr))
        return todo
      }
      throw err
    }
  },

  async updateTodo(todoId: string, input: UpdateTodoInput): Promise<Todo> {
    const supabase = getSupabaseClient()
    try {
      const { data, error } = await supabase
        .from('todos')
        .update(input)
        .eq('id', todoId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (err: any) {
      // local fallback
      if (typeof window !== 'undefined') {
        const keys = Object.keys(window.localStorage).filter((k) => k.startsWith('local_todos_'))
        for (const key of keys) {
          const raw = window.localStorage.getItem(key)
          if (!raw) continue
          const arr: Todo[] = JSON.parse(raw)
          const idx = arr.findIndex((t) => t.id === todoId)
          if (idx !== -1) {
            const updated = { ...arr[idx], ...input, updated_at: new Date().toISOString() }
            arr[idx] = updated
            window.localStorage.setItem(key, JSON.stringify(arr))
            return updated
          }
        }
      }
      throw err
    }
  },

  async deleteTodo(todoId: string): Promise<void> {
    const supabase = getSupabaseClient()
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', todoId)

      if (error) throw error
      return
    } catch (err: any) {
      // local fallback
      if (typeof window !== 'undefined') {
        const keys = Object.keys(window.localStorage).filter((k) => k.startsWith('local_todos_'))
        for (const key of keys) {
          const raw = window.localStorage.getItem(key)
          if (!raw) continue
          const arr: Todo[] = JSON.parse(raw)
          const filtered = arr.filter((t) => t.id !== todoId)
          if (filtered.length !== arr.length) {
            window.localStorage.setItem(key, JSON.stringify(filtered))
            return
          }
        }
      }
      throw err
    }
  },

  async toggleTodo(todoId: string, completed: boolean): Promise<Todo> {
    const supabase = getSupabaseClient()
    try {
      const { data, error } = await supabase
        .from('todos')
        .update({ completed })
        .eq('id', todoId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (err: any) {
      // local fallback
      if (typeof window !== 'undefined') {
        const keys = Object.keys(window.localStorage).filter((k) => k.startsWith('local_todos_'))
        for (const key of keys) {
          const raw = window.localStorage.getItem(key)
          if (!raw) continue
          const arr: Todo[] = JSON.parse(raw)
          const idx = arr.findIndex((t) => t.id === todoId)
          if (idx !== -1) {
            arr[idx] = { ...arr[idx], completed, updated_at: new Date().toISOString() }
            window.localStorage.setItem(key, JSON.stringify(arr))
            return arr[idx]
          }
        }
      }
      throw err
    }
  },
}
