import NextAuth, { type NextAuthOptions, getServerSession } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { prisma } from './prisma'

type AuthUser = {
  id: string
  email: string
  name: string | null
}

type AuthResult = {
  user: AuthUser
  token: string
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        })

        if (!user || !user.password) return null

        const isValid = await bcrypt.compare(credentials.password as string, user.password)
        if (!isValid) return null

        return { id: user.id, email: user.email, name: user.name }
      }
    })
  ],
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/signin'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        ;(token as typeof token & { id?: string }).id = user.id
      }
      return token
    },
    async session({ session, token }) {
      const tokenId = (token as { id?: string }).id
      if (session.user && tokenId) {
        ;(session.user as typeof session.user & { id: string }).id = tokenId
      }
      return session
    }
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

export async function signIn(email: string, password: string): Promise<AuthResult> {
  if (!email || !password) {
    throw new Error('Email and password are required')
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !user.password) {
    throw new Error('Invalid credentials')
  }

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) {
    throw new Error('Invalid credentials')
  }

  const jwtSecret = process.env.JWT_SECRET
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not set')
  }

  const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, { expiresIn: '7d' })
  return { user: { id: user.id, email: user.email, name: user.name }, token }
}

export async function signUp(email: string, password: string, name?: string): Promise<AuthResult> {
  if (!email || !password) {
    throw new Error('Email and password are required')
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    throw new Error('User already exists')
  }

  const hashedPassword = await bcrypt.hash(password, 12)
  const user = await prisma.user.create({
    data: { email, password: hashedPassword, name }
  })

  const jwtSecret = process.env.JWT_SECRET
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not set')
  }

  const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, { expiresIn: '7d' })
  return { user: { id: user.id, email: user.email, name: user.name }, token }
}

export async function getUser() {
  const session = await getServerSession(authOptions)
  const sessionUser = session?.user as { id?: string; email?: string } | undefined

  if (sessionUser?.id || sessionUser?.email) {
    return prisma.user.findUnique({
      where: sessionUser.id ? { id: sessionUser.id } : { email: sessionUser.email as string }
    })
  }

  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value
  if (!token) return null

  const jwtSecret = process.env.JWT_SECRET
  if (!jwtSecret) return null

  try {
    const payload = jwt.verify(token, jwtSecret) as { id?: string }
    if (!payload.id) return null
    return prisma.user.findUnique({ where: { id: payload.id } })
  } catch {
    return null
  }
}
