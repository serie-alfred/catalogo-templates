import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// A rota é pública e o único chamador (services/emailService.ts) manda nome e
// mensagem fixos, sem `email`. Ler esses campos do corpo deixava qualquer um
// injetar endereço no parser do nodemailer (DoS) e HTML no corpo do e-mail;
// agora o corpo só contribui com o config, que vai como anexo.
const REMETENTE = 'Layout Config';
const MENSAGEM = 'Olá, JSON do layout gerado!';

export async function POST(request: Request) {
  let json: unknown;
  try {
    ({ json } = await request.json());
  } catch {
    return NextResponse.json({ message: 'Invalid body' }, { status: 400 });
  }
  if (!json || typeof json !== 'object') {
    return NextResponse.json({ message: 'Missing config' }, { status: 400 });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      // O remetente precisa ser a conta autenticada acima.
      from: `"${REMETENTE}" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL,
      subject: `E-temas Template Config`,
      text: MENSAGEM,
      html: `<p>${MENSAGEM}</p>`,
      attachments: [
        {
          filename: 'config.json',
          content: JSON.stringify(json, null, 2),
          contentType: 'application/json',
        },
      ],
    });

    return NextResponse.json(
      { message: 'Email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return NextResponse.json(
      { message: 'Failed to send email' },
      { status: 500 }
    );
  }
}
