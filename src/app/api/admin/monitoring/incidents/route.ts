import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const incidents = await prisma.serverIncident.findMany({
    orderBy: { startedAt: 'desc' },
    take: 100,
    include: { server: { select: { name: true, color: true } } },
  })

  return NextResponse.json(incidents)
}
