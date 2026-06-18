import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import AdminShell from '@/components/admin/AdminShell'
import MonitoringDashboard from '@/components/admin/monitoring/MonitoringDashboard'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Monitoring' }

export default async function MonitoringPage() {
  const session = await getSession()
  if (!session) redirect('/admin/login')
  if (session.role !== 'admin') redirect('/admin')

  const servers = await prisma.monitoredServer.findMany({ where: { active: true }, orderBy: { createdAt: 'asc' } })

  return (
    <AdminShell role={session.role} permissions={session.permissions}>
      <MonitoringDashboard initialServers={servers} />
    </AdminShell>
  )
}
