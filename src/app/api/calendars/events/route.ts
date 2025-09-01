import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
// import { GoogleCalendarService } from '@/lib/google-calendar'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // const { searchParams } = new URL(request.url)
    // const timeMin = searchParams.get('timeMin')
    // const timeMax = searchParams.get('timeMax')

    // Get user's family
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: { family: true }
    })

    if (!user?.family) {
      return NextResponse.json({ error: 'User not in a family' }, { status: 400 })
    }

    // Get all visible calendars for the family
    // const calendars = await db.calendar.findMany({
    //   where: { 
    //     familyId: user.family.id,
    //     isVisible: true
    //   },
    //   include: { user: true }
    // })

    // For now, return mock events since we need proper Google OAuth setup
    // In a real implementation, you would:
    // 1. Get the user's Google access token from the session
    // 2. Use GoogleCalendarService to fetch real events
    // 3. Transform and return the events

    const mockEvents = [
      {
        id: '1',
        title: 'Doctor Appointment',
        start: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        end: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
        color: '#3b82f6',
        calendarName: 'John Doe',
        calendarId: '1'
      },
      {
        id: '2',
        title: 'Soccer Practice',
        start: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        end: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000),
        color: '#10b981',
        calendarName: 'Jane Doe',
        calendarId: '2'
      },
      {
        id: '3',
        title: 'Family Dinner',
        start: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        end: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
        color: '#f59e0b',
        calendarName: 'Family',
        calendarId: '3'
      }
    ]

    return NextResponse.json({ events: mockEvents })
  } catch (error) {
    console.error('Error fetching calendar events:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
