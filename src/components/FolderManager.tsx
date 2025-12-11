'use client'

import React, { useState } from 'react'
import { Folder, CreateFolderInput } from '@/types'

interface FolderManagerProps {
  folders: Folder[]
  onCreateFolder: (input: CreateFolderInput) => Promise<void>
  onUpdateFolder: (folderId: string, input: Partial<Folder>) => Promise<void>
  onDeleteFolder: (folderId: string) => Promise<void>
  isLoading?: boolean
}

const PRESET_COLORS = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#FFA07A', // Light Salmon
  '#98D8C8', // Mint
  '#F7DC6F', // Yellow
  '#BB8FCE', // Purple
  '#85C1E2', // Sky Blue
  '#F8B88B', // Peach
  '#76D7C4', // Turquoise
]

export const FolderManager: React.FC<FolderManagerProps> = ({
  folders,
  onCreateFolder,
  onUpdateFolder,
  onDeleteFolder,
  isLoading = false,
}) => {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', color: PRESET_COLORS[0] })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      alert('Folder name is required')
      return
    }

    setSubmitting(true)
    try {
      if (editingId) {
        await onUpdateFolder(editingId, formData)
        setEditingId(null)
      } else {
        await onCreateFolder(formData as CreateFolderInput)
      }
      setFormData({ name: '', color: PRESET_COLORS[0] })
      setShowForm(false)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (folderId: string) => {
    if (!confirm('Delete this folder? Tasks will not be deleted.')) return
    try {
      await onDeleteFolder(folderId)
    } catch (err) {
      console.error('Error deleting folder:', err)
    }
  }

  const handleQuickEdit = (folder: Folder) => {
    setEditingFolder(folder)
    setFormData({ name: folder.name, color: folder.color })
    setEditingId(folder.id)
    setShowForm(true)
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">📁 Study Categories</h2>
        <button
          onClick={() => {
            setShowForm(true)
            setEditingId(null)
            setFormData({ name: '', color: PRESET_COLORS[0] })
          }}
          className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
        >
          + Add Category
        </button>
      </div>

      {/* Folder Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
        >
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Math, Physics, Biology"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
            <div className="flex gap-2 flex-wrap">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    formData.color === color ? 'border-gray-800 scale-110' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-3 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {submitting ? 'Saving...' : editingId ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false)
                setEditingId(null)
              }}
              className="px-3 py-2 text-sm bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Folders List */}
      {folders.length === 0 ? (
        <p className="text-gray-500 text-sm">No categories yet. Create one to organize your tasks!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {folders.map((folder) => (
            <div
              key={folder.id}
              className="p-3 rounded-lg border border-gray-200 flex items-center justify-between hover:shadow-md transition-shadow"
              style={{ backgroundColor: folder.color + '15', borderColor: folder.color }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: folder.color }}
                />
                <span className="font-medium text-gray-900 text-sm">{folder.name}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleQuickEdit(folder)}
                  className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(folder.id)}
                  className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
