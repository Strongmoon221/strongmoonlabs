'use client'

import { useState } from 'react'
import { CheckCircle2, AlertCircle, Send } from 'lucide-react'

export default function SupportForm({ slug }: { slug: string }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch(`/api/apps/${slug}/support`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-border bg-muted/30 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 transition-all'

  if (status === 'sent') {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <CheckCircle2 className="w-10 h-10 text-emerald-400" />
        <p className="font-semibold text-foreground">Message sent!</p>
        <p className="text-sm text-muted-foreground">We&apos;ll get back to you within 24–48 hours.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Your Name</label>
        <input
          type="text"
          required
          placeholder="John Doe"
          className={inputClass}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
        <input
          type="email"
          required
          placeholder="you@example.com"
          className={inputClass}
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Message</label>
        <textarea
          required
          rows={5}
          placeholder="Describe your issue or question..."
          className={`${inputClass} resize-none`}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
      </div>

      {status === 'error' && (
        <div className="flex items-center gap-2 text-sm text-red-400">
          <AlertCircle className="w-4 h-4" /> Something went wrong. Please try again.
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-all"
      >
        <Send className="w-4 h-4" />
        {status === 'sending' ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  )
}
