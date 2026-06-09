import { redirect } from 'next/navigation'
import Link from 'next/link'
import { PlusCircle, Pencil, Smartphone } from 'lucide-react'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import AdminShell from '@/components/admin/AdminShell'
import DeleteAppButton from '@/components/admin/DeleteAppButton'

export const metadata = { title: 'Apps' }

const PAGE_TYPES = ['privacy', 'terms', 'support'] as const
const PAGE_LABELS: Record<string, string> = { privacy: 'Privacy', terms: 'Terms', support: 'Support' }
const PAGE_URLS: Record<string, string> = { privacy: 'privacy-policy', terms: 'terms', support: 'support' }

export default async function AdminAppsPage() {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  const apps = await prisma.app.findMany({
    include: { pages: { select: { type: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <AdminShell>
      <div className="max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground mb-1">Apps</h1>
            <p className="text-sm text-muted-foreground">
              Manage privacy policies, terms and support pages for your mobile apps
            </p>
          </div>
          <Link
            href="/admin/apps/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/25"
          >
            <PlusCircle className="w-4 h-4" />
            New App
          </Link>
        </div>

        {apps.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-2xl">
            <Smartphone className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground mb-4">No apps yet</p>
            <Link
              href="/admin/apps/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              Add your first app
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {apps.map((app) => (
              <div key={app.id} className="p-5 rounded-2xl border border-border bg-card">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {app.iconUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={app.iconUrl} alt={app.name} className="w-10 h-10 rounded-xl object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold">
                        {app.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-heading font-semibold text-foreground">{app.name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${app.published ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'}`}>
                          {app.published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">/{app.slug}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/admin/apps/${app.id}/edit`}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <DeleteAppButton id={app.id} name={app.name} />
                  </div>
                </div>

                {/* Pages status */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {PAGE_TYPES.map((type) => {
                    const exists = app.pages.some((p) => p.type === type)
                    return (
                      <div key={type} className="flex items-center gap-1.5">
                        {exists ? (
                          <Link
                            href={`/apps/${app.slug}/${PAGE_URLS[type]}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
                          >
                            ✓ {PAGE_LABELS[type]}
                          </Link>
                        ) : (
                          <Link
                            href={`/admin/apps/${app.id}/edit?page=${type}`}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-zinc-500/10 text-zinc-400 border border-zinc-500/20 hover:bg-zinc-500/20 transition-colors"
                          >
                            + Add {PAGE_LABELS[type]}
                          </Link>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  )
}
