import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, color, isVisible } = await request.json()

    // Get user's family
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: { family: true }
    })

    if (!user?.family) {
      return NextResponse.json({ error: 'User not in a family' }, { status: 400 })
    }

    // Update calendar
    const calendar = await db.calendar.update({
      where: {
        id: params.id,
        familyId: user.family.id // Ensure user can only update calendars in their family
      },
      data: {
        ...(name && { name }),
        ...(color && { color }),
        ...(isVisible !== undefined && { isVisible })
      },
      include: { user: true }
    })

    return NextResponse.json({ calendar })
  } catch (error) {
    console.error('Error updating calendar:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Delete calendar
    await db.calendar.delete({
      where: {
        id: params.id,
        familyId: user.family.id // Ensure user can only delete calendars in their family
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting calendar:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
