'use client'

import React, { useState } from 'react'
import { Todo, CreateTodoInput, UpdateTodoInput, Folder } from '@/types'

interface TodoFormProps {
  initialTodo?: Todo
  onSubmit: (data: CreateTodoInput | UpdateTodoInput) => Promise<void> | void
  onCancel: () => void
  isLoading?: boolean
  folders?: Folder[]
}

export const TodoForm: React.FC<TodoFormProps> = ({
  initialTodo,
  onSubmit,
  onCancel,
  isLoading = false,
  folders = [],
}) => {
  const [formData, setFormData] = useState({
    title: initialTodo?.title || '',
    description: initialTodo?.description || '',
    due_date: initialTodo?.due_date || '',
    folder_id: initialTodo?.folder_id || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      alert('Title is required')
      return
    }
    await onSubmit({
      title: formData.title,
      description: formData.description || undefined,
      due_date: formData.due_date || undefined,
      folder_id: formData.folder_id || undefined,
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
    >
      <h2 className="text-xl font-bold mb-4">
        {initialTodo ? 'Edit Task' : 'New Task'}
      </h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Title *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter todo title"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Enter description (optional)"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Due Date & Time (optional)
        </label>
        <input
          type="datetime-local"
          value={formData.due_date}
          onChange={(e) =>
            setFormData({ ...formData, due_date: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category (optional)
        </label>
        <select
          value={formData.folder_id}
          onChange={(e) =>
            setFormData({ ...formData, folder_id: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">No Category</option>
          {folders.map((folder) => (
            <option key={folder.id} value={folder.id}>
              {folder.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : initialTodo ? 'Update' : 'Save'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
