export interface Project {
  id: string
  title: string
  slug: string
  description: string
  longDescription?: string | null
  category: ProjectCategory
  technologies: string[]
  features?: string[] | null
  challenges?: string | null
  results?: string | null
  liveUrl?: string | null
  githubUrl?: string | null
  coverImage?: string | null
  featured: boolean
  order: number
  published: boolean
  screenshots: Screenshot[]
  createdAt: Date
  updatedAt: Date
}

export interface Screenshot {
  id: string
  url: string
  alt?: string | null
  order: number
  projectId: string
  createdAt: Date
}

export type ProjectCategory = 'mobile' | 'website' | 'saas' | 'tool'

export const PROJECT_CATEGORIES: { value: ProjectCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All Projects' },
  { value: 'mobile', label: 'Mobile Apps' },
  { value: 'website', label: 'Websites' },
  { value: 'saas', label: 'SaaS' },
  { value: 'tool', label: 'Internal Tools' },
]

export interface ContactFormData {
  name: string
  email: string
  subject?: string
  message: string
}

export interface Service {
  icon: string
  title: string
  description: string
  features: string[]
}

export interface AdminUser {
  id: string
  email: string
  name?: string | null
}

export interface ProjectFormData {
  title: string
  slug: string
  description: string
  longDescription?: string
  category: ProjectCategory
  technologies: string
  features?: string
  challenges?: string
  results?: string
  liveUrl?: string
  githubUrl?: string
  coverImage?: string
  featured: boolean
  published: boolean
  order: number
}
