import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import AdminShell from '@/components/admin/AdminShell'
import ProjectForm from '@/components/crm/ProjectForm'

export const metadata = { title: 'New Project' }

export default async function NewProjectPage() {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  const team = await prisma.crmUser.findMany({ orderBy: { name: 'asc' } })

  return (
    <AdminShell role={session.role} permissions={session.permissions}>
      <div className="max-w-2xl">
        <Link href="/admin/crm/projects" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </Link>
        <h1 className="text-2xl font-heading font-bold text-foreground mb-8">New Project</h1>
        <ProjectForm team={team} />
      </div>
    </AdminShell>
  )
}
