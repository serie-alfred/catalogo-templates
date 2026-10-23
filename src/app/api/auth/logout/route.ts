import { NextResponse } from 'next/server';
import { COOKIE_SESSAO } from '@/lib/auth';

/** Sai: apaga o cookie e volta ao /login. POST, para um <img> alheio não deslogar. */
export async function POST(request: Request) {
  const res = NextResponse.redirect(new URL('/login?saiu=1', request.url), 303);
  res.cookies.set(COOKIE_SESSAO, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return res;
}
