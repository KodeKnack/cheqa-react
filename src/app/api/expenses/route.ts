import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUser } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const expenses = await prisma.expense.findMany({
      where: { userId: user.id },
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
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { description, amount, categoryId, paymentMethodId, expenseDate } = body

    const expense = await prisma.expense.create({
      data: {
        description,
        amount: parseFloat(amount),
        categoryId,
        paymentMethodId,
        expenseDate: new Date(expenseDate),
        userId: user.id
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