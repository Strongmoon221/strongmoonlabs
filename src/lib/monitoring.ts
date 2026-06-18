import { connect } from 'tls'
import nodemailer from 'nodemailer'

// ─── SSL check ───────────────────────────────────────────────────────────────

export async function checkSSL(hostname: string): Promise<{ daysLeft: number; expires: Date } | null> {
  return new Promise((resolve) => {
    try {
      const socket = connect(443, hostname, { servername: hostname, rejectUnauthorized: false }, () => {
        const cert = socket.getPeerCertificate()
        socket.destroy()
        if (!cert?.valid_to) { resolve(null); return }
        const expires = new Date(cert.valid_to)
        const daysLeft = Math.floor((expires.getTime() - Date.now()) / 86_400_000)
        resolve({ daysLeft, expires })
      })
      socket.setTimeout(5000, () => { socket.destroy(); resolve(null) })
      socket.on('error', () => resolve(null))
    } catch {
      resolve(null)
    }
  })
}

// ─── HTTP health check ────────────────────────────────────────────────────────

export async function checkHealth(url: string): Promise<{ ok: boolean; statusCode: number; responseMs: number }> {
  const start = Date.now()
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000), method: 'GET' })
    return { ok: res.ok, statusCode: res.status, responseMs: Date.now() - start }
  } catch {
    return { ok: false, statusCode: 0, responseMs: Date.now() - start }
  }
}

// ─── Telegram alert ───────────────────────────────────────────────────────────

export async function sendTelegramAlert(chatId: string, text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://strongmoonlabs.com'
  if (!token || !chatId) return
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [[
            { text: '📊 Open Dashboard', url: `${siteUrl}/admin/monitoring` },
          ]],
        },
      }),
    })
  } catch { /* non-blocking */ }
}

// ─── Email alert ──────────────────────────────────────────────────────────────

export async function sendEmailAlert(to: string, subject: string, html: string): Promise<void> {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    })
    await transporter.sendMail({
      from: `"Strongmoon Monitor" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    })
  } catch { /* non-blocking */ }
}

// ─── Alert message builders ───────────────────────────────────────────────────

const TYPE_ICONS: Record<string, string> = {
  offline: '🔌', cpu: '⚡', ram: '🧠', disk: '💾', ssl: '🔐', health: '🌐',
}
const TYPE_LABELS: Record<string, string> = {
  offline: 'Server Offline', cpu: 'High CPU', ram: 'High RAM',
  disk: 'High Disk', ssl: 'SSL Expiring', health: 'Health Check Failed',
}

function bar(pct: number, w = 10): string {
  const f = Math.round(Math.max(0, Math.min(100, pct)) / 100 * w)
  return '█'.repeat(f) + '░'.repeat(w - f)
}

function fmtDuration(ms: number): string {
  const s = Math.floor(ms / 1000)
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ${s % 60}s`
  return `${Math.floor(m / 60)}h ${m % 60}m`
}

export interface AlertCtx {
  cpu?: number
  ram?: number
  disk?: number
  durationMs?: number
}

export function alertMessage(serverName: string, type: string, message: string, resolved = false, ctx?: AlertCtx): string {
  const icon = TYPE_ICONS[type] ?? '⚠️'
  const label = TYPE_LABELS[type] ?? type
  const time = new Date().toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZone: 'UTC', timeZoneName: 'short',
  })

  const header = resolved
    ? `✅ <b>RESOLVED — ${serverName}</b>`
    : `🚨 <b>ALERT — ${serverName}</b>`

  const sep = '┄'.repeat(22)

  const body = resolved
    ? `${icon} <b>${label} — Fixed</b>\n<code>${message}</code>`
    : `${icon} <b>${label}</b>\n<code>${message}</code>`

  const duration = resolved && ctx?.durationMs
    ? `\n⏱ <b>Duration:</b> ${fmtDuration(ctx.durationMs)}`
    : ''

  const lines: string[] = []
  if (ctx?.cpu  !== undefined) lines.push(`CPU   [${bar(ctx.cpu)}] ${String(ctx.cpu.toFixed(1)).padStart(5)}%`)
  if (ctx?.ram  !== undefined) lines.push(`RAM   [${bar(ctx.ram)}] ${String(ctx.ram.toFixed(1)).padStart(5)}%`)
  if (ctx?.disk !== undefined) lines.push(`Disk  [${bar(ctx.disk)}] ${String(ctx.disk.toFixed(1)).padStart(5)}%`)
  const metrics = lines.length ? `\n📊 <b>Metrics</b>\n<code>${lines.join('\n')}</code>` : ''

  return `${header}\n<code>${sep}</code>\n\n${body}${duration}${metrics}\n\n🕐 <i>${time}</i>`
}

export function alertHtml(serverName: string, type: string, message: string, resolved = false, ctx?: AlertCtx): string {
  const color = resolved ? '#10b981' : '#ef4444'
  const status = resolved ? '✅ RESOLVED' : '🔴 ALERT'
  const label = TYPE_LABELS[type] ?? type
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''

  const metricRows = [
    ctx?.cpu  !== undefined ? `<tr><td>CPU</td><td>${ctx.cpu.toFixed(1)}%</td><td style="width:120px"><div style="height:8px;background:#e5e7eb;border-radius:4px"><div style="height:8px;width:${ctx.cpu}%;background:${color};border-radius:4px"></div></div></td></tr>` : '',
    ctx?.ram  !== undefined ? `<tr><td>RAM</td><td>${ctx.ram.toFixed(1)}%</td><td><div style="height:8px;background:#e5e7eb;border-radius:4px"><div style="height:8px;width:${ctx.ram}%;background:${color};border-radius:4px"></div></div></td></tr>` : '',
    ctx?.disk !== undefined ? `<tr><td>Disk</td><td>${ctx.disk.toFixed(1)}%</td><td><div style="height:8px;background:#e5e7eb;border-radius:4px"><div style="height:8px;width:${ctx.disk}%;background:${color};border-radius:4px"></div></div></td></tr>` : '',
  ].filter(Boolean).join('')

  const durationRow = resolved && ctx?.durationMs
    ? `<p style="color:#6b7280;font-size:13px">⏱ Duration: <b>${fmtDuration(ctx.durationMs)}</b></p>` : ''

  return `<div style="font-family:sans-serif;max-width:520px;margin:0 auto;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
    <div style="background:${color};color:#fff;padding:16px 20px">
      <div style="font-size:18px;font-weight:700">${status}</div>
      <div style="font-size:22px;font-weight:800;margin-top:2px">${serverName}</div>
    </div>
    <div style="padding:20px;background:#fff">
      <p style="font-size:15px;font-weight:600;margin:0 0 4px">${TYPE_ICONS[type] ?? '⚠️'} ${label}</p>
      <p style="color:#6b7280;font-size:13px;margin:0 0 12px">${message}</p>
      ${durationRow}
      ${metricRows ? `<table style="width:100%;border-collapse:collapse;font-size:13px;margin-top:12px">${metricRows}</table>` : ''}
      <a href="${siteUrl}/admin/monitoring" style="display:inline-block;margin-top:16px;padding:10px 20px;background:#2563eb;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">📊 View Dashboard →</a>
    </div>
  </div>`
}
