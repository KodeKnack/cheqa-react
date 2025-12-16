import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUser } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const paymentMethods = await prisma.paymentMethod.findMany({
      orderBy: {
        name: 'asc'
      }
    })
    return NextResponse.json(paymentMethods)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch payment methods' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name } = await request.json()
    const paymentMethod = await prisma.paymentMethod.create({
      data: { name }
    })
    return NextResponse.json(paymentMethod, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create payment method' }, { status: 500 })
  }
}