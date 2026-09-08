'use client';

import React, { useMemo } from 'react';

import { useLayout } from '@/context/LayoutContext';
import { LAYOUTS, ComponentVariable } from '@/data/layoutData';
import ColorPicker from '../ColorPicker';
import FontSelector from '../FontSelector';
import { Component } from 'lucide-react';

import styles from './index.module.css';

/** Extrai a família ("Manrope") de um valor de fonte ("'Manrope', sans-serif"). */
function parseFontFamily(value: string): string {
  const first = value.split(',')[0] ?? '';
  return first.replace(/['"]/g, '').trim();
}

/** Empacota a família escolhida no formato gravado no config. */
function toFontValue(family: string): string {
  return `'${family}', sans-serif`;
}

export default function ComponentVariablesPanel() {
  const {
    editingUid,
    selections,
    setItemVariable,
    resetItemVariables,
  } = useLayout();

  const selection = useMemo(
    () => selections.find(s => s.uid === editingUid) ?? null,
    [selections, editingUid]
  );

  const layoutItem = useMemo(() => {
    if (!selection) return null;
    return (
      LAYOUTS[selection.layoutKey].items.find(i => i.id === selection.id) ??
      null
    );
  }, [selection]);

  // Agrupa as variáveis pelo campo `group` (preservando a ordem do schema).
  const groups = useMemo(() => {
    const schema = layoutItem?.variablesSchema ?? [];
    const order: string[] = [];
    const byGroup = new Map<string, ComponentVariable[]>();

    for (const variable of schema) {
      const groupName = variable.group ?? 'Geral';
      if (!byGroup.has(groupName)) {
        byGroup.set(groupName, []);
        order.push(groupName);
      }
      byGroup.get(groupName)!.push(variable);
    }

    return order.map(name => ({ name, variables: byGroup.get(name)! }));
  }, [layoutItem]);

  /* Estados vazios: o painel é permanente, então não some — explica por quê.
     16 dos 44 itens do catálogo não declaram `variablesSchema`, então o
     segundo caso é garantido, não hipotético. */
  if (!editingUid || !selection) {
    return (
      <p className={styles.empty}>
        Selecione uma seção no preview ou na lista para editar as variáveis
        dela.
      </p>
    );
  }

  if (!layoutItem?.variablesSchema?.length) {
    return (
      <p className={styles.empty}>
        <strong>{layoutItem?.title}</strong> não expõe variáveis próprias. As
        cores e fontes vêm das variáveis globais.
      </p>
    );
  }

  return (
    <div className={styles.panel} aria-label="Editar variáveis do componente">
      <header className={styles.header}>
        <span className={styles.icon}>
          <Component size={24} />
        </span>
        <div className={styles.identity}>
          <h2 className={styles.title}>{layoutItem.title}</h2>
          {layoutItem.description && (
            <p className={styles.description}>{layoutItem.description}</p>
          )}
        </div>
      </header>

      <div className={styles.body}>
        {groups.map(group => (
          <section key={group.name} className={styles.group}>
            <h3 className={styles.groupTitle}>{group.name}</h3>

            {group.variables.map(variable => {
              const current = selection.variables?.[variable.cssVar];
              const isUnset = current == null;

              if (variable.type === 'font') {
                return (
                  <FontSelector
                    // remonta ao alternar set/unset para limpar o estado interno
                    key={`${variable.cssVar}-${isUnset ? 'unset' : 'set'}`}
                    label={variable.label}
                    cssVariable={variable.cssVar.replace(/^--/, '')}
                    selectedFont={current ? parseFontFamily(current) : ''}
                    unset={isUnset}
                    inheritsLabel={variable.inheritsLabel}
                    onFontChange={family =>
                      setItemVariable(
                        editingUid,
                        variable.cssVar,
                        toFontValue(family)
                      )
                    }
                  />
                );
              }

              return (
                <ColorPicker
                  key={variable.cssVar}
                  label={variable.label}
                  color={current ?? variable.default}
                  unset={isUnset}
                  inheritsLabel={variable.inheritsLabel}
                  setColor={value =>
                    setItemVariable(editingUid, variable.cssVar, value)
                  }
                />
              );
            })}
          </section>
        ))}
      </div>

      <footer className={styles.footer}>
        <button
          type="button"
          className={styles.resetButton}
          onClick={() => resetItemVariables(editingUid)}
        >
          Restaurar padrão
        </button>
      </footer>
    </div>
  );
}
