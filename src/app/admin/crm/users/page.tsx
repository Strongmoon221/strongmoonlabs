import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import AdminShell from '@/components/admin/AdminShell'
import CrmUsersManager from '@/components/crm/CrmUsersManager'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'CRM Users' }

export default async function CrmUsersPage() {
  const session = await getSession()
  if (!session) redirect('/admin/login')
  if (session.role !== 'admin') redirect('/admin')

  const [users, apps] = await Promise.all([
    prisma.crmAccount.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.app.findMany({ select: { id: true, name: true, slug: true }, orderBy: { name: 'asc' } }),
  ])

  return (
    <AdminShell role={session.role} permissions={session.permissions}>
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl font-heading font-bold text-foreground mb-1">Users</h1>
          <p className="text-sm text-muted-foreground">
            Create accounts and assign access. Users log in at <span className="text-blue-400">/admin/login</span>
          </p>
        </div>
        <CrmUsersManager
          initialUsers={users.map(u => ({ ...u, password: '' }))}
          apps={apps}
        />
      </div>
    </AdminShell>
  )
}
