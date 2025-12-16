'use client'

import { Download } from 'lucide-react'
import { useStore } from '@/lib/store'

export default function ExportButton() {
  const { expenses, categories, paymentMethods } = useStore()

  const exportToCSV = () => {
    const headers = ['Date', 'Description', 'Amount', 'Category', 'Payment Method']
    
    const csvData = expenses.map(expense => {
      const category = categories.find(c => c.id === expense.categoryId)?.name || 'Unknown'
      const paymentMethod = paymentMethods.find(p => p.id === expense.paymentMethodId)?.name || 'Unknown'
      
      return [
        expense.expenseDate,
        expense.description,
        `R ${expense.amount.toFixed(2)}`,
        category,
        paymentMethod
      ]
    })

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', `cheqa-expenses-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <button
      onClick={exportToCSV}
      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      <Download className="h-4 w-4 mr-2" />
      Export CSV
    </button>
  )
}