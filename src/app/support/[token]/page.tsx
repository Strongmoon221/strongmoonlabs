import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { prisma } from '@/lib/db'
import TicketChat from '@/components/support/TicketChat'

interface PageProps { params: Promise<{ token: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { token } = await params
  const ticket = await prisma.supportTicket.findUnique({ where: { token }, include: { app: { select: { name: true } } } })
  if (!ticket) return { title: 'Not Found' }
  return { title: `Support — ${ticket.app.name}`, robots: { index: false, follow: false } }
}

export default async function SupportChatPage({ params }: PageProps) {
  const { token } = await params
  const ticket = await prisma.supportTicket.findUnique({
    where: { token },
    include: {
      app: { select: { name: true, iconUrl: true } },
      messages: { orderBy: { createdAt: 'asc' } },
    },
  })
  if (!ticket) notFound()

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card px-4 py-3 flex items-center gap-3">
        <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        {ticket.app.iconUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={ticket.app.iconUrl} alt={ticket.app.name} className="w-8 h-8 rounded-lg object-cover" />
        ) : (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm">
            {ticket.app.name.charAt(0)}
          </div>
        )}
        <div>
          <p className="text-sm font-semibold text-foreground">{ticket.app.name} Support</p>
          <p className="text-xs text-muted-foreground">#{token.slice(0, 8).toUpperCase()}</p>
        </div>
        <span className={`ml-auto px-2.5 py-1 rounded-full text-xs font-medium border ${
          ticket.status === 'open'
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
        }`}>
          {ticket.status === 'open' ? 'Open' : 'Closed'}
        </span>
      </div>

      {/* Chat */}
      <TicketChat
        token={token}
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
  )
}
