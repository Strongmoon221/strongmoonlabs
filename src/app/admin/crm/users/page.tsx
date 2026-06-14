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

  const users = await prisma.crmAccount.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <AdminShell>
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl font-heading font-bold text-foreground mb-1">CRM Users</h1>
          <p className="text-sm text-muted-foreground">
            Create accounts for team members and assign their permissions in the CRM.
            They log in at <span className="text-blue-400">/crm/login</span>
          </p>
        </div>
        <CrmUsersManager initialUsers={users.map(u => ({ ...u, password: '' }))} />
      </div>
    </AdminShell>
  )
}
