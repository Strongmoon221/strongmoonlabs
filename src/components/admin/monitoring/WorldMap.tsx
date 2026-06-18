interface Server {
  id: string
  name: string
  color: string
  lat?: number | null
  lng?: number | null
  country?: string | null
  online?: boolean
}

// Equirectangular projection
function toXY(lat: number, lng: number, w: number, h: number) {
  return {
    x: ((lng + 180) / 360) * w,
    y: ((90 - lat) / 180) * h,
  }
}

const W = 800
const H = 400

export default function WorldMap({ servers }: { servers: Server[] }) {
  const positioned = servers.filter(s => s.lat != null && s.lng != null)

  // Grid lines
  const latLines = [-60, -30, 0, 30, 60]
  const lngLines = [-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150]

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="font-semibold text-sm text-foreground">Server Locations</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{positioned.length} of {servers.length} servers have coordinates</p>
      </div>

      <div className="relative bg-zinc-950 p-4">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-xl" style={{ background: 'radial-gradient(ellipse at center, #0f172a 0%, #020617 100%)' }}>
          {/* Grid lines */}
          {latLines.map(lat => {
            const { y } = toXY(lat, 0, W, H)
            return <line key={lat} x1={0} y1={y} x2={W} y2={y} stroke="#1e293b" strokeWidth="0.5" />
          })}
          {lngLines.map(lng => {
            const { x } = toXY(0, lng, W, H)
            return <line key={lng} x1={x} y1={0} x2={x} y2={H} stroke="#1e293b" strokeWidth="0.5" />
          })}
          {/* Equator + prime meridian highlight */}
          <line x1={0} y1={H / 2} x2={W} y2={H / 2} stroke="#1e3a5f" strokeWidth="0.8" />
          <line x1={W / 2} y1={0} x2={W / 2} y2={H} stroke="#1e3a5f" strokeWidth="0.8" />

          {/* Servers without coordinates - show in corner */}
          {servers.filter(s => s.lat == null).map((s, i) => (
            <g key={s.id}>
              <circle cx={20 + i * 18} cy={H - 16} r={5} fill={s.color} opacity={0.5} />
            </g>
          ))}

          {/* Positioned servers */}
          {positioned.map(s => {
            const { x, y } = toXY(s.lat!, s.lng!, W, H)
            return (
              <g key={s.id}>
                {/* Ping ring */}
                <circle cx={x} cy={y} r={12} fill={s.color} opacity={0.08}>
                  <animate attributeName="r" from="6" to="20" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.2" to="0" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx={x} cy={y} r={6} fill={s.color} opacity={0.15} />
                <circle cx={x} cy={y} r={4} fill={s.color} opacity={s.online ? 1 : 0.3} />
                {/* Status dot */}
                <circle cx={x + 5} cy={y - 5} r={2} fill={s.online ? '#10b981' : '#ef4444'} />
                {/* Label */}
                <text x={x} y={y + 16} textAnchor="middle" fontSize="8" fill="#94a3b8" fontFamily="sans-serif">
                  {s.name}
                </text>
              </g>
            )
          })}
        </svg>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />Online
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-red-400" />Offline
          </div>
          {servers.filter(s => s.lat == null).length > 0 && (
            <div className="text-xs text-muted-foreground">
              • {servers.filter(s => s.lat == null).length} server(s) without coordinates (bottom-left)
            </div>
          )}
        </div>
      </div>

      {/* Server list */}
      <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
        {servers.map(s => (
          <div key={s.id} className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
            <span className="text-foreground truncate">{s.name}</span>
            {s.country && <span className="text-muted-foreground">{s.country}</span>}
          </div>
        ))}
      </div>
    </div>
  )
}
