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
  if (!token || !chatId) return
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
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

export function alertMessage(serverName: string, type: string, message: string, resolved = false): string {
  const icon = resolved ? '✅' : '🔴'
  const status = resolved ? 'RESOLVED' : 'ALERT'
  const time = new Date().toUTCString()
  return `${icon} <b>[${status}] ${serverName}</b>\n\n<b>Type:</b> ${type}\n<b>Detail:</b> ${message}\n<b>Time:</b> ${time}`
}

export function alertHtml(serverName: string, type: string, message: string, resolved = false): string {
  const color = resolved ? '#10b981' : '#ef4444'
  const status = resolved ? '✅ RESOLVED' : '🔴 ALERT'
  return `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;">
      <div style="background:${color};color:#fff;padding:12px 20px;border-radius:8px 8px 0 0;font-weight:700;font-size:16px;">${status} — ${serverName}</div>
      <div style="border:1px solid #e5e7eb;border-top:none;padding:20px;border-radius:0 0 8px 8px;">
        <p><strong>Type:</strong> ${type}</p>
        <p><strong>Detail:</strong> ${message}</p>
        <p><strong>Time:</strong> ${new Date().toUTCString()}</p>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/monitoring" style="display:inline-block;padding:10px 20px;background:#2563eb;color:#fff;border-radius:8px;text-decoration:none;margin-top:8px;">View Dashboard →</a>
      </div>
    </div>`
}
