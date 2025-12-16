import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const paymentMethods = await db.paymentMethod.findMany({
      orderBy: {
        name: 'asc'
      }
    })
    return NextResponse.json(paymentMethods)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch payment methods' }, { status: 500 })
  }
}