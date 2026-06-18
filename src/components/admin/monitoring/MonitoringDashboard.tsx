'use client'

import { useState, useEffect, useCallback } from 'react'
import { Cpu, MemoryStick, HardDrive, Clock, Plus, Trash2, RefreshCw, Wifi, WifiOff, X } from 'lucide-react'

interface Server { id: string; name: string; url: string; color: string; active: boolean }

interface Metrics {
  cpu: { load1: number; load5: number; load15: number; percent: number }
  mem: { total: number; used: number; free: number; percent: number }
  disk: { total: number; used: number; free: number; percent: number }
  uptime: number
  os: string
  pm2?: { name: string; status: string; cpu: number; memory: number; restarts: number }[]
}

interface ServerState {
  server: Server
  metrics: Metrics | null
  error: string | null
  loading: boolean
  lastUpdate: Date | null
}

const COLORS = ['#3b82f6','#8b5cf6','#10b981','#f59e0b','#ef4444','#06b6d4','#ec4899']

function fmt(bytes: number) {
  if (bytes >= 1073741824) return `${(bytes / 1073741824).toFixed(1)} GB`
  return `${(bytes / 1048576).toFixed(0)} MB`
}
function fmtUptime(s: number) {
  const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60)
  if (d > 0) return `${d}d ${h}h`
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

function Bar({ value, color = 'bg-blue-500', warn = 70, danger = 90 }: { value: number; color?: string; warn?: number; danger?: number }) {
  const c = value >= danger ? 'bg-red-500' : value >= warn ? 'bg-amber-500' : color
  return (
    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
      <div className={`h-full ${c} rounded-full transition-all duration-500`} style={{ width: `${Math.min(value, 100)}%` }} />
    </div>
  )
}

