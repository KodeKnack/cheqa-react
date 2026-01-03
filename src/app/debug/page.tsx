'use client'

import { useState, useEffect } from 'react'

export default function DebugPage() {
  const [data, setData] = useState({ categories: [], paymentMethods: [], expenses: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesRes, paymentMethodsRes, expensesRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/payment-methods'),
          fetch('/api/expenses')
        ])

        console.log('Response status:', {
          categories: categoriesRes.status,
          paymentMethods: paymentMethodsRes.status,
          expenses: expensesRes.status
        })

        if (categoriesRes.ok && paymentMethodsRes.ok && expensesRes.ok) {
          const [categories, paymentMethods, expenses] = await Promise.all([
            categoriesRes.json(),
            paymentMethodsRes.json(),
            expensesRes.json()
          ])
          setData({ categories, paymentMethods, expenses })
        } else {
          const errors = []
          if (!categoriesRes.ok) errors.push(`Categories: ${await categoriesRes.text()}`)
          if (!paymentMethodsRes.ok) errors.push(`Payment Methods: ${await paymentMethodsRes.text()}`)
          if (!expensesRes.ok) errors.push(`Expenses: ${await expensesRes.text()}`)
          setError(errors.join(', '))
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Debug Data</h1>
      
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Categories ({data.categories.length})</h2>
        <pre className="bg-gray-100 p-2 rounded text-sm">
          {JSON.stringify(data.categories, null, 2)}
        </pre>
      </div>
      
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Payment Methods ({data.paymentMethods.length})</h2>
        <pre className="bg-gray-100 p-2 rounded text-sm">
          {JSON.stringify(data.paymentMethods, null, 2)}
        </pre>
      </div>
      
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Expenses ({data.expenses.length})</h2>
        <pre className="bg-gray-100 p-2 rounded text-sm">
          {JSON.stringify(data.expenses, null, 2)}
        </pre>
      </div>
    </div>
  )
}