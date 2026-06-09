import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

const updateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  iconUrl: z.string().optional(),
  published: z.boolean().optional(),
})

interface RouteParams { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const app = await prisma.app.findUnique({
    where: { id },
    include: { pages: { orderBy: { type: 'asc' } } },
  })

  if (!app) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(app)
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  try {
    const body = await request.json()
    const data = updateSchema.parse(body)
    const app = await prisma.app.update({ where: { id }, data })
    return NextResponse.json(app)
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await prisma.app.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
