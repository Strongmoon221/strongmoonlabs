import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sendTicketConfirmation, sendAdminNotification } from '@/lib/mailer'

interface RouteParams { params: Promise<{ slug: string }> }

export async function POST(request: NextRequest, { params }: RouteParams) {
  const { slug } = await params

  const app = await prisma.app.findUnique({ where: { slug, published: true } })
  if (!app) return NextResponse.json({ error: 'App not found' }, { status: 404 })

  const { name, email, message } = await request.json()
  if (!name || !email || !message) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
  }

  const ticket = await prisma.supportTicket.create({
    data: { name, email, message, appId: app.id },
  })

  // Also save the first message in the chat
  await prisma.ticketMessage.create({
    data: { content: message, fromAdmin: false, ticketId: ticket.id },
  })

  // Send emails (non-blocking)
  Promise.all([
    sendTicketConfirmation({ to: email, name, appName: app.name, token: ticket.token }),
    sendAdminNotification({ appName: app.name, userName: name, message, ticketId: ticket.id }),
  ]).catch(console.error)

  return NextResponse.json({ token: ticket.token })
}
