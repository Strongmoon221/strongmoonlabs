'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'

export default function DeleteAppButton({ id, name }: { id: string; name: string }) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)

  const handleDelete = async () => {
    await fetch(`/api/admin/apps/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <button onClick={handleDelete} className="px-2 py-1 text-xs font-medium rounded-lg bg-red-600 hover:bg-red-500 text-white transition-all">Delete</button>
        <button onClick={() => setConfirming(false)} className="px-2 py-1 text-xs font-medium rounded-lg border border-border text-muted-foreground hover:text-foreground transition-all">Cancel</button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all"
      title={`Delete "${name}"`}
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )
}
