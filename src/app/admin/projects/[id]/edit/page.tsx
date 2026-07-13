import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import AdminShell from '@/components/admin/AdminShell'
import ProjectForm from '@/components/admin/ProjectForm'

interface PageProps {
  params: Promise<{ id: string }>
}

export const metadata = { title: 'Edit Project' }

export default async function EditProjectPage({ params }: PageProps) {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  const { id } = await params
  const project = await prisma.project.findUnique({ where: { id } })
  if (!project) notFound()

  return (
    <AdminShell>
      <div>
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>
        <h1 className="text-2xl font-heading font-bold text-foreground mb-8">
          Edit: {project.title}
        </h1>
        <ProjectForm
          mode="edit"
          initialData={{
            id: project.id,
            title: project.title,
            slug: project.slug,
            description: project.description,
            longDescription: project.longDescription ?? undefined,
            category: project.category as 'mobile' | 'website' | 'saas' | 'tool',
            technologies: project.technologies,
            features: project.features ?? undefined,
            challenges: project.challenges ?? undefined,
            results: project.results ?? undefined,
            liveUrl: project.liveUrl ?? undefined,
            githubUrl: project.githubUrl ?? undefined,
            coverImage: project.coverImage ?? undefined,
            featured: project.featured,
            published: project.published,
            order: project.order,
          }}
        />
      </div>
    </AdminShell>
  )
}
