'use client'

import React, { useState } from 'react'
import { Todo, Folder } from '@/types'

interface CalendarProps {
  todos: Todo[]
  folders: Folder[]
  onEditFolder: (folderId: string) => void
}

type CalendarView = 'weekly' | 'monthly'

export const Calendar: React.FC<CalendarProps> = ({ todos, folders, onEditFolder }) => {
  const [view, setView] = useState<CalendarView>('weekly')
  const [currentDate, setCurrentDate] = useState(new Date())

  // Create a map of folder id to folder for quick lookup
  const folderMap = folders.reduce(
    (acc, folder) => {
      acc[folder.id] = folder
      return acc
    },
    {} as Record<string, Folder>
  )

  // Get the start of the week (Monday)
  const getWeekStart = (date: Date) => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1)
    return new Date(d.setDate(diff))
  }

  // Get the start of the month
  const getMonthStart = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1)
  }

  // Get tasks for a specific date
  const getTasksForDate = (date: Date) => {
    const dateStr = date.toLocaleDateString()
    return todos.filter((todo) => {
      if (!todo.due_date) return false
      const todoDate = new Date(todo.due_date).toLocaleDateString()
      return todoDate === dateStr
    })
  }

  // Generate week days
  const getWeekDays = () => {
    const start = getWeekStart(currentDate)
    const days = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(start)
      date.setDate(date.getDate() + i)
      days.push(date)
    }
    return days
  }

  // Generate month days
  const getMonthDays = () => {
    const start = getMonthStart(currentDate)
    const year = start.getFullYear()
    const month = start.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const days = []
    // Add previous month's days to fill the grid
    const firstDayOfWeek = start.getDay()
    const startDate = new Date(start)
    startDate.setDate(startDate.getDate() - (firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1))

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate)
      date.setDate(date.getDate() + i)
      days.push(date)
    }

    return days
  }

  const weekDays = getWeekDays()
  const monthDays = view === 'monthly' ? getMonthDays() : []
  const calendarDays = view === 'weekly' ? weekDays : monthDays

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toLocaleDateString() === today.toLocaleDateString()
  }

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth()
  }

  const handlePrevious = () => {
    const newDate = new Date(currentDate)
    if (view === 'weekly') {
      newDate.setDate(newDate.getDate() - 7)
    } else {
      newDate.setMonth(newDate.getMonth() - 1)
    }
    setCurrentDate(newDate)
  }

  const handleNext = () => {
    const newDate = new Date(currentDate)
    if (view === 'weekly') {
      newDate.setDate(newDate.getDate() + 7)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  const formatDateRange = () => {
    if (view === 'weekly') {
      const start = getWeekStart(currentDate)
      const end = new Date(start)
      end.setDate(end.getDate() + 6)
      return `${start.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
    } else {
      return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    }
  }

  return (
    <div className="mb-12">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">📅 Study Schedule</h2>
            <p className="text-gray-600 text-sm mt-1">{formatDateRange()}</p>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2">
            <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setView('weekly')}
                className={`px-4 py-2 rounded transition-colors ${
                  view === 'weekly'
                    ? 'bg-blue-600 text-white'
                    : 'bg-transparent text-gray-700 hover:text-gray-900'
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setView('monthly')}
                className={`px-4 py-2 rounded transition-colors ${
                  view === 'monthly'
                    ? 'bg-blue-600 text-white'
                    : 'bg-transparent text-gray-700 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
          >
            ← Previous
          </button>
          <button
            onClick={handleToday}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Today
          </button>
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Day Headers */}
        <div
          className={`grid gap-0 border-b border-gray-200 ${
            view === 'weekly' ? 'grid-cols-7' : 'grid-cols-7'
          }`}
        >
          {(view === 'weekly'
            ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
          ).map((day) => (
            <div
              key={day}
              className="px-4 py-3 bg-gray-50 border-r border-gray-200 text-center font-semibold text-gray-700 last:border-r-0"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className={`grid gap-0 ${view === 'weekly' ? 'grid-cols-7' : 'grid-cols-7'}`}>
          {calendarDays.map((date, idx) => {
            const dayTasks = getTasksForDate(date)
            const today = isToday(date)
            const currentMonth = view === 'monthly' ? isCurrentMonth(date) : true

            return (
              <div
                key={idx}
                className={`min-h-24 border-r border-b border-gray-200 p-2 last:border-r-0 ${
                  today ? 'bg-blue-50' : currentMonth ? 'bg-white' : 'bg-gray-50'
                } ${idx % 7 === 6 ? 'border-r-0' : ''}`}
              >
                <div
                  className={`text-sm font-semibold mb-1 ${
                    today
                      ? 'text-blue-600'
                      : currentMonth
                        ? 'text-gray-900'
                        : 'text-gray-400'
                  }`}
                >
                  {date.getDate()}
                </div>

                {/* Tasks for this date */}
                <div className="space-y-1">
                  {dayTasks.slice(0, 3).map((task) => {
                    const folder = task.folder_id ? folderMap[task.folder_id] : null
                    const bgColor = folder ? folder.color + '30' : '#E5E7EB30'
                    const borderColor = folder ? folder.color : '#9CA3AF'

                    return (
                      <div
                        key={task.id}
                        className="text-xs p-1 rounded border-l-2 truncate cursor-pointer hover:opacity-80 transition-opacity"
                        style={{
                          backgroundColor: bgColor,
                          borderLeftColor: borderColor,
                        }}
                        title={task.title}
                      >
                        <span className={task.completed ? 'line-through opacity-60' : ''}>
                          {task.title}
                        </span>
                      </div>
                    )
                  })}

                  {dayTasks.length > 3 && (
                    <div className="text-xs text-gray-500 px-1">+{dayTasks.length - 3} more</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Folder Legend */}
      {folders.length > 0 && (
        <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Categories Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {folders.map((folder) => (
              <button
                key={folder.id}
                onClick={() => onEditFolder(folder.id)}
                className="p-2 rounded border border-gray-200 hover:shadow-md transition-all flex items-center gap-2 group"
                style={{ backgroundColor: folder.color + '15', borderColor: folder.color }}
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: folder.color }}
                />
                <span className="text-xs font-medium text-gray-900 truncate group-hover:opacity-70">
                  {folder.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
