import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import AdminShell from '@/components/admin/AdminShell'
import TeamManager from '@/components/crm/TeamManager'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Team' }

export default async function TeamPage() {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  const users = await prisma.crmUser.findMany({
    include: { _count: { select: { projects: true, tasks: true } } },
    orderBy: { name: 'asc' },
  })

  return (
    <AdminShell>
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl font-heading font-bold text-foreground mb-1">Team</h1>
          <p className="text-sm text-muted-foreground">{users.length} members</p>
        </div>
        <TeamManager initialUsers={users.map(u => ({ ...u, projectCount: u._count.projects, taskCount: u._count.tasks }))} />
      </div>
    </AdminShell>
  )
}
