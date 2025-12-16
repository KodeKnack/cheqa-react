'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface MonthlyTrendProps {
  expenses: any[]
}

export default function MonthlyTrend({ expenses }: MonthlyTrendProps) {
  // Calculate monthly spending for last 6 months
  const monthlyData = []
  const now = new Date()
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthName = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    
    const monthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.expenseDate)
      return expenseDate.getMonth() === date.getMonth() && 
             expenseDate.getFullYear() === date.getFullYear()
    })
    
    const total = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    
    monthlyData.push({
      month: monthName,
      amount: total,
      count: monthExpenses.length
    })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(value).replace('ZAR', 'R')
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border rounded shadow">
          <p className="font-medium">{label}</p>
          <p className="text-blue-600">{formatCurrency(data.amount)}</p>
          <p className="text-gray-500 text-sm">{data.count} expenses</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Spending Trend</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(value) => `R${value}`} />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="amount" 
              stroke="#2563eb" 
              strokeWidth={2}
              dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}