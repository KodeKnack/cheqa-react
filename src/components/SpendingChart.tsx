'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

interface SpendingChartProps {
  expenses: any[]
  categories: any[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C']

export default function SpendingChart({ expenses, categories }: SpendingChartProps) {
  // Calculate spending by category
  const categorySpending = categories.map(category => {
    const categoryExpenses = expenses.filter(expense => expense.categoryId === category.id)
    const total = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    
    return {
      name: category.name,
      value: total,
      count: categoryExpenses.length
    }
  }).filter(item => item.value > 0) // Only show categories with spending

  if (categorySpending.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          Spending by Category
        </h3>
        <div className="text-center text-gray-600 dark:text-gray-400 py-8">
          No expenses to display
        </div>
      </div>
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(value).replace('ZAR', 'R')
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white dark:bg-gray-900 p-3 border border-gray-200 dark:border-gray-700 rounded shadow-sm">
          <p className="font-medium text-gray-900 dark:text-gray-100">{data.name}</p>
          <p className="text-blue-600 dark:text-blue-400">{formatCurrency(data.value)}</p>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{data.count} expenses</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
        Spending by Category
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categorySpending}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {categorySpending.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
