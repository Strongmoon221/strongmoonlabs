'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, MailOpen, ChevronDown, ChevronUp } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Message {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  read: boolean
  createdAt: Date
}

interface MessagesClientProps {
  messages: Message[]
}

export default function MessagesClient({ messages: initialMessages }: MessagesClientProps) {
  const router = useRouter()
  const [messages, setMessages] = useState(initialMessages)
  const [expanded, setExpanded] = useState<string | null>(null)

  const toggleRead = async (id: string, read: boolean) => {
    await fetch('/api/admin/messages', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, read }),
    })
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read } : m)))
    router.refresh()
  }

  if (messages.length === 0) {
    return (
      <div className="text-center py-20 border border-dashed border-border rounded-2xl">
        <Mail className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">No messages yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`rounded-xl border transition-all ${
            !msg.read
              ? 'border-blue-500/20 bg-blue-500/5'
              : 'border-border bg-card'
          }`}
        >
          {/* Header */}
          <button
            onClick={() => {
              setExpanded(expanded === msg.id ? null : msg.id)
              if (!msg.read) toggleRead(msg.id, true)
            }}
            className="w-full flex items-center gap-3 p-4 text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
              {msg.read ? (
                <MailOpen className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Mail className="w-4 h-4 text-blue-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-foreground">{msg.name}</span>
                {!msg.read && (
                  <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                )}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                <span className="text-foreground/60">{msg.email}</span>
                {msg.subject && <span> · {msg.subject}</span>}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs text-muted-foreground hidden sm:block">
                {formatDate(msg.createdAt)}
              </span>
              {expanded === msg.id ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
          </button>

          {/* Expanded content */}
          {expanded === msg.id && (
            <div className="px-4 pb-4 border-t border-border/50">
              <div className="pt-3 space-y-3">
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span><strong className="text-foreground">From:</strong> {msg.name}</span>
                  <a href={`mailto:${msg.email}`} className="text-blue-400 hover:underline">
                    {msg.email}
                  </a>
                  <span>{formatDate(msg.createdAt)}</span>
                </div>
                {msg.subject && (
                  <p className="text-sm font-medium text-foreground">Subject: {msg.subject}</p>
                )}
                <div className="p-3 rounded-lg bg-muted/50 border border-border text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                  {msg.message}
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${msg.email}?subject=Re: ${msg.subject || 'Your message'}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-all"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    Reply
                  </a>
                  <button
                    onClick={() => toggleRead(msg.id, !msg.read)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border text-muted-foreground hover:text-foreground text-xs font-semibold rounded-lg transition-all"
                  >
                    Mark as {msg.read ? 'unread' : 'read'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
