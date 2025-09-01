'use client'

import { useState, useEffect } from 'react'
// import { useSession } from 'next-auth/react'
import { ChevronLeft, ChevronRight, Plus, Settings } from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths } from 'date-fns'
import { CalendarEvent } from '@/components/calendar-event'
import { CalendarSettings } from '@/components/calendar-settings'

interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  color: string
  calendarName: string
}

export function CalendarView() {
  // const { data: session } = useSession()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [showSettings, setShowSettings] = useState(false)
  const [calendars, setCalendars] = useState<unknown[]>([])

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Mock events for now - will be replaced with real Google Calendar integration
  useEffect(() => {
    const mockEvents: CalendarEvent[] = [
      {
        id: '1',
        title: 'Doctor Appointment',
        start: new Date(2024, 0, 15, 10, 0),
        end: new Date(2024, 0, 15, 11, 0),
        color: '#3b82f6',
        calendarName: 'John Doe'
      },
      {
        id: '2',
        title: 'Soccer Practice',
        start: new Date(2024, 0, 16, 16, 0),
        end: new Date(2024, 0, 16, 17, 30),
        color: '#10b981',
        calendarName: 'Jane Doe'
      },
      {
        id: '3',
        title: 'Family Dinner',
        start: new Date(2024, 0, 20, 18, 0),
        end: new Date(2024, 0, 20, 20, 0),
        color: '#f59e0b',
        calendarName: 'Family'
      }
    ]
    setEvents(mockEvents)
  }, [])

  const getEventsForDay = (day: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start)
      return eventDate.toDateString() === day.toDateString()
    })
  }

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {format(currentDate, 'MMMM yyyy')}
            </h1>
            <div className="flex space-x-1">
              <button
                onClick={prevMonth}
                className="p-2 hover:bg-gray-100 rounded-md"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-gray-100 rounded-md"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowSettings(true)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </button>
            <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Plus className="h-4 w-4 mr-2" />
              Add Calendar
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {/* Day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="bg-gray-50 px-3 py-2 text-sm font-medium text-gray-500 text-center">
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {daysInMonth.map((day) => {
            const dayEvents = getEventsForDay(day)
            return (
              <div
                key={day.toISOString()}
                className={`bg-white min-h-[120px] p-2 ${
                  !isSameMonth(day, currentDate) ? 'text-gray-400' : ''
                } ${isToday(day) ? 'bg-blue-50' : ''}`}
              >
                <div className={`text-sm font-medium mb-1 ${
                  isToday(day) ? 'text-blue-600' : 'text-gray-900'
                }`}>
                  {format(day, 'd')}
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event) => (
                    <CalendarEvent key={event.id} event={event} />
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {showSettings && (
        <CalendarSettings
          onClose={() => setShowSettings(false)}
          calendars={calendars}
          onCalendarsChange={setCalendars}
        />
      )}
    </div>
  )
}
