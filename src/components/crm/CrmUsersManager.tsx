'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PlusCircle, Pencil, Trash2, X, Check, Shield, ShieldOff, Eye, EyeOff, ChevronDown } from 'lucide-react'
import { ALL_PERMISSIONS, PERMISSION_GROUPS } from '@/lib/crm-permissions'

interface CrmUser { id: string; name: string; email: string; permissions: string; resources: string; active: boolean; createdAt: Date | string }
interface AppItem { id: string; name: string; slug: string }
interface Resources { apps?: string[]; support?: string[] }

function getPermLabel(key: string) { return ALL_PERMISSIONS.find(p => p.key === key)?.label ?? key }
function parseJson<T>(s: string, fallback: T): T { try { return JSON.parse(s) } catch { return fallback } }

export default function CrmUsersManager({ initialUsers, apps }: { initialUsers: CrmUser[]; apps: AppItem[] }) {
  const router = useRouter()
  const [users, setUsers] = useState(initialUsers)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showPass, setShowPass] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    permissions: [] as string[],
    resources: { apps: [] as string[], support: [] as string[] },
    active: true,
  })

  const inputClass = 'w-full px-3 py-2.5 rounded-xl border border-border bg-muted/30 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all'

  const togglePerm = (key: string) =>
    setForm(f => ({ ...f, permissions: f.permissions.includes(key) ? f.permissions.filter(p => p !== key) : [...f.permissions, key] }))

  const setAll = (keys: string[], val: boolean) =>
    setForm(f => ({ ...f, permissions: val ? [...new Set([...f.permissions, ...keys])] : f.permissions.filter(p => !keys.includes(p)) }))

  const toggleResource = (type: 'apps' | 'support', id: string) =>
    setForm(f => ({
      ...f,
      resources: {
        ...f.resources,
        [type]: f.resources[type].includes(id) ? f.resources[type].filter(x => x !== id) : [...f.resources[type], id],
      },
    }))

  const openCreate = () => {
    setForm({ name: '', email: '', password: '', permissions: [], resources: { apps: [], support: [] }, active: true })
    setEditingId(null); setShowForm(true); setError('')
  }

  const openEdit = (u: CrmUser) => {
    const res = parseJson<Resources>(u.resources, {})
    setForm({
      name: u.name, email: u.email, password: '',
      permissions: parseJson<string[]>(u.permissions, []),
      resources: { apps: res.apps ?? [], support: res.support ?? [] },
      active: u.active,
    })
    setEditingId(u.id); setShowForm(true); setError('')
  }

  const submit = async () => {
    if (!form.name || !form.email) return
    if (!editingId && !form.password) { setError('Password is required'); return }
    setSaving(true); setError('')
    try {
      const body: Record<string, unknown> = {
        name: form.name, email: form.email,
        permissions: form.permissions,
        resources: form.resources,
        active: form.active,
      }
      if (form.password) body.password = form.password

      const res = await fetch(
        editingId ? `/api/admin/crm/users/${editingId}` : '/api/admin/crm/users',
        { method: editingId ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
      )
      if (!res.ok) { const d = await res.json(); throw new Error(d.error) }
      setShowForm(false); setEditingId(null)
      router.refresh()
    } catch (e) { setError(e instanceof Error ? e.message : 'Error') }
    finally { setSaving(false) }
  }

  const deleteUser = async (id: string, name: string) => {
    if (!confirm(`Delete ${name}?`)) return
    await fetch(`/api/admin/crm/users/${id}`, { method: 'DELETE' })
    setUsers(prev => prev.filter(u => u.id !== id))
  }

  const toggleActive = async (u: CrmUser) => {
    const res = await fetch(`/api/admin/crm/users/${u.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !u.active }),
    })
    if (res.ok) setUsers(prev => prev.map(x => x.id === u.id ? { ...x, active: !x.active } : x))
  }

  const hasTabApps = form.permissions.includes('tab.apps')
  const hasTabSupport = form.permissions.includes('tab.support')

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all">
          <PlusCircle className="w-4 h-4" /> Add User
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center p-4 pt-10 overflow-y-auto" onClick={() => setShowForm(false)}>
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg p-6 space-y-5 mb-10" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-foreground">{editingId ? 'Edit User' : 'New User'}</h3>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Full Name *</label>
                <input type="text" className={inputClass} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="John Doe" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Email *</label>
                <input type="email" className={inputClass} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="user@example.com" />
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">{editingId ? 'New Password (leave blank to keep)' : 'Password *'}</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} className={`${inputClass} pr-10`} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder={editingId ? '••••••••' : 'Min 8 characters'} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Permissions */}
            <div>
              <label className="text-xs text-muted-foreground mb-3 block font-medium uppercase tracking-wider">Tab Access & Actions</label>
              <div className="space-y-4">
                {PERMISSION_GROUPS.map(group => {
                  const allChecked = group.keys.every(k => form.permissions.includes(k))
                  return (
                    <div key={group.label}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-foreground">{group.label}</span>
                        <button type="button" onClick={() => setAll(group.keys, !allChecked)} className="text-xs text-blue-400 hover:text-blue-300">
                          {allChecked ? 'Clear' : 'All'}
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {group.keys.map(key => (
                          <label key={key} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border cursor-pointer transition-all text-xs ${
                            form.permissions.includes(key) ? 'border-blue-500/50 bg-blue-500/10 text-foreground' : 'border-border bg-muted/20 text-muted-foreground hover:text-foreground'
                          }`}>
                            <input type="checkbox" className="sr-only" checked={form.permissions.includes(key)} onChange={() => togglePerm(key)} />
                            <div className={`w-3 h-3 rounded border flex-shrink-0 flex items-center justify-center transition-all ${form.permissions.includes(key) ? 'bg-blue-500 border-blue-500' : 'border-border'}`}>
                              {form.permissions.includes(key) && <Check className="w-2 h-2 text-white" />}
                            </div>
                            {getPermLabel(key)}
                          </label>
                        ))}
                      </div>

                      {/* Resource restrictions for Apps */}
                      {group.label === 'Apps' && hasTabApps && apps.length > 0 && (
                        <div className="mt-3 p-3 rounded-xl bg-muted/20 border border-border">
                          <div className="flex items-center gap-2 mb-2">
                            <ChevronDown className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Accessible apps — leave empty for all</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {apps.map(app => (
                              <label key={app.id} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border cursor-pointer transition-all text-xs ${
                                form.resources.apps.includes(app.id) ? 'border-violet-500/50 bg-violet-500/10 text-foreground' : 'border-border bg-muted/20 text-muted-foreground hover:text-foreground'
                              }`}>
                                <input type="checkbox" className="sr-only" checked={form.resources.apps.includes(app.id)} onChange={() => toggleResource('apps', app.id)} />
                                <div className={`w-3 h-3 rounded border flex-shrink-0 flex items-center justify-center ${form.resources.apps.includes(app.id) ? 'bg-violet-500 border-violet-500' : 'border-border'}`}>
                                  {form.resources.apps.includes(app.id) && <Check className="w-2 h-2 text-white" />}
                                </div>
                                {app.name}
                              </label>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Resource restrictions for Support */}
                      {group.label === 'Support' && hasTabSupport && apps.length > 0 && (
                        <div className="mt-3 p-3 rounded-xl bg-muted/20 border border-border">
                          <div className="flex items-center gap-2 mb-2">
                            <ChevronDown className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Accessible support apps — leave empty for all</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {apps.map(app => (
                              <label key={app.id} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border cursor-pointer transition-all text-xs ${
                                form.resources.support.includes(app.id) ? 'border-violet-500/50 bg-violet-500/10 text-foreground' : 'border-border bg-muted/20 text-muted-foreground hover:text-foreground'
                              }`}>
                                <input type="checkbox" className="sr-only" checked={form.resources.support.includes(app.id)} onChange={() => toggleResource('support', app.id)} />
                                <div className={`w-3 h-3 rounded border flex-shrink-0 flex items-center justify-center ${form.resources.support.includes(app.id) ? 'bg-violet-500 border-violet-500' : 'border-border'}`}>
                                  {form.resources.support.includes(app.id) && <Check className="w-2 h-2 text-white" />}
                                </div>
                                {app.name}
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} className="w-4 h-4 accent-blue-500" />
              <span className="text-sm text-foreground">Active account</span>
            </label>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <div className="flex gap-2">
              <button onClick={submit} disabled={saving} className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-all">
                <Check className="w-3.5 h-3.5" /> {saving ? 'Saving...' : 'Save'}
              </button>
              <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-border text-sm text-muted-foreground rounded-xl hover:text-foreground transition-all">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Users list */}
      {users.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-2xl text-sm text-muted-foreground">
          No users yet. Create one to grant admin access.
        </div>
      ) : (
        <div className="space-y-3">
          {users.map(u => {
            const perms = parseJson<string[]>(u.permissions, [])
            const res = parseJson<Resources>(u.resources, {})
            const tabPerms = perms.filter(p => p.startsWith('tab.'))
            const actionPerms = perms.filter(p => !p.startsWith('tab.'))
            return (
              <div key={u.id} className="p-4 rounded-2xl border border-border bg-card">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{u.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs border ${u.active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'}`}>
                        {u.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{u.email}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => toggleActive(u)} className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all" title={u.active ? 'Deactivate' : 'Activate'}>
                      {u.active ? <Shield className="w-4 h-4" /> : <ShieldOff className="w-4 h-4" />}
                    </button>
                    <button onClick={() => openEdit(u)} className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-blue-400 hover:bg-blue-500/10 transition-all">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => deleteUser(u.id, u.name)} className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                {perms.length > 0 ? (
                  <div className="space-y-1.5">
                    {tabPerms.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {tabPerms.map(p => (
                          <span key={p} className="px-2 py-0.5 rounded-full text-[10px] bg-violet-500/10 text-violet-400 border border-violet-500/20">{getPermLabel(p)}</span>
                        ))}
                      </div>
                    )}
                    {actionPerms.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {actionPerms.map(p => (
                          <span key={p} className="px-2 py-0.5 rounded-full text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20">{getPermLabel(p)}</span>
                        ))}
                      </div>
                    )}
                    {(res.apps?.length || res.support?.length) ? (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {res.apps?.map(id => {
                          const app = apps.find(a => a.id === id)
                          return app ? <span key={id} className="px-2 py-0.5 rounded-full text-[10px] bg-zinc-500/10 text-zinc-400 border border-zinc-500/20">Apps: {app.name}</span> : null
                        })}
                        {res.support?.map(id => {
                          const app = apps.find(a => a.id === id)
                          return app ? <span key={id} className="px-2 py-0.5 rounded-full text-[10px] bg-zinc-500/10 text-zinc-400 border border-zinc-500/20">Support: {app.name}</span> : null
                        })}
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">No permissions assigned</p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
