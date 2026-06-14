'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { useCallback } from 'react'

export default function ProjectFilters() {
  const router = useRouter()
  const sp = useSearchParams()

  const update = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(sp.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`/admin/crm/projects?${params.toString()}`)
  }, [router, sp])

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search projects..."
          defaultValue={sp.get('search') ?? ''}
          onChange={(e) => update('search', e.target.value)}
          className="pl-8 pr-3 py-2 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/40 w-48"
        />
      </div>
      <select
        value={sp.get('status') ?? ''}
        onChange={(e) => update('status', e.target.value)}
        className="px-3 py-2 rounded-xl border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/40"
      >
        <option value="">All Status</option>
        <option value="planning">Planning</option>
        <option value="active">In Progress</option>
        <option value="testing">Testing</option>
        <option value="done">Done</option>
        <option value="frozen">Frozen</option>
        <option value="cancelled">Cancelled</option>
      </select>
      <select
        value={sp.get('priority') ?? ''}
        onChange={(e) => update('priority', e.target.value)}
        className="px-3 py-2 rounded-xl border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/40"
      >
        <option value="">All Priority</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="critical">Critical</option>
      </select>
    </div>
  )
}
