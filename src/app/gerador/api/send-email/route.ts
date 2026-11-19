import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import {
  contaPode,
  exigirConta,
  plataformaDaTrilha,
  plataformaRecusada,
} from '@/lib/contaAtual';

// A rota é pública e o único chamador (services/emailService.ts) manda nome e
// mensagem fixos, sem `email`. Ler esses campos do corpo deixava qualquer um
// injetar endereço no parser do nodemailer (DoS) e HTML no corpo do e-mail;
// agora o corpo só contribui com o config, que vai como anexo.
const REMETENTE = 'Layout Config';
const MENSAGEM = 'Olá, JSON do layout gerado!';

export async function POST(request: Request) {
  const g = await exigirConta();
  if ('resposta' in g) return g.resposta;
  let json: unknown;
  try {
    ({ json } = await request.json());
  } catch {
    return NextResponse.json({ message: 'Invalid body' }, { status: 400 });
  }
  if (!json || typeof json !== 'object') {
    return NextResponse.json({ message: 'Missing config' }, { status: 400 });
  }

  // O config diz a plataforma pela trilha (`wake`, `faststore`…): um convidado
  // só envia config das plataformas da conta.
  const plataforma = plataformaDaTrilha(
    (json as { platform?: unknown }).platform
  );
  if (g.conta.papel !== 'admin' && !contaPode(g.conta, plataforma))
    return plataformaRecusada();
  // Quem enviou, no assunto e no corpo: o time sabe de que conta veio o tema.
  // `usuario` é o e-mail da conta (Supabase); no HTML vai escapado.
  const quem =
    g.conta.papel === 'admin'
      ? `agência ${g.conta.usuario}`
      : `convidado ${g.conta.usuario}`;
  const quemHtml = quem.replace(/[&<>"']/g, c => `&#${c.charCodeAt(0)};`);

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
      subject: `E-temas Template Config (${quem})`,
      text: `${MENSAGEM}\nEnviado pela conta: ${quem}.`,
      html: `<p>${MENSAGEM}</p><p>Enviado pela conta: ${quemHtml}.</p>`,
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
