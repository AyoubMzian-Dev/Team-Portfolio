import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import type { NextAuthOptions } from "next-auth"
import { getServerSession } from "next-auth"

// Mock users database - replace with your actual database
const users = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@devteam.com",
    role: "ADMIN",
    image: null,
  },
  {
    id: "2", 
    name: "Team Member",
    email: "member@devteam.com",
    role: "MEMBER",
    image: null,
  },
  {
    id: "3",
    name: "Viewer User", 
    email: "viewer@devteam.com",
    role: "VIEWER",
    image: null,
  }
]

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        
        const user = users.find(u => u.email === credentials.email)
        if (!user) return null
        
        // For development, accept the demo passwords directly
        const validPasswords = {
          "admin@devteam.com": "admin123",
          "member@devteam.com": "member123", 
          "viewer@devteam.com": "viewer123"
        }
        
        const isValid = validPasswords[user.email as keyof typeof validPasswords] === credentials.password
        
        if (!isValid) return null
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
        }
      }
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      })
    ] : [])
  ],
  
  // 🔥 CRITICAL SESSION CONFIGURATION FOR PERSISTENCE
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 24 * 60 * 60, // 24 hours
  },
  
  // 🔥 CRITICAL JWT CONFIGURATION
  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours
  },
  
  // 🔥 CRITICAL COOKIE CONFIGURATION FOR PERSISTENCE
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' 
        ? '__Secure-next-auth.session-token' 
        : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 // 24 hours
      }
    }
  },
  
  callbacks: {
    async jwt({ token, user, trigger }) {
      // Add user info to token on sign in
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      
      // Handle token refresh
      if (trigger === "update") {
        // You can update token here if needed
      }
      
      return token
    },
    
    async session({ session, token }) {
      // Send properties to the client
      if (token && session.user) {
        session.user.id = token.sub as string
        session.user.role = token.role as string
      }
      return session
    }
  },
  
  pages: {
    signIn: "/admin/auth/signin",
    error: "/admin/auth/error",
  },
  
  // 🔥 ENSURE SECRET IS SET
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development-minimum-32-chars",
  
  // 🔥 ADD DEBUG MODE FOR DEVELOPMENT
  debug: process.env.NODE_ENV === 'development',
}

export default NextAuth(authOptions)

// Server-side auth helper for NextAuth v4
export async function getAuthSession() {
  return await getServerSession(authOptions)
}

// Re-export for compatibility
export { signIn, signOut } from "next-auth/react"
