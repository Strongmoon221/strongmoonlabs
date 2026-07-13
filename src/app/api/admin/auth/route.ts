import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { createSession, deleteSession } from '@/lib/auth'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)

    const adminUser = await prisma.adminUser.findUnique({ where: { email } })
    if (adminUser) {
      const valid = await bcrypt.compare(password, adminUser.password)
      if (valid) {
        await createSession(adminUser.id, adminUser.email)
        return NextResponse.json({ success: true, user: { id: adminUser.id, email: adminUser.email, name: adminUser.name } })
      }
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }
    console.error('Auth error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE() {
  await deleteSession()
  return NextResponse.json({ success: true })
}
