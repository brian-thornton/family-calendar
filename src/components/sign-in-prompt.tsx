'use client'

import { signIn } from 'next-auth/react'
import { Calendar, Users, ShoppingCart, CheckSquare } from 'lucide-react'

export function SignInPrompt() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Calendar className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Family Calendar & Planning
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Organize your family&apos;s schedule, groceries, and chores in one place
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Features
              </h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-blue-500 mr-3" />
                  <span className="text-sm text-gray-700">
                    Sync multiple Google Calendars
                  </span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-sm text-gray-700">
                    Multi-family support
                  </span>
                </div>
                <div className="flex items-center">
                  <ShoppingCart className="h-5 w-5 text-orange-500 mr-3" />
                  <span className="text-sm text-gray-700">
                    Shared grocery lists
                  </span>
                </div>
                <div className="flex items-center">
                  <CheckSquare className="h-5 w-5 text-purple-500 mr-3" />
                  <span className="text-sm text-gray-700">
                    Chore management
                  </span>
                </div>
              </div>
            </div>

            <div>
              <button
                onClick={() => signIn('google')}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign in with Google
              </button>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                By signing in, you agree to our terms of service and privacy policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
