'use client'

import { useState } from 'react'
import { X, Plus, Trash2, Eye, EyeOff } from 'lucide-react'

interface Calendar {
  id: string
  name: string
  color: string
  isVisible: boolean
  googleCalendarId: string
}

interface CalendarSettingsProps {
  onClose: () => void
  calendars: Calendar[]
  onCalendarsChange: (calendars: Calendar[]) => void
}

export function CalendarSettings({ onClose, calendars, onCalendarsChange }: CalendarSettingsProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newCalendar, setNewCalendar] = useState({
    name: '',
    color: '#3b82f6',
    googleCalendarId: ''
  })

  const handleAddCalendar = () => {
    if (newCalendar.name && newCalendar.googleCalendarId) {
      const calendar: Calendar = {
        id: Date.now().toString(),
        name: newCalendar.name,
        color: newCalendar.color,
        isVisible: true,
        googleCalendarId: newCalendar.googleCalendarId
      }
      onCalendarsChange([...calendars, calendar])
      setNewCalendar({ name: '', color: '#3b82f6', googleCalendarId: '' })
      setShowAddForm(false)
    }
  }

  const handleRemoveCalendar = (id: string) => {
    onCalendarsChange(calendars.filter(cal => cal.id !== id))
  }

  const handleToggleVisibility = (id: string) => {
    onCalendarsChange(calendars.map(cal => 
      cal.id === id ? { ...cal, isVisible: !cal.isVisible } : cal
    ))
  }

  const handleColorChange = (id: string, color: string) => {
    onCalendarsChange(calendars.map(cal => 
      cal.id === id ? { ...cal, color } : cal
    ))
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Calendar Settings</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Existing Calendars */}
          {calendars.map((calendar) => (
            <div key={calendar.id} className="flex items-center space-x-3 p-3 border rounded-lg">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: calendar.color }}
              />
              <div className="flex-1">
                <div className="font-medium text-sm">{calendar.name}</div>
                <div className="text-xs text-gray-500">{calendar.googleCalendarId}</div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={calendar.color}
                  onChange={(e) => handleColorChange(calendar.id, e.target.value)}
                  className="w-6 h-6 rounded border-0 cursor-pointer"
                />
                <button
                  onClick={() => handleToggleVisibility(calendar.id)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {calendar.isVisible ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </button>
                <button
                  onClick={() => handleRemoveCalendar(calendar.id)}
                  className="text-red-400 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Add Calendar Form */}
          {showAddForm ? (
            <div className="p-3 border rounded-lg bg-gray-50">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Calendar Name
                  </label>
                  <input
                    type="text"
                    value={newCalendar.name}
                    onChange={(e) => setNewCalendar({ ...newCalendar, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder="e.g., John's Work Calendar"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Google Calendar ID
                  </label>
                  <input
                    type="text"
                    value={newCalendar.googleCalendarId}
                    onChange={(e) => setNewCalendar({ ...newCalendar, googleCalendarId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder="Enter Google Calendar ID"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color
                  </label>
                  <input
                    type="color"
                    value={newCalendar.color}
                    onChange={(e) => setNewCalendar({ ...newCalendar, color: e.target.value })}
                    className="w-full h-10 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleAddCalendar}
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-700"
                  >
                    Add Calendar
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 px-3 py-2 rounded-md text-sm hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full flex items-center justify-center space-x-2 p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600"
            >
              <Plus className="h-4 w-4" />
              <span>Add Google Calendar</span>
            </button>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
