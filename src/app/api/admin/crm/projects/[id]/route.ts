import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

interface RouteParams { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const project = await prisma.crmProject.findUnique({
    where: { id },
    include: {
      members: { include: { user: true } },
      tasks: {
        include: { assignee: { select: { id: true, name: true, color: true, avatar: true } } },
        orderBy: { order: 'asc' },
      },
    },
  })
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(project)
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await request.json()
  const { memberIds, ...data } = body

  const project = await prisma.crmProject.update({
    where: { id },
    data: {
      ...data,
      ...(data.deadline ? { deadline: new Date(data.deadline) } : {}),
      ...(memberIds !== undefined ? {
        members: {
          deleteMany: {},
          create: memberIds.map((userId: string) => ({ userId })),
        },
      } : {}),
    },
    include: {
      members: { include: { user: true } },
      tasks: { include: { assignee: true }, orderBy: { order: 'asc' } },
    },
  })
  return NextResponse.json(project)
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await prisma.crmProject.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
