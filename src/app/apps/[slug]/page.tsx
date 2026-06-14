import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Shield, FileText, HeadphonesIcon, ChevronRight } from 'lucide-react'
import { prisma } from '@/lib/db'

interface PageProps {
  params: Promise<{ slug: string }>
}

const PAGE_TYPES = [
  { type: 'privacy', url: 'privacy-policy', label: 'Privacy Policy', icon: Shield, description: 'How we collect and use your data' },
  { type: 'terms', url: 'terms', label: 'Terms of Service', icon: FileText, description: 'Rules and conditions for using the app' },
  { type: 'support', url: 'support', label: 'Support', icon: HeadphonesIcon, description: 'Get help and contact us' },
]

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const app = await prisma.app.findUnique({ where: { slug, published: true } })
  if (!app) return { title: 'Not Found' }
  return {
    title: `${app.name} — Strongmoon Labs`,
    description: app.description ?? `Legal pages and support for ${app.name}`,
  }
}

export default async function AppIndexPage({ params }: PageProps) {
  const { slug } = await params

  const app = await prisma.app.findUnique({
    where: { slug, published: true },
    include: { pages: true },
  })

  if (!app) notFound()

  const availablePages = PAGE_TYPES.filter((p) => app.pages.some((ap) => ap.type === p.type))

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Strongmoon Labs
        </Link>

        {/* App header */}
        <div className="flex items-center gap-4 mb-10">
          {app.iconUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={app.iconUrl} alt={app.name} className="w-16 h-16 rounded-2xl object-cover shadow-lg" />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-blue-500/25">
              {app.name.charAt(0)}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">{app.name}</h1>
            {app.description && (
              <p className="text-sm text-muted-foreground mt-0.5">{app.description}</p>
            )}
          </div>
        </div>

        {/* Available pages */}
        {availablePages.length > 0 && (
          <div className="space-y-3 mb-6">
            {availablePages.map(({ url, label, icon: Icon, description }) => (
              <Link
                key={url}
                href={`/apps/${slug}/${url}`}
                className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-card hover:border-blue-500/40 hover:bg-blue-500/5 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">{description}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
              </Link>
            ))}
          </div>
        )}

        {availablePages.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No pages available yet.
          </div>
        )}

        {/* Footer */}
        <p className="text-xs text-muted-foreground text-center mt-10">
          © {new Date().getFullYear()} {app.name} · Developed by{' '}
          <Link href="/" className="text-blue-400 hover:underline">Strongmoon Labs</Link>
        </p>
      </div>
    </div>
  )
}
