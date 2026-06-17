'use client'

import { useState, useTransition } from 'react'
import { Plus, Eye, EyeOff, Trash2, Edit, X, Loader2 } from 'lucide-react'
import { upsertTeamMember, toggleVisibility, deleteItem } from '@/lib/actions'
import { ImageUpload } from '@/components/admin/ImageUpload'
import { SortableList } from '@/components/admin/SortableList'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface Member {
  id: string; name: string; role: string; designation: string
  linkedin_url: string | null; instagram_url: string | null
  photo_url: string | null; is_visible: boolean
}

const emptyForm = { name: '', designation: '', role: 'Pro', linkedin_url: '', instagram_url: '', photo_url: '', is_visible: true }

export function TeamClient({ team }: { team: Member[] }) {
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Member | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowForm(true) }
  const openEdit = (m: Member) => {
    setEditing(m)
    setForm({ name: m.name, designation: m.designation, role: m.role || 'Pro', linkedin_url: m.linkedin_url || '', instagram_url: m.instagram_url || '', photo_url: m.photo_url || '', is_visible: m.is_visible })
    setShowForm(true)
  }

  const handleSave = () => {
    if (!form.name || !form.designation) return toast.error('Name and designation required')
    startTransition(async () => {
      await upsertTeamMember({ ...editing ? { id: editing.id } : {}, ...form, linkedin_url: form.linkedin_url || null, instagram_url: form.instagram_url || null, photo_url: form.photo_url || null })
      toast.success(editing ? 'Updated!' : 'Added!'); setShowForm(false); router.refresh()
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-semibold text-slate-900 mb-1">Team Members</h1>
          <p className="text-slate-500 text-sm">{team.length} members · drag to reorder</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 bg-sky-500 text-white text-sm font-medium rounded-xl hover:bg-sky-600 transition-colors">
          <Plus size={16} /> Add Member
        </button>
      </div>

      <SortableList items={team} table="team_members" renderItem={(member) => (
        <div className={`p-4 rounded-2xl border bg-white flex items-center gap-4 ${member.is_visible ? 'border-slate-200' : 'border-dashed border-slate-300 opacity-60'}`}>
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={member.photo_url || '/images/cute-smiling-robot-avatar-icon-260nw-2636636685.jpg'}
              alt={member.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/images/cute-smiling-robot-avatar-icon-260nw-2636636685.jpg'
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-slate-900">{member.name}</p>
            <p className="text-xs text-slate-500 truncate">{member.role || 'Pro'} · {member.designation}</p>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => openEdit(member)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"><Edit size={14} /></button>
            <button onClick={() => startTransition(async () => { await toggleVisibility('team_members', member.id, member.is_visible); router.refresh() })} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500">{member.is_visible ? <EyeOff size={14} /> : <Eye size={14} />}</button>
            <button onClick={() => { if (confirm('Delete?')) startTransition(async () => { await deleteItem('team_members', member.id); router.refresh() }) }} className="p-2 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-500"><Trash2 size={14} /></button>
          </div>
        </div>
      )} />

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/30 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-7 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-semibold text-slate-900">{editing ? 'Edit Member' : 'Add Member'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-slate-100"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block font-mono text-[11px] text-slate-500 uppercase mb-2">Name *</label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300" />
              </div>
              <div>
                <label className="block font-mono text-[11px] text-slate-500 uppercase mb-2">Role / Position (e.g. CEO, CTO) *</label>
                <input value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300" />
              </div>
              <div>
                <label className="block font-mono text-[11px] text-slate-500 uppercase mb-2">Designation *</label>
                <input value={form.designation} onChange={e => setForm(p => ({ ...p, designation: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300" />
              </div>
              <div>
                <label className="block font-mono text-[11px] text-slate-500 uppercase mb-2">LinkedIn URL</label>
                <input value={form.linkedin_url} onChange={e => setForm(p => ({ ...p, linkedin_url: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300" />
              </div>
              <div>
                <label className="block font-mono text-[11px] text-slate-500 uppercase mb-2">Instagram URL</label>
                <input value={form.instagram_url} onChange={e => setForm(p => ({ ...p, instagram_url: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300" />
              </div>
              <ImageUpload value={form.photo_url} onChange={url => setForm(p => ({ ...p, photo_url: url }))} folder="team" label="Profile Photo (upload file)" />
              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                <input type="checkbox" checked={form.is_visible} onChange={e => setForm(p => ({ ...p, is_visible: e.target.checked }))} /> Visible on website
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-xl border border-slate-200 text-sm hover:bg-slate-50">Cancel</button>
              <button onClick={handleSave} disabled={isPending} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-sky-500 text-white text-sm hover:bg-sky-600 disabled:opacity-60">
                {isPending ? <Loader2 size={16} className="animate-spin" /> : null} Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
