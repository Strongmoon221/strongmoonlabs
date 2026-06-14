'use client'

import { useState } from 'react'
import { PlusCircle, X, Calendar, ChevronRight, ChevronLeft, Trash2 } from 'lucide-react'
import { PRIORITY_CONFIG } from '@/lib/crm'
import { useCrmLang } from './useCrmLang'

interface Assignee { id: string; name: string; color: string }
interface Task {
  id: string
  title: string
  description: string
  status: string
  priority: string
  deadline: string
  assignee: Assignee | null
  assigneeId: string
}

interface Props {
  projectId: string
  initialTasks: Task[]
  team: Assignee[]
}

const NEXT_STATUS: Record<string, string> = { todo: 'in_progress', in_progress: 'review', review: 'done', done: 'todo' }
const PREV_STATUS: Record<string, string> = { todo: 'done', in_progress: 'todo', review: 'in_progress', done: 'review' }

export default function KanbanBoard({ projectId, initialTasks, team }: Props) {
  const { t } = useCrmLang()
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [showNewTask, setShowNewTask] = useState<string | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [newTask, setNewTask] = useState({ title: '', priority: 'medium', assigneeId: '', deadline: '' })
  const [saving, setSaving] = useState(false)

  const COLUMNS = [
    { id: 'todo',        label: t('todo'),       color: 'bg-zinc-400' },
    { id: 'in_progress', label: t('inProgress'),  color: 'bg-blue-400' },
    { id: 'review',      label: t('review'),      color: 'bg-violet-400' },
    { id: 'done',        label: t('done'),        color: 'bg-emerald-400' },
  ]

  const PRIORITY_OPTIONS = [
    { value: 'low',      label: t('low') },
    { value: 'medium',   label: t('medium') },
    { value: 'high',     label: t('high') },
    { value: 'critical', label: t('criticalPriority') },
  ]

  const createTask = async (status: string) => {
    if (!newTask.title.trim()) return
    setSaving(true)
    const res = await fetch('/api/admin/crm/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newTask, status, projectId }),
    })
    const task = await res.json()
    setTasks(prev => [...prev, { ...task, description: task.description ?? '', deadline: task.deadline ? task.deadline.split('T')[0] : '', assigneeId: task.assigneeId ?? '' }])
    setNewTask({ title: '', priority: 'medium', assigneeId: '', deadline: '' })
    setShowNewTask(null)
    setSaving(false)
  }

  const moveTask = async (id: string, direction: 'next' | 'prev') => {
    const task = tasks.find(t => t.id === id)
    if (!task) return
    const newStatus = direction === 'next' ? NEXT_STATUS[task.status] : PREV_STATUS[task.status]
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t))
    await fetch(`/api/admin/crm/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
  }

  const deleteTask = async (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id))
    setSelectedTask(null)
    await fetch(`/api/admin/crm/tasks/${id}`, { method: 'DELETE' })
  }

  const updateTask = async (id: string, data: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...data } : t))
    setSelectedTask(prev => prev ? { ...prev, ...data } : null)
    await fetch(`/api/admin/crm/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
  }

  const inputClass = 'w-full px-2.5 py-2 rounded-lg border border-border bg-muted/30 text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all'

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {COLUMNS.map(col => {
        const colTasks = tasks.filter(t => t.status === col.id)
        return (
          <div key={col.id} className="flex-shrink-0 w-72">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${col.color}`} />
                <span className="text-sm font-semibold text-foreground">{col.label}</span>
                <span className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground font-medium">{colTasks.length}</span>
              </div>
              <button
                onClick={() => setShowNewTask(showNewTask === col.id ? null : col.id)}
                className="w-6 h-6 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              >
                <PlusCircle className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {showNewTask === col.id && (
                <div className="p-3 rounded-xl border border-blue-500/30 bg-blue-500/5 space-y-2">
                  <input
                    autoFocus
                    type="text"
                    placeholder={t('taskPlaceholder')}
                    className={inputClass}
                    value={newTask.title}
                    onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                    onKeyDown={e => { if (e.key === 'Enter') createTask(col.id); if (e.key === 'Escape') setShowNewTask(null) }}
                  />
                  <div className="grid grid-cols-2 gap-1.5">
                    <select className={inputClass} value={newTask.priority} onChange={e => setNewTask({ ...newTask, priority: e.target.value })}>
                      {PRIORITY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                    <select className={inputClass} value={newTask.assigneeId} onChange={e => setNewTask({ ...newTask, assigneeId: e.target.value })}>
                      <option value="">{t('noAssignee')}</option>
                      {team.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                    </select>
                  </div>
                  <div className="flex gap-1.5">
                    <button onClick={() => createTask(col.id)} disabled={saving || !newTask.title.trim()} className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-all">
                      {saving ? '...' : t('addBtn')}
                    </button>
                    <button onClick={() => setShowNewTask(null)} className="px-2.5 py-1.5 border border-border text-xs text-muted-foreground rounded-lg hover:text-foreground transition-all">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}

              {colTasks.map(task => {
                const pri = PRIORITY_CONFIG[task.priority as keyof typeof PRIORITY_CONFIG]
                return (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    className="p-3 rounded-xl border border-border bg-card hover:border-blue-500/40 cursor-pointer transition-all group"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-sm text-foreground leading-snug">{task.title}</p>
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 ${pri.dot}`} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        {task.assignee && (
                          <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white" style={{ backgroundColor: task.assignee.color }} title={task.assignee.name}>
                            {task.assignee.name.charAt(0)}
                          </div>
                        )}
                        {task.deadline && (
                          <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                            <Calendar className="w-2.5 h-2.5" />
                            {new Date(task.deadline).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                        <button onClick={() => moveTask(task.id, 'prev')} className="w-5 h-5 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-all" title={t('moveLeft')}>
                          <ChevronLeft className="w-3 h-3" />
                        </button>
                        <button onClick={() => moveTask(task.id, 'next')} className="w-5 h-5 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-all" title={t('moveRight')}>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* Task detail modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setSelectedTask(null)}>
          <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-3">
              <input
                className="flex-1 text-base font-semibold text-foreground bg-transparent border-none outline-none focus:ring-0"
                value={selectedTask.title}
                onChange={e => setSelectedTask({ ...selectedTask, title: e.target.value })}
                onBlur={e => updateTask(selectedTask.id, { title: e.target.value })}
              />
              <div className="flex items-center gap-1">
                <button onClick={() => deleteTask(selectedTask.id)} className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setSelectedTask(null)} className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <textarea
              rows={3}
              placeholder={t('descriptionPlaceholder')}
              className="w-full px-3 py-2 rounded-xl border border-border bg-muted/30 text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              value={selectedTask.description}
              onChange={e => setSelectedTask({ ...selectedTask, description: e.target.value })}
              onBlur={e => updateTask(selectedTask.id, { description: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">{t('status')}</label>
                <select
                  className={inputClass}
                  value={selectedTask.status}
                  onChange={e => { const s = e.target.value; updateTask(selectedTask.id, { status: s }); setSelectedTask({ ...selectedTask, status: s }) }}
                >
                  {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">{t('priority')}</label>
                <select
                  className={inputClass}
                  value={selectedTask.priority}
                  onChange={e => { const p = e.target.value; updateTask(selectedTask.id, { priority: p }); setSelectedTask({ ...selectedTask, priority: p }) }}
                >
                  {PRIORITY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">{t('assignee')}</label>
                <select
                  className={inputClass}
                  value={selectedTask.assigneeId}
                  onChange={e => {
                    const uid = e.target.value
                    const assignee = team.find(u => u.id === uid) ?? null
                    updateTask(selectedTask.id, { assigneeId: uid, assignee })
                    setSelectedTask({ ...selectedTask, assigneeId: uid, assignee })
                  }}
                >
                  <option value="">{t('noAssignee')}</option>
                  {team.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">{t('deadline')}</label>
                <input
                  type="date"
                  className={inputClass}
                  value={selectedTask.deadline}
                  onChange={e => { updateTask(selectedTask.id, { deadline: e.target.value }); setSelectedTask({ ...selectedTask, deadline: e.target.value }) }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
