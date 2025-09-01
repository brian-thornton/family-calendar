import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { db } from './db'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    session: async ({ session, user }) => {
      if (session?.user) {
        session.user.id = user.id
        // Get user with family information
        const userWithFamily = await db.user.findUnique({
          where: { id: user.id },
          include: { family: true },
        })
        if (userWithFamily) {
          session.user.familyId = userWithFamily.familyId
          session.user.familyName = userWithFamily.family.name
        }
      }
      return session
    },
    signIn: async ({ user, account }) => {
      if (account?.provider === 'google') {
        // Check if user exists and has a family
        const existingUser = await db.user.findUnique({
          where: { email: user.email! },
          include: { family: true },
        })

        if (!existingUser) {
          // Create a new family for the user
          const family = await db.family.create({
            data: {
              name: `${user.name}'s Family`,
            },
          })

          // Update user with family ID
          await db.user.update({
            where: { email: user.email! },
            data: { familyId: family.id },
          })
        }
      }
      return true
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'database',
  },
}
