import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

interface RouteParams { params: Promise<{ id: string }> }

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { name, email, password, permissions, active } = await request.json()

  const data: Record<string, unknown> = {}
  if (name !== undefined) data.name = name
  if (email !== undefined) data.email = email
  if (active !== undefined) data.active = active
  if (permissions !== undefined) data.permissions = JSON.stringify(permissions)
  if (password) data.password = await bcrypt.hash(password, 12)

  const user = await prisma.crmAccount.update({ where: { id }, data })
  return NextResponse.json({ ...user, password: undefined })
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await prisma.crmAccount.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
