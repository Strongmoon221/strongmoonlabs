import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendTicketConfirmation({
  to,
  name,
  appName,
  token,
}: {
  to: string
  name: string
  appName: string
  token: string
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://strongmoonlabs.com'
  const chatUrl = `${siteUrl}/support/${token}`

  await transporter.sendMail({
    from: `"Strongmoon Labs Support" <${process.env.SMTP_USER}>`,
    to,
    subject: `Your support request for ${appName} — #${token.slice(0, 8).toUpperCase()}`,
    html: `
      <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; color: #111;">
        <h2 style="margin-bottom: 8px;">Hi ${name}!</h2>
        <p style="color: #555;">We received your support request for <strong>${appName}</strong>. We'll get back to you within 24–48 hours.</p>
        <p style="color: #555;">You can follow the conversation and reply using your personal support link:</p>
        <a href="${chatUrl}" style="display:inline-block;margin:16px 0;padding:12px 24px;background:#2563eb;color:#fff;border-radius:10px;text-decoration:none;font-weight:600;">
          Open Support Chat →
        </a>
        <p style="color:#999;font-size:12px;">Or copy this link: ${chatUrl}</p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
        <p style="color:#999;font-size:12px;">Strongmoon Labs · hello@strongmoonlabs.com</p>
      </div>
    `,
  })
}

export async function sendAdminNotification({
  appName,
  userName,
  message,
  ticketId,
}: {
  appName: string
  userName: string
  message: string
  ticketId: string
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://strongmoonlabs.com'

  await transporter.sendMail({
    from: `"Strongmoon Labs" <${process.env.SMTP_USER}>`,
    to: process.env.CONTACT_EMAIL || 'hello@strongmoonlabs.com',
    subject: `New support ticket — ${appName} from ${userName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; color: #111;">
        <h2>New Support Ticket</h2>
        <p><strong>App:</strong> ${appName}</p>
        <p><strong>From:</strong> ${userName}</p>
        <p><strong>Message:</strong></p>
        <blockquote style="border-left:3px solid #2563eb;margin:8px 0;padding:8px 16px;color:#555;">${message}</blockquote>
        <a href="${siteUrl}/admin/support/${ticketId}" style="display:inline-block;margin:16px 0;padding:12px 24px;background:#2563eb;color:#fff;border-radius:10px;text-decoration:none;font-weight:600;">
          View in Admin →
        </a>
      </div>
    `,
  })
}
