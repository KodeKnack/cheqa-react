'use client'

import { useState } from 'react'
import { Calendar } from 'lucide-react'

interface DateRangePickerProps {
  onDateRangeChange: (startDate: string, endDate: string) => void
}

// This component allows users to select a date range using predefined presets or a custom range
export default function DateRangePicker({ onDateRangeChange }: DateRangePickerProps) {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [showCustom, setShowCustom] = useState(false)

  const handlePresetChange = (preset: string) => {
    const today = new Date()
    let start = ''
    let end = today.toISOString().split('T')[0]

    switch (preset) {
      case '7days': {
        const startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
        start = startDate.toISOString().split('T')[0]
        break
      }
      case '30days': {
        const startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
        start = startDate.toISOString().split('T')[0]
        break
      }
      case '90days': {
        const startDate = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000)
        start = startDate.toISOString().split('T')[0]
        break
      }
      case '1year': {
        const startDate = new Date(today)
        startDate.setFullYear(startDate.getFullYear() - 1)
        start = startDate.toISOString().split('T')[0]
        break
      }
      case '2years': {
        const startDate = new Date(today)
        startDate.setFullYear(startDate.getFullYear() - 2)
        start = startDate.toISOString().split('T')[0]
        break
      }
      case 'custom':
        setShowCustom(true)
        return
      case 'all':
        start = ''
        end = ''
        break
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
        className="w-full px-4 py-3 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
      >
        <option value="all">All Time</option>
        <option value="7days">Last 7 Days</option>
        <option value="30days">Last 30 Days</option>
        <option value="90days">Last 90 Days</option>
        <option value="1year">Last 1 Year</option>
        <option value="2years">Last 2 Years</option>
        <option value="custom">Custom Range</option>
      </select>
      {showCustom && (
        <div className="flex items-center space-x-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
          <span className="text-gray-600 dark:text-gray-400">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
