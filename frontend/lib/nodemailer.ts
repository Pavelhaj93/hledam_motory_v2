import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'mailproxy.webglobe.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  authMethod: 'PLAIN',
  tls: {
    rejectUnauthorized: false,
    ciphers: 'SSLv3',
  },
  debug: true,
  logger: true,
})
