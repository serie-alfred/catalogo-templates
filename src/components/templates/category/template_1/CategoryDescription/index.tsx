import React from 'react';
import styles from './index.module.css';

const CategoryDescription = () => {
  const category = {
    name: 'Nome da Categoria',
    small_description:
      "<p>Esta é uma descrição de exemplo para a categoria. Ela pode conter <a href='#'>links</a> e formatação HTML.</p>",
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
