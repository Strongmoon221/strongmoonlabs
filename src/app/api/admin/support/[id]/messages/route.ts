import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

interface RouteParams { params: Promise<{ id: string }> }

export async function POST(request: NextRequest, { params }: RouteParams) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { content, imageUrl } = await request.json()
  if (!content?.trim() && !imageUrl) return NextResponse.json({ error: 'Empty message' }, { status: 400 })

  const msg = await prisma.ticketMessage.create({
    data: { content: content?.trim() || '', imageUrl: imageUrl ?? null, fromAdmin: true, ticketId: id },
  })
  return NextResponse.json(msg)
}
