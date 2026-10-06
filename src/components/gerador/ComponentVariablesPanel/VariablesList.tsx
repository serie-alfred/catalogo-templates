'use client';

import React, { Fragment, useMemo } from 'react';

import type { ComponentVariable } from '@/data/layoutData';
import ColorPicker from '../ColorPicker';
import FontSelector from '../FontSelector';

import styles from './index.module.css';

/** Extrai a família ("Manrope") de um valor de fonte ("'Manrope', sans-serif"). */
export function parseFontFamily(value: string): string {
  const first = value.split(',')[0] ?? '';
  return first.replace(/['"]/g, '').trim();
}

/** Empacota a família escolhida no formato gravado no config. */
export function toFontValue(family: string): string {
  return `'${family}', sans-serif`;
}

export interface VariablesListProps {
  /** Os campos, na ordem em que aparecem; `group` agrupa em caixas. */
  variables: ComponentVariable[];
  /** O que o usuário já escolheu. Chave ausente = o campo herda. */
  values: Record<string, string> | undefined;
  onChange: (cssVar: string, value: string) => void;
  /** Como a família escolhida vira valor. Padrão: `'Família', sans-serif`. */
  fontValue?: (family: string) => string;
  /**
   * A frase do estado herdado, AO VIVO — "Herdando de cor primária da marca
   * (#000000)". Sem ela vale a frase fixa dos controles ("Usando variável da
   * {inheritsLabel}"), que é o que o painel de componentes mostra.
   */
  inheritsTextFor?: (variable: ComponentVariable) => string | undefined;
  /** Cor com que o picker abre enquanto o campo herda. Padrão: o `default`. */
  inheritedColorFor?: (variable: ComponentVariable) => string;
}

/**
 * A lista de variáveis em grupos — só apresentação.
 *
 * Saiu do ComponentVariablesPanel para o modo Checkout usar a MESMA lista com os
 * papéis do `checkout.json` (que têm o formato `ComponentVariable`). O markup e
 * as classes são os de antes, byte a byte: o funil do editor lê este DOM.
 */
export default function VariablesList({
  variables,
  values,
  onChange,
  fontValue = toFontValue,
  inheritsTextFor,
  inheritedColorFor,
}: VariablesListProps) {
  // Agrupa as variáveis pelo campo `group` (preservando a ordem do schema).
  const groups = useMemo(() => {
    const order: string[] = [];
    const byGroup = new Map<string, ComponentVariable[]>();

    for (const variable of variables) {
      const groupName = variable.group ?? 'Geral';
      if (!byGroup.has(groupName)) {
        byGroup.set(groupName, []);
        order.push(groupName);
      }
      byGroup.get(groupName)!.push(variable);
    }

    return order.map(name => ({ name, variables: byGroup.get(name)! }));
  }, [variables]);

  return (
    <>
      {groups.map(group => (
        <section key={group.name} className={styles.group}>
          <h3 className={styles.groupTitle}>{group.name}</h3>

          {group.variables.map(variable => {
            const current = values?.[variable.cssVar];
            const isUnset = current == null;
            const inheritsText = isUnset
              ? inheritsTextFor?.(variable)
              : undefined;
            const nota = variable.previewNote ? (
              <p className={styles.nota}>{variable.previewNote}</p>
            ) : null;

            /* Fragmento com `key` no lugar do `key` que estava no controle:
               a nota é irmã dele, e as duas juntas são UM item da lista. */
            if (variable.type === 'font') {
              return (
                <Fragment
                  // remonta ao alternar set/unset para limpar o estado interno
                  key={`${variable.cssVar}-${isUnset ? 'unset' : 'set'}`}
                >
                  <FontSelector
                    label={variable.label}
                    cssVariable={variable.cssVar.replace(/^--/, '')}
                    selectedFont={current ? parseFontFamily(current) : ''}
                    unset={isUnset}
                    inheritsLabel={variable.inheritsLabel}
                    inheritsText={inheritsText}
                    onFontChange={family =>
                      onChange(variable.cssVar, fontValue(family))
                    }
                  />
                  {nota}
                </Fragment>
              );
            }

            return (
              <Fragment key={variable.cssVar}>
                <ColorPicker
                  label={variable.label}
                  color={
                    current ??
                    inheritedColorFor?.(variable) ??
                    variable.default
                  }
                  unset={isUnset}
                  inheritsLabel={variable.inheritsLabel}
                  inheritsText={inheritsText}
                  optional={variable.optional}
                  setColor={value => onChange(variable.cssVar, value)}
                />
                {nota}
              </Fragment>
            );
          })}
        </section>
      ))}
    </>
  );
}
