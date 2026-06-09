import nodemailer from 'nodemailer'

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

export async function sendContactEmail(data: {
  name: string
  email: string
  subject?: string
  message: string
}): Promise<void> {
  const { name, email, subject, message } = data
  const transporter = createTransporter()

  await transporter.sendMail({
    from: `"Strongmoon Labs Website" <${process.env.SMTP_USER}>`,
    to: process.env.CONTACT_EMAIL || 'hello@strongmoonlabs.com',
    replyTo: email,
    subject: subject ? `[Contact] ${subject}` : `[Contact] New message from ${name}`,
    html: `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1a1a2e;">
          <div style="border-left: 4px solid #3B82F6; padding-left: 16px; margin-bottom: 24px;">
            <h2 style="margin: 0 0 4px; color: #3B82F6;">New Contact Message</h2>
            <p style="margin: 0; color: #666;">via Strongmoon Labs website</p>
          </div>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555; width: 100px;">From:</td>
              <td style="padding: 8px 0;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Email:</td>
              <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #3B82F6;">${email}</a></td>
            </tr>
            ${subject ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #555;">Subject:</td><td style="padding: 8px 0;">${subject}</td></tr>` : ''}
          </table>
          <div style="background: #f8f9fa; padding: 16px; border-radius: 8px;">
            <h3 style="margin: 0 0 12px; color: #333;">Message:</h3>
            <p style="margin: 0; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
          <p style="margin-top: 24px; color: #999; font-size: 12px;">Sent from strongmoonlabs.com contact form</p>
        </body>
      </html>
    `,
  })
}
