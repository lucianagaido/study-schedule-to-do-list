'use client'

import React, { useState } from 'react'
import { Todo } from '@/types'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string, completed: boolean) => void
  onDelete: (id: string) => void
  onEdit: (todo: Todo) => void
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onDelete,
  onEdit,
}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 flex-1">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={(e) => onToggle(todo.id, e.target.checked)}
          className="w-5 h-5 text-blue-600 rounded cursor-pointer"
        />
        <div className="flex-1">
          <h3
            className={`font-medium ${
              todo.completed
                ? 'line-through text-gray-500'
                : 'text-gray-900'
            }`}
          >
            {todo.title}
          </h3>
          {todo.description && (
            <p className="text-sm text-gray-600">{todo.description}</p>
          )}
          {todo.due_date && (
            <p className="text-xs text-gray-500 mt-1">
              Due: {new Date(todo.due_date).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(todo)}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
