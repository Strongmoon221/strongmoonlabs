import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { getCategoryLabel, getCategoryColor } from '@/lib/utils'
import type { Project } from '@/types'

interface FeaturedProjectsProps {
  projects: Project[]
}

export default function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  return (
    <section className="section-padding bg-muted/20">
      <div className="container-custom">
        <SectionHeader
          eyebrow="Featured Work"
          title="Projects We're"
          titleHighlight="Proud Of"
          description="A selection of our most impactful work. Each project tells a story of a problem solved and a business transformed."
          className="mb-16"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {projects.map((project, i) => (
            <AnimatedSection key={project.id} delay={i * 0.1}>
              <Link
                href={`/portfolio/${project.slug}`}
                className="group block h-full rounded-2xl border border-border bg-card overflow-hidden hover:border-zinc-600/60 dark:hover:border-zinc-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20"
              >
                {/* Cover image */}
                <div className="relative h-48 bg-muted overflow-hidden">
                  {project.coverImage ? (
                    <Image
                      src={project.coverImage}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-violet-600/20 flex items-center justify-center">
                      <span className="text-4xl font-bold text-white/20 font-heading">
                        {project.title.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getCategoryColor(project.category)}`}
                    >
                      {getCategoryLabel(project.category)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-heading font-semibold text-lg text-foreground mb-2 group-hover:text-blue-400 transition-colors flex items-center gap-1">
                    {project.title}
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-muted text-muted-foreground border border-border"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-muted text-muted-foreground border border-border">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className="text-center">
          <Link
            href="/portfolio"
            className="group inline-flex items-center gap-2 px-8 py-4 border border-border hover:border-blue-500/50 text-foreground hover:text-blue-400 font-semibold rounded-xl transition-all duration-200"
          >
            View All Projects
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  )
}
