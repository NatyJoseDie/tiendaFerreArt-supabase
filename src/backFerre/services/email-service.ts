import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS, // Asegurate que sea la App Password (no tu contraseña real)
  },
});

type EmailOptions = {
  to: string;
  subject: string;
  html: string;
};

/**
 * Envía un email a través de Gmail usando nodemailer.
 * @param to Destinatario
 * @param subject Asunto del correo
 * @param html Cuerpo en HTML
 */
export async function sendOrderEmail({ to, subject, html }: EmailOptions) {
  const mailOptions = {
    from: `"FerreArt" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email enviado:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Error al enviar el email:', error);
    throw error;
  }
}

