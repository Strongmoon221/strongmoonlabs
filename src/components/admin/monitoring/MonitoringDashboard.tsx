'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Cpu, MemoryStick, HardDrive, Clock, Plus, Trash2, RefreshCw,
  Wifi, WifiOff, X, Shield, Globe, AlertTriangle, CheckCircle2,
  BarChart2, Map, GitCompare, List, Edit2, Check,
} from 'lucide-react'
import Sparkline from './Sparkline'
import WorldMap from './WorldMap'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Server {
  id: string; name: string; url: string; color: string; active: boolean
  lat?: number | null; lng?: number | null; country?: string | null
  sslDomain?: string | null; healthUrl?: string | null
  alertTelegram?: string | null; alertEmail?: string | null
  alertCpuThreshold: number; alertRamThreshold: number; alertDiskThreshold: number
}
interface Metrics {
  cpu: { load1: number; load5: number; load15: number; percent: number; cores: number }
  mem: { total: number; used: number; free: number; percent: number }
  disk: { total: number; used: number; free: number; percent: number }
  uptime: number; os: string
  pm2?: { name: string; status: string; cpu: number; memory: number; restarts: number }[]
}
interface HistMetric { cpuPercent: number; memPercent: number; diskPercent: number; online: boolean; createdAt: string }
interface Incident {
  id: string; type: string; message: string; startedAt: string; resolvedAt: string | null
  server: { name: string; color: string }
}
interface ServerState {
  server: Server; metrics: Metrics | null; error: string | null
  loading: boolean; lastUpdate: Date | null
  history: HistMetric[]; uptimePct: string | null; histLoading: boolean
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const COLORS = ['#3b82f6','#8b5cf6','#10b981','#f59e0b','#ef4444','#06b6d4','#ec4899']
function fmt(b: number) { return b >= 1073741824 ? `${(b/1073741824).toFixed(1)} GB` : `${(b/1048576).toFixed(0)} MB` }
function fmtUptime(s: number) {
  const d = Math.floor(s/86400), h = Math.floor((s%86400)/3600), m = Math.floor((s%3600)/60)
  return d > 0 ? `${d}d ${h}h` : h > 0 ? `${h}h ${m}m` : `${m}m`
}
function fmtDuration(start: string, end?: string | null) {
  const ms = (end ? new Date(end) : new Date()).getTime() - new Date(start).getTime()
  const h = Math.floor(ms / 3600000), m = Math.floor((ms % 3600000) / 60000)
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}
const inputCls = 'w-full px-3 py-2 rounded-xl border border-border bg-muted/30 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 placeholder:text-muted-foreground'

function Bar({ value, warn=70, danger=90, color='bg-blue-500' }: { value:number; warn?:number; danger?:number; color?:string }) {
  const c = value >= danger ? 'bg-red-500' : value >= warn ? 'bg-amber-500' : color
  return (
    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
      <div className={`h-full ${c} rounded-full transition-all duration-500`} style={{ width: `${Math.min(value,100)}%` }} />
    </div>
  )
}

const INCIDENT_META: Record<string, { label: string; icon: string; color: string }> = {
  offline: { label: 'Offline',      icon: '🔴', color: 'text-red-400 bg-red-500/10 border-red-500/20' },
  cpu:     { label: 'High CPU',     icon: '⚡', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  ram:     { label: 'High RAM',     icon: '💾', color: 'text-violet-400 bg-violet-500/10 border-violet-500/20' },
  disk:    { label: 'Disk Full',    icon: '💿', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
  ssl:     { label: 'SSL',          icon: '🔒', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
  health:  { label: 'Health Fail',  icon: '🏥', color: 'text-pink-400 bg-pink-500/10 border-pink-500/20' },
}

// ─── Server Card ──────────────────────────────────────────────────────────────

function ServerCard({ state, onRemove, onEdit, selected, onSelect }: {
  state: ServerState; onRemove: () => void; onEdit: () => void; selected: boolean; onSelect: () => void
}) {
  const { server, metrics, error, loading, lastUpdate, history, uptimePct, histLoading } = state
  const online = !!metrics && !error
  const cpuData = history.map(h => h.cpuPercent)
  const memData = history.map(h => h.memPercent)

  return (
    <div
      className={`rounded-2xl border bg-card overflow-hidden transition-all cursor-pointer ${selected ? 'border-blue-500/50 ring-1 ring-blue-500/20' : 'border-border hover:border-border/80'}`}
      onClick={onSelect}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: server.color }} />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-foreground truncate">{server.name}</p>
          <p className="text-[10px] text-muted-foreground truncate">{server.url}</p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {loading && <RefreshCw className="w-3 h-3 text-muted-foreground animate-spin" />}
          {online ? <Wifi className="w-3.5 h-3.5 text-emerald-400" /> : <WifiOff className="w-3.5 h-3.5 text-red-400" />}
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${online ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
            {online ? 'Online' : 'Offline'}
          </span>
          <button onClick={e => { e.stopPropagation(); onEdit() }} className="w-6 h-6 flex items-center justify-center rounded-lg text-muted-foreground hover:text-blue-400 hover:bg-blue-500/10 transition-all" title="Edit server">
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button onClick={e => { e.stopPropagation(); onRemove() }} className="w-6 h-6 flex items-center justify-center rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all" title="Remove">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {error && <div className="px-4 py-6 text-center text-sm text-red-400">{error}</div>}

      {metrics && (
        <div className="p-4 space-y-3">
          {/* CPU */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5"><Cpu className="w-3 h-3 text-muted-foreground" /><span className="text-xs text-muted-foreground">CPU</span></div>
              <span className="text-xs font-semibold text-foreground">{metrics.cpu.percent.toFixed(1)}%</span>
            </div>
            <Bar value={metrics.cpu.percent} color="bg-blue-500" />
            {!histLoading && cpuData.length > 1 && <div className="mt-1"><Sparkline data={cpuData} color={server.color} height={28} /></div>}
          </div>

          {/* RAM */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5"><MemoryStick className="w-3 h-3 text-muted-foreground" /><span className="text-xs text-muted-foreground">RAM</span></div>
              <span className="text-xs font-semibold text-foreground">{fmt(metrics.mem.used)} / {fmt(metrics.mem.total)}</span>
            </div>
            <Bar value={metrics.mem.percent} color="bg-violet-500" />
            {!histLoading && memData.length > 1 && <div className="mt-1"><Sparkline data={memData} color="#8b5cf6" height={28} /></div>}
          </div>

          {/* Disk */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5"><HardDrive className="w-3 h-3 text-muted-foreground" /><span className="text-xs text-muted-foreground">Disk</span></div>
              <span className="text-xs font-semibold text-foreground">{fmt(metrics.disk.used)} / {fmt(metrics.disk.total)}</span>
            </div>
            <Bar value={metrics.disk.percent} color="bg-teal-500" />
          </div>

          {/* Footer row */}
          <div className="flex items-center justify-between pt-2 border-t border-border text-[10px] text-muted-foreground">
            <div className="flex items-center gap-1"><Clock className="w-3 h-3" />{fmtUptime(metrics.uptime)}</div>
            {uptimePct && (
              <span className={`font-semibold ${parseFloat(uptimePct) >= 99 ? 'text-emerald-400' : parseFloat(uptimePct) >= 95 ? 'text-amber-400' : 'text-red-400'}`}>
                {uptimePct}% uptime
              </span>
            )}
            <span>{metrics.os.split(' ').slice(0,2).join(' ')}</span>
          </div>

          {/* SSL badge */}
          {server.sslDomain && history.length > 0 && history[history.length-1].cpuPercent !== undefined && (
            <div className="flex items-center gap-1.5 text-[10px]">
              <Shield className="w-3 h-3 text-muted-foreground" />
              <span className="text-muted-foreground">SSL</span>
            </div>
          )}

          {/* PM2 */}
          {metrics.pm2 && metrics.pm2.length > 0 && (
            <div className="pt-2 border-t border-border space-y-1">
              {metrics.pm2.map(p => (
                <div key={p.name} className="flex items-center gap-2 text-xs">
                  <span className={`w-1.5 h-1.5 rounded-full ${p.status === 'online' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                  <span className="text-foreground font-medium flex-1 truncate">{p.name}</span>
                  <span className="text-muted-foreground">{p.cpu.toFixed(1)}%</span>
                  <span className="text-muted-foreground">{fmt(p.memory)}</span>
                  {p.restarts > 0 && <span className="text-amber-400">↺{p.restarts}</span>}
                </div>
              ))}
            </div>
          )}

          {lastUpdate && <p className="text-[10px] text-muted-foreground text-right">{lastUpdate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>}
        </div>
      )}
    </div>
  )
}

// ─── Add/Edit Server Modal ────────────────────────────────────────────────────

function ServerModal({ initial, onSave, onClose }: {
  initial?: Partial<Server>; onSave: (s: Server) => void; onClose: () => void
}) {
  const [form, setForm] = useState({
    name: initial?.name ?? '', url: initial?.url ?? '', token: '',
    color: initial?.color ?? COLORS[0],
    lat: initial?.lat?.toString() ?? '', lng: initial?.lng?.toString() ?? '', country: initial?.country ?? '',
    sslDomain: initial?.sslDomain ?? '', healthUrl: initial?.healthUrl ?? '',
    alertTelegram: initial?.alertTelegram ?? '', alertEmail: initial?.alertEmail ?? '',
    alertCpuThreshold: initial?.alertCpuThreshold?.toString() ?? '90',
    alertRamThreshold: initial?.alertRamThreshold?.toString() ?? '90',
    alertDiskThreshold: initial?.alertDiskThreshold?.toString() ?? '90',
  })
  const [saving, setSaving] = useState(false)
  const isEdit = !!initial?.id

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    const body = {
      ...form,
      lat: form.lat ? parseFloat(form.lat) : null,
      lng: form.lng ? parseFloat(form.lng) : null,
      alertCpuThreshold: parseInt(form.alertCpuThreshold),
      alertRamThreshold: parseInt(form.alertRamThreshold),
      alertDiskThreshold: parseInt(form.alertDiskThreshold),
    }
    const res = await fetch(isEdit ? `/api/admin/monitoring/${initial!.id}` : '/api/admin/monitoring', {
      method: isEdit ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (res.ok) { const s = await res.json(); onSave(s); onClose() }
    setSaving(false)
  }

  const f = (k: keyof typeof form, v: string) => setForm(p => ({ ...p, [k]: v }))

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl w-full max-w-lg my-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border">
          <h2 className="font-heading font-semibold text-foreground">{isEdit ? 'Edit Server' : 'Add Server'}</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2"><label className="text-xs text-muted-foreground mb-1 block">Name *</label><input required placeholder="API Server" className={inputCls} value={form.name} onChange={e => f('name', e.target.value)} /></div>
            <div className="col-span-2"><label className="text-xs text-muted-foreground mb-1 block">Agent URL *</label><input required placeholder="http://1.2.3.4:9000" className={inputCls} value={form.url} onChange={e => f('url', e.target.value)} /></div>
            <div className="col-span-2"><label className="text-xs text-muted-foreground mb-1 block">Token {isEdit ? '(leave blank to keep)' : '*'}</label><input type="password" required={!isEdit} placeholder="Agent secret token" className={inputCls} value={form.token} onChange={e => f('token', e.target.value)} /></div>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-2 block">Color</label>
            <div className="flex gap-2">{COLORS.map(c => <button key={c} type="button" onClick={() => f('color', c)} className={`w-7 h-7 rounded-full transition-all ${form.color === c ? 'ring-2 ring-offset-2 ring-offset-card ring-white scale-110' : ''}`} style={{ background: c }} />)}</div>
          </div>

          <div className="border-t border-border pt-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Location (for map)</p>
            <div className="grid grid-cols-3 gap-3">
              <div><label className="text-xs text-muted-foreground mb-1 block">Lat</label><input placeholder="48.85" className={inputCls} value={form.lat} onChange={e => f('lat', e.target.value)} /></div>
              <div><label className="text-xs text-muted-foreground mb-1 block">Lng</label><input placeholder="2.35" className={inputCls} value={form.lng} onChange={e => f('lng', e.target.value)} /></div>
              <div><label className="text-xs text-muted-foreground mb-1 block">Country</label><input placeholder="FR" className={inputCls} value={form.country} onChange={e => f('country', e.target.value)} /></div>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Checks</p>
            <div className="space-y-3">
              <div><label className="text-xs text-muted-foreground mb-1 block">SSL Domain</label><input placeholder="example.com" className={inputCls} value={form.sslDomain} onChange={e => f('sslDomain', e.target.value)} /></div>
              <div><label className="text-xs text-muted-foreground mb-1 block">Health URL</label><input placeholder="https://example.com/api/health" className={inputCls} value={form.healthUrl} onChange={e => f('healthUrl', e.target.value)} /></div>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Alerts</p>
            <div className="space-y-3">
              <div><label className="text-xs text-muted-foreground mb-1 block">Telegram Chat ID</label><input placeholder="-1001234567890" className={inputCls} value={form.alertTelegram} onChange={e => f('alertTelegram', e.target.value)} /></div>
              <div><label className="text-xs text-muted-foreground mb-1 block">Alert Email</label><input type="email" placeholder="admin@example.com" className={inputCls} value={form.alertEmail} onChange={e => f('alertEmail', e.target.value)} /></div>
              <div className="grid grid-cols-3 gap-3">
                <div><label className="text-xs text-muted-foreground mb-1 block">CPU %</label><input type="number" min="50" max="100" className={inputCls} value={form.alertCpuThreshold} onChange={e => f('alertCpuThreshold', e.target.value)} /></div>
                <div><label className="text-xs text-muted-foreground mb-1 block">RAM %</label><input type="number" min="50" max="100" className={inputCls} value={form.alertRamThreshold} onChange={e => f('alertRamThreshold', e.target.value)} /></div>
                <div><label className="text-xs text-muted-foreground mb-1 block">Disk %</label><input type="number" min="50" max="100" className={inputCls} value={form.alertDiskThreshold} onChange={e => f('alertDiskThreshold', e.target.value)} /></div>
              </div>
            </div>
          </div>

          <button type="submit" disabled={saving} className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-all">
            {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Server'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ─── Incident Log ─────────────────────────────────────────────────────────────

function IncidentLog({ incidents }: { incidents: Incident[] }) {
  if (incidents.length === 0) return (
    <div className="text-center py-16 border border-dashed border-border rounded-2xl">
      <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
      <p className="text-sm text-muted-foreground">No incidents recorded</p>
    </div>
  )
  return (
    <div className="space-y-2">
      {incidents.map(inc => {
        const meta = INCIDENT_META[inc.type] ?? { label: inc.type, icon: '⚠️', color: 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20' }
        const duration = fmtDuration(inc.startedAt, inc.resolvedAt)
        return (
          <div key={inc.id} className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card">
            <span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: inc.server.color }} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <span className="font-medium text-sm text-foreground">{inc.server.name}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium border ${meta.color}`}>{meta.icon} {meta.label}</span>
                {inc.resolvedAt
                  ? <span className="px-1.5 py-0.5 rounded-full text-[10px] font-medium border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">✅ Resolved</span>
                  : <span className="px-1.5 py-0.5 rounded-full text-[10px] font-medium border bg-red-500/10 text-red-400 border-red-500/20">● Ongoing</span>}
              </div>
              <p className="text-xs text-muted-foreground truncate">{inc.message}</p>
            </div>
            <div className="text-right flex-shrink-0 text-[10px] text-muted-foreground">
              <div>{new Date(inc.startedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
              <div className="text-muted-foreground/60">Duration: {duration}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Comparison View ──────────────────────────────────────────────────────────

function CompareView({ states }: { states: ServerState[] }) {
  const metrics = ['CPU', 'RAM', 'Disk'] as const
  const dataOf = (s: ServerState, m: typeof metrics[number]) =>
    s.history.map(h => m === 'CPU' ? h.cpuPercent : m === 'RAM' ? h.memPercent : h.diskPercent)

  return (
    <div className="space-y-6">
      {metrics.map(metric => (
        <div key={metric} className="rounded-2xl border border-border bg-card p-4">
          <h3 className="font-semibold text-sm text-foreground mb-4">{metric} — Last 24h</h3>
          <div className="space-y-3">
            {states.map(state => {
              const data = dataOf(state, metric)
              const current = state.metrics
                ? metric === 'CPU' ? state.metrics.cpu.percent
                : metric === 'RAM' ? state.metrics.mem.percent
                : state.metrics.disk.percent
                : null
              return (
                <div key={state.server.id} className="flex items-center gap-3">
                  <div className="w-28 flex-shrink-0 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ background: state.server.color }} />
                    <span className="text-xs text-foreground truncate">{state.server.name}</span>
                  </div>
                  <div className="flex-1">
                    {data.length > 1 ? <Sparkline data={data} color={state.server.color} height={32} /> : <div className="h-8 bg-muted/20 rounded text-xs text-muted-foreground flex items-center justify-center">No data</div>}
                  </div>
                  <span className="w-12 text-right text-xs font-semibold text-foreground flex-shrink-0">
                    {current !== null ? `${current.toFixed(1)}%` : '—'}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

type Tab = 'overview' | 'incidents' | 'map' | 'compare'

export default function MonitoringDashboard({ initialServers }: { initialServers: Server[] }) {
  const [states, setStates] = useState<ServerState[]>(
    initialServers.map(s => ({ server: s, metrics: null, error: null, loading: true, lastUpdate: null, history: [], uptimePct: null, histLoading: true }))
  )
  const [tab, setTab] = useState<Tab>('overview')
  const [showAdd, setShowAdd] = useState(false)
  const [editServer, setEditServer] = useState<Server | null>(null)
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

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

  const fetchHistory = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/admin/monitoring/${id}/history`)
      if (!res.ok) return
      const { metrics, uptimePct } = await res.json()
      setStates(prev => prev.map(s => s.server.id === id ? { ...s, history: metrics, uptimePct, histLoading: false } : s))
    } catch { /* ignore */ }
  }, [])

  const fetchIncidents = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/monitoring/incidents')
      if (res.ok) setIncidents(await res.json())
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    states.forEach(s => { fetchMetrics(s.server.id); fetchHistory(s.server.id) })
    fetchIncidents()
    const metricsInterval = setInterval(() => states.forEach(s => fetchMetrics(s.server.id)), 10000)
    const histInterval = setInterval(() => { states.forEach(s => fetchHistory(s.server.id)); fetchIncidents() }, 300000)
    return () => { clearInterval(metricsInterval); clearInterval(histInterval) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [states.length])

  const addServer = (server: Server) => {
    setStates(prev => [...prev, { server, metrics: null, error: null, loading: true, lastUpdate: null, history: [], uptimePct: null, histLoading: true }])
    setTimeout(() => { fetchMetrics(server.id); fetchHistory(server.id) }, 100)
  }

  const updateServer = (server: Server) => {
    setStates(prev => prev.map(s => s.server.id === server.id ? { ...s, server } : s))
  }

  const removeServer = async (id: string) => {
    if (!confirm('Remove this server?')) return
    await fetch(`/api/admin/monitoring/${id}`, { method: 'DELETE' })
    setStates(prev => prev.filter(s => s.server.id !== id))
    setSelectedIds(prev => { const n = new Set(prev); n.delete(id); return n })
  }

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const n = new Set(prev)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })
  }

  const online = states.filter(s => s.metrics && !s.error).length
  const openIncidents = incidents.filter(i => !i.resolvedAt).length
  const compareStates = selectedIds.size > 0 ? states.filter(s => selectedIds.has(s.server.id)) : states

  const TABS = [
    { id: 'overview' as Tab,  label: 'Overview',  icon: BarChart2 },
    { id: 'incidents' as Tab, label: `Incidents${openIncidents > 0 ? ` (${openIncidents})` : ''}`, icon: AlertTriangle },
    { id: 'map' as Tab,       label: 'Map',       icon: Map },
    { id: 'compare' as Tab,   label: 'Compare',   icon: GitCompare },
  ]

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground mb-1">Server Monitoring</h1>
          <p className="text-sm text-muted-foreground">
            {online}/{states.length} online
            {openIncidents > 0 && <span className="ml-2 text-red-400 font-medium">· {openIncidents} open incident{openIncidents > 1 ? 's' : ''}</span>}
            <span className="ml-2">· auto-refresh 10s</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { states.forEach(s => fetchMetrics(s.server.id)); fetchIncidents() }}
            className="inline-flex items-center gap-2 px-3 py-2 border border-border text-sm text-muted-foreground rounded-xl hover:text-foreground hover:bg-muted transition-all">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all">
            <Plus className="w-4 h-4" /> Add Server
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 border-b border-border">
        {TABS.map(t => {
          const Icon = t.icon
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px ${tab === t.id ? 'border-blue-500 text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
              <Icon className="w-3.5 h-3.5" />{t.label}
            </button>
          )
        })}
      </div>

      {/* Overview */}
      {tab === 'overview' && (
        states.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-border rounded-2xl">
            <p className="text-muted-foreground mb-3">No servers added yet</p>
            <button onClick={() => setShowAdd(true)} className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl">
              <Plus className="w-4 h-4" /> Add Server
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {states.map(state => (
              <ServerCard key={state.server.id} state={state}
                onRemove={() => removeServer(state.server.id)}
                onEdit={() => setEditServer(state.server)}
                selected={selectedIds.has(state.server.id)}
                onSelect={() => toggleSelect(state.server.id)}
              />
            ))}
          </div>
        )
      )}

      {/* Incidents */}
      {tab === 'incidents' && <IncidentLog incidents={incidents} />}

      {/* Map */}
      {tab === 'map' && (
        <WorldMap servers={states.map(s => ({
          id: s.server.id, name: s.server.name, color: s.server.color,
          lat: s.server.lat, lng: s.server.lng, country: s.server.country,
          online: !!s.metrics && !s.error,
        }))} />
      )}

      {/* Compare */}
      {tab === 'compare' && (
        <div>
          {states.length > 1 && (
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="text-xs text-muted-foreground">Select servers to compare (or leave all selected):</span>
              {states.map(s => (
                <button key={s.server.id} onClick={() => toggleSelect(s.server.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-all ${selectedIds.has(s.server.id) ? 'border-blue-500/50 bg-blue-500/10 text-foreground' : 'border-border text-muted-foreground hover:text-foreground'}`}>
                  <span className="w-2 h-2 rounded-full" style={{ background: s.server.color }} />
                  {s.server.name}
                  {selectedIds.has(s.server.id) && <Check className="w-3 h-3 text-blue-400" />}
                </button>
              ))}
            </div>
          )}
          <CompareView states={compareStates} />
        </div>
      )}

      {/* Modals */}
      {showAdd && <ServerModal onSave={addServer} onClose={() => setShowAdd(false)} />}
      {editServer && <ServerModal initial={editServer} onSave={updateServer} onClose={() => setEditServer(null)} />}
    </div>
  )
}
