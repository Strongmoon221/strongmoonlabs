import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import AdminShell from '@/components/admin/AdminShell'
import MessagesClient from '@/components/admin/MessagesClient'

export const metadata = { title: 'Messages' }

export default async function AdminMessagesPage() {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <AdminShell role={session.role} permissions={session.permissions}>
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl font-heading font-bold text-foreground mb-1">Messages</h1>
          <p className="text-sm text-muted-foreground">
            {messages.filter((m) => !m.read).length} unread of {messages.length} total
          </p>
        </div>
        <MessagesClient messages={messages} />
      </div>
    </AdminShell>
  )
}
