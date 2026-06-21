import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Shield, FileText } from 'lucide-react'
import { prisma } from '@/lib/db'

interface PageProps {
  params: Promise<{ slug: string; pageType: string }>
}

const pageTypeMeta: Record<string, { label: string; icon: typeof Shield }> = {
  'privacy-policy': { label: 'Privacy Policy', icon: Shield },
  'terms': { label: 'Terms of Service', icon: FileText },
}

const pageTypeDb: Record<string, string> = {
  'privacy-policy': 'privacy',
  'terms': 'terms',
}

async function getData(slug: string, pageType: string) {
  const dbType = pageTypeDb[pageType]
  if (!dbType) return null

  const app = await prisma.app.findUnique({
    where: { slug, published: true },
    include: {
      pages: { where: { type: dbType } },
    },
  })

  if (!app || app.pages.length === 0) return null
  return { app, page: app.pages[0] }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, pageType } = await params
  const data = await getData(slug, pageType)
  if (!data) return { title: 'Not Found' }

  const meta = pageTypeMeta[pageType]
  return {
    title: `${data.page.title} — ${data.app.name}`,
    description: `${meta?.label ?? pageType} for ${data.app.name}`,
    robots: { index: true, follow: false },
  }
}

export default async function AppLegalPage({ params }: PageProps) {
  const { slug, pageType } = await params
  const data = await getData(slug, pageType)

  if (!data) notFound()

  const { app, page } = data
  const meta = pageTypeMeta[pageType]
  const Icon = meta?.icon ?? FileText

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Strongmoon Labs
        </Link>

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          {app.iconUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={app.iconUrl} alt={app.name} className="w-10 h-10 rounded-xl object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-lg">
              {app.name.charAt(0)}
            </div>
          )}
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{app.name}</p>
            <div className="flex items-center gap-1.5">
              <Icon className="w-4 h-4 text-blue-400" />
              <h1 className="text-xl font-heading font-bold text-foreground">{page.title}</h1>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mb-8">
          Last updated: {new Date(page.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <hr className="border-border mb-8" />

        {/* Content */}
        <div
          className="prose prose-neutral dark:prose-invert max-w-none
            prose-h2:text-xl prose-h2:font-heading prose-h2:font-bold prose-h2:text-foreground prose-h2:mt-0 prose-h2:mb-4
            prose-h3:text-base prose-h3:font-heading prose-h3:font-semibold prose-h3:text-foreground prose-h3:mt-8 prose-h3:mb-2
            prose-h4:text-sm prose-h4:font-semibold prose-h4:text-blue-400 prose-h4:mt-6 prose-h4:mb-1
            prose-p:text-sm prose-p:text-muted-foreground prose-p:leading-relaxed
            prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-foreground
            prose-li:text-sm prose-li:text-muted-foreground
            prose-hr:border-border"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />

        <hr className="border-border mt-12 mb-6" />
        <p className="text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()} {app.name} · Developed by{' '}
          <Link href="/" className="text-blue-400 hover:underline">Strongmoon Labs</Link>
        </p>
      </div>
    </div>
  )
}
