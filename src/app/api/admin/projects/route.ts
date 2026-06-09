import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { slugify } from '@/lib/utils'

const projectSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).optional(),
  description: z.string().min(1).max(500),
  longDescription: z.string().optional(),
  category: z.enum(['mobile', 'website', 'saas', 'tool']),
  technologies: z.string().min(1),
  features: z.string().optional(),
  challenges: z.string().optional(),
  results: z.string().optional(),
  liveUrl: z.string().url().optional().or(z.literal('')),
  githubUrl: z.string().url().optional().or(z.literal('')),
  coverImage: z.string().optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  order: z.number().int().default(0),
})

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const projects = await prisma.project.findMany({
    include: { screenshots: { orderBy: { order: 'asc' } } },
    orderBy: [{ featured: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }],
  })

  return NextResponse.json(projects)
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const data = projectSchema.parse(body)

    const slug = data.slug || slugify(data.title)

    const existing = await prisma.project.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json({ error: 'A project with this slug already exists' }, { status: 409 })
    }

    const project = await prisma.project.create({
      data: {
        ...data,
        slug,
        liveUrl: data.liveUrl || null,
        githubUrl: data.githubUrl || null,
        longDescription: data.longDescription || null,
        features: data.features || null,
        challenges: data.challenges || null,
        results: data.results || null,
        coverImage: data.coverImage || null,
      },
      include: { screenshots: true },
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 })
    }
    console.error('Create project error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
