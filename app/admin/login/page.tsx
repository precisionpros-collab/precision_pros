'use client'

import { useState, useRef, useCallback } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Loader2, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { ThemeProvider } from 'next-themes'
import { SecurityShield } from '@/components/admin/SecurityShield'

export default function AdminLogin() {
  const router = useRouter()
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  // Use useState only for email (non-sensitive)
  const [email, setEmail] = useState('')
  // Use useRef for password to prevent exposure in React DevTools state
  const passwordRef = useRef<HTMLInputElement>(null)

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Read password directly from DOM ref (never stored in React state)
    const password = passwordRef.current?.value || ''

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      // Clear password from DOM immediately after submission
      if (passwordRef.current) {
        passwordRef.current.value = ''
      }

      if (res?.ok) {
        // Set session flag for AdminSessionGuard
        sessionStorage.setItem('pp_admin_active', Date.now().toString())
        router.push('/admin/dashboard')
      } else {
        toast.error('Invalid credentials.')
      }
    } catch {
      toast.error('Something went wrong.')
      // Clear password on error too
      if (passwordRef.current) {
        passwordRef.current.value = ''
      }
    } finally {
      setLoading(false)
    }
  }, [email, router])

  return (
    <ThemeProvider attribute="class" forcedTheme="light" enableSystem={false}>
      <SecurityShield />
      <div className="admin-portal min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,rgba(245,158,11,0.08),transparent)]" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="relative w-full max-w-md mx-6">
          <div className="p-8 rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/50">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-50 border border-sky-200 mb-4">
                <Lock size={22} className="text-sky-600" />
              </div>
              <h1 className="font-display text-2xl font-semibold text-slate-900 mb-1">Admin Access</h1>
              <p className="text-sm text-slate-500">Precision Pro&apos;s Control Panel</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
              <div>
                <label className="block font-mono text-[11px] text-slate-500 tracking-widest uppercase mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="off"
                  data-lpignore="true"
                  data-sensitive="true"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
                />
              </div>
              <div>
                <label className="block font-mono text-[11px] text-slate-500 tracking-widest uppercase mb-2">Password</label>
                <div className="relative">
                  <input
                    ref={passwordRef}
                    type={show ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    data-lpignore="true"
                    data-sensitive="true"
                    className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
                  />
                  <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400">
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-sky-500 text-white font-medium rounded-xl hover:bg-sky-600 transition-all disabled:opacity-60 mt-2">
                {loading ? <><Loader2 size={16} className="animate-spin" /> Authenticating...</> : 'Access Dashboard'}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </ThemeProvider>
  )
}
