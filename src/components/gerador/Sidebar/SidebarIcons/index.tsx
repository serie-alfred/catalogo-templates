import React from 'react';
import Link from 'next/link';
import { iconsGenerator } from '@/assets/icons/generator';

type Tab = 'global' | 'build' | 'register' | 'share';

interface Props {
  toggleTab: (tab: Tab) => void;
}

export default function SidebarIcons({ toggleTab }: Props) {
  return (
    <>
      <Link href="#">{iconsGenerator.etemas}</Link>
      <button
        title="Editar o Tema"
        onClick={() => toggleTab('build')}
        className="icon"
      >
        {iconsGenerator.editTheme}
      </button>
      <button
        title="Variáveis Globais"
        onClick={() => toggleTab('global')}
        className="icon"
      >
        {iconsGenerator.configTheme}
      </button>
      <button
        title="Cadastro"
        onClick={() => toggleTab('register')}
        className="icon"
      >
        {iconsGenerator.registerTheme}
      </button>
      <button
        title="Compartilhar meu tema"
        onClick={() => toggleTab('share')}
        className="icon"
      >
        {iconsGenerator.shareTheme}
      </button>
    </>
  );
}
