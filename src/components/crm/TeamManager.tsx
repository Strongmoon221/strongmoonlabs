'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PlusCircle, Pencil, Trash2, X, Check } from 'lucide-react'
import { ROLE_CONFIG } from '@/lib/crm'

interface User { id: string; name: string; email: string; role: string; color: string; projectCount: number; taskCount: number }

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#f97316']

export default function TeamManager({ initialUsers }: { initialUsers: User[] }) {
  const router = useRouter()
  const [users, setUsers] = useState(initialUsers)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', email: '', role: 'employee', color: '#3b82f6' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const inputClass = 'w-full px-3 py-2.5 rounded-xl border border-border bg-muted/30 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all'

  const submit = async () => {
    if (!form.name || !form.email) return
    setSaving(true); setError('')
    try {
      const res = await fetch(editingId ? `/api/admin/crm/team/${editingId}` : '/api/admin/crm/team', {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) { const d = await res.json(); throw new Error(d.error) }
      router.refresh()
      setShowForm(false); setEditingId(null)
      setForm({ name: '', email: '', role: 'employee', color: '#3b82f6' })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error')
    } finally { setSaving(false) }
  }

  const startEdit = (u: User) => {
    setForm({ name: u.name, email: u.email, role: u.role, color: u.color })
    setEditingId(u.id); setShowForm(true)
  }

  const deleteUser = async (id: string, name: string) => {
    if (!confirm(`Remove ${name} from team?`)) return
    await fetch(`/api/admin/crm/team/${id}`, { method: 'DELETE' })
    setUsers(prev => prev.filter(u => u.id !== id))
  }

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setForm({ name: '', email: '', role: 'employee', color: '#3b82f6' }) }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all"
        >
          <PlusCircle className="w-4 h-4" /> Add Member
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="p-5 rounded-2xl border border-blue-500/30 bg-blue-500/5 mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">{editingId ? 'Edit Member' : 'New Member'}</h3>
            <button onClick={() => { setShowForm(false); setEditingId(null) }} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input type="text" placeholder="Full Name *" className={inputClass} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <input type="email" placeholder="Email *" className={inputClass} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <select className={inputClass} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
            <option value="admin">Admin</option>
            <option value="pm">Project Manager</option>
            <option value="lead">Team Lead</option>
            <option value="employee">Employee</option>
          </select>
          <div>
            <label className="text-xs text-muted-foreground mb-2 block">Avatar Color</label>
            <div className="flex gap-2">
              {COLORS.map(c => (
                <button key={c} type="button" onClick={() => setForm({ ...form, color: c })}
                  className="w-7 h-7 rounded-full border-2 transition-all" style={{ backgroundColor: c, borderColor: form.color === c ? 'white' : 'transparent' }}
                />
              ))}
            </div>
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="flex gap-2">
            <button onClick={submit} disabled={saving} className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-all">
              <Check className="w-3.5 h-3.5" /> {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => { setShowForm(false); setEditingId(null) }} className="px-4 py-2 border border-border text-sm text-muted-foreground rounded-xl hover:text-foreground transition-all">Cancel</button>
          </div>
        </div>
      )}

      {/* Users list */}
      {users.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-2xl text-sm text-muted-foreground">No team members yet</div>
      ) : (
        <div className="space-y-3">
          {users.map(u => {
            const role = ROLE_CONFIG[u.role as keyof typeof ROLE_CONFIG] ?? ROLE_CONFIG.employee
            return (
              <div key={u.id} className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-card">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-base flex-shrink-0" style={{ backgroundColor: u.color }}>
                  {u.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-foreground">{u.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs border ${role.color}`}>{role.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{u.email}</p>
                </div>
                <div className="text-xs text-muted-foreground text-right flex-shrink-0">
                  <div>{u.projectCount} projects</div>
                  <div>{u.taskCount} tasks</div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => startEdit(u)} className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-blue-400 hover:bg-blue-500/10 transition-all">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => deleteUser(u.id, u.name)} className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
