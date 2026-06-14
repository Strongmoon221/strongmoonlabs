import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

interface RouteParams { params: Promise<{ id: string }> }

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { status } = await request.json()

  const ticket = await prisma.supportTicket.update({
    where: { id },
    data: { status },
  })

  return NextResponse.json(ticket)
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await prisma.supportTicket.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
