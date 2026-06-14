'use client'

import { useCrmLang } from './useCrmLang'

export default function CrmLangToggle() {
  const { lang, setLang } = useCrmLang()

  return (
    <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-muted border border-border">
      <button
        onClick={() => setLang('en')}
        className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${lang === 'en' ? 'bg-blue-600 text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
      >
        EN
      </button>
      <button
        onClick={() => setLang('ru')}
        className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${lang === 'ru' ? 'bg-blue-600 text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
      >
        RU
      </button>
    </div>
  )
}
