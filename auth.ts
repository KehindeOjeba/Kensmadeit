import NextAuth from "next-auth"
import { PrismaClient } from '@prisma/client'
import Credentials from "next-auth/providers/credentials"

const prisma = new PrismaClient()

// Extend the session type to include user data
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
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Add your authorization logic here
        const user = await prisma.adminUser.findUnique({
          where: { email: credentials.email as string }
        })

        if (!user || user.password !== credentials.password) {
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
      // Send properties to the client, like user id and role
      if (token && session) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.role = token.role as string
      }
      return session
    },
    async jwt({ token, user }) {
      // Persist additional data to the token, like user id and role
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
})
