import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

interface RouteParams { params: Promise<{ id: string }> }

// Proxy metrics request to the agent
export async function GET(_req: NextRequest, { params }: RouteParams) {
  const session = await getSession()
  if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const server = await prisma.monitoredServer.findUnique({ where: { id } })
  if (!server) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  try {
    const res = await fetch(`${server.url}/metrics`, {
      headers: { Authorization: `Bearer ${server.token}` },
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) return NextResponse.json({ error: 'Agent error', status: res.status }, { status: 502 })
    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Unreachable' }, { status: 503 })
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const session = await getSession()
  if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const data = await request.json()
  const server = await prisma.monitoredServer.update({ where: { id }, data })
  return NextResponse.json(server)
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const session = await getSession()
  if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  await prisma.monitoredServer.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
