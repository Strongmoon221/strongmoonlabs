import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { getCategoryLabel, getCategoryColor } from '@/lib/utils'
import type { Project } from '@/types'

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/portfolio/${project.slug}`}
      className="group block rounded-2xl border border-border bg-card overflow-hidden hover:border-zinc-600/60 dark:hover:border-zinc-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 h-full"
    >
      {/* Cover */}
      <div className="relative h-52 bg-muted overflow-hidden">
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-indigo-600/20 to-violet-600/20 flex items-center justify-center">
            <span className="text-6xl font-bold text-white/10 font-heading select-none">
              {project.title.charAt(0)}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-blue-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="bg-white rounded-full p-3 shadow-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <ArrowUpRight className="w-5 h-5 text-blue-700" />
          </div>
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getCategoryColor(project.category)}`}
          >
            {getCategoryLabel(project.category)}
          </span>
          {project.featured && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
              Featured
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-heading font-semibold text-base text-foreground mb-2 group-hover:text-blue-400 transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-muted text-muted-foreground border border-border"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-muted text-muted-foreground border border-border">
              +{project.technologies.length - 4}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
