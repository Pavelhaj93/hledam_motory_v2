import {NextRequest, NextResponse} from 'next/server'
import {transporter} from '@/lib/nodemailer'

const RATE_LIMIT_MAX_REQUESTS = 5
const RATE_LIMIT_WINDOW_MS = 60_000

// In-memory per-instance limiter: coarse but enough to blunt scripted floods
// without adding infra. Resets on deploy/restart; that's acceptable here.
const requestTimestampsByIp = new Map<string, number[]>()

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) return forwardedFor.split(',')[0].trim()
  return request.headers.get('x-real-ip') || 'unknown'
}

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const timestamps = (requestTimestampsByIp.get(ip) || []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS,
  )
  if (timestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    requestTimestampsByIp.set(ip, timestamps)
    return true
  }
  timestamps.push(now)
  requestTimestampsByIp.set(ip, timestamps)
  return false
}

export async function POST(request: NextRequest) {
  try {
    if (isRateLimited(getClientIp(request))) {
      return NextResponse.json({error: 'Too many requests'}, {status: 429})
    }

    const {name, email, phone, message, locale, website} = await request.json()
    const isAustrian = locale === 'de-AT'

    // Honeypot: real visitors never see or fill this field. Pretend success
    // so scripts don't learn the submission was detected and adapt.
    if (website) {
      return NextResponse.json({success: true, message: 'Email sent successfully'})
    }

    const escapeHtml = (value: string) =>
      value.replace(/[&<>"']/g, (ch) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[ch]!))

    const nameSubject = String(name).replace(/[\r\n]+/g, ' ')
    const nameHtml = escapeHtml(String(name))
    const emailHtml = escapeHtml(String(email))
    const phoneHtml = phone ? escapeHtml(String(phone)) : ''
    const messageHtml = escapeHtml(String(message))
    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json({error: 'Missing required fields'}, {status: 400})
    }

    const marketBadge = isAustrian
      ? `<p style="margin: 0 0 16px; display:inline-block; background:#EF4444; color:#fff; font-size:12px; font-weight:600; padding:3px 10px; border-radius:4px;">🇦🇹 Poptávka z rakouského trhu</p>`
      : ''
    const marketText = isAustrian ? '[Poptávka z rakouského trhu]\n\n' : ''

    console.log('Attempting to send email with config:', {
      host: process.env.SMTP_HOST || 'mailproxy.webglobe.com',
      port: process.env.SMTP_PORT || 587,
      user: process.env.SMTP_USER || 'info@hledammotory.cz',
      from: process.env.SMTP_USER || 'info@hledammotory.cz',
      to: 'info@hledammotory.cz',
    })

    // Send email — always in Czech (email lands with the Czech-based team)
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER || 'info@hledammotory.cz',
      to: 'info@hledammotory.cz',
      subject: `Nová poptávka – ${nameSubject}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
          <h2 style="color: #EF4444; border-bottom: 2px solid #EF4444; padding-bottom: 10px;">
            Nová poptávka
          </h2>

          ${marketBadge}

          <div style="margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>Jméno:</strong> ${nameHtml}</p>
            <p style="margin: 10px 0;"><strong>E-mail:</strong> <a href="mailto:${emailHtml}">${emailHtml}</a></p>
            ${phone ? `<p style="margin: 10px 0;"><strong>Telefon:</strong> <a href="tel:${phoneHtml}">${phoneHtml}</a></p>` : ''}
          </div>

          <div style="background-color: #F3F4F6; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">Zpráva:</h3>
            <p style="white-space: pre-wrap; color: #1F2937;">${messageHtml}</p>
          </div>

          <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 20px 0;">

          <p style="color: #6B7280; font-size: 12px;">
            hledammotory.cz
          </p>
        </div>
      `,
      text: `
Nová poptávka
${marketText}
Jméno: ${nameSubject}
E-mail: ${email}
${phone ? `Telefon: ${phone}` : ''}

Zpráva:
${message}

---
hledammotory.cz
      `,
    })

    console.log('Email sent successfully:', info.messageId)

    return NextResponse.json({success: true, message: 'Email sent successfully'})
  } catch (error) {
    console.error('Error sending email:', error)
    console.error('Error details:', {
      message: (error as any).message,
      code: (error as any).code,
      command: (error as any).command,
      response: (error as any).response,
      responseCode: (error as any).responseCode,
    })

    // Check if it's a country restriction error
    const errorMessage = (error as any).message || ''
    if (errorMessage.includes('country') && errorMessage.includes('not allowed')) {
      return NextResponse.json(
        {
          error: 'Geographic restriction',
          details:
            'Email service is restricted from this location. This will work in production/Czech Republic.',
        },
        {status: 500},
      )
    }

    return NextResponse.json(
      {error: 'Failed to send email', details: (error as any).message},
      {status: 500},
    )
  }
}
