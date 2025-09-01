'use client'

import { format } from 'date-fns'

interface CalendarEventProps {
  event: {
    id: string
    title: string
    start: Date
    end: Date
    color: string
    calendarName: string
  }
}

export function CalendarEvent({ event }: CalendarEventProps) {
  return (
    <div
      className="text-xs p-1 rounded truncate cursor-pointer hover:opacity-80"
      style={{ backgroundColor: event.color, color: 'white' }}
      title={`${event.title} - ${event.calendarName}`}
    >
      <div className="font-medium truncate">{event.title}</div>
      <div className="opacity-90 truncate">
        {format(event.start, 'h:mm a')}
      </div>
    </div>
  )
}
