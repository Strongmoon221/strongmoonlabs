import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

interface RouteParams { params: Promise<{ slug: string }> }

export async function POST(request: NextRequest, { params }: RouteParams) {
  const { slug } = await params

  const app = await prisma.app.findUnique({ where: { slug, published: true } })
  if (!app) return NextResponse.json({ error: 'App not found' }, { status: 404 })

  const { name, email, message } = await request.json()
  if (!name || !email || !message) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
  }

  await prisma.supportTicket.create({
    data: { name, email, message, appId: app.id },
  })

  return NextResponse.json({ success: true })
}
