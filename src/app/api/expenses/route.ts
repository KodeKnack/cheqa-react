import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const expenses = await db.expense.findMany({
      include: {
        category: true,
        paymentMethod: true,
      },
      orderBy: {
        expenseDate: 'desc'
      }
    })
    return NextResponse.json(expenses)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { description, amount, categoryId, paymentMethodId, expenseDate } = body

    const expense = await db.expense.create({
      data: {
        description,
        amount: parseFloat(amount),
        categoryId,
        paymentMethodId,
        expenseDate: new Date(expenseDate),
        userId: 'temp-user-id' // TODO: Get from auth session
      },
      include: {
        category: true,
        paymentMethod: true,
      }
    })

    return NextResponse.json(expense, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 })
  }
}