import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import AdminShell from '@/components/admin/AdminShell'
import TicketChat from '@/components/support/TicketChat'
import TicketStatusButton from '@/components/admin/TicketStatusButton'

export const dynamic = 'force-dynamic'

interface PageProps { params: Promise<{ id: string }> }

export default async function AdminTicketPage({ params }: PageProps) {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  const { id } = await params
  const ticket = await prisma.supportTicket.findUnique({
    where: { id },
    include: {
      app: { select: { name: true, iconUrl: true, slug: true } },
      messages: { orderBy: { createdAt: 'asc' } },
    },
  })
  if (!ticket) notFound()

  return (
    <AdminShell>
      <div className="max-w-3xl">
        <Link href="/admin/support" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Support
        </Link>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {ticket.app.iconUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={ticket.app.iconUrl} alt={ticket.app.name} className="w-9 h-9 rounded-xl object-cover" />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold">
                {ticket.app.name.charAt(0)}
              </div>
            )}
            <div>
              <h1 className="font-heading font-bold text-foreground">{ticket.name}</h1>
              <p className="text-xs text-muted-foreground">{ticket.email} · {ticket.app.name} · #{ticket.token.slice(0, 8).toUpperCase()}</p>
            </div>
          </div>
          <TicketStatusButton id={ticket.id} status={ticket.status} />
        </div>

        <div className="rounded-2xl border border-border bg-card overflow-hidden" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column' }}>
          <TicketChat
            token={ticket.token}
            ticketId={ticket.id}
            isAdmin
            initialMessages={ticket.messages.map(m => ({
              id: m.id,
              content: m.content,
              fromAdmin: m.fromAdmin,
              createdAt: m.createdAt.toISOString(),
            }))}
            status={ticket.status}
            userName={ticket.name}
          />
        </div>
      </div>
    </AdminShell>
  )
}
