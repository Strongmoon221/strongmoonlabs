import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

interface RouteParams { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const session = await getSession()
  if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000)

  const metrics = await prisma.serverMetric.findMany({
    where: { serverId: id, createdAt: { gte: since } },
    orderBy: { createdAt: 'asc' },
    select: { cpuPercent: true, memPercent: true, diskPercent: true, online: true, responseMs: true, createdAt: true },
  })

  // Calculate uptime % over 30 days
  const since30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const total30 = await prisma.serverMetric.count({ where: { serverId: id, createdAt: { gte: since30 } } })
  const online30 = await prisma.serverMetric.count({ where: { serverId: id, online: true, createdAt: { gte: since30 } } })
  const uptimePct = total30 > 0 ? ((online30 / total30) * 100).toFixed(2) : null

  return NextResponse.json({ metrics, uptimePct })
}
