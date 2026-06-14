import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Users } from 'lucide-react'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import AdminShell from '@/components/admin/AdminShell'
import KanbanBoard from '@/components/crm/KanbanBoard'
import ProjectActions from '@/components/crm/ProjectActions'
import { STATUS_CONFIG, PRIORITY_CONFIG } from '@/lib/crm'

export const dynamic = 'force-dynamic'

interface PageProps { params: Promise<{ id: string }> }

export default async function ProjectDetailPage({ params }: PageProps) {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  const { id } = await params
  const [project, team] = await Promise.all([
    prisma.crmProject.findUnique({
      where: { id },
      include: {
        members: { include: { user: true } },
        tasks: {
          include: { assignee: { select: { id: true, name: true, color: true } } },
          orderBy: { order: 'asc' },
        },
      },
    }),
    prisma.crmUser.findMany({ orderBy: { name: 'asc' } }),
  ])

  if (!project) notFound()

  const cfg = STATUS_CONFIG[project.status as keyof typeof STATUS_CONFIG]
  const pri = PRIORITY_CONFIG[project.priority as keyof typeof PRIORITY_CONFIG]

  return (
    <AdminShell>
      <div className="max-w-7xl">
        <Link href="/admin/crm/projects" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Projects
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-heading font-bold text-foreground">{project.name}</h1>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.color}`}>{cfg.label}</span>
            </div>
            {project.description && <p className="text-sm text-muted-foreground max-w-xl">{project.description}</p>}
            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${pri.dot}`} />
                <span className={pri.color}>{pri.label} priority</span>
              </span>
              {project.deadline && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(project.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {project.members.length} members
              </span>
            </div>
          </div>
          <ProjectActions project={{
            id: project.id,
            name: project.name,
            description: project.description ?? '',
            status: project.status,
            priority: project.priority,
            deadline: project.deadline ? project.deadline.toISOString().split('T')[0] : '',
            archived: project.archived,
            memberIds: project.members.map(m => m.userId),
          }} team={team} />
        </div>

        {/* Members */}
        <div className="flex items-center gap-2 mb-6">
          {project.members.map(m => (
            <div key={m.user.id} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted border border-border text-xs text-foreground">
              <div className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white" style={{ backgroundColor: m.user.color }}>
                {m.user.name.charAt(0)}
              </div>
              {m.user.name}
            </div>
          ))}
        </div>

        {/* Kanban */}
        <KanbanBoard
          projectId={project.id}
          initialTasks={project.tasks.map(t => ({
            id: t.id,
            title: t.title,
            description: t.description ?? '',
            status: t.status,
            priority: t.priority,
            deadline: t.deadline ? t.deadline.toISOString().split('T')[0] : '',
            assignee: t.assignee,
            assigneeId: t.assigneeId ?? '',
          }))}
          team={project.members.map(m => m.user)}
        />
      </div>
    </AdminShell>
  )
}
