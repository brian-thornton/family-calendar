'use client'

import { useState, useEffect } from 'react'
import { Plus, ShoppingCart, Check, X, Trash2 } from 'lucide-react'

interface GroceryList {
  id: string
  name: string
  items: GroceryItem[]
  createdAt: Date
}

interface GroceryItem {
  id: string
  name: string
  quantity?: string
  isCompleted: boolean
  addedBy: string
  createdAt: Date
}

export function GroceryListsView() {
  const [lists, setLists] = useState<GroceryList[]>([])
  const [selectedList, setSelectedList] = useState<GroceryList | null>(null)
  const [showAddList, setShowAddList] = useState(false)
  const [showAddItem, setShowAddItem] = useState(false)
  const [newListName, setNewListName] = useState('')
  const [newItem, setNewItem] = useState({ name: '', quantity: '' })

  // Mock data for now
  useEffect(() => {
    const mockLists: GroceryList[] = [
      {
        id: '1',
        name: 'Weekly Groceries',
        createdAt: new Date(),
        items: [
          {
            id: '1',
            name: 'Milk',
            quantity: '1 gallon',
            isCompleted: false,
            addedBy: 'John Doe',
            createdAt: new Date()
          },
          {
            id: '2',
            name: 'Bread',
            quantity: '2 loaves',
            isCompleted: true,
            addedBy: 'Jane Doe',
            createdAt: new Date()
          },
          {
            id: '3',
            name: 'Eggs',
            quantity: '1 dozen',
            isCompleted: false,
            addedBy: 'John Doe',
            createdAt: new Date()
          }
        ]
      },
      {
        id: '2',
        name: 'Party Supplies',
        createdAt: new Date(),
        items: [
          {
            id: '4',
            name: 'Chips',
            quantity: '3 bags',
            isCompleted: false,
            addedBy: 'Jane Doe',
            createdAt: new Date()
          }
        ]
      }
    ]
    setLists(mockLists)
    if (mockLists.length > 0) {
      setSelectedList(mockLists[0])
    }
  }, [])

  const handleAddList = () => {
    if (newListName.trim()) {
      const newList: GroceryList = {
        id: Date.now().toString(),
        name: newListName,
        items: [],
        createdAt: new Date()
      }
      setLists([...lists, newList])
      setNewListName('')
      setShowAddList(false)
    }
  }

  const handleAddItem = () => {
    if (newItem.name.trim() && selectedList) {
      const newGroceryItem: GroceryItem = {
        id: Date.now().toString(),
        name: newItem.name,
        quantity: newItem.quantity || undefined,
        isCompleted: false,
        addedBy: 'Current User', // This would come from session
        createdAt: new Date()
      }
      
      const updatedList = {
        ...selectedList,
        items: [...selectedList.items, newGroceryItem]
      }
      
      setLists(lists.map(list => 
        list.id === selectedList.id ? updatedList : list
      ))
      setSelectedList(updatedList)
      setNewItem({ name: '', quantity: '' })
      setShowAddItem(false)
    }
  }

  const handleToggleItem = (itemId: string) => {
    if (!selectedList) return
    
    const updatedList = {
      ...selectedList,
      items: selectedList.items.map(item =>
        item.id === itemId ? { ...item, isCompleted: !item.isCompleted } : item
      )
    }
    
    setLists(lists.map(list => 
      list.id === selectedList.id ? updatedList : list
    ))
    setSelectedList(updatedList)
  }

  const handleDeleteItem = (itemId: string) => {
    if (!selectedList) return
    
    const updatedList = {
      ...selectedList,
      items: selectedList.items.filter(item => item.id !== itemId)
    }
    
    setLists(lists.map(list => 
      list.id === selectedList.id ? updatedList : list
    ))
    setSelectedList(updatedList)
  }

  const handleDeleteList = (listId: string) => {
    setLists(lists.filter(list => list.id !== listId))
    if (selectedList?.id === listId) {
      setSelectedList(lists.length > 1 ? lists.find(list => list.id !== listId) || null : null)
    }
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <ShoppingCart className="h-6 w-6 mr-2" />
            Grocery Lists
          </h1>
          <button
            onClick={() => setShowAddList(true)}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            New List
          </button>
        </div>
      </div>

      <div className="flex h-96">
        {/* Lists Sidebar */}
        <div className="w-1/3 border-r border-gray-200">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Lists</h3>
            <div className="space-y-2">
              {lists.map((list) => (
                <div
                  key={list.id}
                  className={`p-3 rounded-lg cursor-pointer border ${
                    selectedList?.id === list.id
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedList(list)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{list.name}</div>
                      <div className="text-xs text-gray-500">
                        {list.items.length} items
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteList(list.id)
                      }}
                      className="text-red-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 p-4">
          {selectedList ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedList.name}
                </h3>
                <button
                  onClick={() => setShowAddItem(true)}
                  className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-blue-600 bg-blue-100 hover:bg-blue-200"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Item
                </button>
              </div>

              <div className="space-y-2">
                {selectedList.items.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center p-3 rounded-lg border ${
                      item.isCompleted
                        ? 'bg-green-50 border-green-200'
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <button
                      onClick={() => handleToggleItem(item.id)}
                      className={`mr-3 p-1 rounded ${
                        item.isCompleted
                          ? 'bg-green-500 text-white'
                          : 'border border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {item.isCompleted && <Check className="h-3 w-3" />}
                    </button>
                    <div className="flex-1">
                      <div className={`font-medium text-sm ${
                        item.isCompleted ? 'line-through text-gray-500' : 'text-gray-900'
                      }`}>
                        {item.name}
                      </div>
                      {item.quantity && (
                        <div className="text-xs text-gray-500">
                          {item.quantity}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-red-400 hover:text-red-600 ml-2"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {selectedList.items.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No items in this list yet.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Select a list to view items
            </div>
          )}
        </div>
      </div>

      {/* Add List Modal */}
      {showAddList && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">New Grocery List</h3>
              <button
                onClick={() => setShowAddList(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  List Name
                </label>
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="e.g., Weekly Groceries"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleAddList}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-700"
                >
                  Create List
                </button>
                <button
                  onClick={() => setShowAddList(false)}
                  className="flex-1 bg-gray-300 text-gray-700 px-3 py-2 rounded-md text-sm hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {showAddItem && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Add Item</h3>
              <button
                onClick={() => setShowAddItem(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name
                </label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="e.g., Milk"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity (optional)
                </label>
                <input
                  type="text"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="e.g., 1 gallon"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleAddItem}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-700"
                >
                  Add Item
                </button>
                <button
                  onClick={() => setShowAddItem(false)}
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
