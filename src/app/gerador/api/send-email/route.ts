import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  const { name, email, message, json } = await request.json();

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
      // O remetente precisa ser a conta autenticada acima. O cliente não envia
      // `email`, então isto montava literalmente `"Layout Config" <undefined>`
      // e o SMTP recusava a mensagem.
      from: `"${name}" <${process.env.SMTP_USER}>`,
      ...(email ? { replyTo: email as string } : {}),
      to: process.env.CONTACT_EMAIL,
      subject: `E-temas Template Config`,
      text: message,
      html: `<p>${message}</p>`,
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
