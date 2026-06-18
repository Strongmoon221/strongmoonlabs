'use client'

import { useState } from 'react'
import { CheckCircle2, Circle, Trash2, MessageCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface App { id: string; name: string }
interface Ticket {
  id: string
  name: string
  email: string
  message: string
  status: string
  category: string
  createdAt: Date | string
  app: { name: string; slug: string; iconUrl: string | null }
}

const CATEGORY_META: Record<string, { label: string; emoji: string }> = {
  bug:         { label: 'Bug',          emoji: '🐛' },
  payment:     { label: 'Payment',      emoji: '💳' },
  account:     { label: 'Account',      emoji: '👤' },
  feature:     { label: 'Feature',      emoji: '💡' },
  performance: { label: 'Performance',  emoji: '⚡' },
  data:        { label: 'Data',         emoji: '🔒' },
  sync:        { label: 'Sync',         emoji: '🔄' },
  general:     { label: 'General',      emoji: '💬' },
}

export default function SupportTicketList({ tickets, apps }: { tickets: Ticket[]; apps: App[] }) {
  const router = useRouter()
  const [filterApp, setFilterApp] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterCategory, setFilterCategory] = useState('')

  const filtered = tickets.filter((t) => {
    if (filterApp && t.app.slug !== filterApp) return false
    if (filterStatus && t.status !== filterStatus) return false
    if (filterCategory && t.category !== filterCategory) return false
    return true
  })

  const toggleStatus = async (id: string, current: string) => {
    const next = current === 'open' ? 'closed' : 'open'
    await fetch(`/api/admin/support/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next }),
    })
    router.refresh()
  }

  const deleteTicket = async (id: string) => {
    if (!confirm('Delete this ticket?')) return
    await fetch(`/api/admin/support/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  const selectClass = 'px-3 py-2 rounded-xl border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/40'

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select value={filterApp} onChange={(e) => setFilterApp(e.target.value)} className={selectClass}>
          <option value="">All Apps</option>
          {apps.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className={selectClass}>
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className={selectClass}>
          <option value="">All Topics</option>
          {Object.entries(CATEGORY_META).map(([val, { label, emoji }]) => (
            <option key={val} value={val}>{emoji} {label}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border rounded-2xl">
          <p className="text-muted-foreground">No tickets found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((ticket) => {
            const cat = CATEGORY_META[ticket.category] ?? CATEGORY_META.general
            return (
              <div key={ticket.id} className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="flex items-center gap-4 p-4">
                  <button
                    onClick={() => toggleStatus(ticket.id, ticket.status)}
                    className="flex-shrink-0"
                    title={ticket.status === 'open' ? 'Mark as closed' : 'Reopen'}
                  >
                    {ticket.status === 'open'
                      ? <Circle className="w-5 h-5 text-amber-400" />
                      : <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm text-foreground">{ticket.name}</span>
                      <span className="text-xs text-muted-foreground">{ticket.email}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                        ticket.status === 'open'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                      }`}>
                        {ticket.status}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs bg-muted border border-border text-muted-foreground">
                        {cat.emoji} {cat.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-blue-400">{ticket.app.name}</span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(ticket.createdAt).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 truncate">{ticket.message}</p>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Link
                      href={`/admin/support/${ticket.id}`}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                      title="Open chat"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => deleteTicket(ticket.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
