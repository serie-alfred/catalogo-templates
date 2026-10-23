'use client';

import { useEffect, useMemo, useState, useRef } from 'react';

import { loadGoogleFont } from '@/utils/googleFont';
import {
  FONTES_DO_SISTEMA,
  carregarFontesGoogle,
  type FonteDoCatalogo,
} from '@/utils/fontCatalog';

import styles from './index.module.css';

/** Quantas do Google a lista desenha de uma vez; o resto aparece digitando. */
const MAX_GOOGLE = 120;

const SISTEMA: FonteDoCatalogo[] = FONTES_DO_SISTEMA.map(family => ({
  family,
  origem: 'sistema',
}));

type FontSelectorProps = {
  label: string;
  cssVariable: string;
  selectedFont: string;
  onFontChange: (font: string) => void;
  /** Quando true, ainda não há fonte própria (herda do global): não aplica em :root. */
  unset?: boolean;
  /** Nome amigável do token herdado, ex.: "fonte dos títulos". */
  inheritsLabel?: string;
  /** A frase inteira do estado herdado (ver ColorPicker). */
  inheritsText?: string;
  /** Ver ColorPicker: `block` na esquerda (sem rótulo), `field` na direita. */
  variant?: 'block' | 'field';
};

export default function FontSelector({
  label,
  cssVariable,
  selectedFont,
  onFontChange,
  unset = false,
  inheritsLabel,
  inheritsText,
  variant = 'field',
}: FontSelectorProps) {
  const [google, setGoogle] = useState<FonteDoCatalogo[]>([]);
  // Sem `GOOGLE_FONTS_API_KEY` a rota devolve 500 e o catálogo do Google não
  // vem. Antes isso matava o seletor inteiro em silêncio; agora a lista ainda
  // traz as do sistema, o aviso diz o que houve e o Enter aplica o digitado.
  const [catalogo, setCatalogo] = useState<
    'carregando' | 'ok' | 'indisponivel'
  >('carregando');
  const [searchTerm, setSearchTerm] = useState(selectedFont || '');
  /**
   * O que filtra a lista. Vazio ao ABRIR (clique ou foco): a lista inteira
   * aparece na hora, sem precisar digitar — é o pedido. Só passa a filtrar
   * quando o usuário digita.
   */
  const [filtro, setFiltro] = useState('');
  const [aberto, setAberto] = useState(false);
  /** Opção destacada pelas setas; -1 = nenhuma (Enter aplica o digitado). */
  const [ativo, setAtivo] = useState(-1);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listaRef = useRef<HTMLUListElement | null>(null);
  const listboxId = `fontes-${cssVariable}`;

  useEffect(() => {
    let vivo = true;
    carregarFontesGoogle().then(lista => {
      if (!vivo) return;
      setGoogle(lista ?? []);
      setCatalogo(lista ? 'ok' : 'indisponivel');
    });
    return () => {
      vivo = false;
    };
  }, []);

  /* A fonte muda por fora (template aplicado, desfazer, tema reaberto): o campo
     acompanha, a não ser que o usuário esteja digitando nele. */
  useEffect(() => {
    if (document.activeElement !== inputRef.current)
      setSearchTerm(selectedFont || '');
  }, [selectedFont]);

  /**
   * Só carrega a face no documento do editor — quem escreve as custom
   * properties é outra pessoa.
   *
   * Este efeito fazia `setProperty` no `:root`, e isso estava errado de dois
   * jeitos: as variáveis globais já são escritas pelo useLayoutGenerator (com
   * a grafia certa, `--font-secundary`), e as variáveis POR COMPONENTE não são
   * únicas por instância — definir a fonte de um Showcase gravava
   * `--showcase-font` no `:root` e passava a valer para todos os outros, sem
   * nunca ser removida. O preview por instância vem do estilo inline que o
   * ThemeRenderer põe no wrapper da seção.
   *
   * A face precisa existir NESTE documento mesmo assim: é ele que o
   * ExportStage fotografa para os PNGs.
   */
  useEffect(() => {
    if (unset || !selectedFont) return;
    loadGoogleFont(selectedFont);
  }, [selectedFont, unset]);

  const opcoes = useMemo(() => {
    const termo = filtro.trim().toLowerCase();
    const casa = (f: FonteDoCatalogo) =>
      !termo || f.family.toLowerCase().includes(termo);
    const doSistema = SISTEMA.filter(casa);
    const doGoogle = google.filter(casa);
    return {
      doSistema,
      doGoogle: doGoogle.slice(0, MAX_GOOGLE),
      googleTotal: doGoogle.length,
    };
  }, [filtro, google]);

  const lista = useMemo(
    () => [...opcoes.doSistema, ...opcoes.doGoogle],
    [opcoes]
  );

  // A opção destacada acompanha a rolagem da lista.
  useEffect(() => {
    if (ativo < 0) return;
    listaRef.current
      ?.querySelector<HTMLElement>(`[data-indice="${ativo}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [ativo]);

  const abrir = () => {
    setFiltro('');
    setAtivo(-1);
    setAberto(true);
  };

  const fechar = () => {
    setAberto(false);
    setAtivo(-1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setFiltro(value);
    setAtivo(-1);
    setAberto(true);
  };

  // Aplica o que está digitado. É o único caminho para uma família fora da
  // lista (ou com o catálogo fora do ar), e um atalho para quem sabe o nome.
  const aplicarDigitado = () => {
    const nome = searchTerm.trim();
    if (nome.length > 0 && nome !== selectedFont) onFontChange(nome);
    fechar();
  };

  const handleSelectFont = (font: string) => {
    onFontChange(font);
    setSearchTerm(font);
    fechar();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!aberto) {
        abrir();
        return;
      }
      if (lista.length === 0) return;
      const passo = e.key === 'ArrowDown' ? 1 : -1;
      setAtivo(prev =>
        prev < 0
          ? passo > 0
            ? 0
            : lista.length - 1
          : (prev + passo + lista.length) % lista.length
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (aberto && ativo >= 0 && lista[ativo])
        handleSelectFont(lista[ativo].family);
      else aplicarDigitado();
    } else if (e.key === 'Escape') {
      if (!aberto) return;
      e.preventDefault();
      setSearchTerm(selectedFont || '');
      fechar();
    }
  };

  const renderOpcao = (font: FonteDoCatalogo, indice: number) => (
    <li key={`${font.origem}-${font.family}`} role="presentation">
      <button
        type="button"
        role="option"
        aria-selected={indice === ativo}
        data-indice={indice}
        data-origem={font.origem}
        className={`${styles.suggestion} ${indice === ativo ? styles.ativo : ''}`}
        style={{ fontFamily: font.family }}
        // `onMouseDown` e não click: o blur do input fecha a lista antes.
        onMouseDown={e => {
          e.preventDefault();
          handleSelectFont(font.family);
        }}
        tabIndex={-1}
      >
        {font.family}
        {font.family === selectedFont && !unset && (
          <span className={styles.atual} aria-hidden>
            em uso
          </span>
        )}
      </button>
    </li>
  );

  return (
    <div className={styles.field} data-variant={variant}>
      {variant === 'field' && (
        <label className={styles.label} htmlFor={`input-font-${cssVariable}`}>
          {label}
        </label>
      )}

      <div className={styles.control}>
        <input
          ref={inputRef}
          id={`input-font-${cssVariable}`}
          type="text"
          role="combobox"
          aria-expanded={aberto}
          aria-controls={listboxId}
          aria-autocomplete="list"
          autoComplete="off"
          spellCheck={false}
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={e => {
            abrir();
            e.currentTarget.select();
          }}
          // Já focado (a lista foi fechada com Esc ou por uma escolha): um
          // clique novo reabre.
          onMouseDown={() => {
            if (!aberto && document.activeElement === inputRef.current) abrir();
          }}
          onBlur={() => setTimeout(fechar, 150)}
          onKeyDown={onKeyDown}
          placeholder="Escolha ou digite uma fonte"
          className={styles.input}
          style={{ fontFamily: unset ? undefined : selectedFont }}
        />

        {aberto && (
          <ul
            ref={listaRef}
            id={listboxId}
            role="listbox"
            aria-label={label}
            className={`${styles.fontSuggest} ed-scroll`}
          >
            {opcoes.doSistema.length > 0 && (
              <li className={styles.grupo} role="presentation">
                Fontes do sistema
              </li>
            )}
            {opcoes.doSistema.map((f, i) => renderOpcao(f, i))}

            <li className={styles.grupo} role="presentation">
              Google Fonts
              {catalogo === 'ok' && (
                <span className={styles.contagem}>{opcoes.googleTotal}</span>
              )}
            </li>
            {catalogo === 'carregando' && (
              <li className={styles.nota} role="presentation">
                Carregando o catálogo…
              </li>
            )}
            {catalogo === 'indisponivel' && (
              <li className={styles.nota} role="presentation">
                Catálogo indisponível agora.
              </li>
            )}
            {opcoes.doGoogle.map((f, i) =>
              renderOpcao(f, opcoes.doSistema.length + i)
            )}
            {catalogo === 'ok' && opcoes.googleTotal > MAX_GOOGLE && (
              <li className={styles.nota} role="presentation">
                Mais {opcoes.googleTotal - MAX_GOOGLE}: digite para filtrar.
              </li>
            )}
            {catalogo === 'ok' &&
              lista.length === 0 &&
              searchTerm.trim().length > 0 && (
                <li className={styles.nota} role="presentation">
                  Nenhuma fonte com “{searchTerm.trim()}”. Enter aplica o nome
                  digitado.
                </li>
              )}
          </ul>
        )}
      </div>

      {catalogo === 'indisponivel' && (
        <p className={styles.aviso} role="status">
          Catálogo de fontes indisponível. Digite o nome exato da família e
          pressione <kbd>Enter</kbd> para aplicar.
        </p>
      )}

      {unset && (
        <p className={styles.inherits}>
          {inheritsText ?? (
            <>Usando variável da {inheritsLabel ?? 'configuração global'}</>
          )}{' '}
          <button
            type="button"
            className={styles.inheritsCta}
            onClick={() =>
              document.getElementById(`input-font-${cssVariable}`)?.focus()
            }
          >
            (clique aqui para alterar)
          </button>
        </p>
      )}
    </div>
  );
}
