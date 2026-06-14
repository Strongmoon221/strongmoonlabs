'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { useCallback } from 'react'
import { useCrmLang } from './useCrmLang'
import CrmLangToggle from './CrmLangToggle'

export default function ProjectFilters() {
  const router = useRouter()
  const sp = useSearchParams()
  const { t } = useCrmLang()

  const update = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(sp.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`/admin/crm/projects?${params.toString()}`)
  }, [router, sp])

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <input
          type="text"
          placeholder={t('projects') + '...'}
          defaultValue={sp.get('search') ?? ''}
          onChange={(e) => update('search', e.target.value)}
          className="pl-8 pr-3 py-2 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/40 w-48"
        />
      </div>
      <select
        value={sp.get('status') ?? ''}
        onChange={(e) => update('status', e.target.value)}
        className="px-3 py-2 rounded-xl border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/40"
      >
        <option value="">{t('status')}</option>
        <option value="planning">{t('statusPlanning')}</option>
        <option value="active">{t('statusActive')}</option>
        <option value="done">{t('statusDone')}</option>
        <option value="frozen">{t('statusOnHold')}</option>
      </select>
      <select
        value={sp.get('priority') ?? ''}
        onChange={(e) => update('priority', e.target.value)}
        className="px-3 py-2 rounded-xl border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/40"
      >
        <option value="">{t('priority')}</option>
        <option value="low">{t('low')}</option>
        <option value="medium">{t('medium')}</option>
        <option value="high">{t('high')}</option>
        <option value="critical">{t('criticalPriority')}</option>
      </select>
      <div className="ml-auto">
        <CrmLangToggle />
      </div>
    </div>
  )
}
