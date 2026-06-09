import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { slugify } from '@/lib/utils'

const schema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().optional(),
  description: z.string().optional(),
  iconUrl: z.string().optional(),
  published: z.boolean().default(true),
})

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const apps = await prisma.app.findMany({
    include: { pages: { select: { type: true, updatedAt: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(apps)
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const data = schema.parse(body)
    const slug = data.slug || slugify(data.name)

    const existing = await prisma.app.findUnique({ where: { slug } })
    if (existing) return NextResponse.json({ error: 'Slug already exists' }, { status: 409 })

    const app = await prisma.app.create({
      data: { ...data, slug, description: data.description || null, iconUrl: data.iconUrl || null },
    })

    return NextResponse.json(app, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
