import type { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { serializeProject } from '@/lib/utils'
import AnimatedSection from '@/components/ui/AnimatedSection'
import ProjectGrid from '@/components/portfolio/ProjectGrid'
import CTA from '@/components/sections/CTA'

export const metadata: Metadata = {
  title: 'Portfolio',
  description:
    'Explore our portfolio of mobile apps, web platforms, SaaS products, and internal tools built for clients worldwide.',
}

async function getProjects() {
  try {
    const projects = await prisma.project.findMany({
      where: { published: true },
      include: { screenshots: { orderBy: { order: 'asc' } } },
      orderBy: [{ featured: 'desc' }, { order: 'asc' }],
    })
    return projects.map(serializeProject)
  } catch {
    return []
  }
}

export default async function PortfolioPage() {
  const projects = await getProjects()

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16">
        <div className="container-custom">
          <div className="max-w-2xl mb-4">
            <AnimatedSection>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-4">
                Our Work
              </span>
            </AnimatedSection>
            <AnimatedSection delay={0.05}>
              <h1 className="text-4xl sm:text-5xl font-bold font-heading tracking-tight mb-4">
                Projects We&apos;re{' '}
                <span className="gradient-text">Proud Of</span>
              </h1>
            </AnimatedSection>
            <AnimatedSection delay={0.1}>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {projects.length} projects across mobile, web, SaaS, and enterprise tools. Each one
                built with the same care, craft, and commitment to quality.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Portfolio grid */}
      <section className="pb-20">
        <div className="container-custom">
          <AnimatedSection delay={0.15}>
            <ProjectGrid projects={projects} />
          </AnimatedSection>
        </div>
      </section>

      <CTA />
    </>
  )
}
