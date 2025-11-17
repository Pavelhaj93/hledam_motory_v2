import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'info@hledammotory.cz',
    pass: process.env.SMTP_PASSWORD || '',
  },
})
