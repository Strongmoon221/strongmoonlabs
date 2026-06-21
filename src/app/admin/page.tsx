import { redirect } from 'next/navigation'
import Link from 'next/link'
import { FolderOpen, MessageSquare, Eye, PlusCircle, ArrowRight, Kanban } from 'lucide-react'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import AdminShell from '@/components/admin/AdminShell'
import { formatDate } from '@/lib/utils'

export default async function AdminDashboardPage() {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  const isAdmin = session.role === 'admin'
  const can = (perm: string) => isAdmin || session.permissions.includes(perm)

  const [projectCount, publishedCount, messageCount, unreadCount, recentMessages] =
    await Promise.all([
      can('tab.projects') ? prisma.project.count() : Promise.resolve(null),
      can('tab.projects') ? prisma.project.count({ where: { published: true } }) : Promise.resolve(null),
      can('tab.messages') ? prisma.contactMessage.count() : Promise.resolve(null),
      can('tab.messages') ? prisma.contactMessage.count({ where: { read: false } }) : Promise.resolve(null),
      can('tab.messages') ? prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }) : Promise.resolve([]),
    ])

  const stats = [
    can('tab.projects') && {
      label: 'Total Projects', value: projectCount, sub: `${publishedCount} published`,
      icon: FolderOpen, href: '/admin/projects', color: 'from-blue-500 to-indigo-500',
    },
    can('tab.messages') && {
      label: 'Contact Messages', value: messageCount,
      sub: (unreadCount ?? 0) > 0 ? `${unreadCount} unread` : 'All read',
      icon: MessageSquare, href: '/admin/messages',
      color: (unreadCount ?? 0) > 0 ? 'from-amber-500 to-orange-500' : 'from-emerald-500 to-teal-500',
    },
    can('tab.crm') && {
      label: 'CRM', value: 'Open', sub: 'Project manager',
      icon: Kanban, href: '/admin/crm', color: 'from-violet-500 to-purple-500',
    },
    isAdmin && {
      label: 'Live Site', value: 'View', sub: 'Open in new tab',
      icon: Eye, href: '/', color: 'from-zinc-500 to-zinc-600', external: true,
    },
  ].filter(Boolean) as { label: string; value: string | number | null; sub: string; icon: React.ElementType; href: string; color: string; external?: boolean }[]

  return (
    <AdminShell role={session.role} permissions={session.permissions}>
      <div className="max-w-5xl">
        <div className="mb-8">
          <h1 className="text-2xl font-heading font-bold text-foreground mb-1">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back, {session.email}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Link
                key={stat.label}
                href={stat.href}
                target={stat.external ? '_blank' : undefined}
                className="group p-5 rounded-2xl border border-border bg-card hover:bg-muted/20 transition-all hover:-translate-y-0.5"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-2xl font-bold font-heading text-foreground mb-1">{stat.value}</div>
                <div className="text-xs text-muted-foreground font-medium">{stat.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{stat.sub}</div>
              </Link>
            )
          })}
        </div>

        {/* Quick actions */}
        {(can('tab.projects') || can('tab.messages')) && (
          <div className="mb-10">
            <h2 className="font-heading font-semibold text-base text-foreground mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-3">
              {can('tab.projects') && can('projects.create') && (
                <Link href="/admin/projects/new" className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/25">
                  <PlusCircle className="w-4 h-4" /> New Project
                </Link>
              )}
              {can('tab.projects') && (
                <Link href="/admin/projects" className="inline-flex items-center gap-2 px-4 py-2.5 border border-border text-foreground text-sm font-semibold rounded-xl hover:bg-muted transition-all">
                  <FolderOpen className="w-4 h-4" /> All Projects
                </Link>
              )}
              {can('tab.messages') && (
                <Link href="/admin/messages" className="inline-flex items-center gap-2 px-4 py-2.5 border border-border text-foreground text-sm font-semibold rounded-xl hover:bg-muted transition-all">
                  <MessageSquare className="w-4 h-4" /> Messages
                  {(unreadCount ?? 0) > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30">{unreadCount}</span>
                  )}
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Recent messages */}
        {can('tab.messages') && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-semibold text-base text-foreground">Recent Messages</h2>
              <Link href="/admin/messages" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            {recentMessages.length === 0 ? (
              <p className="text-sm text-muted-foreground">No messages yet</p>
            ) : (
              <div className="space-y-2">
                {recentMessages.map((msg) => (
                  <div key={msg.id} className={`p-4 rounded-xl border ${!msg.read ? 'border-blue-500/20 bg-blue-500/5' : 'border-border bg-card'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm text-foreground">{msg.name}</span>
                          {!msg.read && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{msg.subject || msg.message}</p>
                      </div>
                      <span className="text-xs text-muted-foreground flex-shrink-0">{formatDate(msg.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </AdminShell>
  )
}
