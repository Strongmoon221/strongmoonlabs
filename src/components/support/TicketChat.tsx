'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, Paperclip, X, ImageIcon } from 'lucide-react'

interface Message {
  id: string
  content: string
  imageUrl?: string | null
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
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [lightbox, setLightbox] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (status === 'closed') return
    const interval = setInterval(async () => {
      try {
        const url = isAdmin ? `/api/admin/support/${ticketId}` : `/api/support/${token}`
        const res = await fetch(url)
        if (!res.ok) return
        const data = await res.json()
        const msgs = data.messages
        if (msgs && msgs.length !== messages.length) {
          setMessages(msgs.map((m: Message) => ({
            id: m.id, content: m.content, imageUrl: m.imageUrl ?? null,
            fromAdmin: m.fromAdmin, createdAt: m.createdAt,
          })))
        }
      } catch { /* ignore */ }
    }, 4000)
    return () => clearInterval(interval)
  }, [messages.length, status, token, isAdmin, ticketId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleFile = (file: File) => {
    setUploadError(null)
    if (!file.type.startsWith('image/')) { setUploadError('Only images allowed'); return }
    if (file.size > 5 * 1024 * 1024) { setUploadError('Max 5 MB'); return }
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (e) => setImagePreview(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  const clearImage = () => { setImageFile(null); setImagePreview(null); setUploadError(null) }

  const send = async () => {
    if ((!input.trim() && !imageFile) || sending) return
    setSending(true)
    setUploadError(null)
    try {
      let imageUrl: string | null = null
      if (imageFile) {
        const fd = new FormData()
        fd.append('file', imageFile)
        const up = await fetch('/api/upload/support', { method: 'POST', body: fd })
        if (!up.ok) { setUploadError('Upload failed'); setSending(false); return }
        const { url } = await up.json()
        imageUrl = url
      }

      const url = isAdmin ? `/api/admin/support/${ticketId}/messages` : `/api/support/${token}`
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: input.trim(), imageUrl }),
      })
      if (!res.ok) return
      const msg = await res.json()
      setMessages((prev) => [...prev, {
        id: msg.id, content: msg.content, imageUrl: msg.imageUrl ?? null,
        fromAdmin: msg.fromAdmin, createdAt: msg.createdAt,
      }])
      setInput('')
      clearImage()
    } finally {
      setSending(false)
    }
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    const item = Array.from(e.clipboardData.items).find(i => i.type.startsWith('image/'))
    if (item) { const f = item.getAsFile(); if (f) handleFile(f) }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  return (
    <div
      className="flex-1 flex flex-col max-w-2xl w-full mx-auto px-4 py-4"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
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

                {msg.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <button
                    onClick={() => setLightbox(msg.imageUrl!)}
                    className="rounded-xl overflow-hidden border border-border max-w-xs hover:opacity-90 transition-opacity"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={msg.imageUrl}
                      alt=""
                      className="max-w-[300px] max-h-[240px] object-cover rounded-xl block"
                    />
                  </button>
                )}

                {msg.content && (
                  <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    isMine
                      ? 'bg-blue-600 text-white rounded-br-sm'
                      : 'bg-card border border-border text-foreground rounded-bl-sm'
                  }`}>
                    {msg.content}
                  </div>
                )}

                <p className="text-[10px] text-muted-foreground px-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      {status === 'closed' ? (
        <div className="text-center text-sm text-muted-foreground py-4 border-t border-border mt-4">
          This ticket is closed.
        </div>
      ) : (
        <div className="pt-4 border-t border-border mt-4 space-y-2">
          {imagePreview && (
            <div className="relative inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imagePreview} alt="" className="w-[120px] h-[80px] rounded-xl object-cover border border-border" />
              <button
                onClick={clearImage}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-zinc-800 border border-border flex items-center justify-center hover:bg-red-500/80 transition-colors"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          )}

          {uploadError && <p className="text-xs text-red-400">{uploadError}</p>}

          <div className="flex gap-2 items-end">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-blue-400 hover:border-blue-500/40 transition-all"
              title="Attach image"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = '' }}
            />

            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              onPaste={handlePaste}
              placeholder="Type a message… (Enter to send, paste image)"
              className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 transition-all"
            />

            <button
              onClick={send}
              disabled={sending || (!input.trim() && !imageFile)}
              className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white transition-all"
            >
              {sending
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <Send className="w-4 h-4" />}
            </button>
          </div>

          <p className="text-[10px] text-muted-foreground flex items-center gap-1">
            <ImageIcon className="w-3 h-3" />
            Attach via button, drag & drop or paste (max 5 MB · JPG/PNG/GIF/WebP)
          </p>
        </div>
      )}

      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            onClick={() => setLightbox(null)}
          >
            <X className="w-5 h-5" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox}
            alt="full size"
            className="max-w-full max-h-[90vh] rounded-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}
