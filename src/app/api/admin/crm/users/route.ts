import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const users = await prisma.crmAccount.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(users.map(u => ({ ...u, password: undefined })))
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name, email, password, permissions, resources } = await request.json()
  if (!name || !email || !password) return NextResponse.json({ error: 'Name, email and password required' }, { status: 400 })

  const existing = await prisma.crmAccount.findUnique({ where: { email } })
  if (existing) return NextResponse.json({ error: 'Email already exists' }, { status: 400 })

  const hashed = await bcrypt.hash(password, 12)
  const user = await prisma.crmAccount.create({
    data: {
      name,
      email,
      password: hashed,
      permissions: JSON.stringify(permissions ?? []),
      resources: JSON.stringify(resources ?? {}),
    },
  })
  return NextResponse.json({ ...user, password: undefined })
}
