const WHATSAPP_NUMBER = '918738917652'
const DEFAULT_WHATSAPP_MESSAGE = 'Hi Suraj, I want to discuss a website project.'

export const emailjsConfig = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID?.trim() ?? '',
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID?.trim() ?? '',
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY?.trim() ?? '',
}

export const hasEmailJsConfig = Object.values(emailjsConfig).every(Boolean)

export function buildWhatsAppHref(message = DEFAULT_WHATSAPP_MESSAGE) {
  const query = message ? `?text=${encodeURIComponent(message)}` : ''

  return `https://wa.me/${WHATSAPP_NUMBER}${query}`
}
