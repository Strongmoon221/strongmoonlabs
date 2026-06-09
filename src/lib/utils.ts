import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Project } from '@/types'
import type { Project as PrismaProject, Screenshot as PrismaScreenshot } from '@prisma/client'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function parseJsonArray(json: string | null | undefined): string[] {
  if (!json) return []
  try {
    const parsed = JSON.parse(json)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    mobile: 'Mobile App',
    website: 'Website',
    saas: 'SaaS',
    tool: 'Internal Tool',
  }
  return labels[category] ?? category
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    mobile: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    website: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    saas: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    tool: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  }
  return colors[category] ?? 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
}

export function serializeProject(
  project: PrismaProject & { screenshots: PrismaScreenshot[] }
): Project {
  return {
    ...project,
    category: project.category as Project['category'],
    technologies: parseJsonArray(project.technologies),
    features: project.features ? parseJsonArray(project.features) : null,
  }
}
