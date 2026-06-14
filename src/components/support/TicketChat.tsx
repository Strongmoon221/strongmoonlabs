'use client'

import { useState, useEffect, useRef } from 'react'
import { Send } from 'lucide-react'

interface Message {
  id: string
  content: string
  fromAdmin: boolean
  createdAt: string
}

interface Props {
  token: string
  initialMessages: Message[]
  status: string
  userName: string
  isAdmin?: boolean
  ticketId?: string
}

export default function TicketChat({ token, initialMessages, status, userName, isAdmin, ticketId }: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Poll for new messages every 4 seconds
  useEffect(() => {
    if (status === 'closed') return
    const interval = setInterval(async () => {
      try {
        const url = isAdmin
          ? `/api/admin/support/${ticketId}`
          : `/api/support/${token}`
        const res = await fetch(url)
        if (!res.ok) return
        const data = await res.json()
        const msgs = isAdmin ? data.messages : data.messages
        if (msgs && msgs.length !== messages.length) {
          setMessages(msgs.map((m: { id: string; content: string; fromAdmin: boolean; createdAt: string }) => ({
            id: m.id,
            content: m.content,
            fromAdmin: m.fromAdmin,
            createdAt: m.createdAt,
          })))
        }
      } catch { /* ignore */ }
    }, 4000)
    return () => clearInterval(interval)
  }, [messages.length, status, token, isAdmin, ticketId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    if (!input.trim() || sending) return
    setSending(true)
    try {
      const url = isAdmin
        ? `/api/admin/support/${ticketId}/messages`
        : `/api/support/${token}`
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: input.trim() }),
      })
      if (!res.ok) return
      const msg = await res.json()
      setMessages((prev) => [...prev, {
        id: msg.id,
        content: msg.content,
        fromAdmin: msg.fromAdmin,
        createdAt: msg.createdAt,
      }])
      setInput('')
    } finally {
      setSending(false)
    }
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="flex-1 flex flex-col max-w-2xl w-full mx-auto px-4 py-4">
      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto pb-4 min-h-0" style={{ minHeight: '60vh' }}>
        {messages.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-8">No messages yet</p>
        )}
        {messages.map((msg) => {
          const isMine = isAdmin ? msg.fromAdmin : !msg.fromAdmin
          return (
            <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] ${isMine ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                <p className="text-[10px] text-muted-foreground px-1">
                  {msg.fromAdmin ? 'Support' : userName}
                </p>
                <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  isMine
                    ? 'bg-blue-600 text-white rounded-br-sm'
                    : 'bg-card border border-border text-foreground rounded-bl-sm'
                }`}>
                  {msg.content}
                </div>
                <p className="text-[10px] text-muted-foreground px-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {status === 'closed' ? (
        <div className="text-center text-sm text-muted-foreground py-4 border-t border-border mt-4">
          This ticket is closed.
        </div>
      ) : (
        <div className="flex gap-2 pt-4 border-t border-border mt-4">
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Type a message... (Enter to send)"
            className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 transition-all"
          />
          <button
            onClick={send}
            disabled={sending || !input.trim()}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white transition-all flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
