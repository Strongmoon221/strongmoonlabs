'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export default function CrmLogoutButton() {
  const router = useRouter()

  const logout = async () => {
    await fetch('/api/crm/auth', { method: 'DELETE' })
    router.push('/crm/login')
  }

  return (
    <button
      onClick={logout}
      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      <LogOut className="w-4 h-4" />
    </button>
  )
}
