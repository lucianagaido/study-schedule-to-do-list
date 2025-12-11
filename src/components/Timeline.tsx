'use client'

import React from 'react'
import { Todo, Folder } from '@/types'

interface TimelineProps {
  todos: Todo[]
  folders: Folder[]
}

export const Timeline: React.FC<TimelineProps> = ({ todos, folders }) => {
  // Create a map of folder id to folder for quick lookup
  const folderMap = folders.reduce(
    (acc, folder) => {
      acc[folder.id] = folder
      return acc
    },
    {} as Record<string, Folder>
  )
  // Filter todos with due dates and sort by due date
  const todosWithDates = todos
    .filter((t) => t.due_date)
    .sort((a, b) => {
      const dateA = new Date(a.due_date || '').getTime()
      const dateB = new Date(b.due_date || '').getTime()
      return dateA - dateB
    })

  if (todosWithDates.length === 0) {
    return null
  }

  // Get current time and earliest/latest dates
  const now = new Date()
  const dates = todosWithDates.map((t) => new Date(t.due_date || ''))
  const earliestDate = new Date(Math.min(...dates.map((d) => d.getTime())))
  const latestDate = new Date(Math.max(...dates.map((d) => d.getTime())))

  // Calculate position on timeline (0-100%)
  const getPosition = (date: Date) => {
    const range = latestDate.getTime() - earliestDate.getTime()
    if (range === 0) return 50
    const position = ((date.getTime() - earliestDate.getTime()) / range) * 100
    return Math.max(0, Math.min(100, position))
  }

  // Group tasks by date and folder
  const tasksByDateAndFolder = todosWithDates.reduce(
    (acc, todo) => {
      const dateStr = new Date(todo.due_date || '').toLocaleDateString()
      const folderId = todo.folder_id || 'no-folder'
      if (!acc[dateStr]) {
        acc[dateStr] = {}
      }
      if (!acc[dateStr][folderId]) {
        acc[dateStr][folderId] = []
      }
      acc[dateStr][folderId].push(todo)
      return acc
    },
    {} as Record<string, Record<string, Todo[]>>
  )

  const sortedDates = Object.keys(tasksByDateAndFolder).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  )

  return (
    <div className="mt-12 mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">📅 Study Schedule Timeline</h2>

      {/* Timeline Bar */}
      <div className="mb-8">
        <div className="relative h-2 bg-gradient-to-r from-blue-300 to-blue-600 rounded-full overflow-hidden">
          {/* Current time indicator if within range */}
          {now >= earliestDate && now <= latestDate && (
            <div
              className="absolute top-1/2 w-1 h-6 -mt-2 bg-red-500 rounded-full shadow-lg"
              style={{ left: `${getPosition(now)}%` }}
              title="Today"
            />
          )}

          {/* Task indicators */}
          {todosWithDates.map((todo) => (
            <div
              key={todo.id}
              className={`absolute top-1/2 w-4 h-4 -mt-2 rounded-full shadow-md transform -translate-x-1/2 cursor-pointer hover:scale-125 transition-transform ${
                todo.completed ? 'bg-green-500' : 'bg-yellow-400'
              }`}
              style={{ left: `${getPosition(new Date(todo.due_date || ''))}%` }}
              title={`${todo.title} - ${new Date(todo.due_date || '').toLocaleString()}`}
            />
          ))}
        </div>

        {/* Timeline labels */}
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>{earliestDate.toLocaleDateString()}</span>
          <span>{latestDate.toLocaleDateString()}</span>
        </div>
      </div>

      {/* Tasks by Date and Folder */}
      <div className="space-y-4">
        {sortedDates.map((dateStr) => {
          const date = new Date(dateStr)
          const dayFolders = tasksByDateAndFolder[dateStr]
          const isToday = new Date().toLocaleDateString() === dateStr
          const isPast = date < now && !isToday
          const allDayTasks = Object.values(dayFolders).flat()
          const pendingTasks = allDayTasks.filter((t) => !t.completed)
          const completedTasks = allDayTasks.filter((t) => t.completed)

          return (
            <div
              key={dateStr}
              className={`p-4 rounded-lg border-l-4 ${
                isToday
                  ? 'bg-blue-50 border-blue-500'
                  : isPast
                    ? 'bg-gray-50 border-gray-300'
                    : 'bg-white border-indigo-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-semibold text-gray-900">
                  {isToday
                    ? '📌 Today'
                    : isPast
                      ? '✅ Past'
                      : `📅 ${date.toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}`}
                </h3>
                <span className="text-sm text-gray-500">
                  ({pendingTasks.length} pending, {completedTasks.length} done)
                </span>
              </div>

              {/* Tasks grouped by folder */}
              <div className="space-y-3">
                {Object.entries(dayFolders).map(([folderId, tasks]) => {
                  const folder = folderId !== 'no-folder' ? folderMap[folderId] : null
                  const folderColor = folder?.color || '#9CA3AF'

                  return (
                    <div key={folderId} className="ml-2">
                      {folder && (
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: folderColor }}
                          />
                          <span className="text-sm font-medium text-gray-700">{folder.name}</span>
                        </div>
                      )}
                      {!folder && (
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-3 h-3 rounded-full bg-gray-400" />
                          <span className="text-sm font-medium text-gray-600">Free Time / No Category</span>
                        </div>
                      )}
                      <div className="space-y-2">
                        {tasks.map((todo) => (
                          <div
                            key={todo.id}
                            className={`text-sm p-2 rounded border-l-3 ${
                              todo.completed
                                ? 'bg-green-100 text-gray-600 line-through border-green-500'
                                : 'bg-white text-gray-800 border-gray-300'
                            }`}
                            style={
                              !todo.completed && folder
                                ? { borderLeftColor: folderColor, backgroundColor: folderColor + '08' }
                                : {}
                            }
                          >
                            <div className="flex items-center gap-2">
                              <span>{todo.completed ? '✓' : '•'}</span>
                              <span className="flex-1">{todo.title}</span>
                              <span className="text-xs text-gray-500">
                                {new Date(todo.due_date || '').toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Free Time Information */}
      <div className="mt-8 p-4 bg-green-50 border border-green-300 rounded-lg">
        <p className="text-sm text-green-800">
          <span className="font-semibold">💡 Tip:</span> Tasks with dates help you visualize your study
          schedule. The timeline above shows when your tasks are due, so you can plan your free time
          effectively.
        </p>
      </div>
    </div>
  )
}
