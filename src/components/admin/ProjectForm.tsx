'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { AlertCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import { slugify, cn } from '@/lib/utils'
import type { ProjectFormData } from '@/types'

interface ProjectFormProps {
  initialData?: Partial<ProjectFormData & { id: string }>
  mode: 'create' | 'edit'
}

const inputClass =
  'w-full px-3 py-2.5 rounded-xl border border-border bg-muted/30 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 transition-all'

const labelClass = 'block text-sm font-medium text-foreground mb-1.5'

export default function ProjectForm({ initialData, mode }: ProjectFormProps) {
  const router = useRouter()
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProjectFormData>({
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      longDescription: '',
      category: 'website',
      technologies: '',
      features: '',
      challenges: '',
      results: '',
      liveUrl: '',
      githubUrl: '',
      coverImage: '',
      featured: false,
      published: true,
      order: 0,
      ...initialData,
    },
  })

  const onSubmit = async (data: ProjectFormData) => {
    setStatus('loading')
    setError('')

    const url =
      mode === 'create'
        ? '/api/admin/projects'
        : `/api/admin/projects/${initialData?.id}`
    const method = mode === 'create' ? 'POST' : 'PATCH'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const body = await res.json()
        throw new Error(body.error || 'Request failed')
      }

      router.push('/admin/projects')
      router.refresh()
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
      {/* Basic info */}
      <div className="p-5 rounded-2xl border border-border bg-card space-y-4">
        <h2 className="font-heading font-semibold text-foreground">Basic Information</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="Project Name"
              className={cn(inputClass, errors.title && 'border-red-500/50')}
              {...register('title', { required: true })}
              onChange={(e) => {
                register('title').onChange(e)
                if (mode === 'create') {
                  setValue('slug', slugify(e.target.value))
                }
              }}
            />
          </div>
          <div>
            <label className={labelClass}>Slug</label>
            <input
              type="text"
              placeholder="project-slug"
              className={inputClass}
              {...register('slug')}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>
            Short Description <span className="text-red-400">*</span>
          </label>
          <textarea
            rows={2}
            placeholder="One to two sentences describing the project..."
            className={cn(inputClass, 'resize-none', errors.description && 'border-red-500/50')}
            {...register('description', { required: true })}
          />
        </div>

        <div>
          <label className={labelClass}>Long Description</label>
          <textarea
            rows={5}
            placeholder="Detailed description. Use double line breaks for paragraphs."
            className={cn(inputClass, 'resize-none')}
            {...register('longDescription')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              Category <span className="text-red-400">*</span>
            </label>
            <select className={inputClass} {...register('category', { required: true })}>
              <option value="mobile">Mobile App</option>
              <option value="website">Website</option>
              <option value="saas">SaaS</option>
              <option value="tool">Internal Tool</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Order (for sorting)</label>
            <input
              type="number"
              className={inputClass}
              {...register('order', { valueAsNumber: true })}
            />
          </div>
        </div>
      </div>

      {/* Technologies & Features */}
      <div className="p-5 rounded-2xl border border-border bg-card space-y-4">
        <h2 className="font-heading font-semibold text-foreground">Technologies & Features</h2>

        <div>
          <label className={labelClass}>
            Technologies <span className="text-red-400">*</span>
            <span className="text-muted-foreground font-normal ml-1">(JSON array: [&quot;React&quot;, &quot;Node.js&quot;])</span>
          </label>
          <input
            type="text"
            placeholder='["React Native", "TypeScript", "Node.js"]'
            className={cn(inputClass, errors.technologies && 'border-red-500/50')}
            {...register('technologies', { required: true })}
          />
        </div>

        <div>
          <label className={labelClass}>
            Features
            <span className="text-muted-foreground font-normal ml-1">(JSON array)</span>
          </label>
          <textarea
            rows={3}
            placeholder='["Feature one", "Feature two", "Feature three"]'
            className={cn(inputClass, 'resize-none')}
            {...register('features')}
          />
        </div>

        <div>
          <label className={labelClass}>Challenges</label>
          <textarea
            rows={3}
            placeholder="What technical challenges did you overcome?"
            className={cn(inputClass, 'resize-none')}
            {...register('challenges')}
          />
        </div>

        <div>
          <label className={labelClass}>Results</label>
          <textarea
            rows={3}
            placeholder="Measurable outcomes and impact..."
            className={cn(inputClass, 'resize-none')}
            {...register('results')}
          />
        </div>
      </div>

      {/* Links & Media */}
      <div className="p-5 rounded-2xl border border-border bg-card space-y-4">
        <h2 className="font-heading font-semibold text-foreground">Links & Media</h2>

        <div>
          <label className={labelClass}>Cover Image URL</label>
          <input
            type="url"
            placeholder="https://..."
            className={inputClass}
            {...register('coverImage')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Live URL</label>
            <input
              type="url"
              placeholder="https://..."
              className={inputClass}
              {...register('liveUrl')}
            />
          </div>
          <div>
            <label className={labelClass}>GitHub URL</label>
            <input
              type="url"
              placeholder="https://github.com/..."
              className={inputClass}
              {...register('githubUrl')}
            />
          </div>
        </div>
      </div>

      {/* Flags */}
      <div className="p-5 rounded-2xl border border-border bg-card space-y-3">
        <h2 className="font-heading font-semibold text-foreground">Visibility</h2>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-border accent-blue-500"
            {...register('published')}
          />
          <span className="text-sm text-foreground">Published (visible on site)</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-border accent-blue-500"
            {...register('featured')}
          />
          <span className="text-sm text-foreground">Featured (shown on homepage)</span>
        </label>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" loading={status === 'loading'} size="lg">
          {mode === 'create' ? 'Create Project' : 'Save Changes'}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => router.push('/admin/projects')}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
