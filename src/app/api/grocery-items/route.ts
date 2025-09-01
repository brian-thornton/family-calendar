import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { groceryListId, name, quantity } = await request.json()

    if (!groceryListId || !name) {
      return NextResponse.json({ error: 'Grocery list ID and name are required' }, { status: 400 })
    }

    // Verify the grocery list belongs to the user's family
    const groceryList = await db.groceryList.findFirst({
      where: {
        id: groceryListId,
        family: {
          members: {
            some: { id: session.user.id }
          }
        }
      }
    })

    if (!groceryList) {
      return NextResponse.json({ error: 'Grocery list not found' }, { status: 404 })
    }

    // Create new grocery item
    const groceryItem = await db.groceryItem.create({
      data: {
        groceryListId,
        userId: session.user.id,
        name,
        quantity
      },
      include: { user: true }
    })

    return NextResponse.json({ groceryItem })
  } catch (error) {
    console.error('Error creating grocery item:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, isCompleted } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 })
    }

    // Verify the grocery item belongs to the user's family
    const groceryItem = await db.groceryItem.findFirst({
      where: {
        id,
        groceryList: {
          family: {
            members: {
              some: { id: session.user.id }
            }
          }
        }
      }
    })

    if (!groceryItem) {
      return NextResponse.json({ error: 'Grocery item not found' }, { status: 404 })
    }

    // Update grocery item
    const updatedItem = await db.groceryItem.update({
      where: { id },
      data: { isCompleted },
      include: { user: true }
    })

    return NextResponse.json({ groceryItem: updatedItem })
  } catch (error) {
    console.error('Error updating grocery item:', error)
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
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 })
    }

    // Verify the grocery item belongs to the user's family
    const groceryItem = await db.groceryItem.findFirst({
      where: {
        id,
        groceryList: {
          family: {
            members: {
              some: { id: session.user.id }
            }
          }
        }
      }
    })

    if (!groceryItem) {
      return NextResponse.json({ error: 'Grocery item not found' }, { status: 404 })
    }

    // Delete grocery item
    await db.groceryItem.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting grocery item:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
