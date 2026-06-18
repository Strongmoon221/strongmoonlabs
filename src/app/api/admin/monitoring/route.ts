import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const servers = await prisma.monitoredServer.findMany({ orderBy: { createdAt: 'asc' } })
  return NextResponse.json(servers)
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { name, url, token, color } = await request.json()
  if (!name || !url || !token) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  const server = await prisma.monitoredServer.create({ data: { name, url, token, color: color ?? '#3b82f6' } })
  return NextResponse.json(server)
}
