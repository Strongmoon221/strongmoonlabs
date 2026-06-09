import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

const updateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).max(500).optional(),
  longDescription: z.string().optional(),
  category: z.enum(['mobile', 'website', 'saas', 'tool']).optional(),
  technologies: z.string().optional(),
  features: z.string().optional(),
  challenges: z.string().optional(),
  results: z.string().optional(),
  liveUrl: z.string().url().optional().or(z.literal('')),
  githubUrl: z.string().url().optional().or(z.literal('')),
  coverImage: z.string().optional(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
  order: z.number().int().optional(),
})

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const project = await prisma.project.findUnique({
    where: { id },
    include: { screenshots: { orderBy: { order: 'asc' } } },
  })

  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json(project)
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  try {
    const body = await request.json()
    const data = updateSchema.parse(body)

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...data,
        liveUrl: data.liveUrl === '' ? null : data.liveUrl,
        githubUrl: data.githubUrl === '' ? null : data.githubUrl,
      },
      include: { screenshots: true },
    })

    return NextResponse.json(project)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 })
    }
    console.error('Update project error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  try {
    await prisma.project.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 })
  }
}
