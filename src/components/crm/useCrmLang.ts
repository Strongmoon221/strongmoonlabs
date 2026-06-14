'use client'

import { useState, useEffect, useCallback } from 'react'
import { CrmLang, CrmTKey, t as getT } from '@/lib/crm-i18n'

export function useCrmLang() {
  const [lang, setLangState] = useState<CrmLang>('en')

  useEffect(() => {
    const saved = (localStorage.getItem('crm_lang') ?? 'en') as CrmLang
    setLangState(saved)
  }, [])

  const setLang = useCallback((l: CrmLang) => {
    setLangState(l)
    localStorage.setItem('crm_lang', l)
    // Also set cookie for server components
    document.cookie = `crm_lang=${l};path=/;max-age=31536000`
  }, [])

  const t = useCallback((key: CrmTKey) => getT(lang, key), [lang])

  return { lang, setLang, t }
}
