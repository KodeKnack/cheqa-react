import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUser } from '@/lib/auth'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { description, amount, categoryId, paymentMethodId, expenseDate } = body

    const expense = await prisma.expense.update({
      where: { 
        id,
        userId: user.id // Ensure user can only update their own expenses
      },
      data: {
        description,
        amount: parseFloat(amount),
        categoryId,
        paymentMethodId,
        expenseDate: new Date(expenseDate)
      },
      include: {
        category: true,
        paymentMethod: true
      }
    })

    return NextResponse.json(expense)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update expense' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    await prisma.expense.delete({
      where: { 
        id,
        userId: user.id // Ensure user can only delete their own expenses
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete expense' }, { status: 500 })
  }
}