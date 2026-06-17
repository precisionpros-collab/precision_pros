'use client'

import Link from 'next/link'
import { Briefcase, Users, Wrench, MessageSquare, BarChart3, Bell, ArrowRight } from 'lucide-react'

interface Stats {
  totalServices: number; totalWorks: number; totalTeam: number
  totalContacts: number; newContacts: number; totalViews: number
}

export function DashboardClient({ stats }: { stats: Stats }) {
  const cards = [
    { label: 'Total Projects', value: stats.totalWorks, icon: Briefcase, href: '/admin/dashboard/projects', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Team Members', value: stats.totalTeam, icon: Users, href: '/admin/dashboard/team', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Services', value: stats.totalServices, icon: Wrench, href: '/admin/dashboard/services', color: 'text-sky-600', bg: 'bg-sky-50' },
    { label: 'Page Views', value: stats.totalViews, icon: BarChart3, href: '/admin/dashboard/analytics', color: 'text-violet-600', bg: 'bg-violet-50' },
    { label: 'Contact Requests', value: stats.totalContacts, icon: MessageSquare, href: '/admin/dashboard/contacts', color: 'text-purple-600', bg: 'bg-purple-50' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-slate-900 mb-1">Dashboard</h1>
        <p className="text-slate-500 text-sm">Welcome back — changes you make update the website instantly.</p>
      </div>

      {stats.newContacts > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-sky-200 bg-sky-50 mb-8">
          <Bell size={18} className="text-sky-600 flex-shrink-0" />
          <p className="text-sm text-slate-700">
            <span className="font-bold text-sky-700">{stats.newContacts} new</span> contact request{stats.newContacts > 1 ? 's' : ''} — reply via email manually.
          </p>
          <Link href="/admin/dashboard/contacts" className="ml-auto flex items-center gap-1 text-sm text-sky-700 font-semibold hover:gap-2 transition-all">
            View <ArrowRight size={14} />
          </Link>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 mb-10">
        {cards.map((card) => (
          <div key={card.label}>
            <Link href={card.href} className="block p-6 rounded-2xl border border-slate-200 bg-white hover:border-sky-300 hover:shadow-md transition-all group">
              <div className={`p-2.5 rounded-xl ${card.bg} w-fit mb-4`}><card.icon size={20} className={card.color} /></div>
              <div className="text-3xl font-bold text-slate-900 mb-1">{card.value}</div>
              <div className="text-sm text-slate-500">{card.label}</div>
            </Link>
          </div>
        ))}
      </div>

      <h2 className="font-display text-xl font-semibold text-slate-900 mb-5">Quick Actions</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: 'Add Project', href: '/admin/dashboard/projects', desc: 'Upload image & live demo URL' },
          { label: 'Add Team Member', href: '/admin/dashboard/team', desc: 'Upload photo file' },
          { label: 'Site Analytics', href: '/admin/dashboard/analytics', desc: 'Views, top pages, trends' },
          { label: 'Form Options', href: '/admin/dashboard/options', desc: 'Add categories & service types' },
          { label: 'View Contacts', href: '/admin/dashboard/contacts', desc: 'All message details' },
          { label: 'Site Settings', href: '/admin/dashboard/settings', desc: 'Phones, stats, visibility' },
        ].map(action => (
          <Link key={action.label} href={action.href} className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 bg-white hover:border-sky-300 transition-all group">
            <div>
              <p className="text-sm font-semibold text-slate-900">{action.label}</p>
              <p className="text-xs text-slate-500">{action.desc}</p>
            </div>
            <ArrowRight size={14} className="ml-auto text-slate-300 group-hover:text-sky-600 transition-all" />
          </Link>
        ))}
      </div>
    </div>
  )
}
