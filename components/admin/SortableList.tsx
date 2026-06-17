'use client'

import { useState, useTransition, ReactNode } from 'react'
import { GripVertical, Loader2 } from 'lucide-react'
import { reorderItems } from '@/lib/actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface SortableListProps<T extends { id: string }> {
  items: T[]
  table: string
  renderItem: (item: T, index: number) => ReactNode
}

export function SortableList<T extends { id: string }>({ items, table, renderItem }: SortableListProps<T>) {
  const [order, setOrder] = useState(items.map(i => i.id))
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const ordered = order.map(id => items.find(i => i.id === id)).filter(Boolean) as T[]

  const handleDragStart = (idx: number) => setDragIdx(idx)

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault()
    if (dragIdx === null || dragIdx === idx) return
    const newOrder = [...order]
    const [removed] = newOrder.splice(dragIdx, 1)
    newOrder.splice(idx, 0, removed)
    setOrder(newOrder)
    setDragIdx(idx)
  }

  const handleDragEnd = () => {
    setDragIdx(null)
    startTransition(async () => {
      try {
        await reorderItems(table, order)
        toast.success('Order saved')
        router.refresh()
      } catch {
        toast.error('Failed to save order')
      }
    })
  }

  return (
    <div className="space-y-3">
      {isPending && (
        <div className="flex items-center gap-2 text-xs text-sky-700 bg-sky-50 px-3 py-2 rounded-lg">
          <Loader2 size={12} className="animate-spin" /> Saving order...
        </div>
      )}
      {ordered.map((item, idx) => (
        <div
          key={item.id}
          draggable
          onDragStart={() => handleDragStart(idx)}
          onDragOver={e => handleDragOver(e, idx)}
          onDragEnd={handleDragEnd}
          className={`flex items-stretch gap-2 group ${dragIdx === idx ? 'opacity-50' : ''}`}
        >
          <div className="flex items-center px-2 cursor-grab active:cursor-grabbing text-slate-300 hover:text-sky-600 transition-colors">
            <GripVertical size={18} />
          </div>
          <div className="flex-1">{renderItem(item, idx)}</div>
        </div>
      ))}
    </div>
  )
}
