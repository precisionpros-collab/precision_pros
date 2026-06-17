'use client'

import { useState, useTransition } from 'react'
import { Save, Loader2, Globe, Phone, Mail, Share2, AtSign, PlayCircle, MessageCircle, Eye, EyeOff, GripVertical } from "lucide-react"
import { updateSetting, updateSectionOrder } from '@/lib/actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface SettingsClientProps { settings: Record<string, string> }

const SECTION_LABELS: Record<string, string> = {
  home: 'Hero / Home', services: 'Services',
  works: 'Projects / Works', about: 'About & Team', testimonials: 'Testimonials',
  contact: 'Contact',
}

const settingGroups = [
  {
    title: 'Company Info',
    items: [
      { key: 'company_name', label: 'Company Name', icon: Globe, type: 'text' },
      { key: 'tagline', label: 'Tagline', icon: Globe, type: 'text' },
      { key: 'email', label: 'Email', icon: Mail, type: 'email' },
      { key: 'address', label: 'Company Address', icon: Globe, type: 'text' },
    ]
  },
  {
    title: 'Contact Numbers',
    items: [
      { key: 'phone', label: 'Phone Number 1', icon: Phone, type: 'tel' },
      { key: 'phone_2', label: 'Phone Number 2', icon: Phone, type: 'tel' },
      { key: 'whatsapp', label: 'WhatsApp Number', icon: MessageCircle, type: 'tel' },
    ]
  },
  {
    title: 'Social Media',
    items: [
      { key: 'instagram', label: 'Instagram URL', icon: Share2, type: 'url' },
      { key: 'linkedin', label: 'LinkedIn URL', icon: AtSign, type: 'url' },
      { key: 'youtube', label: 'YouTube URL', icon: PlayCircle, type: 'url' },
    ]
  },
  // Statistics group removed
]

const visibilityKeys = [
  { key: 'show_home', label: 'Home / Hero Section' },
  { key: 'show_services', label: 'Services Section' },
  { key: 'show_works', label: 'Works / Projects Section' },
  { key: 'show_team', label: 'About & Team Section' },
  { key: 'show_testimonials', label: 'Testimonials Section' },
  { key: 'show_contact', label: 'Contact Section' },
]

export function SettingsClient({ settings }: SettingsClientProps) {
  const [values, setValues] = useState<Record<string, string>>(settings)
  const [isPending, startTransition] = useTransition()
  const [saving, setSaving] = useState<string | null>(null)
  const [sectionOrder, setSectionOrder] = useState<string[]>(() => {
    const defaultOrder = ['home','services','works','about','testimonials','contact']
    const normalize = (order: unknown) => {
      if (!Array.isArray(order)) return defaultOrder
      const normalized = order
        .filter((id: unknown) => typeof id === 'string')
        .map(id => id.trim())
        .filter(id => id !== 'stats' && Object.keys(SECTION_LABELS).includes(id))
        .reduce<string[]>((acc, id) => acc.includes(id) ? acc : [...acc, id], [])
      if (!normalized.includes('testimonials')) {
        const contactIndex = normalized.indexOf('contact')
        if (contactIndex !== -1) normalized.splice(contactIndex, 0, 'testimonials')
        else normalized.push('testimonials')
      }
      return normalized.length > 0 ? normalized : defaultOrder
    }

    try {
      const parsed = JSON.parse(settings.section_order || '[]')
      return normalize(parsed)
    } catch {
      return defaultOrder
    }
  })
  const [dragSection, setDragSection] = useState<number | null>(null)
  const router = useRouter()

  const handleSave = (key: string) => {
    setSaving(key)
    startTransition(async () => {
      try {
        await updateSetting(key, values[key] || '')
        toast.success('Saved — website updated')
        router.refresh()
      } catch (err) {
        console.error('Failed to save setting', err)
        const error = err as { message?: string }
        toast.error(error?.message || 'Failed to save setting')
      } finally {
        setSaving(null)
      }
    })
  }

  const handleToggle = (key: string) => {
    const currentlyVisible = values[key] !== 'false'
    const newVal = currentlyVisible ? 'false' : 'true'
    setValues(p => ({ ...p, [key]: newVal }))
    startTransition(async () => {
      try {
        await updateSetting(key, newVal)
        toast.success(newVal === 'true' ? 'Section visible' : 'Section hidden')
        router.refresh()
      } catch (err) {
        console.error('Failed to toggle setting', err)
        const error = err as { message?: string }
        toast.error(error?.message || 'Failed to update visibility')
      }
    })
  }

  const isVisible = (key: string) => values[key] !== 'false'

  const handleSectionDrag = (from: number, to: number) => {
    const next = [...sectionOrder]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    setSectionOrder(next)
  }

  const saveSectionOrder = () => {
    startTransition(async () => {
      await updateSectionOrder(sectionOrder)
      toast.success('Section order saved — website updated')
      router.refresh()
    })
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-slate-900 mb-1">Site Settings</h1>
        <p className="text-slate-500 text-sm">Changes save instantly and update the public website.</p>
      </div>

      {/* Section order */}
      <div className="p-6 rounded-2xl border border-slate-200 bg-white mb-8">
        <h2 className="font-display text-lg font-semibold text-slate-900 mb-2">Page Section Order</h2>
        <p className="text-slate-500 text-xs mb-5">Drag to reorder sections on the homepage.</p>
        <div className="space-y-2 mb-4">
          {sectionOrder.map((id, idx) => (
            <div key={id} draggable
              onDragStart={() => setDragSection(idx)}
              onDragOver={e => { e.preventDefault(); if (dragSection !== null && dragSection !== idx) { handleSectionDrag(dragSection, idx); setDragSection(idx) } }}
              onDragEnd={() => { setDragSection(null); saveSectionOrder() }}
              className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50 cursor-grab active:cursor-grabbing">
              <GripVertical size={16} className="text-slate-400" />
              <span className="text-sm font-medium text-slate-700">{SECTION_LABELS[id] || id}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Visibility */}
      <div className="p-6 rounded-2xl border border-slate-200 bg-white mb-8">
        <h2 className="font-display text-lg font-semibold text-slate-900 mb-5 flex items-center gap-2">
          <Eye size={18} className="text-sky-600" /> Section Visibility
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {visibilityKeys.map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50">
              <span className="text-sm font-medium text-slate-700">{label}</span>
              <button onClick={() => handleToggle(key)} disabled={isPending}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  isVisible(key) ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'
                }`}>
                {isVisible(key) ? <Eye size={12} /> : <EyeOff size={12} />}
                {isVisible(key) ? 'Visible' : 'Hidden'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {settingGroups.map((group) => (
        <div key={group.title} className="p-6 rounded-2xl border border-slate-200 bg-white mb-6">
          <h2 className="font-display text-lg font-semibold text-slate-900 mb-5">{group.title}</h2>
          <div className="space-y-4">
            {group.items.map(({ key, label, icon: Icon, type }) => (
              <div key={key} className="flex items-end gap-3">
                <div className="flex-1">
                  <label className="block font-mono text-[11px] text-slate-500 tracking-widest uppercase mb-2 flex items-center gap-2">
                    <Icon size={12} /> {label}
                  </label>
                  <input type={type} value={values[key] || ''} onChange={e => setValues(p => ({ ...p, [key]: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300" />
                </div>
                <button onClick={() => handleSave(key)} disabled={isPending}
                  className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-sky-50 text-sky-700 border border-sky-200 text-sm hover:bg-sky-100 disabled:opacity-50 flex-shrink-0">
                  {saving === key && isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
