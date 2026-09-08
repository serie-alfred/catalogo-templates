'use client';

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { CaretDownSm, CaretUpSm } from '@/assets/icons/editor';

import styles from './index.module.css';

/** Quanto um clique num caret rola. */
const STEP = 120;

/**
 * Área rolável com a barra do Figma: trilho branco de 10px com borda
 * --ed-bg-02, polegar #004799 de 6px e raio 120, entre dois carets de 10px.
 *
 * A barra nativa não dá conta: o design tem botões de seta, que
 * `::-webkit-scrollbar-button` não sabe desenhar de forma portável, e o
 * Firefox não tem pseudo-elementos de scrollbar. Então a nativa é escondida e
 * esta é desenhada por cima — mas o scroll continua sendo o do elemento, com
 * roda, teclado e trackpad intactos.
 */
export default function ScrollArea({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startY: number; startScroll: number } | null>(null);

  const [metrics, setMetrics] = useState({
    thumb: 0,
    offset: 0,
    overflow: false,
  });

  const measure = useCallback(() => {
    const el = viewportRef.current;
    const track = trackRef.current;
    if (!el || !track) return;

    const trackH = track.clientHeight;
    const ratio = el.clientHeight / el.scrollHeight;
    if (ratio >= 1 || trackH === 0) {
      setMetrics({ thumb: 0, offset: 0, overflow: false });
      return;
    }
    const thumb = Math.max(32, Math.round(trackH * ratio));
    const max = el.scrollHeight - el.clientHeight;
    const offset = max > 0 ? ((trackH - thumb) * el.scrollTop) / max : 0;
    setMetrics({ thumb, offset: Math.round(offset), overflow: true });
  }, []);

  useLayoutEffect(measure, [measure, children]);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    el.addEventListener('scroll', measure, { passive: true });
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    // O conteúdo muda de altura sem o viewport mudar (acordeão, lista filtrada).
    if (el.firstElementChild) observer.observe(el.firstElementChild);
    return () => {
      el.removeEventListener('scroll', measure);
      observer.disconnect();
    };
  }, [measure]);

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      const drag = dragRef.current;
      const el = viewportRef.current;
      const track = trackRef.current;
      if (!drag || !el || !track) return;
      const usable = track.clientHeight - metrics.thumb;
      if (usable <= 0) return;
      const max = el.scrollHeight - el.clientHeight;
      el.scrollTop =
        drag.startScroll + ((event.clientY - drag.startY) * max) / usable;
    };
    const onUp = () => {
      dragRef.current = null;
      document.body.style.userSelect = '';
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
  }, [metrics.thumb]);

  const scrollBy = (delta: number) =>
    viewportRef.current?.scrollBy({ top: delta, behavior: 'smooth' });

  return (
    <div className={`${styles.root} ${className ?? ''}`}>
      <div ref={viewportRef} className={styles.viewport}>
        {children}
      </div>

      <div className={styles.bar} data-hidden={!metrics.overflow || undefined}>
        <button
          type="button"
          className={styles.caret}
          onClick={() => scrollBy(-STEP)}
          aria-label="Rolar para cima"
          tabIndex={-1}
        >
          <CaretUpSm width={10} height={10} />
        </button>

        <div ref={trackRef} className={styles.track}>
          <div
            className={styles.thumb}
            style={{
              height: metrics.thumb,
              transform: `translateY(${metrics.offset}px)`,
            }}
            onMouseDown={event => {
              event.preventDefault();
              dragRef.current = {
                startY: event.clientY,
                startScroll: viewportRef.current?.scrollTop ?? 0,
              };
              document.body.style.userSelect = 'none';
            }}
          />
        </div>

        <button
          type="button"
          className={styles.caret}
          onClick={() => scrollBy(STEP)}
          aria-label="Rolar para baixo"
          tabIndex={-1}
        >
          <CaretDownSm width={10} height={10} />
        </button>
      </div>
    </div>
  );
}
