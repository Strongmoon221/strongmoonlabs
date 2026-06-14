import { redirect } from 'next/navigation'
import Link from 'next/link'
import { FolderOpen, CheckCircle2, Clock, AlertCircle, Users, PlusCircle, UserCog } from 'lucide-react'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import AdminShell from '@/components/admin/AdminShell'
import { STATUS_CONFIG, PRIORITY_CONFIG } from '@/lib/crm'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'CRM Dashboard' }

export default async function CrmDashboardPage() {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  const [projects, teamCount, taskStats] = await Promise.all([
    prisma.crmProject.findMany({
      where: { archived: false },
      include: {
        members: { include: { user: { select: { id: true, name: true, color: true } } } },
        tasks: { select: { status: true } },
      },
      orderBy: { updatedAt: 'desc' },
      take: 5,
    }),
    prisma.crmUser.count(),
    prisma.crmTask.groupBy({ by: ['status'], _count: true }),
  ])

  const allProjects = await prisma.crmProject.findMany({ where: { archived: false }, select: { status: true, priority: true } })

  const stats = {
    total: allProjects.length,
    active: allProjects.filter(p => p.status === 'active').length,
    done: allProjects.filter(p => p.status === 'done').length,
    critical: allProjects.filter(p => p.priority === 'critical').length,
  }

  const taskMap = Object.fromEntries(taskStats.map(t => [t.status, t._count]))

  return (
    <AdminShell role={session.role} permissions={session.permissions}>
      <div className="max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground mb-1">Project Manager</h1>
            <p className="text-sm text-muted-foreground">Overview of all projects and team activity</p>
          </div>
          <Link
            href="/admin/crm/projects/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/25"
          >
            <PlusCircle className="w-4 h-4" /> New Project
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Projects', value: stats.total, icon: FolderOpen, color: 'text-blue-400', bg: 'bg-blue-500/10' },
            { label: 'Active', value: stats.active, icon: Clock, color: 'text-violet-400', bg: 'bg-violet-500/10' },
            { label: 'Completed', value: stats.done, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { label: 'Critical', value: stats.critical, icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="p-5 rounded-2xl border border-border bg-card">
              <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <div className="text-2xl font-bold font-heading text-foreground">{value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent projects */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-semibold text-foreground">Recent Projects</h2>
              <Link href="/admin/crm/projects" className="text-xs text-blue-400 hover:text-blue-300">View all →</Link>
            </div>
            <div className="space-y-3">
              {projects.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-border rounded-2xl text-sm text-muted-foreground">
                  No projects yet. <Link href="/admin/crm/projects/new" className="text-blue-400">Create one →</Link>
                </div>
              ) : projects.map((project) => {
                const cfg = STATUS_CONFIG[project.status as keyof typeof STATUS_CONFIG]
                const pri = PRIORITY_CONFIG[project.priority as keyof typeof PRIORITY_CONFIG]
                const done = project.tasks.filter(t => t.status === 'done').length
                const total = project.tasks.length
                return (
                  <Link key={project.id} href={`/admin/crm/projects/${project.id}`}
                    className="block p-4 rounded-xl border border-border bg-card hover:border-blue-500/40 hover:bg-blue-500/5 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <p className="font-medium text-sm text-foreground">{project.name}</p>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className={`w-1.5 h-1.5 rounded-full ${pri.dot}`} />
                        <span className={`px-2 py-0.5 rounded-full text-xs border ${cfg.color}`}>{cfg.label}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-1.5">
                        {project.members.slice(0, 4).map(m => (
                          <div key={m.user.id} className="w-6 h-6 rounded-full border-2 border-card flex items-center justify-center text-[9px] font-bold text-white" style={{ backgroundColor: m.user.color }}>
                            {m.user.name.charAt(0)}
                          </div>
                        ))}
                        {project.members.length > 4 && <div className="w-6 h-6 rounded-full border-2 border-card bg-muted flex items-center justify-center text-[9px] text-muted-foreground">+{project.members.length - 4}</div>}
                      </div>
                      {total > 0 && (
                        <span className="text-xs text-muted-foreground">{done}/{total} tasks</span>
                      )}
                    </div>
                    {total > 0 && (
                      <div className="mt-2 h-1 rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${Math.round((done / total) * 100)}%` }} />
                      </div>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Tasks & Team */}
          <div className="space-y-6">
            {/* Task summary */}
            <div>
              <h2 className="font-heading font-semibold text-foreground mb-4">Tasks</h2>
              <div className="p-4 rounded-xl border border-border bg-card space-y-3">
                {[
                  { key: 'todo', label: 'To Do', color: 'bg-zinc-400' },
                  { key: 'in_progress', label: 'In Progress', color: 'bg-blue-400' },
                  { key: 'review', label: 'Review', color: 'bg-violet-400' },
                  { key: 'done', label: 'Done', color: 'bg-emerald-400' },
                ].map(({ key, label, color }) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${color}`} />
                      <span className="text-sm text-muted-foreground">{label}</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">{taskMap[key] || 0}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Team */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading font-semibold text-foreground">Team</h2>
                <Link href="/admin/crm/team" className="text-xs text-blue-400 hover:text-blue-300">Manage →</Link>
              </div>
              <div className="p-4 rounded-xl border border-border bg-card flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-xl font-bold text-foreground">{teamCount}</div>
                  <div className="text-xs text-muted-foreground">Team members</div>
                </div>
              </div>
            </div>

            {/* Portal Users */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading font-semibold text-foreground">Portal Users</h2>
                <Link href="/admin/crm/users" className="text-xs text-blue-400 hover:text-blue-300">Manage →</Link>
              </div>
              <Link href="/admin/crm/users" className="p-4 rounded-xl border border-border bg-card flex items-center gap-3 hover:border-blue-500/40 hover:bg-blue-500/5 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                  <UserCog className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground group-hover:text-blue-400 transition-colors">CRM Accounts</div>
                  <div className="text-xs text-muted-foreground">Manage access & permissions</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
