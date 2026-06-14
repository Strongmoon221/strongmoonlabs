import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { createCrmSession, deleteCrmSession } from '@/lib/crm-auth'

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()
  if (!email || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const user = await prisma.crmAccount.findUnique({ where: { email } })
  if (!user || !user.active) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

  await createCrmSession(user.id, user.email)
  return NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email, permissions: JSON.parse(user.permissions) } })
}

export async function DELETE() {
  await deleteCrmSession()
  return NextResponse.json({ success: true })
}
