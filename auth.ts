import NextAuth from "next-auth"
import { PrismaClient } from '@prisma/client'
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
    }
  }
  
  interface User {
    id: string
    email: string
    name: string
    role: string
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      id: 'credentials',
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
      
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.adminUser.findUnique({
          where: { email: credentials.email as string }
        })

        if (!user) {
          return null
        }

     
        const passwordsMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!passwordsMatch) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      }
    }),
  ],
  callbacks: {
    async session({ session, token }) {
    
      if (token && session) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.role = token.role as string
      }
      return session
    },
    async jwt({ token, user }) {
      
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.role = user.role
      }
      return token
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: '/auth/signin',
  },
})
