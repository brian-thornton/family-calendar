'use client'

import { useState, useEffect } from 'react'
import { Plus, CheckSquare, Check, X, Edit2, Trash2, Calendar, User } from 'lucide-react'
import { format } from 'date-fns'

interface Chore {
  id: string
  title: string
  description?: string
  assignedTo?: string
  assignedToName?: string
  dueDate?: Date
  isCompleted: boolean
  createdAt: Date
}

interface FamilyMember {
  id: string
  name: string
  email: string
}

export function ChoresView() {
  const [chores, setChores] = useState<Chore[]>([])
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([])
  const [showAddChore, setShowAddChore] = useState(false)
  const [editingChore, setEditingChore] = useState<Chore | null>(null)
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all')
  const [newChore, setNewChore] = useState({
    title: '',
    description: '',
    assignedTo: '',
    dueDate: ''
  })

  // Mock data for now
  useEffect(() => {
    const mockChores: Chore[] = [
      {
        id: '1',
        title: 'Take out trash',
        description: 'Take out all trash bins to the curb',
        assignedTo: '1',
        assignedToName: 'John Doe',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        isCompleted: false,
        createdAt: new Date()
      },
      {
        id: '2',
        title: 'Vacuum living room',
        description: 'Vacuum the living room carpet',
        assignedTo: '2',
        assignedToName: 'Jane Doe',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
        isCompleted: true,
        createdAt: new Date()
      },
      {
        id: '3',
        title: 'Wash dishes',
        description: 'Wash all dishes in the sink',
        isCompleted: false,
        createdAt: new Date()
      }
    ]

    const mockMembers: FamilyMember[] = [
      { id: '1', name: 'John Doe', email: 'john@example.com' },
      { id: '2', name: 'Jane Doe', email: 'jane@example.com' },
      { id: '3', name: 'Kids', email: 'kids@example.com' }
    ]

    setChores(mockChores)
    setFamilyMembers(mockMembers)
  }, [])

  const filteredChores = chores.filter(chore => {
    if (filter === 'completed') return chore.isCompleted
    if (filter === 'pending') return !chore.isCompleted
    return true
  })

  const handleAddChore = () => {
    if (newChore.title.trim()) {
      const chore: Chore = {
        id: Date.now().toString(),
        title: newChore.title,
        description: newChore.description || undefined,
        assignedTo: newChore.assignedTo || undefined,
        assignedToName: newChore.assignedTo ? 
          familyMembers.find(m => m.id === newChore.assignedTo)?.name : undefined,
        dueDate: newChore.dueDate ? new Date(newChore.dueDate) : undefined,
        isCompleted: false,
        createdAt: new Date()
      }
      setChores([...chores, chore])
      setNewChore({ title: '', description: '', assignedTo: '', dueDate: '' })
      setShowAddChore(false)
    }
  }

  const handleEditChore = () => {
    if (editingChore && newChore.title.trim()) {
      const updatedChore = {
        ...editingChore,
        title: newChore.title,
        description: newChore.description || undefined,
        assignedTo: newChore.assignedTo || undefined,
        assignedToName: newChore.assignedTo ? 
          familyMembers.find(m => m.id === newChore.assignedTo)?.name : undefined,
        dueDate: newChore.dueDate ? new Date(newChore.dueDate) : undefined,
      }
      setChores(chores.map(chore => 
        chore.id === editingChore.id ? updatedChore : chore
      ))
      setEditingChore(null)
      setNewChore({ title: '', description: '', assignedTo: '', dueDate: '' })
    }
  }

  const handleToggleChore = (choreId: string) => {
    setChores(chores.map(chore =>
      chore.id === choreId ? { ...chore, isCompleted: !chore.isCompleted } : chore
    ))
  }

  const handleDeleteChore = (choreId: string) => {
    setChores(chores.filter(chore => chore.id !== choreId))
  }

  const startEditChore = (chore: Chore) => {
    setEditingChore(chore)
    setNewChore({
      title: chore.title,
      description: chore.description || '',
      assignedTo: chore.assignedTo || '',
      dueDate: chore.dueDate ? format(chore.dueDate, 'yyyy-MM-dd') : ''
    })
    setShowAddChore(true)
  }

  const getOverdueChores = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return chores.filter(chore => 
      !chore.isCompleted && 
      chore.dueDate && 
      chore.dueDate < today
    ).length
  }

  const getDueTodayChores = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    return chores.filter(chore => 
      !chore.isCompleted && 
      chore.dueDate && 
      chore.dueDate >= today && 
      chore.dueDate < tomorrow
    ).length
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <CheckSquare className="h-6 w-6 mr-2" />
            Chores
          </h1>
          <button
            onClick={() => {
              setEditingChore(null)
              setNewChore({ title: '', description: '', assignedTo: '', dueDate: '' })
              setShowAddChore(true)
            }}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Chore
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{chores.length}</div>
            <div className="text-sm text-gray-500">Total Chores</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{getOverdueChores()}</div>
            <div className="text-sm text-gray-500">Overdue</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{getDueTodayChores()}</div>
            <div className="text-sm text-gray-500">Due Today</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {chores.filter(c => c.isCompleted).length}
            </div>
            <div className="text-sm text-gray-500">Completed</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex space-x-4">
          {(['all', 'pending', 'completed'] as const).map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                filter === filterType
                  ? 'bg-blue-100 text-blue-800'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Chores List */}
      <div className="p-6">
        <div className="space-y-4">
          {filteredChores.map((chore) => (
            <div
              key={chore.id}
              className={`p-4 rounded-lg border ${
                chore.isCompleted
                  ? 'bg-green-50 border-green-200'
                  : chore.dueDate && chore.dueDate < new Date() && !chore.isCompleted
                  ? 'bg-red-50 border-red-200'
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => handleToggleChore(chore.id)}
                    className={`mt-1 p-1 rounded ${
                      chore.isCompleted
                        ? 'bg-green-500 text-white'
                        : 'border border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {chore.isCompleted && <Check className="h-3 w-3" />}
                  </button>
                  <div className="flex-1">
                    <h3 className={`font-medium ${
                      chore.isCompleted ? 'line-through text-gray-500' : 'text-gray-900'
                    }`}>
                      {chore.title}
                    </h3>
                    {chore.description && (
                      <p className={`text-sm mt-1 ${
                        chore.isCompleted ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {chore.description}
                      </p>
                    )}
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      {chore.assignedToName && (
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {chore.assignedToName}
                        </div>
                      )}
                      {chore.dueDate && (
                        <div className={`flex items-center ${
                          chore.dueDate < new Date() && !chore.isCompleted
                            ? 'text-red-600'
                            : ''
                        }`}>
                          <Calendar className="h-3 w-3 mr-1" />
                          {format(chore.dueDate, 'MMM d, yyyy')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => startEditChore(chore)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteChore(chore.id)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredChores.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No chores found for the selected filter.
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Chore Modal */}
      {showAddChore && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingChore ? 'Edit Chore' : 'New Chore'}
              </h3>
              <button
                onClick={() => {
                  setShowAddChore(false)
                  setEditingChore(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={newChore.title}
                  onChange={(e) => setNewChore({ ...newChore, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="e.g., Take out trash"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newChore.description}
                  onChange={(e) => setNewChore({ ...newChore, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  rows={3}
                  placeholder="Optional description..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assign to
                </label>
                <select
                  value={newChore.assignedTo}
                  onChange={(e) => setNewChore({ ...newChore, assignedTo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">Unassigned</option>
                  {familyMembers.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={newChore.dueDate}
                  onChange={(e) => setNewChore({ ...newChore, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={editingChore ? handleEditChore : handleAddChore}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-700"
                >
                  {editingChore ? 'Update Chore' : 'Add Chore'}
                </button>
                <button
                  onClick={() => {
                    setShowAddChore(false)
                    setEditingChore(null)
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 px-3 py-2 rounded-md text-sm hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
