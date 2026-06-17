import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { supabaseAdmin } from '@/lib/supabase'

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        const adminEmail = process.env.ADMIN_EMAIL
        const adminPassword = process.env.ADMIN_PASSWORD

        const isValid =
          credentials?.email === adminEmail &&
          credentials?.password === adminPassword

        if (!isValid) {
          try {
                const headers = request?.headers
            const ipAddress = headers?.get('x-forwarded-for')?.split(',')[0]?.trim()
              || headers?.get('x-real-ip')
              || null

            await supabaseAdmin.from('auth_failures').insert({
              attempted_email: credentials?.email || null,
              ip_address: ipAddress,
              user_agent: headers?.get('user-agent') || null,
              error_message: 'Invalid credentials',
            })
          } catch {
            // Logging failure must not prevent auth flow
          }
          return null
        }

        return {
          id: "1",
          email: adminEmail,
          name: "Admin",
          role: "admin",
        }
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isAdminPage = nextUrl.pathname.startsWith('/admin/dashboard')
      if (isAdminPage && !isLoggedIn) return false
      return true
    },
    jwt({ token, user }) {
      if (user) token.role = (user as { role?: string }).role
      return token
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = token.role as string
      }
      return session
    },
  },
  session: { strategy: "jwt" },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production" ? "__Secure-next-auth.session-token" : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
      },
    },
  },
})
