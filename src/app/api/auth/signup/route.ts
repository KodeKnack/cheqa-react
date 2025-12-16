import { NextRequest, NextResponse } from 'next/server'
<<<<<<< HEAD
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
=======
import { signUp } from '@/lib/auth'
import { cookies } from 'next/headers'
>>>>>>> dev

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()
    
<<<<<<< HEAD
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
=======
    const result = await signUp(email, password, name)
    
    const cookieStore = await cookies()
    cookieStore.set('auth-token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })
    
    return NextResponse.json({ user: { id: result.user.id, email: result.user.email, name: result.user.name } })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal server error' }, { status: 400 })
>>>>>>> dev
  }
}