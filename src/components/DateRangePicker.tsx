'use client'

import { useState } from 'react'
import { Calendar } from 'lucide-react'

interface DateRangePickerProps {
  onDateRangeChange: (startDate: string, endDate: string) => void
}

export default function DateRangePicker({ onDateRangeChange }: DateRangePickerProps) {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [showCustom, setShowCustom] = useState(false)

  const handlePresetChange = (preset: string) => {
    const today = new Date()
    let start = ''
    let end = today.toISOString().split('T')[0]

    switch (preset) {
      case 'today':
        start = end
        break
      case 'week':
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
        start = weekAgo.toISOString().split('T')[0]
        break
      case 'month':
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
        start = monthStart.toISOString().split('T')[0]
        break
      case 'year':
        const yearStart = new Date(today.getFullYear(), 0, 1)
        start = yearStart.toISOString().split('T')[0]
        break
      case 'custom':
        setShowCustom(true)
        return
      default:
        start = ''
        end = ''
    }

    setShowCustom(false)
    onDateRangeChange(start, end)
  }

  const handleCustomDateChange = () => {
    if (startDate && endDate) {
      onDateRangeChange(startDate, endDate)
    }
  }

  return (
    <div className="flex items-center space-x-3">
      <select
        onChange={(e) => handlePresetChange(e.target.value)}
        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
      >
        <option value="all">All Time</option>
        <option value="today">Today</option>
        <option value="week">This Week</option>
        <option value="month">This Month</option>
        <option value="year">This Year</option>
        <option value="custom">Custom Range</option>
      </select>

      {showCustom && (
        <div className="flex items-center space-x-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          />
          <span className="text-gray-500">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          />
          <button
            onClick={handleCustomDateChange}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Calendar className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}