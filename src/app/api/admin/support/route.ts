import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const appId = searchParams.get('appId')
  const status = searchParams.get('status')

  const tickets = await prisma.supportTicket.findMany({
    where: {
      ...(appId ? { appId } : {}),
      ...(status ? { status } : {}),
    },
    include: { app: { select: { name: true, slug: true, iconUrl: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(tickets)
}
