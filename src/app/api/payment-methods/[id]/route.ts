import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUser } from '@/lib/auth'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Check if payment method has expenses
    const expenseCount = await prisma.expense.count({
      where: { paymentMethodId: id }
    })

    if (expenseCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete payment method with existing expenses' }, 
        { status: 400 }
      )
    }

    await prisma.paymentMethod.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Payment method deleted successfully' })
  } catch (error) {
    console.error('Delete payment method error:', error)
    return NextResponse.json({ error: 'Failed to delete payment method' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const { name } = await request.json()

    const paymentMethod = await prisma.paymentMethod.update({
      where: { id },
      data: { name }
    })

    return NextResponse.json(paymentMethod)
  } catch (error) {
    console.error('Update payment method error:', error)
    return NextResponse.json({ error: 'Failed to update payment method' }, { status: 500 })
  }
}