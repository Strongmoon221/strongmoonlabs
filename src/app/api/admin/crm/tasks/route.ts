import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { title, description, status, priority, deadline, projectId, assigneeId } = await request.json()
  if (!title || !projectId) return NextResponse.json({ error: 'Title and projectId required' }, { status: 400 })

  const count = await prisma.crmTask.count({ where: { projectId, status: status || 'todo' } })

  const task = await prisma.crmTask.create({
    data: {
      title,
      description,
      status: status || 'todo',
      priority: priority || 'medium',
      deadline: deadline ? new Date(deadline) : null,
      projectId,
      assigneeId: assigneeId || null,
      order: count,
    },
    include: { assignee: { select: { id: true, name: true, color: true, avatar: true } } },
  })
  return NextResponse.json(task)
}
