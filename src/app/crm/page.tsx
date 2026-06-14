import { redirect } from 'next/navigation'
import Link from 'next/link'
import { FolderOpen, CheckSquare, Users, Moon } from 'lucide-react'
import { getCrmSession } from '@/lib/crm-auth'
import { prisma } from '@/lib/db'
import CrmLogoutButton from '@/components/crm/CrmLogoutButton'

export const dynamic = 'force-dynamic'

export default async function CrmPortalPage() {
  const session = await getCrmSession()
  if (!session) redirect('/crm/login')

  const user = await prisma.crmAccount.findUnique({ where: { id: session.userId } })
  if (!user || !user.active) redirect('/crm/login')

  const perms: string[] = (() => { try { return JSON.parse(user.permissions) } catch { return [] } })()

  const [projectCount, taskCount] = await Promise.all([
    perms.includes('projects.view') ? prisma.crmProject.count({ where: { archived: false } }) : Promise.resolve(null),
    perms.includes('tasks.view') ? prisma.crmTask.count({ where: { status: { not: 'done' } } }) : Promise.resolve(null),
  ])

  const links = [
    { key: 'projects.view', href: '/admin/crm/projects', label: 'Projects', icon: FolderOpen, count: projectCount, color: 'bg-blue-500/10 text-blue-400' },
    { key: 'tasks.view',    href: '/admin/crm/projects', label: 'Active Tasks', icon: CheckSquare, count: taskCount, color: 'bg-violet-500/10 text-violet-400' },
    { key: 'team.view',     href: '/admin/crm/team',     label: 'Team',     icon: Users, count: null, color: 'bg-emerald-500/10 text-emerald-400' },
  ].filter(l => perms.includes(l.key))

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
            <Moon className="w-4 h-4 text-white" fill="currentColor" />
          </div>
          <div>
            <span className="font-heading font-bold text-sm text-foreground">Strongmoon CRM</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{user.name}</span>
          <CrmLogoutButton />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-heading font-bold text-foreground mb-2">Welcome, {user.name.split(' ')[0]}</h1>
        <p className="text-sm text-muted-foreground mb-8">Here&apos;s what you have access to:</p>

        {links.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-2xl">
            <p className="text-muted-foreground">No permissions assigned yet. Contact your administrator.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {links.map(({ href, label, icon: Icon, count, color }) => (
              <Link key={label} href={href} className="p-6 rounded-2xl border border-border bg-card hover:border-blue-500/40 hover:bg-blue-500/5 transition-all group">
                <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-4`}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className="font-heading font-semibold text-foreground group-hover:text-blue-400 transition-colors">{label}</p>
                {count !== null && <p className="text-2xl font-bold text-foreground mt-1">{count}</p>}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
