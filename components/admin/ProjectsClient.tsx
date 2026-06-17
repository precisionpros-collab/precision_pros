'use client'

import { useState, useTransition } from 'react'
import { Plus, Eye, EyeOff, Trash2, Edit, Star, X, Loader2 } from 'lucide-react'
import { upsertWork, toggleVisibility, deleteItem } from '@/lib/actions'
import { ImageUpload } from '@/components/admin/ImageUpload'
import { SortableList } from '@/components/admin/SortableList'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface Work {
  id: string; title: string; description: string; tags: string[]; category: string
  is_featured: boolean; is_visible: boolean; client_name: string | null
  project_url: string | null; image_url: string | null
}

interface ProjectsClientProps {
  works: Work[]
  categories: string[]
}

const emptyForm = { title: '', description: '', category: 'AI', tags: '', client_name: '', project_url: '', image_url: '', is_featured: false, is_visible: true }

export function ProjectsClient({ works, categories }: ProjectsClientProps) {
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Work | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowForm(true) }
  const openEdit = (w: Work) => {
    setEditing(w)
    setForm({ title: w.title, description: w.description, category: w.category, tags: w.tags.join(', '), client_name: w.client_name || '', project_url: w.project_url || '', image_url: w.image_url || '', is_featured: w.is_featured, is_visible: w.is_visible })
    setShowForm(true)
  }

  const handleSave = () => {
    if (!form.title || !form.description) return toast.error('Title and description required')
    startTransition(async () => {
      await upsertWork({ ...editing ? { id: editing.id } : {}, title: form.title, description: form.description, category: form.category, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean), client_name: form.client_name || null, project_url: form.project_url || null, image_url: form.image_url || null, is_featured: form.is_featured, is_visible: form.is_visible })
      toast.success(editing ? 'Updated!' : 'Added!'); setShowForm(false); router.refresh()
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-semibold text-slate-900 mb-1">Projects</h1>
          <p className="text-slate-500 text-sm">{works.length} total · drag to reorder</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 bg-sky-500 text-white text-sm font-medium rounded-xl hover:bg-sky-600">
          <Plus size={16} /> Add Project
        </button>
      </div>

      <SortableList items={works} table="works" renderItem={(work) => (
        <div className={`p-5 rounded-2xl border bg-white ${work.is_visible ? 'border-slate-200' : 'border-dashed opacity-60'}`}>
          <div className="flex items-start gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {work.image_url && <img src={work.image_url} alt="" className="w-16 h-16 rounded-xl object-cover" />}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{work.category}</span>
                {work.is_featured && <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 flex items-center gap-1"><Star size={9} />Featured</span>}
              </div>
              <h3 className="font-semibold text-sm text-slate-900">{work.title}</h3>
              <p className="text-xs text-slate-500 line-clamp-1 mt-1">{work.description}</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => openEdit(work)} className="p-2 rounded-lg hover:bg-slate-100"><Edit size={14} /></button>
              <button onClick={() => startTransition(async () => { await toggleVisibility('works', work.id, work.is_visible); router.refresh() })} className="p-2 rounded-lg hover:bg-slate-100">{work.is_visible ? <EyeOff size={14} /> : <Eye size={14} />}</button>
              <button onClick={() => { if (confirm('Delete?')) startTransition(async () => { await deleteItem('works', work.id); router.refresh() }) }} className="p-2 rounded-lg hover:bg-red-50 hover:text-red-500"><Trash2 size={14} /></button>
            </div>
          </div>
        </div>
      )} />

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/30 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-3xl p-7 shadow-2xl max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-semibold">{editing ? 'Edit Project' : 'Add Project'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-slate-100"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block font-mono text-[11px] text-slate-500 uppercase mb-2">Title *</label>
                <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-sky-300 focus:outline-none" />
              </div>
              <div>
                <label className="block font-mono text-[11px] text-slate-500 uppercase mb-2">Description *</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm resize-none focus:ring-2 focus:ring-sky-300 focus:outline-none" />
              </div>
              <div>
                <label className="block font-mono text-[11px] text-slate-500 uppercase mb-2">Client Name</label>
                <input value={form.client_name} onChange={e => setForm(p => ({ ...p, client_name: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-sky-300 focus:outline-none" />
              </div>
              <div>
                <label className="block font-mono text-[11px] text-slate-500 uppercase mb-2">Live Demo URL</label>
                <input value={form.project_url} onChange={e => setForm(p => ({ ...p, project_url: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-sky-300 focus:outline-none" />
              </div>
              <ImageUpload value={form.image_url} onChange={url => setForm(p => ({ ...p, image_url: url }))} folder="projects" label="Project Image (upload file)" />
              <div>
                <label className="block font-mono text-[11px] text-slate-500 uppercase mb-2">Category</label>
                <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm">
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-mono text-[11px] text-slate-500 uppercase mb-2">Tags (comma separated)</label>
                <input value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm" />
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_featured} onChange={e => setForm(p => ({ ...p, is_featured: e.target.checked }))} /> Featured</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_visible} onChange={e => setForm(p => ({ ...p, is_visible: e.target.checked }))} /> Visible</label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-xl border border-slate-200 text-sm">Cancel</button>
              <button onClick={handleSave} disabled={isPending} className="flex-1 py-3 rounded-xl bg-sky-500 text-white text-sm flex items-center justify-center gap-2 disabled:opacity-60">
                {isPending && <Loader2 size={16} className="animate-spin" />} Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
