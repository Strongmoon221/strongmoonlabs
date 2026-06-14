import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import AdminShell from '@/components/admin/AdminShell'
import CrmDashboard from '@/components/crm/CrmDashboard'
import { STATUS_CONFIG, PRIORITY_CONFIG } from '@/lib/crm'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'CRM' }

export default async function CrmDashboardPage() {
  const session = await getSession()
  if (!session) redirect('/admin/login')
  if (session.role !== 'admin' && !session.permissions.includes('tab.crm')) redirect('/admin')

  const [projects, teamCount, taskStats, allProjects] = await Promise.all([
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
    prisma.crmProject.findMany({ where: { archived: false }, select: { status: true, priority: true } }),
  ])

  const stats = {
    total: allProjects.length,
    active: allProjects.filter(p => p.status === 'active').length,
    done: allProjects.filter(p => p.status === 'done').length,
    critical: allProjects.filter(p => p.priority === 'critical').length,
  }

  const taskMap = Object.fromEntries(taskStats.map(t => [t.status, t._count]))

  return (
    <AdminShell role={session.role} permissions={session.permissions}>
      <CrmDashboard
        projects={projects}
        stats={stats}
        taskMap={taskMap}
        teamCount={teamCount}
        isAdmin={session.role === 'admin'}
        statusConfig={STATUS_CONFIG}
        priorityConfig={PRIORITY_CONFIG}
      />
    </AdminShell>
  )
}
