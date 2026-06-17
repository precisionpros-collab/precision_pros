'use client'

import { useState, useTransition } from 'react'
import { Mail, Phone, Building, Trash2, CheckCircle, Clock, MessageSquare, Filter, Calendar, User } from 'lucide-react'
import { updateContactStatus, deleteContact } from '@/lib/actions'
import { useRouter } from 'next/navigation'

interface Contact {
  id: string; name: string; email: string; phone: string | null; company: string | null
  service_type: string; message: string; status: 'new' | 'read' | 'replied'; created_at: string
}

const statusStyles = {
  new: 'bg-sky-50 text-sky-700 border-sky-200',
  read: 'bg-blue-50 text-blue-700 border-blue-200',
  replied: 'bg-emerald-50 text-emerald-700 border-emerald-200',
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ContactsClient({ contacts, senderEmail }: { contacts: Contact[]; senderEmail: string }) {
  const [filter, setFilter] = useState<'all' | 'new' | 'read' | 'replied'>('all')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const [selected, setSelected] = useState<Contact | null>(null)

  const filtered = filter === 'all' ? contacts : contacts.filter(c => c.status === filter)

  const formatDate = (d: string) => new Date(d).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-slate-900 mb-1">Contact Requests</h1>
        <p className="text-slate-500 text-sm">{contacts.length} total · {contacts.filter(c => c.status === 'new').length} new · Reply manually via email</p>
      </div>

      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <Filter size={15} className="text-slate-400" />
        {(['all', 'new', 'read', 'replied'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm capitalize transition-all border ${
              filter === f ? 'bg-sky-500 text-white border-sky-500' : 'border-slate-200 text-slate-600 hover:border-sky-300'
            }`}>{f}</button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          {filtered.map((contact) => (
            <div key={contact.id}
              onClick={() => setSelected(contact)}
              className={`p-5 rounded-2xl border bg-white cursor-pointer transition-all hover:border-sky-300 hover:shadow-md ${
                selected?.id === contact.id ? 'border-sky-400 bg-sky-50/30' : 'border-slate-200'
              }`}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <p className="font-semibold text-sm text-slate-900">{contact.name}</p>
                  <p className="text-xs text-slate-500">{contact.email}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border capitalize ${statusStyles[contact.status]}`}>{contact.status}</span>
              </div>
              <p className="text-[10px] font-mono text-sky-700 uppercase tracking-wider mb-2">{contact.service_type}</p>
              <p className="text-xs text-slate-500 line-clamp-2">{contact.message}</p>
              <p className="text-[10px] text-slate-400 mt-3">{formatDate(contact.created_at)}</p>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-center py-16 text-slate-400 text-sm">No contacts found.</p>}
        </div>

        {selected && (
          <div className="p-6 rounded-2xl border border-slate-200 bg-white h-fit sticky top-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="font-display text-xl font-semibold text-slate-900">{selected.name}</h3>
                <span className={`inline-block mt-2 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border capitalize ${statusStyles[selected.status]}`}>{selected.status}</span>
              </div>
              <button onClick={() => startTransition(async () => { if (confirm('Delete?')) { await deleteContact(selected.id); setSelected(null); router.refresh() } })}
                className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50"><Trash2 size={16} /></button>
            </div>

            <div className="space-y-3 mb-6 text-sm">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                <User size={15} className="text-slate-400" />
                <div><p className="text-[10px] text-slate-400 uppercase font-mono">Full Name</p><p className="font-medium text-slate-900">{selected.name}</p></div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                <Mail size={15} className="text-slate-400" />
                <div><p className="text-[10px] text-slate-400 uppercase font-mono">Email</p>
                  <a href={`mailto:${selected.email}`} className="font-medium text-sky-700 hover:underline">{selected.email}</a></div>
              </div>
              {selected.phone && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                  <Phone size={15} className="text-slate-400" />
                  <div><p className="text-[10px] text-slate-400 uppercase font-mono">Phone</p>
                    <a href={`tel:${selected.phone.replace(/\s+/g, '')}`} className="font-medium text-slate-900">{selected.phone}</a></div>
                </div>
              )}
              {selected.company && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                  <Building size={15} className="text-slate-400" />
                  <div><p className="text-[10px] text-slate-400 uppercase font-mono">Company</p><p className="font-medium text-slate-900">{selected.company}</p></div>
                </div>
              )}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                <MessageSquare size={15} className="text-slate-400" />
                <div><p className="text-[10px] text-slate-400 uppercase font-mono">Service Required</p><p className="font-medium text-slate-900">{selected.service_type}</p></div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                <Calendar size={15} className="text-slate-400" />
                <div><p className="text-[10px] text-slate-400 uppercase font-mono">Received</p><p className="font-medium text-slate-900">{formatDate(selected.created_at)}</p></div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-sky-50 border border-sky-100 mb-6">
              <p className="text-[10px] font-mono text-sky-700 uppercase tracking-wider mb-2">Full Message</p>
              <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
            </div>

            <p className="text-xs text-slate-400 mb-4 italic">Reply to this inquiry manually through your email client.</p>

            <div className="flex flex-wrap gap-2">
              <button onClick={() => startTransition(async () => { await updateContactStatus(selected.id, 'read'); router.refresh() })} disabled={selected.status === 'read' || isPending}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-50 text-blue-700 text-sm hover:bg-blue-100 disabled:opacity-50">
                <Clock size={14} /> Mark Read
              </button>
              <button onClick={() => startTransition(async () => { await updateContactStatus(selected.id, 'replied'); router.refresh() })} disabled={selected.status === 'replied' || isPending}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-50 text-emerald-700 text-sm hover:bg-emerald-100 disabled:opacity-50">
                <CheckCircle size={14} /> Mark Replied
              </button>
              <a href={`https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=${encodeURIComponent(selected.email)}&su=${encodeURIComponent(`Re: ${selected.service_type} - Precision Pro's`)}&body=${encodeURIComponent(`Hi ${selected.name},

Thank you for reaching out.

`)}`}
                target="_blank" rel="noreferrer noopener"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sky-500 text-white text-sm hover:bg-sky-600">
                <Mail size={14} /> Open Gmail to Reply
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
