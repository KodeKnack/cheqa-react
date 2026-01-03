import { create } from 'zustand'

export interface Expense {
  id: string
  description: string
  amount: number
  categoryId: string
  paymentMethodId: string
  expenseDate: string
  createdAt: string
}

export interface Category {
  id: string
  name: string
}

export interface PaymentMethod {
  id: string
  name: string
}

interface Store {
  expenses: Expense[]
  categories: Category[]
  paymentMethods: PaymentMethod[]
  
  loadData: () => Promise<void>
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => Promise<void>
  updateExpense: (id: string, expense: Partial<Expense>) => Promise<void>
  deleteExpense: (id: string) => Promise<void>
  
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>
  deleteCategory: (id: string) => Promise<void>
  
  addPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => Promise<void>
  updatePaymentMethod: (id: string, method: Partial<PaymentMethod>) => Promise<void>
  deletePaymentMethod: (id: string) => Promise<void>
}

export const useStore = create<Store>((set, get) => ({
  expenses: [],
  categories: [],
  paymentMethods: [],

  loadData: async () => {
    try {
      console.log('Loading data...')
      const [expensesRes, categoriesRes, paymentMethodsRes] = await Promise.all([
        fetch('/api/expenses'),
        fetch('/api/categories'),
        fetch('/api/payment-methods')
      ])
      
      console.log('API responses:', {
        expenses: expensesRes.status,
        categories: categoriesRes.status,
        paymentMethods: paymentMethodsRes.status
      })
      
      if (expensesRes.ok && categoriesRes.ok && paymentMethodsRes.ok) {
        const [expenses, categories, paymentMethods] = await Promise.all([
          expensesRes.json(),
          categoriesRes.json(),
          paymentMethodsRes.json()
        ])
        
        console.log('Loaded data:', { expenses: expenses.length, categories: categories.length, paymentMethods: paymentMethods.length })
        set({ expenses, categories, paymentMethods })
      } else {
        console.error('Failed to load some data:', {
          expenses: !expensesRes.ok ? await expensesRes.text() : 'OK',
          categories: !categoriesRes.ok ? await categoriesRes.text() : 'OK',
          paymentMethods: !paymentMethodsRes.ok ? await paymentMethodsRes.text() : 'OK'
        })
      }
    } catch (error) {
      console.error('Failed to load data:', error)
    }
  },

  addExpense: async (expense) => {
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expense)
      })
      
      if (res.ok) {
        const newExpense = await res.json()
        set((state) => ({ expenses: [...state.expenses, newExpense] }))
      }
    } catch (error) {
      console.error('Failed to add expense:', error)
    }
  },

  updateExpense: async (id, expense) => {
    try {
      const res = await fetch(`/api/expenses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expense)
      })
      
      if (res.ok) {
        const updatedExpense = await res.json()
        set((state) => ({
          expenses: state.expenses.map(e => e.id === id ? updatedExpense : e)
        }))
      }
    } catch (error) {
      console.error('Failed to update expense:', error)
    }
  },

  deleteExpense: async (id) => {
    try {
      const res = await fetch(`/api/expenses/${id}`, { method: 'DELETE' })
      
      if (res.ok) {
        set((state) => ({ expenses: state.expenses.filter(e => e.id !== id) }))
      }
    } catch (error) {
      console.error('Failed to delete expense:', error)
    }
  },

  addCategory: async (category) => {
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category)
      })
      
      if (res.ok) {
        const newCategory = await res.json()
        set((state) => ({ categories: [...state.categories, newCategory] }))
      }
    } catch (error) {
      console.error('Failed to add category:', error)
    }
  },

  updateCategory: async (id, category) => {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category)
      })
      
      if (res.ok) {
        const updatedCategory = await res.json()
        set((state) => ({
          categories: state.categories.map(c => c.id === id ? updatedCategory : c)
        }))
      }
    } catch (error) {
      console.error('Failed to update category:', error)
    }
  },

  deleteCategory: async (id) => {
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' })
      
      if (res.ok) {
        set((state) => ({ categories: state.categories.filter(c => c.id !== id) }))
      }
    } catch (error) {
      console.error('Failed to delete category:', error)
    }
  },

  addPaymentMethod: async (method) => {
    try {
      const res = await fetch('/api/payment-methods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(method)
      })
      
      if (res.ok) {
        const newMethod = await res.json()
        set((state) => ({ paymentMethods: [...state.paymentMethods, newMethod] }))
      }
    } catch (error) {
      console.error('Failed to add payment method:', error)
    }
  },

  updatePaymentMethod: async (id, method) => {
    try {
      const res = await fetch(`/api/payment-methods/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(method)
      })
      
      if (res.ok) {
        const updatedMethod = await res.json()
        set((state) => ({
          paymentMethods: state.paymentMethods.map(m => m.id === id ? updatedMethod : m)
        }))
      }
    } catch (error) {
      console.error('Failed to update payment method:', error)
    }
  },

  deletePaymentMethod: async (id) => {
    try {
      const res = await fetch(`/api/payment-methods/${id}`, { method: 'DELETE' })
      
      if (res.ok) {
        set((state) => ({ paymentMethods: state.paymentMethods.filter(m => m.id !== id) }))
      }
    } catch (error) {
      console.error('Failed to delete payment method:', error)
    }
  }
}))