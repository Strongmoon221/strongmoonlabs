import { redirect } from 'next/navigation'
import Link from 'next/link'
import { PlusCircle, Pencil, Eye, Star } from 'lucide-react'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { getCategoryLabel, getCategoryColor, parseJsonArray } from '@/lib/utils'
import AdminShell from '@/components/admin/AdminShell'
import DeleteProjectButton from '@/components/admin/DeleteProjectButton'
import TogglePublishedButton from '@/components/admin/TogglePublishedButton'

async function getProjects() {
  return prisma.project.findMany({
    orderBy: [{ featured: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }],
    include: { _count: { select: { screenshots: true } } },
  })
}

export default async function AdminProjectsPage() {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  const projects = await getProjects()

  return (
    <AdminShell role={session.role} permissions={session.permissions}>
      <div className="max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground mb-1">Projects</h1>
            <p className="text-sm text-muted-foreground">{projects.length} total projects</p>
          </div>
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/25"
          >
            <PlusCircle className="w-4 h-4" />
            New Project
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-2xl">
            <p className="text-muted-foreground mb-4">No projects yet</p>
            <Link
              href="/admin/projects/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              Create your first project
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Project</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Category</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Technologies</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {project.featured && (
                          <Star className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" fill="currentColor" />
                        )}
                        <div>
                          <div className="font-medium text-foreground">{project.title}</div>
                          <div className="text-xs text-muted-foreground">/{project.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getCategoryColor(project.category)}`}>
                        {getCategoryLabel(project.category)}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {parseJsonArray(project.technologies).slice(0, 3).map((tech) => (
                          <span key={tech} className="px-1.5 py-0.5 rounded text-xs bg-muted text-muted-foreground border border-border">
                            {tech}
                          </span>
                        ))}
                        {parseJsonArray(project.technologies).length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{parseJsonArray(project.technologies).length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <TogglePublishedButton id={project.id} published={project.published} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/portfolio/${project.slug}`}
                          target="_blank"
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                          title="View on site"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/projects/${project.id}/edit`}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <DeleteProjectButton id={project.id} title={project.title} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminShell>
  )
}
