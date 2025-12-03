import {NextRequest, NextResponse} from 'next/server'
import {transporter} from '@/lib/nodemailer'

export async function POST(request: NextRequest) {
  try {
    const {name, email, phone, message} = await request.json()

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json({error: 'Missing required fields'}, {status: 400})
    }

    console.log('Attempting to send email with config:', {
      host: process.env.SMTP_HOST || 'mailproxy.webglobe.com',
      port: process.env.SMTP_PORT || 587,
      user: process.env.SMTP_USER || 'info@hledammotory.cz',
      from: process.env.SMTP_USER || 'info@hledammotory.cz',
      to: 'info@hledammotory.cz',
    })

    // Send email
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER || 'info@hledammotory.cz',
      to: 'info@hledammotory.cz',
      subject: `Nová zpráva z kontaktního formuláře od ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
          <h2 style="color: #EF4444; border-bottom: 2px solid #EF4444; padding-bottom: 10px;">
            Nová zpráva z kontaktního formuláře
          </h2>
          
          <div style="margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>Jméno:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            ${phone ? `<p style="margin: 10px 0;"><strong>Telefon:</strong> <a href="tel:${phone}">${phone}</a></p>` : ''}
          </div>
          
          <div style="background-color: #F3F4F6; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">Zpráva:</h3>
            <p style="white-space: pre-wrap; color: #1F2937;">${message}</p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 20px 0;">
          
          <p style="color: #6B7280; font-size: 12px;">
            Tato zpráva byla odeslána z kontaktního formuláře na webu hledammotory.cz
          </p>
        </div>
      `,
      text: `
Nová zpráva z kontaktního formuláře

Jméno: ${name}
Email: ${email}
${phone ? `Telefon: ${phone}` : ''}

Zpráva:
${message}

---
Tato zpráva byla odeslána z kontaktního formuláře na webu hledammotory.cz
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
