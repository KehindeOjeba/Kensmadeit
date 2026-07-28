import { Resend } from 'resend'

const apiKey = process.env.RESEND_API_KEY

if (!apiKey) {
  console.warn('RESEND_API_KEY is not set')
}

export const resend = new Resend(apiKey || 'dummy-key-for-dev')
