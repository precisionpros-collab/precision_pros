'use client'

import { useState, useTransition } from 'react'
import { Plus, Trash2, Loader2, Tags } from 'lucide-react'
import { addCustomOption, deleteCustomOption } from '@/lib/actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface OptionItem { id: string; option_type: string; value: string; label: string; order_index: number }

interface OptionGroup { type: string; label: string; items: OptionItem[] }

export function OptionsClient({ groups }: { groups: OptionGroup[] }) {
  const [isPending, startTransition] = useTransition()
  const [newValues, setNewValues] = useState<Record<string, string>>({})
  const router = useRouter()

  const handleAdd = (type: string) => {
    const val = newValues[type]?.trim()
    if (!val) return toast.error('Enter a value')
    startTransition(async () => {
      try {
        await addCustomOption(type, val, val)
        setNewValues(p => ({ ...p, [type]: '' }))
        toast.success('Option added')
        router.refresh()
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Failed')
      }
    })
  }

  const handleDelete = (id: string) => {
    if (id.startsWith('default-')) return toast.error('Run migration SQL first to manage options in database')
    startTransition(async () => {
      await deleteCustomOption(id)
      toast.success('Removed')
      router.refresh()
    })
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-slate-900 mb-1">Form & Category Options</h1>
        <p className="text-slate-500 text-sm">Add custom categories, icons, and service types used across admin forms.</p>
      </div>

      <div className="space-y-6">
        {groups.map(group => (
          <div key={group.type} className="p-6 rounded-2xl border border-slate-200 bg-white">
            <h2 className="font-display text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Tags size={18} className="text-sky-600" /> {group.label}
            </h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {group.items.map(item => (
                <span key={item.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-sm border border-slate-200">
                  {item.label}
                  <button onClick={() => handleDelete(item.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={newValues[group.type] || ''}
                onChange={e => setNewValues(p => ({ ...p, [group.type]: e.target.value }))}
                placeholder={`Add new ${group.label.toLowerCase()}...`}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
              />
              <button
                onClick={() => handleAdd(group.type)}
                disabled={isPending}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-sky-500 text-white text-sm font-medium hover:bg-sky-600 disabled:opacity-60"
              >
                {isPending ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
