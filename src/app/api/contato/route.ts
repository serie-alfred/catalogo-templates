import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { getKv } from '@/lib/kv';
import { SEGMENTOS, FAIXAS_COLABORADORES } from '@/utils/contato';

export const dynamic = 'force-dynamic';

/**
 * O formulário "Iniciar lançamento" do rodapé da home. Pública por natureza:
 * fica fora do `/gerador/api`, que pede login. Usa o mesmo Nodemailer e as
 * mesmas `SMTP_*`/`CONTACT_EMAIL` do envio de tema.
 *
 * O e-mail sai só em TEXTO, e cada campo tem tamanho máximo: nada do que o
 * visitante digita vira HTML ou endereço no parser do nodemailer. Spam: campo
 * isca (`site`, invisível; preenchido = robô, responde 200 e não envia) e 5
 * envios por IP por hora no mesmo KV do limite do login — sem banco, segue sem
 * o limite, como o login.
 */
const MAX_POR_IP = 5;
const JANELA_SEGUNDOS = 60 * 60;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LIMITES = {
  nome: 120,
  empresa: 120,
  telefone: 30,
  email: 160,
  desafio: 3000,
} as const;

function ipDe(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'local'
  );
}

function texto(v: unknown, max: number): string | null {
  if (typeof v !== 'string') return null;
  const t = v.trim();
  return t && t.length <= max ? t : null;
}

export async function POST(request: Request) {
  let corpo: Record<string, unknown>;
  try {
    const lido: unknown = await request.json();
    if (!lido || typeof lido !== 'object') throw new Error();
    corpo = lido as Record<string, unknown>;
  } catch {
    return NextResponse.json({ message: 'Corpo inválido' }, { status: 400 });
  }

  if (typeof corpo.site === 'string' && corpo.site !== '') {
    return NextResponse.json({ message: 'ok' }, { status: 200 });
  }

  const nome = texto(corpo.nome, LIMITES.nome);
  const empresa = texto(corpo.empresa, LIMITES.empresa);
  const telefone = texto(corpo.telefone, LIMITES.telefone);
  const email = texto(corpo.email, LIMITES.email);
  const desafio = texto(corpo.desafio, LIMITES.desafio);
  const segmento = SEGMENTOS.find(s => s.valor === corpo.segmento);
  const colaboradores = FAIXAS_COLABORADORES.find(
    f => f === corpo.colaboradores
  );
  const invalidos = [
    !nome && 'nome',
    !empresa && 'empresa',
    !segmento && 'segmento',
    !colaboradores && 'colaboradores',
    (!telefone || telefone.replace(/\D/g, '').length < 10) && 'telefone',
    (!email || !EMAIL.test(email)) && 'email',
    !desafio && 'desafio',
    corpo.aceite !== true && 'aceite',
  ].filter(Boolean);
  if (invalidos.length) {
    return NextResponse.json(
      { message: 'Campos inválidos', campos: invalidos },
      { status: 400 }
    );
  }

  const chave = `contato:${ipDe(request)}`;
  const kv = await getKv().catch(() => null);
  const envios = kv ? ((await kv.get<number>(chave).catch(() => 0)) ?? 0) : 0;
  if (envios >= MAX_POR_IP) {
    return NextResponse.json(
      { message: 'Muitos envios. Tente mais tarde.' },
      { status: 429 }
    );
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
      from: `"E-temas · Contato" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL,
      subject: 'Novo contato pelo site E-temas',
      text: [
        `Nome: ${nome}`,
        `Empresa: ${empresa}`,
        `Segmento: ${segmento!.rotulo}`,
        `Colaboradores: ${colaboradores}`,
        `Telefone: ${telefone}`,
        `E-mail: ${email}`,
        '',
        'Desafio:',
        desafio,
        '',
        'Aceitou a Política de Privacidade.',
      ].join('\n'),
    });
    await kv?.incr(chave, JANELA_SEGUNDOS).catch(() => {});

    return NextResponse.json({ message: 'ok' }, { status: 200 });
  } catch (error) {
    console.error('Erro ao enviar contato:', error);
    return NextResponse.json({ message: 'Falha ao enviar' }, { status: 500 });
  }
}
