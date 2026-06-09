'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'

interface DeleteProjectButtonProps {
  id: string
  title: string
}

export default function DeleteProjectButton({ id, title }: DeleteProjectButtonProps) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)

  const handleDelete = async () => {
    const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' })
    if (res.ok) {
      router.refresh()
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={handleDelete}
          className="px-2 py-1 text-xs font-medium rounded-lg bg-red-600 hover:bg-red-500 text-white transition-all"
        >
          Delete
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="px-2 py-1 text-xs font-medium rounded-lg border border-border text-muted-foreground hover:text-foreground transition-all"
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all"
      title={`Delete "${title}"`}
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )
}
