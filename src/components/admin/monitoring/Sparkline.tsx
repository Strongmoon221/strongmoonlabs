interface Props {
  data: number[]
  color: string
  height?: number
}

export default function Sparkline({ data, color, height = 36 }: Props) {
  if (data.length < 2) {
    return <div className="h-9 bg-muted/20 rounded animate-pulse" />
  }

  const w = 200
  const h = height
  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * w,
    y: h - Math.max(0, Math.min(100, v)) / 100 * h,
  }))

  const polyline = pts.map(p => `${p.x},${p.y}`).join(' ')
  const area = [...pts.map(p => `${p.x},${p.y}`), `${w},${h}`, `0,${h}`].join(' ')
  const gradId = `spark-${color.replace('#', '')}`

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#${gradId})`} />
      <polyline points={polyline} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
