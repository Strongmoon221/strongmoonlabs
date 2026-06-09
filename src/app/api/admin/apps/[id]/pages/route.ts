import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

const schema = z.object({
  type: z.enum(['privacy', 'terms', 'support']),
  title: z.string().min(1),
  content: z.string().min(1),
})

interface RouteParams { params: Promise<{ id: string }> }

export async function POST(request: NextRequest, { params }: RouteParams) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: appId } = await params

  try {
    const body = await request.json()
    const data = schema.parse(body)

    const page = await prisma.appPage.upsert({
      where: { appId_type: { appId, type: data.type } },
      update: { title: data.title, content: data.content },
      create: { appId, ...data },
    })

    return NextResponse.json(page)
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
