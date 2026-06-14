import { redirect } from 'next/navigation'
import Link from 'next/link'
import { PlusCircle, Archive, Calendar } from 'lucide-react'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import AdminShell from '@/components/admin/AdminShell'
import { STATUS_CONFIG, PRIORITY_CONFIG } from '@/lib/crm'
import ProjectFilters from '@/components/crm/ProjectFilters'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Projects' }

interface PageProps { searchParams: Promise<{ status?: string; priority?: string; search?: string; archived?: string }> }

export default async function ProjectsPage({ searchParams }: PageProps) {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  const sp = await searchParams
  const archived = sp.archived === 'true'

  const projects = await prisma.crmProject.findMany({
    where: {
      archived,
      ...(sp.status ? { status: sp.status } : {}),
      ...(sp.priority ? { priority: sp.priority } : {}),
      ...(sp.search ? { name: { contains: sp.search } } : {}),
    },
    include: {
      members: { include: { user: { select: { id: true, name: true, color: true } } } },
      tasks: { select: { status: true } },
    },
    orderBy: { updatedAt: 'desc' },
  })

  return (
    <AdminShell>
      <div className="max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground mb-1">Projects</h1>
            <p className="text-sm text-muted-foreground">{projects.length} {archived ? 'archived' : 'active'} projects</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/admin/crm/projects?archived=${archived ? 'false' : 'true'}`}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground transition-all"
            >
              <Archive className="w-3.5 h-3.5" />
              {archived ? 'Active' : 'Archived'}
            </Link>
            <Link
              href="/admin/crm/projects/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all"
            >
              <PlusCircle className="w-4 h-4" /> New Project
            </Link>
          </div>
        </div>

        <ProjectFilters />

        {projects.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-2xl">
            <p className="text-muted-foreground mb-4">No projects found</p>
            <Link href="/admin/crm/projects/new" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl">
              <PlusCircle className="w-4 h-4" /> Create Project
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {projects.map((project) => {
              const cfg = STATUS_CONFIG[project.status as keyof typeof STATUS_CONFIG]
              const pri = PRIORITY_CONFIG[project.priority as keyof typeof PRIORITY_CONFIG]
              const done = project.tasks.filter(t => t.status === 'done').length
              const total = project.tasks.length
              const pct = total > 0 ? Math.round((done / total) * 100) : 0
              return (
                <Link key={project.id} href={`/admin/crm/projects/${project.id}`}
                  className="block p-5 rounded-2xl border border-border bg-card hover:border-blue-500/40 hover:bg-blue-500/5 transition-all group"
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="font-heading font-semibold text-foreground group-hover:text-blue-400 transition-colors line-clamp-1">{project.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs border flex-shrink-0 ${cfg.color}`}>{cfg.label}</span>
                  </div>
                  {project.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{project.description}</p>
                  )}
                  <div className="flex items-center gap-1.5 mb-3">
                    <span className={`w-1.5 h-1.5 rounded-full ${pri.dot}`} />
                    <span className={`text-xs ${pri.color}`}>{pri.label}</span>
                    {project.deadline && (
                      <>
                        <span className="text-muted-foreground">·</span>
                        <Calendar className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </>
                    )}
                  </div>
                  {total > 0 && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>{done}/{total} tasks</span>
                        <span>{pct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )}
                  <div className="flex -space-x-1.5">
                    {project.members.slice(0, 5).map(m => (
                      <div key={m.user.id} className="w-6 h-6 rounded-full border-2 border-card flex items-center justify-center text-[9px] font-bold text-white" style={{ backgroundColor: m.user.color }} title={m.user.name}>
                        {m.user.name.charAt(0)}
                      </div>
                    ))}
                    {project.members.length > 5 && <div className="w-6 h-6 rounded-full border-2 border-card bg-muted flex items-center justify-center text-[9px] text-muted-foreground">+{project.members.length - 5}</div>}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </AdminShell>
  )
}
