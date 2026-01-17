'use client'

import {
  eachDayOfInterval,
  eachMonthOfInterval,
  endOfDay,
  format,
  isValid,
  parseISO,
  startOfDay
} from 'date-fns'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useTheme } from '@/contexts/ThemeContext'

interface MonthlyTrendProps {
  expenses: any[]
  dateRange?: {
    startDate: string | null
    endDate: string | null
  }
}

export default function MonthlyTrend({ expenses, dateRange }: MonthlyTrendProps) {
  const { theme } = useTheme()
  const axisColor = theme === 'dark' ? '#cbd5f5' : '#6b7280'
  const gridColor = theme === 'dark' ? '#334155' : '#e5e7eb'
  const accentColor = theme === 'dark' ? '#0A84FF' : '#0071E3'
  const parsedStart = dateRange?.startDate ? parseISO(dateRange.startDate) : null
  const parsedEnd = dateRange?.endDate ? parseISO(dateRange.endDate) : null
  const hasRange = parsedStart && parsedEnd && isValid(parsedStart) && isValid(parsedEnd)

  const expenseDates = expenses
    .map((expense) => new Date(expense.expenseDate))
    .filter((date) => isValid(date))

  const rangeStart = hasRange
    ? startOfDay(parsedStart as Date)
    : expenseDates.length
      ? startOfDay(new Date(Math.min(...expenseDates.map((date) => date.getTime()))))
      : null
  const rangeEnd = hasRange
    ? endOfDay(parsedEnd as Date)
    : expenseDates.length
      ? endOfDay(new Date(Math.max(...expenseDates.map((date) => date.getTime()))))
      : null

  const chartData =
    rangeStart && rangeEnd
      ? (() => {
          const rangeDays = Math.round(
            (rangeEnd.getTime() - rangeStart.getTime()) / (24 * 60 * 60 * 1000)
          )
          const isDaily = rangeDays <= 60
          const buckets = isDaily
            ? eachDayOfInterval({ start: rangeStart, end: rangeEnd }).map((date) => ({
                key: format(date, 'yyyy-MM-dd'),
                label: format(date, 'd MMM')
              }))
            : eachMonthOfInterval({ start: rangeStart, end: rangeEnd }).map((date) => ({
                key: format(date, 'yyyy-MM'),
                label: format(date, 'MMM yyyy')
              }))

          const totals = new Map<string, { total: number; count: number }>()
          expenses.forEach((expense) => {
            const expenseDate = new Date(expense.expenseDate)
            if (!isValid(expenseDate)) return
            const key = isDaily ? format(expenseDate, 'yyyy-MM-dd') : format(expenseDate, 'yyyy-MM')
            const existing = totals.get(key) ?? { total: 0, count: 0 }
            totals.set(key, {
              total: existing.total + expense.amount,
              count: existing.count + 1
            })
          })

          return buckets.map((bucket) => {
            const totalsForKey = totals.get(bucket.key) ?? { total: 0, count: 0 }
            return {
              month: bucket.label,
              amount: parseFloat(totalsForKey.total.toFixed(2)),
              count: totalsForKey.count
            }
          })
        })()
      : []

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
        <div className="bg-white dark:bg-gray-900 p-3 border border-gray-200 dark:border-gray-700 rounded shadow-sm">
          <p className="font-medium text-gray-900 dark:text-gray-100">{label}</p>
          <p className="text-blue-600 dark:text-blue-400">{formatCurrency(data.amount)}</p>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{data.count} expenses</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
        Monthly Spending Trend
      </h3>
      <div className="h-80">
        {expenses.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-gray-600 dark:text-gray-400">
            No data for this period
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: axisColor }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                domain={[0, 'auto']}
                tick={{ fontSize: 12, fill: axisColor }}
                tickFormatter={(value) => `R${Number(value).toLocaleString()}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="amount"
                stroke={accentColor}
                strokeWidth={2}
                dot={{ fill: accentColor, strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
