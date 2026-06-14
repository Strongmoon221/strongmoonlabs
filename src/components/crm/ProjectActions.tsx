'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, Archive, Trash2, X } from 'lucide-react'
import ProjectForm from './ProjectForm'

interface ProjectData {
  id: string; name: string; description: string; status: string
  priority: string; deadline: string; archived: boolean; memberIds: string[]
}

export default function ProjectActions({ project, team }: { project: ProjectData; team: { id: string; name: string; color: string }[] }) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)

  const archive = async () => {
    await fetch(`/api/admin/crm/projects/${project.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ archived: !project.archived }),
    })
    router.refresh()
  }

  const deleteProject = async () => {
    if (!confirm(`Delete project "${project.name}"? This cannot be undone.`)) return
    await fetch(`/api/admin/crm/projects/${project.id}`, { method: 'DELETE' })
    router.push('/admin/crm/projects')
  }

  if (editing) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center p-4 pt-20 overflow-y-auto" onClick={() => setEditing(false)}>
        <div className="bg-card border border-border rounded-2xl w-full max-w-xl p-6" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading font-bold text-foreground">Edit Project</h2>
            <button onClick={() => setEditing(false)} className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
              <X className="w-4 h-4" />
            </button>
          </div>
          <ProjectForm team={team} defaultValues={project} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <button onClick={() => setEditing(true)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground transition-all">
        <Pencil className="w-3.5 h-3.5" /> Edit
      </button>
      <button onClick={archive} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground transition-all">
        <Archive className="w-3.5 h-3.5" /> {project.archived ? 'Unarchive' : 'Archive'}
      </button>
      <button onClick={deleteProject} className="w-9 h-9 flex items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-red-400 hover:border-red-500/30 transition-all">
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}
