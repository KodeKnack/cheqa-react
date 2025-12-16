import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key')

export async function createToken(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(secret)
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch {
    return null
  }
}

export async function getUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value
  
  if (!token) return null
  
  const payload = await verifyToken(token)
  if (!payload) return null
  
  return await prisma.user.findUnique({
    where: { id: payload.userId as string }
  })
}

export async function signIn(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } })
  
  if (!user || !user.password) return null
  
  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) return null
  
  const token = await createToken({ userId: user.id })
  return { user, token }
}

export async function signUp(email: string, password: string, name?: string) {
  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists) throw new Error('User already exists')
  
  const hashedPassword = await bcrypt.hash(password, 12)
  const user = await prisma.user.create({
    data: { email, password: hashedPassword, name }
  })
  
  const token = await createToken({ userId: user.id })
  return { user, token }
}