import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }
    
    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) return NextResponse.json({ error: 'User exists' }, { status: 400 })
    
    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name }
    })
    
    return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}