import React from 'react';
import styles from './index.module.css';
import { useCategoriaDaLoja } from '@/hooks/useCategoriaDaLoja';
import { paragrafosEmHtml, categoriaDoExemplo } from '@/utils/categoriaDaLoja';

const EXEMPLO = {
  name: 'Nome da Categoria',
  small_description:
    "<p>Esta é uma descrição de exemplo para a categoria. Ela pode conter <a href='#'>links</a> e formatação HTML.</p>",
};

const CategoryDescription = () => {
  // A categoria da loja (Conteúdo da loja → Página de categoria); o texto do CS vira
  // HTML ESCAPADO (o /p é público). Sem ela, a de exemplo.
  const loja = useCategoriaDaLoja();
  const category = {
    name: loja?.name || EXEMPLO.name,
    small_description: loja?.paragrafos.length
      ? paragrafosEmHtml(loja.paragrafos)
      : EXEMPLO.small_description,
  };

  return (
    <div className={styles.categoryDescription}>
      <div className={`${styles.descriptionContainer} component__container`}>
        <div className={styles.descriptionRow}>
          <div className={styles.descriptionWrapper}>
            <h1>{category.name}</h1>

            {category.small_description && (
              <div
                className={styles.descriptionText}
                dangerouslySetInnerHTML={{ __html: category.small_description }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryDescription;

/** A categoria de exemplo, para o painel partir do que a tela mostra (FichaDaCategoria). */
CategoryDescription.categoriaPadrao = categoriaDoExemplo({ nome: EXEMPLO.name, sobreHtml: EXEMPLO.small_description });
