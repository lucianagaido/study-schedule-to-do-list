import { getSupabaseClient } from '@/lib/supabaseClient'
import { Todo, CreateTodoInput, UpdateTodoInput } from '@/types'

export const todoAPI = {
  async getTodos(userId: string): Promise<Todo[]> {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async createTodo(userId: string, input: CreateTodoInput): Promise<Todo> {
    const supabase = getSupabaseClient()
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
  },

  async updateTodo(todoId: string, input: UpdateTodoInput): Promise<Todo> {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('todos')
      .update(input)
      .eq('id', todoId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteTodo(todoId: string): Promise<void> {
    const supabase = getSupabaseClient()
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', todoId)

    if (error) throw error
  },

  async toggleTodo(todoId: string, completed: boolean): Promise<Todo> {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('todos')
      .update({ completed })
      .eq('id', todoId)
      .select()
      .single()

    if (error) throw error
    return data
  },
}
