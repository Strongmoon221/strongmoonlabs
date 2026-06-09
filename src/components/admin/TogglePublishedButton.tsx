'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface TogglePublishedButtonProps {
  id: string
  published: boolean
}

export default function TogglePublishedButton({ id, published }: TogglePublishedButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [current, setCurrent] = useState(published)

  const toggle = async () => {
    setLoading(true)
    const newValue = !current

    const res = await fetch(`/api/admin/projects/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: newValue }),
    })

    if (res.ok) {
      setCurrent(newValue)
      router.refresh()
    }

    setLoading(false)
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
        current
          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
          : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20 hover:bg-zinc-500/20'
      }`}
    >
      {loading ? '...' : current ? 'Published' : 'Draft'}
    </button>
  )
}
