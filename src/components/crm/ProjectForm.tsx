'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle } from 'lucide-react'
import Button from '@/components/ui/Button'

interface CrmUser { id: string; name: string; color: string }

export interface ProjectDefaults {
  id?: string; name?: string; description?: string; status?: string
  priority?: string; deadline?: string; archived?: boolean; memberIds?: string[]
}

export default function ProjectForm({ team, defaultValues }: { team: CrmUser[]; defaultValues?: ProjectDefaults }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedMembers, setSelectedMembers] = useState<string[]>(defaultValues?.memberIds ?? [])
  const [form, setForm] = useState({
    name: defaultValues?.name ?? '',
    description: defaultValues?.description ?? '',
    status: defaultValues?.status ?? 'planning',
    priority: defaultValues?.priority ?? 'medium',
    deadline: defaultValues?.deadline ?? '',
  })

  const isEdit = !!defaultValues?.id

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const url = isEdit ? `/api/admin/crm/projects/${defaultValues.id}` : '/api/admin/crm/projects'
      const res = await fetch(url, {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, memberIds: selectedMembers }),
      })
      if (!res.ok) { const d = await res.json(); throw new Error(d.error) }
      const project = await res.json()
      router.push(`/admin/crm/projects/${project.id}`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  const inputClass = 'w-full px-3 py-2.5 rounded-xl border border-border bg-muted/30 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 transition-all'

  const toggleMember = (id: string) => setSelectedMembers(prev =>
    prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Project Name *</label>
        <input type="text" required placeholder="My Project" className={inputClass} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
        <textarea rows={3} className={`${inputClass} resize-none`} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="What is this project about?" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Status</label>
          <select className={inputClass} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
            <option value="planning">Planning</option>
            <option value="active">In Progress</option>
            <option value="testing">Testing</option>
            <option value="done">Done</option>
            <option value="frozen">Frozen</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Priority</label>
          <select className={inputClass} value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Deadline</label>
        <input type="date" className={inputClass} value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} />
      </div>
      {team.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Team Members</label>
          <div className="flex flex-wrap gap-2">
            {team.map(u => (
              <button
                key={u.id}
                type="button"
                onClick={() => toggleMember(u.id)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm border transition-all ${
                  selectedMembers.includes(u.id)
                    ? 'border-blue-500/50 bg-blue-500/10 text-foreground'
                    : 'border-border bg-muted/30 text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ backgroundColor: u.color }}>
                  {u.name.charAt(0)}
                </div>
                {u.name}
              </button>
            ))}
          </div>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
        </div>
      )}
      <div className="flex gap-3">
        <Button type="submit" loading={loading} size="lg">{isEdit ? 'Save Changes' : 'Create Project'}</Button>
        <Button type="button" variant="outline" size="lg" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  )
}
