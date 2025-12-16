import { NextRequest, NextResponse } from 'next/server'
import { signIn } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    const result = await signIn(email, password)
    if (!result) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }
    
    const cookieStore = await cookies()
    cookieStore.set('auth-token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })
    
    return NextResponse.json({ user: { id: result.user.id, email: result.user.email, name: result.user.name } })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}