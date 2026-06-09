import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, Github, ArrowLeft, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react'
import { prisma } from '@/lib/db'
import { serializeProject, getCategoryLabel, getCategoryColor } from '@/lib/utils'
import AnimatedSection from '@/components/ui/AnimatedSection'
import CTA from '@/components/sections/CTA'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getProject(slug: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { slug, published: true },
      include: { screenshots: { orderBy: { order: 'asc' } } },
    })
    if (!project) return null
    return serializeProject(project)
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) return { title: 'Project Not Found' }

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: `${project.title} | Strongmoon Labs`,
      description: project.description,
      images: project.coverImage ? [{ url: project.coverImage }] : [],
    },
  }
}

export async function generateStaticParams() {
  try {
    const projects = await prisma.project.findMany({
      where: { published: true },
      select: { slug: true },
    })
    return projects.map(({ slug }) => ({ slug }))
  } catch {
    return []
  }
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params
  const project = await getProject(slug)

  if (!project) notFound()

  return (
    <>
      {/* Back navigation */}
      <div className="pt-24 pb-4">
        <div className="container-custom">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="pb-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <AnimatedSection>
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border mb-4 ${getCategoryColor(project.category)}`}
                >
                  {getCategoryLabel(project.category)}
                </span>
              </AnimatedSection>
              <AnimatedSection delay={0.05}>
                <h1 className="text-4xl sm:text-5xl font-bold font-heading tracking-tight mb-4">
                  {project.title}
                </h1>
              </AnimatedSection>
              <AnimatedSection delay={0.1}>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  {project.description}
                </p>
              </AnimatedSection>
              <AnimatedSection delay={0.15}>
                <div className="flex flex-wrap gap-3">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/25"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Live
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 border border-border hover:border-zinc-500/50 text-foreground text-sm font-semibold rounded-xl transition-all"
                    >
                      <Github className="w-4 h-4" />
                      Source Code
                    </a>
                  )}
                </div>
              </AnimatedSection>
            </div>

            {/* Cover image */}
            <AnimatedSection delay={0.2} direction="left">
              <div className="relative h-72 lg:h-96 rounded-2xl overflow-hidden border border-border">
                {project.coverImage ? (
                  <Image
                    src={project.coverImage}
                    alt={project.title}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-indigo-600/20 to-violet-600/20 flex items-center justify-center">
                    <span className="text-8xl font-bold text-white/10 font-heading select-none">
                      {project.title.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="py-12 border-t border-border">
        <div className="container-custom">
          <AnimatedSection>
            <h2 className="text-lg font-heading font-semibold text-foreground mb-4">
              Technologies Used
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={0.05}>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium bg-muted text-foreground border border-border"
                >
                  {tech}
                </span>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Long description */}
      {project.longDescription && (
        <section className="py-12 border-t border-border">
          <div className="container-custom max-w-3xl">
            <AnimatedSection>
              <h2 className="text-2xl font-heading font-semibold text-foreground mb-6">
                Project Overview
              </h2>
            </AnimatedSection>
            <AnimatedSection delay={0.05}>
              <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                {project.longDescription.split('\n\n').map((para, i) => (
                  <p key={i} className="mb-4 last:mb-0">{para}</p>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Features */}
      {project.features && project.features.length > 0 && (
        <section className="py-12 border-t border-border bg-muted/20">
          <div className="container-custom">
            <AnimatedSection>
              <h2 className="text-2xl font-heading font-semibold text-foreground mb-8">
                Key Features
              </h2>
            </AnimatedSection>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {project.features.map((feature, i) => (
                <AnimatedSection key={i} delay={i * 0.05}>
                  <div className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Challenges & Results */}
      {(project.challenges || project.results) && (
        <section className="py-12 border-t border-border">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {project.challenges && (
                <AnimatedSection>
                  <div className="p-6 rounded-2xl border border-border bg-card h-full">
                    <div className="flex items-center gap-2 mb-4">
                      <AlertCircle className="w-5 h-5 text-amber-400" />
                      <h2 className="font-heading font-semibold text-lg text-foreground">
                        Challenges
                      </h2>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {project.challenges}
                    </p>
                  </div>
                </AnimatedSection>
              )}
              {project.results && (
                <AnimatedSection delay={0.1}>
                  <div className="p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 h-full">
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp className="w-5 h-5 text-emerald-400" />
                      <h2 className="font-heading font-semibold text-lg text-foreground">
                        Results
                      </h2>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {project.results}
                    </p>
                  </div>
                </AnimatedSection>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Screenshots gallery */}
      {project.screenshots.length > 0 && (
        <section className="py-12 border-t border-border">
          <div className="container-custom">
            <AnimatedSection>
              <h2 className="text-2xl font-heading font-semibold text-foreground mb-8">
                Screenshots
              </h2>
            </AnimatedSection>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.screenshots.map((screenshot, i) => (
                <AnimatedSection key={screenshot.id} delay={i * 0.07}>
                  <div className="relative h-56 rounded-xl overflow-hidden border border-border group">
                    <Image
                      src={screenshot.url}
                      alt={screenshot.alt || `${project.title} screenshot ${i + 1}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTA />
    </>
  )
}
