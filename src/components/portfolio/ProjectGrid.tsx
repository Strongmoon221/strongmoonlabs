'use client'

import { useState } from 'react'
import ProjectCard from './ProjectCard'
import type { Project, ProjectCategory } from '@/types'
import { PROJECT_CATEGORIES } from '@/types'
import { cn } from '@/lib/utils'

interface ProjectGridProps {
  projects: Project[]
}

export default function ProjectGrid({ projects }: ProjectGridProps) {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory | 'all'>('all')

  const filtered =
    activeCategory === 'all'
      ? projects
      : projects.filter((p) => p.category === activeCategory)

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-10">
        {PROJECT_CATEGORIES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setActiveCategory(value)}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border',
              activeCategory === value
                ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/25'
                : 'border-border text-muted-foreground hover:text-foreground hover:border-zinc-500/50 bg-transparent'
            )}
          >
            {label}
            <span
              className={cn(
                'ml-2 px-1.5 py-0.5 rounded-full text-xs',
                activeCategory === value
                  ? 'bg-white/20 text-white'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {value === 'all' ? projects.length : projects.filter((p) => p.category === value).length}
            </span>
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 text-muted-foreground">
          <p className="text-lg">No projects in this category yet.</p>
        </div>
      )}
    </div>
  )
}
