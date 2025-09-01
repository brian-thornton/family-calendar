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

    // Get all grocery lists for the family
    const groceryLists = await db.groceryList.findMany({
      where: { familyId: user.family.id },
      include: {
        items: {
          include: { user: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ groceryLists })
  } catch (error) {
    console.error('Error fetching grocery lists:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name } = await request.json()

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    // Get user's family
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: { family: true }
    })

    if (!user?.family) {
      return NextResponse.json({ error: 'User not in a family' }, { status: 400 })
    }

    // Create new grocery list
    const groceryList = await db.groceryList.create({
      data: {
        familyId: user.family.id,
        name
      },
      include: {
        items: {
          include: { user: true }
        }
      }
    })

    return NextResponse.json({ groceryList })
  } catch (error) {
    console.error('Error creating grocery list:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
