import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

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

    // Get all chores for the family
    const chores = await db.chore.findMany({
      where: { familyId: user.family.id },
      include: { assignedTo: true },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ chores })
  } catch (error) {
    console.error('Error fetching chores:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, description, assignedToId, dueDate } = await request.json()

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    // Get user's family
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: { family: true }
    })

    if (!user?.family) {
      return NextResponse.json({ error: 'User not in a family' }, { status: 400 })
    }

    // Verify assigned user is in the same family
    if (assignedToId) {
      const assignedUser = await db.user.findFirst({
        where: {
          id: assignedToId,
          familyId: user.family.id
        }
      })

      if (!assignedUser) {
        return NextResponse.json({ error: 'Assigned user not in family' }, { status: 400 })
      }
    }

    // Create new chore
    const chore = await db.chore.create({
      data: {
        familyId: user.family.id,
        title,
        description,
        assignedToId,
        dueDate: dueDate ? new Date(dueDate) : undefined
      },
      include: { assignedTo: true }
    })

    return NextResponse.json({ chore })
  } catch (error) {
    console.error('Error creating chore:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, title, description, assignedToId, dueDate, isCompleted } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Chore ID is required' }, { status: 400 })
    }

    // Get user's family
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: { family: true }
    })

    if (!user?.family) {
      return NextResponse.json({ error: 'User not in a family' }, { status: 400 })
    }

    // Verify the chore belongs to the user's family
    const existingChore = await db.chore.findFirst({
      where: {
        id,
        familyId: user.family.id
      }
    })

    if (!existingChore) {
      return NextResponse.json({ error: 'Chore not found' }, { status: 404 })
    }

    // Verify assigned user is in the same family
    if (assignedToId) {
      const assignedUser = await db.user.findFirst({
        where: {
          id: assignedToId,
          familyId: user.family.id
        }
      })

      if (!assignedUser) {
        return NextResponse.json({ error: 'Assigned user not in family' }, { status: 400 })
      }
    }

    // Update chore
    const chore = await db.chore.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(assignedToId !== undefined && { assignedToId }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
        ...(isCompleted !== undefined && { isCompleted })
      },
      include: { assignedTo: true }
    })

    return NextResponse.json({ chore })
  } catch (error) {
    console.error('Error updating chore:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Chore ID is required' }, { status: 400 })
    }

    // Get user's family
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: { family: true }
    })

    if (!user?.family) {
      return NextResponse.json({ error: 'User not in a family' }, { status: 400 })
    }

    // Verify the chore belongs to the user's family
    const chore = await db.chore.findFirst({
      where: {
        id,
        familyId: user.family.id
      }
    })

    if (!chore) {
      return NextResponse.json({ error: 'Chore not found' }, { status: 404 })
    }

    // Delete chore
    await db.chore.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting chore:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
