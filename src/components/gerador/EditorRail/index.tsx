'use client';

import React, { useEffect, useState } from 'react';
import {
  Palette,
  SquarePen,
  Component,
  LayoutTemplate,
  ShoppingCart,
  History,
  LogOut,
  ShieldOff,
} from 'lucide-react';

import { useLayout } from '@/context/LayoutContext';
import type { RailTarget } from '@/hooks/useLayoutGenerator';
import { plataformaTemLp } from '@/utils/platformCompat';
import { EtemasMark, LandingPage, TypeCase } from '@/assets/icons/editor';

import styles from './index.module.css';

/**
 * Rail de navegação do editor. Quatro destinos, na ordem do Figma; o mark do
 * E-temas no topo é decorativo.
 *
 * A largura NÃO é declarada aqui: quem dimensiona é a trilha do grid do shell
 * (`--ed-rail-w`, hoje 56px). O rail era hug no Figma — 24 + mark de 27.404 +
 * 24 = 75.404 — e sobravam 19px de cromo em volta de ícones de 20. O mark passa
 * a ser desenhado a 24 de largura (a altura acompanha, 27.404×24 → 24×21).
 *
 * Cada ícone tem o tamanho literal do Figma — o "Aa" não é quadrado.
 */
const ITEMS: { target: RailTarget; label: string; icon: React.ReactNode }[] = [
  {
    target: 'componentes',
    label: 'Componentes',
    icon: <SquarePen width={18} height={18} />,
  },
  {
    target: 'variaveis',
    label: 'Variáveis globais',
    icon: <Palette width={20} height={20} />,
  },
  {
    target: 'tipografia',
    label: 'Tipografia',
    icon: <TypeCase width={20} height={9.998} />,
  },
  {
    target: 'identidade',
    label: 'Identidade visual',
    icon: <Component width={20} height={20} />,
  },
  // Depois dos quatro do Figma, para não mexer nas coordenadas que o estágio
  // 2-geometria mede. Escolhe uma família inteira (utils/templatesCompletos.ts).
  {
    target: 'templates',
    label: 'Por template',
    icon: <LayoutTemplate width={20} height={20} />,
  },
  // O histórico da agência (PanelSavedThemes): vale em todos os modos.
  {
    target: 'salvos',
    label: 'Temas salvos',
    icon: <History width={20} height={20} />,
  },
];

export default function EditorRail({ className }: { className?: string }) {
  const { railTarget, setRailTarget, platform, editorMode, setEditorMode } =
    useLayout();
  const noCheckout = editorMode === 'checkout';
  const naLp = editorMode === 'lp';
  const temLp = plataformaTemLp(platform);
  // No checkout a estrutura é fixa: não há seção para compor. "Por template"
  // monta a LOJA inteira, então some no checkout e na LP.
  /* O modo do login vem do servidor em runtime (ver /api/auth/estado). Com o
     login ligado, o pé do rail tem o "Sair"; em desenvolvimento sem as
     variáveis, um aviso de que o login está desligado. */
  const [modoLogin, setModoLogin] = useState<string | null>(null);
  useEffect(() => {
    fetch('/api/auth/estado', { cache: 'no-store' })
      .then(res => (res.ok ? res.json() : null))
      .then(data => setModoLogin(data?.modo ?? null))
      .catch(() => setModoLogin(null));
  }, []);

  const itens = ITEMS.filter(
    i =>
      !(noCheckout && i.target === 'componentes') &&
      !((noCheckout || naLp) && i.target === 'templates')
  );

  return (
    <nav
      className={`${styles.rail} ${className ?? ''}`}
      aria-label="Seções do editor"
      data-deselect-zone
    >
      <EtemasMark className={styles.mark} width={24} height={21.02} />

      {itens.map(({ target, label, icon }) => (
        <button
          key={target}
          type="button"
          className={styles.item}
          aria-label={label}
          title={label}
          aria-current={railTarget === target ? 'page' : undefined}
          data-rail-target={target}
          onClick={() => setRailTarget(target)}
        >
          {icon}
        </button>
      ))}

      {/* Onde o usuário "seleciona o checkout". Só existe em VTEX — o
          checkout-vtex é o checkout NATIVO da VTEX — e vem depois dos
          destinos, com um divisor: não é um painel, é o que o canvas mostra.
          `aria-pressed`, e não `aria-current`, que é dos destinos. */}
      {(platform === 'VTEX' || temLp) && (
        <span className={styles.divisor} aria-hidden />
      )}
      {platform === 'VTEX' && (
        <button
          type="button"
          className={`${styles.item} ${styles.modo}`}
          aria-label="Checkout"
          title={noCheckout ? 'Voltar para a loja' : 'Editar o checkout'}
          aria-pressed={noCheckout}
          data-editor-mode-toggle=""
          onClick={() => setEditorMode(noCheckout ? 'loja' : 'checkout')}
        >
          <ShoppingCart width={20} height={20} />
        </button>
      )}
      {/* O modo LP: uma landing page avulsa, montada com qualquer seção de
          miolo e exportada sozinha (utils/lp.ts). Wake e VTEX — onde o
          generator sabe montar a LP. */}
      {temLp && (
        <button
          type="button"
          className={`${styles.item} ${styles.modo}`}
          aria-label="Landing page"
          title={naLp ? 'Voltar para a loja' : 'Criar uma landing page'}
          aria-pressed={naLp}
          data-editor-mode-lp=""
          onClick={() => setEditorMode(naLp ? 'loja' : 'lp')}
        >
          <LandingPage width={20} height={20} />
        </button>
      )}

      {/* No PÉ do rail (margin-top: auto): longe dos destinos e das
          coordenadas que o 2-geometria mede. */}
      {modoLogin === 'ligado' && (
        <form method="post" action="/api/auth/logout" className={styles.pe}>
          <button
            type="submit"
            className={styles.item}
            aria-label="Sair"
            title="Sair do editor"
            data-logout=""
          >
            <LogOut width={20} height={20} />
          </button>
        </form>
      )}
      {modoLogin === 'desligado-dev' && (
        <span
          className={`${styles.pe} ${styles.aviso}`}
          role="status"
          aria-label="Login desligado"
          title="Login desligado: desenvolvimento sem ETEMAS_LOGIN_USER, ETEMAS_LOGIN_PASSWORD e ETEMAS_SESSION_SECRET. Em produção, sem elas, o acesso fica fechado."
          data-login-desligado=""
        >
          <ShieldOff width={20} height={20} />
        </span>
      )}
    </nav>
  );
}