function ServerCard({ state, onRemove }: { state: ServerState; onRemove: () => void }) {
  const { server, metrics, error, loading, lastUpdate } = state
  const online = !!metrics && !error

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: server.color }} />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-foreground truncate">{server.name}</p>
          <p className="text-[10px] text-muted-foreground truncate">{server.url}</p>
        </div>
        <div className="flex items-center gap-2">
          {loading && <RefreshCw className="w-3 h-3 text-muted-foreground animate-spin" />}
          {online ? <Wifi className="w-3.5 h-3.5 text-emerald-400" /> : <WifiOff className="w-3.5 h-3.5 text-red-400" />}
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${online ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
            {online ? 'Online' : 'Offline'}
          </span>
          <button onClick={onRemove} className="w-6 h-6 flex items-center justify-center rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {error && (
        <div className="px-4 py-6 text-center text-sm text-red-400">{error}</div>
      )}

      {metrics && (
        <div className="p-4 space-y-4">
          {/* CPU */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">CPU</span>
              </div>
              <span className="text-xs font-semibold text-foreground">{metrics.cpu.percent.toFixed(1)}%</span>
            </div>
            <Bar value={metrics.cpu.percent} color="bg-blue-500" />
            <div className="flex gap-3 mt-1">
              {[metrics.cpu.load1, metrics.cpu.load5, metrics.cpu.load15].map((v, i) => (
                <span key={i} className="text-[10px] text-muted-foreground">
                  {['1m', '5m', '15m'][i]}: <span className="text-foreground">{v.toFixed(2)}</span>
                </span>
              ))}
            </div>
          </div>

          {/* RAM */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <MemoryStick className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">RAM</span>
              </div>
              <span className="text-xs font-semibold text-foreground">{fmt(metrics.mem.used)} / {fmt(metrics.mem.total)}</span>
            </div>
            <Bar value={metrics.mem.percent} color="bg-violet-500" />
          </div>

          {/* Disk */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Disk</span>
              </div>
              <span className="text-xs font-semibold text-foreground">{fmt(metrics.disk.used)} / {fmt(metrics.disk.total)}</span>
            </div>
            <Bar value={metrics.disk.percent} color="bg-teal-500" />
          </div>

          {/* Uptime + OS */}
          <div className="flex items-center justify-between pt-1 border-t border-border">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Uptime: <span className="text-foreground">{fmtUptime(metrics.uptime)}</span></span>
            </div>
            <span className="text-[10px] text-muted-foreground">{metrics.os}</span>
          </div>

          {/* PM2 */}
          {metrics.pm2 && metrics.pm2.length > 0 && (
            <div className="pt-2 border-t border-border space-y-1.5">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">PM2 Processes</p>
              {metrics.pm2.map((proc) => (
                <div key={proc.name} className="flex items-center gap-2 text-xs">
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${proc.status === 'online' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                  <span className="text-foreground font-medium truncate flex-1">{proc.name}</span>
                  <span className="text-muted-foreground">{proc.cpu.toFixed(1)}% CPU</span>
                  <span className="text-muted-foreground">{fmt(proc.memory)}</span>
                  {proc.restarts > 0 && <span className="text-amber-400">↺{proc.restarts}</span>}
                </div>
              ))}
            </div>
          )}

          {lastUpdate && (
            <p className="text-[10px] text-muted-foreground text-right">
              Updated {lastUpdate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

function AddServerModal({ onAdd, onClose }: { onAdd: (s: Server) => void; onClose: () => void }) {
  const [form, setForm] = useState({ name: '', url: '', token: '', color: COLORS[0] })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const res = await fetch('/api/admin/monitoring', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) { const s = await res.json(); onAdd(s); onClose() }
    setSaving(false)
  }

  const inputClass = 'w-full px-3 py-2.5 rounded-xl border border-border bg-muted/30 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 placeholder:text-muted-foreground'

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-heading font-semibold text-foreground">Add Server</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input required placeholder="Server name (e.g. API Server)" className={inputClass} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <input required placeholder="Agent URL (e.g. http://1.2.3.4:9000)" className={inputClass} value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} />
          <input required placeholder="Agent token" type="password" className={inputClass} value={form.token} onChange={e => setForm({ ...form, token: e.target.value })} />
          <div>
            <p className="text-xs text-muted-foreground mb-2">Color</p>
            <div className="flex gap-2">
              {COLORS.map(c => (
                <button key={c} type="button" onClick={() => setForm({ ...form, color: c })}
                  className={`w-7 h-7 rounded-full transition-all ${form.color === c ? 'ring-2 ring-offset-2 ring-offset-card ring-white scale-110' : ''}`}
                  style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
          <button type="submit" disabled={saving} className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-all mt-2">
            {saving ? 'Adding…' : 'Add Server'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function MonitoringDashboard({ initialServers }: { initialServers: Server[] }) {
  const [states, setStates] = useState<ServerState[]>(
    initialServers.map(s => ({ server: s, metrics: null, error: null, loading: true, lastUpdate: null }))
  )
  const [showAdd, setShowAdd] = useState(false)

  const fetchMetrics = useCallback(async (id: string) => {
    setStates(prev => prev.map(s => s.server.id === id ? { ...s, loading: true } : s))
    try {
      const res = await fetch(`/api/admin/monitoring/${id}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed')
      setStates(prev => prev.map(s => s.server.id === id ? { ...s, metrics: data, error: null, loading: false, lastUpdate: new Date() } : s))
    } catch (e) {
      setStates(prev => prev.map(s => s.server.id === id ? { ...s, metrics: null, error: (e as Error).message, loading: false, lastUpdate: new Date() } : s))
    }
  }, [])

  // Initial fetch + polling every 10s
  useEffect(() => {
    states.forEach(s => fetchMetrics(s.server.id))
    const interval = setInterval(() => {
      states.forEach(s => fetchMetrics(s.server.id))
    }, 10000)
    return () => clearInterval(interval)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [states.length])

  const addServer = (server: Server) => {
    setStates(prev => [...prev, { server, metrics: null, error: null, loading: true, lastUpdate: null }])
    setTimeout(() => fetchMetrics(server.id), 100)
  }

  const removeServer = async (id: string) => {
    if (!confirm('Remove this server?')) return
    await fetch(`/api/admin/monitoring/${id}`, { method: 'DELETE' })
    setStates(prev => prev.filter(s => s.server.id !== id))
  }

  const online = states.filter(s => s.metrics && !s.error).length

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground mb-1">Server Monitoring</h1>
          <p className="text-sm text-muted-foreground">
            {online}/{states.length} servers online · auto-refresh every 10s
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => states.forEach(s => fetchMetrics(s.server.id))}
            className="inline-flex items-center gap-2 px-3 py-2 border border-border text-sm text-muted-foreground rounded-xl hover:text-foreground hover:bg-muted transition-all"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all"
          >
            <Plus className="w-4 h-4" /> Add Server
          </button>
        </div>
      </div>

      {states.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-border rounded-2xl">
          <p className="text-muted-foreground mb-3">No servers added yet</p>
          <button onClick={() => setShowAdd(true)} className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all">
            <Plus className="w-4 h-4" /> Add your first server
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {states.map(state => (
            <ServerCard key={state.server.id} state={state} onRemove={() => removeServer(state.server.id)} />
          ))}
        </div>
      )}

      {showAdd && <AddServerModal onAdd={addServer} onClose={() => setShowAdd(false)} />}
    </div>
  )
}
