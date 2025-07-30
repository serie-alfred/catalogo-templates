import React from 'react';
import { iconsGenerator } from '@/assets/icons/generator';

export default function SidebarTabRegister() {
  return (
    <div className="sidebar__main">
      <div className="header">
        <div className="icon">{iconsGenerator.registerTheme}</div>
      </div>

      <div className="field">
        <label htmlFor="user-email">Insira o seu e-mail</label>
        <input
          type="email"
          id="user-email"
          placeholder="Coloque seu email aqui"
        />
      </div>

      <div className="field">
        <label htmlFor="user-tel">Insira o seu e-mail</label>
        <input
          type="tel"
          id="user-tel"
          placeholder="Coloque seu telefone aqui"
        />
      </div>

      <button>Enviar</button>
    </div>
  );
}
