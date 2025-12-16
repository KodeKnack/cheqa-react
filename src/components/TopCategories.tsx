'use client'

import { TrendingUp } from 'lucide-react'

interface TopCategoriesProps {
  expenses: any[]
  categories: any[]
}

export default function TopCategories({ expenses, categories }: TopCategoriesProps) {
  // Calculate top spending categories
  const categoryStats = categories.map(category => {
    const categoryExpenses = expenses.filter(expense => expense.categoryId === category.id)
    const total = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    
    return {
      id: category.id,
      name: category.name,
      total,
      count: categoryExpenses.length,
      avgExpense: categoryExpenses.length > 0 ? total / categoryExpenses.length : 0
    }
  })
  .filter(cat => cat.total > 0)
  .sort((a, b) => b.total - a.total)
  .slice(0, 5) // Top 5 categories

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(amount).replace('ZAR', 'R')
  }

  if (categoryStats.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Top Categories
        </h3>
        <div className="text-center text-gray-500 py-8">
          No expenses to display
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
        <TrendingUp className="h-5 w-5 mr-2" />
        Top Categories
      </h3>
      <div className="space-y-4">
        {categoryStats.map((category, index) => (
          <div key={category.id} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{category.name}</p>
                <p className="text-xs text-gray-500">{category.count} expenses</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{formatCurrency(category.total)}</p>
              <p className="text-xs text-gray-500">Avg: {formatCurrency(category.avgExpense)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}