'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard, Briefcase, Users, Wrench,
  Settings, LogOut, Menu, X, ExternalLink,
  BarChart3, Tags, Mail, Quote
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/dashboard/projects', label: 'Projects', icon: Briefcase },
  { href: '/admin/dashboard/team', label: 'Team Members', icon: Users },
  { href: '/admin/dashboard/services', label: 'Services', icon: Wrench },
  { href: '/admin/dashboard/testimonials', label: 'Testimonials', icon: Quote },
  { href: '/admin/dashboard/contacts', label: 'Contact Requests', icon: Mail },
  { href: '/admin/dashboard/options', label: 'Form Options', icon: Tags },
  { href: '/admin/dashboard/settings', label: 'Site Settings', icon: Settings },
]

interface SidebarContentProps {
  pathname: string
  setMobileOpen: (open: boolean) => void
  handleSignOut: () => void
}

function SidebarContent({ pathname, setMobileOpen, handleSignOut }: SidebarContentProps) {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo.jpeg" alt="Precision Pro's Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="font-display font-semibold text-base text-slate-900 leading-none block">Precision Pro&apos;s</span>
            <span className="font-mono text-[9px] text-slate-400 tracking-[0.2em] uppercase">Admin Portal</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-150',
                active
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              )}
            >
              <item.icon size={17} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-slate-200 space-y-1">
        <a href="/" target="_blank" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors">
          <ExternalLink size={17} /> View Website
        </a>
        <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors">
          <LogOut size={17} /> Sign Out
        </button>
      </div>
    </div>
  )
}

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push('/admin/login')
  }

  return (
    <>
      <div className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 border-r border-slate-200 bg-white z-40 flex-col shadow-sm">
        <SidebarContent pathname={pathname} setMobileOpen={setMobileOpen} handleSignOut={handleSignOut} />
      </div>
      <button onClick={() => setMobileOpen(true)} className="fixed top-4 left-4 z-40 lg:hidden p-2 rounded-xl bg-white border border-slate-200 shadow-md">
        <Menu size={20} className="text-slate-700" />
      </button>
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-slate-900/10 backdrop-blur-xs z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
          <div className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-200 z-50 lg:hidden flex flex-col shadow-lg">
            <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-100"><X size={18} /></button>
            <SidebarContent pathname={pathname} setMobileOpen={setMobileOpen} handleSignOut={handleSignOut} />
          </div>
        </>
      )}
    </>
  )
}
