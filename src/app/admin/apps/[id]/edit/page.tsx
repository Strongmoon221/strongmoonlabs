import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import AdminShell from '@/components/admin/AdminShell'
import AppPageEditor from '@/components/admin/AppPageEditor'

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ page?: string }>
}

const PAGE_TYPES = [
  { type: 'privacy', label: 'Privacy Policy', url: 'privacy-policy', defaultTitle: 'Privacy Policy' },
  { type: 'terms', label: 'Terms of Service', url: 'terms', defaultTitle: 'Terms of Service' },
  { type: 'support', label: 'Support', url: 'support', defaultTitle: 'Support' },
]

export default async function EditAppPage({ params, searchParams }: PageProps) {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  const { id } = await params
  const { page: activeTab } = await searchParams

  const app = await prisma.app.findUnique({
    where: { id },
    include: { pages: true },
  })
  if (!app) notFound()

  const activeType = activeTab || 'privacy'

  return (
    <AdminShell>
      <div className="max-w-4xl">
        <Link href="/admin/apps" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Apps
        </Link>

        {/* App header */}
        <div className="flex items-center gap-3 mb-8">
          {app.iconUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={app.iconUrl} alt={app.name} className="w-12 h-12 rounded-xl object-cover" />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-xl">
              {app.name.charAt(0)}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">{app.name}</h1>
            <p className="text-sm text-muted-foreground">/apps/{app.slug}/...</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-border pb-0">
          {PAGE_TYPES.map(({ type, label, url }) => {
            const exists = app.pages.some((p) => p.type === type)
            return (
              <div key={type} className="flex items-center gap-1">
                <Link
                  href={`/admin/apps/${id}/edit?page=${type}`}
                  className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px ${
                    activeType === type
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {label}
                  {exists && <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />}
                </Link>
                {exists && (
                  <Link
                    href={`/apps/${app.slug}/${url}`}
                    target="_blank"
                    className="text-muted-foreground hover:text-foreground transition-colors mb-px"
                    title="View live page"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            )
          })}
        </div>

        {/* Editor */}
        {PAGE_TYPES.map(({ type, defaultTitle }) => {
          if (activeType !== type) return null
          const existingPage = app.pages.find((p) => p.type === type)
          return (
            <AppPageEditor
              key={type}
              appId={app.id}
              type={type as 'privacy' | 'terms' | 'support'}
              defaultTitle={existingPage?.title ?? defaultTitle}
              defaultContent={existingPage?.content ?? ''}
            />
          )
        })}
      </div>
    </AdminShell>
  )
}
