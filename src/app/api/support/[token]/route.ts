import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

interface RouteParams { params: Promise<{ token: string }> }

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { token } = await params
  const ticket = await prisma.supportTicket.findUnique({
    where: { token },
    include: {
      app: { select: { name: true, iconUrl: true } },
      messages: { orderBy: { createdAt: 'asc' } },
    },
  })
  if (!ticket) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(ticket)
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const { token } = await params
  const ticket = await prisma.supportTicket.findUnique({ where: { token } })
  if (!ticket) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (ticket.status === 'closed') return NextResponse.json({ error: 'Ticket is closed' }, { status: 400 })

  const { content, imageUrl } = await request.json()
  if (!content?.trim() && !imageUrl) return NextResponse.json({ error: 'Empty message' }, { status: 400 })

  const msg = await prisma.ticketMessage.create({
    data: { content: content?.trim() || '', imageUrl: imageUrl ?? null, fromAdmin: false, ticketId: ticket.id },
  })
  return NextResponse.json(msg)
}
