'use client'

import { useSession } from 'next-auth/react'
import { Navigation } from '@/components/navigation'
import { GroceryListsView } from '@/components/grocery-lists-view'
import { SignInPrompt } from '@/components/sign-in-prompt'

export default function GroceryPage() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!session) {
    return <SignInPrompt />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <GroceryListsView />
      </main>
    </div>
  )
}
