import { NextRequest, NextResponse } from 'next/server'
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

    // Get user's family
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: { family: true }
    })

    if (!user?.family) {
      return NextResponse.json({ error: 'User not in a family' }, { status: 400 })
    }

    // Get all calendars for the family
    const calendars = await db.calendar.findMany({
      where: { familyId: user.family.id },
      include: { user: true }
    })

    return NextResponse.json({ calendars })
  } catch (error) {
    console.error('Error fetching calendars:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { googleCalendarId, name, color } = await request.json()

    if (!googleCalendarId || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get user's family
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: { family: true }
    })

    if (!user?.family) {
      return NextResponse.json({ error: 'User not in a family' }, { status: 400 })
    }

    // Check if calendar already exists in family
    const existingCalendar = await db.calendar.findUnique({
      where: {
        familyId_googleCalendarId: {
          familyId: user.family.id,
          googleCalendarId
        }
      }
    })

    if (existingCalendar) {
      return NextResponse.json({ error: 'Calendar already added to family' }, { status: 400 })
    }

    // Create new calendar
    const calendar = await db.calendar.create({
      data: {
        familyId: user.family.id,
        userId: session.user.id,
        googleCalendarId,
        name,
        color: color || '#3b82f6'
      },
      include: { user: true }
    })

    return NextResponse.json({ calendar })
  } catch (error) {
    console.error('Error creating calendar:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
