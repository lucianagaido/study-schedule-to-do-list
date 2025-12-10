'use client'

import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { todoAPI } from '@/lib/todoAPI'
import { Todo, CreateTodoInput, UpdateTodoInput } from '@/types'
import { TodoItem } from '@/components/TodoItem'
import { TodoForm } from '@/components/TodoForm'

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [formLoading, setFormLoading] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setUser(session?.user || null)

        if (session?.user) {
          await fetchTodos(session.user.id)
        }
      } catch (err) {
        console.error('Auth error:', err)
        setError('Failed to load user session')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null)
      if (session?.user) {
        await fetchTodos(session.user.id)
      } else {
        setTodos([])
      }
    })

    return () => subscription?.unsubscribe()
  }, [])

  const fetchTodos = async (userId: string) => {
    try {
      setLoading(true)
      const data = await todoAPI.getTodos(userId)
      setTodos(data)
      setError(null)
    } catch (err: any) {
      console.error('Error fetching todos:', err)
      setError(err.message || 'Failed to load todos')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTodo = async (input: CreateTodoInput | UpdateTodoInput) => {
    if (!user) return

    try {
      setFormLoading(true)
      const newTodo = await todoAPI.createTodo(user.id, input as CreateTodoInput)
      setTodos([newTodo, ...todos])
      setShowForm(false)
      setError(null)
    } catch (err: any) {
      console.error('Error creating todo:', err)
      setError(err.message || 'Failed to create todo')
    } finally {
      setFormLoading(false)
    }
  }

  const handleUpdateTodo = async (input: CreateTodoInput | UpdateTodoInput) => {
    if (!editingTodo) return

    try {
      setFormLoading(true)
      const updated = await todoAPI.updateTodo(editingTodo.id, input as UpdateTodoInput)
      setTodos(todos.map((t) => (t.id === updated.id ? updated : t)))
      setEditingTodo(null)
      setShowForm(false)
      setError(null)
    } catch (err: any) {
      console.error('Error updating todo:', err)
      setError(err.message || 'Failed to update todo')
    } finally {
      setFormLoading(false)
    }
  }

  const handleToggleTodo = async (id: string, completed: boolean) => {
    try {
      const updated = await todoAPI.toggleTodo(id, completed)
      setTodos(todos.map((t) => (t.id === updated.id ? updated : t)))
      setError(null)
    } catch (err: any) {
      console.error('Error toggling todo:', err)
      setError(err.message || 'Failed to update todo')
    }
  }

  const handleDeleteTodo = async (id: string) => {
    if (!confirm('Are you sure you want to delete this todo?')) return

    try {
      await todoAPI.deleteTodo(id)
      setTodos(todos.filter((t) => t.id !== id))
      setError(null)
    } catch (err: any) {
      console.error('Error deleting todo:', err)
      setError(err.message || 'Failed to delete todo')
    }
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setTodos([])
    } catch (err) {
      console.error('Error signing out:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            📝 Todo List App
          </h1>
          <p className="text-gray-600 mb-8">
            Sign in to manage your tasks and schedule
          </p>
          <button
            onClick={() => {
              // Redirect to auth page or show auth UI
              window.location.href = '/auth'
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Sign In / Sign Up
          </button>
        </div>
      </div>
    )
  }

  const completedCount = todos.filter((t) => t.completed).length
  const pendingCount = todos.filter((t) => !t.completed).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">📝 My Todos</h1>
            <p className="text-gray-600 mt-2">
              {user?.email && `Welcome, ${user.email}`}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Sign Out
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Pending</p>
            <p className="text-3xl font-bold text-blue-600">{pendingCount}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Completed</p>
            <p className="text-3xl font-bold text-green-600">{completedCount}</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="mb-8">
            <TodoForm
              initialTodo={editingTodo || undefined}
              onSubmit={editingTodo ? handleUpdateTodo : handleCreateTodo}
              onCancel={() => {
                setShowForm(false)
                setEditingTodo(null)
              }}
              isLoading={formLoading}
            />
          </div>
        )}

        {/* New Todo Button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="mb-8 w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Add New Todo
          </button>
        )}

        {/* Todos List */}
        <div className="space-y-3">
          {todos.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-500 text-lg">
                No todos yet. Create one to get started!
              </p>
            </div>
          ) : (
            <>
              {/* Pending Todos */}
              {pendingCount > 0 && (
                <>
                  <h2 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                    Pending ({pendingCount})
                  </h2>
                  {todos
                    .filter((t) => !t.completed)
                    .map((todo) => (
                      <TodoItem
                        key={todo.id}
                        todo={todo}
                        onToggle={handleToggleTodo}
                        onDelete={handleDeleteTodo}
                        onEdit={(todo) => {
                          setEditingTodo(todo)
                          setShowForm(true)
                        }}
                      />
                    ))}
                </>
              )}

              {/* Completed Todos */}
              {completedCount > 0 && (
                <>
                  <h2 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                    Completed ({completedCount})
                  </h2>
                  {todos
                    .filter((t) => t.completed)
                    .map((todo) => (
                      <TodoItem
                        key={todo.id}
                        todo={todo}
                        onToggle={handleToggleTodo}
                        onDelete={handleDeleteTodo}
                        onEdit={(todo) => {
                          setEditingTodo(todo)
                          setShowForm(true)
                        }}
                      />
                    ))}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
