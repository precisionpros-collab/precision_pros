import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { ThemeProvider } from 'next-themes'
import { AdminSessionGuard } from '@/components/admin/AdminSessionGuard'
import { SecurityShield } from '@/components/admin/SecurityShield'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  try {
    const session = await auth()
    if (!session) redirect('/admin/login')
  } catch (e) {
    console.error('Auth check failed:', e)
    redirect('/admin/login')
  }

  return (
    <ThemeProvider attribute="class" forcedTheme="light" enableSystem={false}>
      <AdminSessionGuard />
      <SecurityShield />
      <div className="admin-portal light flex min-h-screen bg-slate-50 text-slate-900">
        <AdminSidebar />
        <main className="flex-1 ml-0 lg:ml-64 min-h-screen">
          <div className="p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </ThemeProvider>
  )
}
