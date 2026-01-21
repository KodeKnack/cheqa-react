import NextAuth, { type NextAuthOptions, getServerSession } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

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

export async function getUser() {
  const session = await getServerSession(authOptions)
  const sessionUser = session?.user as { id?: string; email?: string } | undefined

  if (sessionUser?.id || sessionUser?.email) {
    return prisma.user.findUnique({
      where: sessionUser.id ? { id: sessionUser.id } : { email: sessionUser.email as string }
    })
  }

  return null
}
