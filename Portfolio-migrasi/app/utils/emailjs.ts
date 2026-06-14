/* ============================================================
   EMAILJS UTILITY
   ============================================================ */

export const EMAILJS_CONFIG = {
  serviceId:  'service_4gmph37',
  templateId: 'template_hutxwgq',
  publicKey:  'FNCDIzpu7wl-Zh3FB',
} as const;

export interface ContactFormData {
  from_name:  string;
  from_email: string;
  subject:    string;
  message:    string;
}

export async function sendContactEmail(data: ContactFormData): Promise<void> {
  const emailjs = await import('@emailjs/browser');

  await emailjs.send(
    EMAILJS_CONFIG.serviceId,
    EMAILJS_CONFIG.templateId,
    {
      from_name:  data.from_name,
      from_email: data.from_email,
      subject:    data.subject,
      message:    data.message,
    },
    EMAILJS_CONFIG.publicKey,
  );
}