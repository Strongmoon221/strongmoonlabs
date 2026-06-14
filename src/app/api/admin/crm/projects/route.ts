import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const priority = searchParams.get('priority')
  const search = searchParams.get('search')
  const archived = searchParams.get('archived') === 'true'

  const projects = await prisma.crmProject.findMany({
    where: {
      archived,
      ...(status ? { status } : {}),
      ...(priority ? { priority } : {}),
      ...(search ? { name: { contains: search } } : {}),
    },
    include: {
      members: { include: { user: { select: { id: true, name: true, color: true, avatar: true } } } },
      tasks: { select: { id: true, status: true } },
    },
    orderBy: [{ createdAt: 'desc' }],
  })

  return NextResponse.json(projects)
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { name, description, status, priority, deadline, memberIds } = body

  if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 })

  const project = await prisma.crmProject.create({
    data: {
      name,
      description,
      status: status || 'planning',
      priority: priority || 'medium',
      deadline: deadline ? new Date(deadline) : null,
      members: memberIds?.length
        ? { create: memberIds.map((userId: string) => ({ userId })) }
        : undefined,
    },
    include: {
      members: { include: { user: true } },
    },
  })

  return NextResponse.json(project)
}
