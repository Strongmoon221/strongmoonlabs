'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import Button from '@/components/ui/Button'

interface AppSettingsFormProps {
  appId: string
  defaultName: string
  defaultSlug: string
  defaultDescription: string
  defaultIconUrl: string
  defaultPublished: boolean
}

export default function AppSettingsForm({
  appId,
  defaultName,
  defaultSlug,
  defaultDescription,
  defaultIconUrl,
  defaultPublished,
}: AppSettingsFormProps) {
  const router = useRouter()
  const [form, setForm] = useState({
    name: defaultName,
    slug: defaultSlug,
    description: defaultDescription,
    iconUrl: defaultIconUrl,
    published: defaultPublished,
  })
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  const inputClass =
    'w-full px-3 py-2.5 rounded-xl border border-border bg-muted/30 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 transition-all'

  const save = async () => {
    setStatus('saving')
    try {
      const res = await fetch(`/api/admin/apps/${appId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          iconUrl: form.iconUrl,
          published: form.published,
        }),
      })
      if (!res.ok) throw new Error()
      setStatus('saved')
      router.refresh()
      setTimeout(() => setStatus('idle'), 2500)
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="space-y-5 max-w-lg">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">App Name</label>
        <input
          type="text"
          className={inputClass}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">
          Slug <span className="text-muted-foreground font-normal">(URL, не изменяется)</span>
        </label>
        <input
          type="text"
          className={`${inputClass} opacity-50 cursor-not-allowed`}
          value={form.slug}
          disabled
        />
        <p className="text-xs text-muted-foreground mt-1">/apps/{form.slug}/privacy-policy</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
        <textarea
          rows={2}
          className={`${inputClass} resize-none`}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Short description of the app..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">App Icon URL</label>
        <div className="flex gap-3 items-center">
          {form.iconUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.iconUrl} alt="icon preview" className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-border" />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
              {form.name.charAt(0)}
            </div>
          )}
          <input
            type="url"
            className={inputClass}
            value={form.iconUrl}
            onChange={(e) => setForm({ ...form, iconUrl: e.target.value })}
            placeholder="https://..."
          />
        </div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={form.published}
          onChange={(e) => setForm({ ...form, published: e.target.checked })}
          className="w-4 h-4 rounded accent-blue-500"
        />
        <span className="text-sm text-foreground">Published</span>
      </label>

      <div className="flex items-center gap-3 pt-1">
        <Button onClick={save} loading={status === 'saving'}>
          {status === 'saving' ? 'Saving...' : 'Save Settings'}
        </Button>
        {status === 'saved' && (
          <span className="flex items-center gap-1.5 text-sm text-emerald-400">
            <CheckCircle2 className="w-4 h-4" /> Saved!
          </span>
        )}
        {status === 'error' && (
          <span className="flex items-center gap-1.5 text-sm text-red-400">
            <AlertCircle className="w-4 h-4" /> Failed to save
          </span>
        )}
      </div>
    </div>
  )
}
