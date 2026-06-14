export const STATUS_CONFIG = {
  planning:   { label: 'Planning',    color: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20' },
  active:     { label: 'In Progress', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  testing:    { label: 'Testing',     color: 'bg-violet-500/10 text-violet-400 border-violet-500/20' },
  done:       { label: 'Done',        color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  frozen:     { label: 'Frozen',      color: 'bg-sky-500/10 text-sky-400 border-sky-500/20' },
  cancelled:  { label: 'Cancelled',   color: 'bg-red-500/10 text-red-400 border-red-500/20' },
} as const

export const PRIORITY_CONFIG = {
  low:      { label: 'Low',      color: 'text-zinc-400',   dot: 'bg-zinc-400' },
  medium:   { label: 'Medium',   color: 'text-blue-400',   dot: 'bg-blue-400' },
  high:     { label: 'High',     color: 'text-amber-400',  dot: 'bg-amber-400' },
  critical: { label: 'Critical', color: 'text-red-400',    dot: 'bg-red-400' },
} as const

export const ROLE_CONFIG = {
  admin:    { label: 'Admin',           color: 'bg-red-500/10 text-red-400 border-red-500/20' },
  pm:       { label: 'Project Manager', color: 'bg-violet-500/10 text-violet-400 border-violet-500/20' },
  lead:     { label: 'Team Lead',       color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  employee: { label: 'Employee',        color: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20' },
} as const

export const TASK_COLUMNS = [
  { id: 'todo',        label: 'To Do' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'review',      label: 'Review' },
  { id: 'done',        label: 'Done' },
] as const
