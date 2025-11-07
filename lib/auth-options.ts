import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { prisma } from '@/lib/prisma';
import { comparePassword } from '@/lib/auth';

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await comparePassword(password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle OAuth sign-in (Google)
      if (account?.provider === 'google') {
        try {
          // Check if user already exists
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          if (existingUser) {
            // User exists - update their info if needed
            await prisma.user.update({
              where: { email: user.email! },
              data: {
                name: user.name || existingUser.name,
                image: user.image || existingUser.image,
              },
            });
            // Attach the existing user's role to the user object
            user.id = existingUser.id;
            user.role = existingUser.role;
          } else {
            // Create new user with USER role by default
            const newUser = await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name || 'Google User',
                image: user.image,
                role: 'USER',
                password: null, // OAuth users don't have passwords
              },
            });
            user.id = newUser.id;
            user.role = newUser.role;
          }

          return true;
        } catch (error) {
          console.error('Error during Google sign-in:', error);
          return false;
        }
      }

      // For credentials provider, just allow sign-in
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.image = user.image;
      }
      
      // Handle session update (when user updates profile)
      if (trigger === 'update' && session) {
        token.name = session.user.name;
        token.image = session.user.image;
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.image = token.image as string | null;
      }
      return session;
    },
  },
};
