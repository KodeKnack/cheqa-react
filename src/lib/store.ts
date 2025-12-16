import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
  
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void
  updateExpense: (id: string, expense: Partial<Expense>) => void
  deleteExpense: (id: string) => void
  
  addCategory: (category: Omit<Category, 'id'>) => void
  updateCategory: (id: string, category: Partial<Category>) => void
  deleteCategory: (id: string) => void
  
  addPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => void
  updatePaymentMethod: (id: string, method: Partial<PaymentMethod>) => void
  deletePaymentMethod: (id: string) => void
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      expenses: [],
      categories: [
        { id: '1', name: 'Food & Dining' },
        { id: '2', name: 'Transportation' },
        { id: '3', name: 'Bills & Utilities' },
        { id: '4', name: 'Entertainment' },
        { id: '5', name: 'Shopping' },
        { id: '6', name: 'Healthcare' },
        { id: '7', name: 'Education' },
        { id: '8', name: 'Travel' }
      ],
      paymentMethods: [
        { id: '1', name: 'Cash' },
        { id: '2', name: 'Credit Card' },
        { id: '3', name: 'Debit Card' },
        { id: '4', name: 'Bank Transfer' },
        { id: '5', name: 'Mobile Payment' },
        { id: '6', name: 'Cheque' }
      ],

      addExpense: (expense) => set((state) => ({
        expenses: [...state.expenses, {
          ...expense,
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        }]
      })),

      updateExpense: (id, expense) => set((state) => ({
        expenses: state.expenses.map(e => e.id === id ? { ...e, ...expense } : e)
      })),

      deleteExpense: (id) => set((state) => ({
        expenses: state.expenses.filter(e => e.id !== id)
      })),

      addCategory: (category) => set((state) => ({
        categories: [...state.categories, {
          ...category,
          id: Date.now().toString()
        }]
      })),

      updateCategory: (id, category) => set((state) => ({
        categories: state.categories.map(c => c.id === id ? { ...c, ...category } : c)
      })),

      deleteCategory: (id) => set((state) => ({
        categories: state.categories.filter(c => c.id !== id)
      })),

      addPaymentMethod: (method) => set((state) => ({
        paymentMethods: [...state.paymentMethods, {
          ...method,
          id: Date.now().toString()
        }]
      })),

      updatePaymentMethod: (id, method) => set((state) => ({
        paymentMethods: state.paymentMethods.map(m => m.id === id ? { ...m, ...method } : m)
      })),

      deletePaymentMethod: (id) => set((state) => ({
        paymentMethods: state.paymentMethods.filter(m => m.id !== id)
      }))
    }),
    {
      name: 'cheqa-storage'
    }
  )
)