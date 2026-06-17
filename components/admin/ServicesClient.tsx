'use client'

import { useState, useTransition } from 'react'
import { Plus, Eye, EyeOff, Trash2, Edit, X, Loader2, Brain, Cpu, Globe, Smartphone, Zap, Cloud } from 'lucide-react'
import { upsertService, toggleVisibility, deleteItem } from '@/lib/actions'
import { SortableList } from '@/components/admin/SortableList'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface Service { id: string; title: string; description: string; icon: string; category?: string; features: string[]; is_visible: boolean }

interface ServicesClientProps {
  services: Service[]
  icons: string[]
}

const iconMap: Record<string, React.ElementType> = { Brain, Cpu, Globe, Smartphone, Zap, Cloud }
const emptyForm = { title: '', description: '', icon: 'Brain', features: '', is_visible: true }

export function ServicesClient({ services, icons }: ServicesClientProps) {
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Service | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowForm(true) }
  const openEdit = (s: Service) => {
    setEditing(s)
    setForm({ title: s.title, description: s.description, icon: s.icon, features: s.features.join('\n'), is_visible: s.is_visible })
    setShowForm(true)
  }

  const handleSave = () => {
    if (!form.title || !form.description) return toast.error('Title and description required')
    startTransition(async () => {
      await upsertService({
        ...editing ? { id: editing.id } : {},
        title: form.title,
        description: form.description,
        icon: form.icon,
        ...(editing?.category ? { category: editing.category } : {}),
        features: form.features.split('\n').map(f => f.trim()).filter(Boolean),
        is_visible: form.is_visible,
      })
      toast.success(editing ? 'Updated!' : 'Added!'); setShowForm(false); router.refresh()
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-semibold text-slate-900 mb-1">Services</h1>
          <p className="text-slate-500 text-sm">{services.length} total · drag to reorder</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 bg-sky-500 text-white text-sm font-medium rounded-xl hover:bg-sky-600">
          <Plus size={16} /> Add Service
        </button>
      </div>

      <SortableList items={services} table="services" renderItem={(service) => {
        const Icon = iconMap[service.icon] || Brain
        return (
          <div className={`p-5 rounded-2xl border bg-white ${service.is_visible ? 'border-slate-200' : 'border-dashed opacity-60'}`}>
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-sky-50"><Icon size={18} className="text-sky-600" /></div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm text-slate-900 mt-1">{service.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-1">{service.description}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(service)} className="p-2 rounded-lg hover:bg-slate-100"><Edit size={14} /></button>
                <button onClick={() => startTransition(async () => { await toggleVisibility('services', service.id, service.is_visible); router.refresh() })} className="p-2 rounded-lg hover:bg-slate-100">{service.is_visible ? <EyeOff size={14} /> : <Eye size={14} />}</button>
                <button onClick={() => { if (confirm('Delete?')) startTransition(async () => { await deleteItem('services', service.id); router.refresh() }) }} className="p-2 rounded-lg hover:bg-red-50 hover:text-red-500"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        )
      }} />

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/30 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-3xl p-7 shadow-2xl max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-semibold">{editing ? 'Edit Service' : 'Add Service'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-slate-100"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              {[['title', 'Title *'], ['description', 'Description *']].map(([name, label]) => (
                <div key={name}>
                  <label className="block font-mono text-[11px] text-slate-500 uppercase mb-2">{label}</label>
                  {name === 'description' ? (
                    <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm resize-none" />
                  ) : (
                    <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm" />
                  )}
                </div>
              ))}
              <div>
                <label className="block font-mono text-[11px] text-slate-500 uppercase mb-2">Icon</label>
                <select value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm">
                  {icons.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-mono text-[11px] text-slate-500 uppercase mb-2">What You Provide (one per line)</label>
                <textarea value={form.features} onChange={e => setForm(p => ({ ...p, features: e.target.value }))} rows={5} placeholder="Source code & ownership&#10;Documentation&#10;30-day support" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm resize-none" />
              </div>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_visible} onChange={e => setForm(p => ({ ...p, is_visible: e.target.checked }))} /> Visible on website</label>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-xl border border-slate-200 text-sm">Cancel</button>
              <button onClick={handleSave} disabled={isPending} className="flex-1 py-3 rounded-xl bg-sky-500 text-white text-sm flex justify-center gap-2 disabled:opacity-60">
                {isPending && <Loader2 size={16} className="animate-spin" />} Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
