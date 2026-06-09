'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import AdminShell from '@/components/admin/AdminShell'
import Button from '@/components/ui/Button'
import { slugify } from '@/lib/utils'

export default function NewAppPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', slug: '', description: '', iconUrl: '', published: true })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed')
      }
      const app = await res.json()
      router.push(`/admin/apps/${app.id}/edit`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  const inputClass = 'w-full px-3 py-2.5 rounded-xl border border-border bg-muted/30 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 transition-all'

  return (
    <AdminShell>
      <div className="max-w-lg">
        <Link href="/admin/apps" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Apps
        </Link>
        <h1 className="text-2xl font-heading font-bold text-foreground mb-8">New App</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">App Name *</label>
            <input
              type="text"
              required
              placeholder="My App"
              className={inputClass}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value, slug: slugify(e.target.value) })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Slug (URL)</label>
            <input
              type="text"
              placeholder="my-app"
              className={inputClass}
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
            />
            <p className="text-xs text-muted-foreground mt-1">
              URL: /apps/<strong>{form.slug || 'my-app'}</strong>/privacy-policy
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
            <textarea rows={2} placeholder="Short description of the app..." className={`${inputClass} resize-none`} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">App Icon URL</label>
            <input type="url" placeholder="https://..." className={inputClass} value={form.iconUrl} onChange={(e) => setForm({ ...form, iconUrl: e.target.value })} />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="w-4 h-4 rounded accent-blue-500" />
            <span className="text-sm text-foreground">Published</span>
          </label>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={loading} size="lg">Create App</Button>
            <Button type="button" variant="outline" size="lg" onClick={() => router.push('/admin/apps')}>Cancel</Button>
          </div>
        </form>
      </div>
    </AdminShell>
  )
}
