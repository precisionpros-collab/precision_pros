'use client'

import { useState, useTransition } from 'react'
import { Plus, Eye, EyeOff, Trash2, Edit, X, Loader2, Star, Quote } from 'lucide-react'
import { upsertTestimonial, toggleVisibility, deleteItem } from '@/lib/actions'
import { SortableList } from '@/components/admin/SortableList'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface Testimonial {
  id: string
  name: string
  company: string | null
  city: string | null
  rating: number
  content: string
  is_visible: boolean
}

interface TestimonialsClientProps {
  testimonials: Testimonial[]
}

const emptyForm = { name: '', company: '', city: '', rating: 5, content: '', is_visible: true }

export function TestimonialsClient({ testimonials }: TestimonialsClientProps) {
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const openAdd = () => {
    setEditing(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  const openEdit = (t: Testimonial) => {
    setEditing(t)
    setForm({
      name: t.name,
      company: t.company || '',
      city: t.city || '',
      rating: t.rating,
      content: t.content,
      is_visible: t.is_visible
    })
    setShowForm(true)
  }

  const handleSave = () => {
    if (!form.name || !form.content) {
      return toast.error('Name and Review Content are required.')
    }
    startTransition(async () => {
      await upsertTestimonial({
        ...editing ? { id: editing.id } : {},
        name: form.name,
        company: form.company || null,
        city: form.city || null,
        rating: form.rating,
        content: form.content,
        is_visible: form.is_visible
      })
      toast.success(editing ? 'Testimonial updated!' : 'Testimonial added!')
      setShowForm(false)
      router.refresh()
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-semibold text-slate-900 mb-1">Testimonials</h1>
          <p className="text-slate-500 text-sm">{testimonials.length} total · drag to reorder</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 bg-sky-500 text-white text-sm font-medium rounded-xl hover:bg-sky-600">
          <Plus size={16} /> Add Testimonial
        </button>
      </div>

      <SortableList items={testimonials} table="testimonials" renderItem={(t) => (
        <div className={`p-5 rounded-2xl border bg-white ${t.is_visible ? 'border-slate-200' : 'border-dashed opacity-60'}`}>
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600">
              <Quote size={18} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5 mb-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={12} className={i < t.rating ? 'fill-sky-400 text-sky-400' : 'text-slate-200'} />
                ))}
              </div>
              <h3 className="font-semibold text-sm text-slate-900 mt-1">{t.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {[t.company, t.city].filter(Boolean).join(' · ')}
              </p>
              <p className="text-xs text-slate-600 italic mt-2 line-clamp-2">&ldquo;{t.content}&rdquo;</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => openEdit(t)} className="p-2 rounded-lg hover:bg-slate-100"><Edit size={14} /></button>
              <button onClick={() => startTransition(async () => { await toggleVisibility('testimonials', t.id, t.is_visible); router.refresh() })} className="p-2 rounded-lg hover:bg-slate-100">
                {t.is_visible ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
              <button onClick={() => { if (confirm('Delete this testimonial?')) startTransition(async () => { await deleteItem('testimonials', t.id); router.refresh() }) }} className="p-2 rounded-lg hover:bg-red-50 hover:text-red-500">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      )} />

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/30 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-3xl p-7 shadow-2xl max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-semibold">{editing ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-slate-100"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block font-mono text-[11px] text-slate-500 uppercase mb-2">Name *</label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm" placeholder="Client Name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[11px] text-slate-500 uppercase mb-2">Company / Position</label>
                  <input value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm" placeholder="e.g. CEO, TechVantage" />
                </div>
                <div>
                  <label className="block font-mono text-[11px] text-slate-500 uppercase mb-2">City</label>
                  <input value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm" placeholder="e.g. Chennai" />
                </div>
              </div>
              <div>
                <label className="block font-mono text-[11px] text-slate-500 uppercase mb-2">Rating</label>
                <select value={form.rating} onChange={e => setForm(p => ({ ...p, rating: parseInt(e.target.value) }))} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm">
                  {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-mono text-[11px] text-slate-500 uppercase mb-2">Review Content *</label>
                <textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} rows={4} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm resize-none" placeholder="Write the client's testimonial or feedback..." />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.is_visible} onChange={e => setForm(p => ({ ...p, is_visible: e.target.checked }))} /> Visible on website
              </label>
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
