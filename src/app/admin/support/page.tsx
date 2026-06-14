import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import AdminShell from '@/components/admin/AdminShell'
import SupportTicketList from '@/components/admin/SupportTicketList'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Support Tickets' }

export default async function AdminSupportPage() {
  const session = await getSession()
  if (!session) redirect('/admin/login')
  if (session.role !== 'admin' && !session.permissions.includes('tab.support')) redirect('/admin')

  const allowedSupportAppIds = session.role === 'crm' && session.resources.support?.length ? session.resources.support : undefined
  const [tickets, apps] = await Promise.all([
    prisma.supportTicket.findMany({
      where: allowedSupportAppIds ? { appId: { in: allowedSupportAppIds } } : undefined,
      include: { app: { select: { name: true, slug: true, iconUrl: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.app.findMany({
      where: allowedSupportAppIds ? { id: { in: allowedSupportAppIds } } : undefined,
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
  ])

  const openCount = tickets.filter((t) => t.status === 'open').length

  return (
    <AdminShell role={session.role} permissions={session.permissions}>
      <div className="max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground mb-1">
              Support Tickets
            </h1>
            <p className="text-sm text-muted-foreground">
              {openCount > 0 ? (
                <span className="text-amber-400 font-medium">{openCount} open</span>
              ) : (
                'All caught up'
              )}{' '}
              · {tickets.length} total
            </p>
          </div>
        </div>

        <SupportTicketList tickets={tickets} apps={apps} />
      </div>
    </AdminShell>
  )
}
