import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { checkSSL, checkHealth, sendTelegramAlert, sendEmailAlert, alertMessage, alertHtml, type AlertCtx } from '@/lib/monitoring'

const CRON_SECRET = process.env.CRON_SECRET

// Called every 5 min by system cron:
// */5 * * * * curl -s -X POST https://strongmoonlabs.com/api/admin/monitoring/collect -H "Authorization: Bearer YOUR_CRON_SECRET"
export async function POST(request: NextRequest) {
  if (CRON_SECRET) {
    const auth = request.headers.get('authorization')
    if (auth !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const servers = await prisma.monitoredServer.findMany({
    where: { active: true },
    include: {
      incidents: { where: { resolvedAt: null }, select: { id: true, type: true, startedAt: true } },
    },
  })

  const results = await Promise.allSettled(servers.map(async (server) => {
    const start = Date.now()
    let metrics: Record<string, unknown> | null = null
    let online = false
    let responseMs = 0

    try {
      const res = await fetch(`${server.url}/metrics`, {
        headers: { Authorization: `Bearer ${server.token}` },
        signal: AbortSignal.timeout(8000),
      })
      responseMs = Date.now() - start
      if (res.ok) { metrics = await res.json(); online = true }
    } catch {
      responseMs = Date.now() - start
    }

    const cpuPercent = online ? ((metrics?.cpu as Record<string, number>)?.percent ?? 0) : 0
    const memPercent = online ? ((metrics?.mem as Record<string, number>)?.percent ?? 0) : 0
    const diskPercent = online ? ((metrics?.disk as Record<string, number>)?.percent ?? 0) : 0

    // SSL check
    let sslDaysLeft: number | null = null
    if (server.sslDomain) {
      const ssl = await checkSSL(server.sslDomain)
      sslDaysLeft = ssl?.daysLeft ?? null
    }

    // Health check
    let healthOk: boolean | null = null
    if (server.healthUrl) {
      const h = await checkHealth(server.healthUrl)
      healthOk = h.ok
    }

    // Save metric
    await prisma.serverMetric.create({
      data: { serverId: server.id, online, cpuPercent, memPercent, diskPercent, responseMs, sslDaysLeft, healthOk },
    })

    // Cleanup metrics older than 30 days
    const cutoff = new Date(Date.now() - 30 * 86_400_000)
    await prisma.serverMetric.deleteMany({ where: { serverId: server.id, createdAt: { lt: cutoff } } })

    const openIncidents = server.incidents
    const hasOpen = (type: string) => openIncidents.some(i => i.type === type)

    const ctx: AlertCtx = { cpu: cpuPercent, ram: memPercent, disk: diskPercent }

    async function openIncident(type: string, message: string) {
      if (hasOpen(type)) return
      await prisma.serverIncident.create({ data: { serverId: server.id, type, message } })
      const text = alertMessage(server.name, type, message, false, ctx)
      const html = alertHtml(server.name, type, message, false, ctx)
      if (server.alertTelegram) await sendTelegramAlert(server.alertTelegram, text)
      if (server.alertEmail) await sendEmailAlert(server.alertEmail, `🔴 [ALERT] ${server.name} — ${type}`, html)
    }

    async function resolveIncident(type: string) {
      const incident = openIncidents.find(i => i.type === type)
      if (!incident) return
      const durationMs = Date.now() - incident.startedAt.getTime()
      await prisma.serverIncident.update({ where: { id: incident.id }, data: { resolvedAt: new Date() } })
      const msg = `Back to normal`
      const text = alertMessage(server.name, type, msg, true, { ...ctx, durationMs })
      const html = alertHtml(server.name, type, msg, true, { ...ctx, durationMs })
      if (server.alertTelegram) await sendTelegramAlert(server.alertTelegram, text)
      if (server.alertEmail) await sendEmailAlert(server.alertEmail, `✅ [RESOLVED] ${server.name} — ${type}`, html)
    }

    // Offline incident
    if (!online) {
      await openIncident('offline', 'Server not responding to health checks')
    } else {
      await resolveIncident('offline')
    }

    // CPU incident
    if (online && cpuPercent >= server.alertCpuThreshold) {
      await openIncident('cpu', `CPU at ${cpuPercent.toFixed(1)}% (threshold: ${server.alertCpuThreshold}%)`)
    } else if (online && cpuPercent < server.alertCpuThreshold - 5) {
      await resolveIncident('cpu')
    }

    // RAM incident
    if (online && memPercent >= server.alertRamThreshold) {
      await openIncident('ram', `RAM at ${memPercent.toFixed(1)}% (threshold: ${server.alertRamThreshold}%)`)
    } else if (online && memPercent < server.alertRamThreshold - 5) {
      await resolveIncident('ram')
    }

    // Disk incident
    if (online && diskPercent >= server.alertDiskThreshold) {
      await openIncident('disk', `Disk at ${diskPercent.toFixed(1)}% (threshold: ${server.alertDiskThreshold}%)`)
    } else if (online && diskPercent < server.alertDiskThreshold - 5) {
      await resolveIncident('disk')
    }

    // SSL incident
    if (sslDaysLeft !== null && sslDaysLeft <= 30) {
      await openIncident('ssl', `SSL certificate expires in ${sslDaysLeft} days`)
    } else if (sslDaysLeft !== null && sslDaysLeft > 30) {
      await resolveIncident('ssl')
    }

    // Health check incident
    if (healthOk === false) {
      await openIncident('health', `Health endpoint returned error: ${server.healthUrl}`)
    } else if (healthOk === true) {
      await resolveIncident('health')
    }

    return { id: server.id, online, cpuPercent, memPercent }
  }))

  return NextResponse.json({ collected: results.length, at: new Date().toISOString() })
}
