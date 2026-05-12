import React, { useState } from 'react';
import styles from './index.module.css';
import { useLayout } from '@/context/LayoutContext';
import { LAYOUTS } from '@/data/layoutData';
import { TemplateRegistry } from '@/utils/templateRegistry';
import Spot from '@/components/templates/common/template_1/Spot';

const CategoryMain = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const { selections } = useLayout();

  // Filtra os spots selecionados
  const selectedSpots = selections.filter(item => item.layoutKey === 'spot');

  // Dados fixos para substituir as variáveis Twig
  const products = [
    { id: 1, name: 'Produto 1', price: 'R$ 99,90', image: '/img/produto1.jpg' },
    {
      id: 2,
      name: 'Produto 2',
      price: 'R$ 149,90',
      image: '/img/produto2.jpg',
    },
    { id: 3, name: 'Produto 3', price: 'R$ 79,90', image: '/img/produto3.jpg' },
    {
      id: 4,
      name: 'Produto 4',
      price: 'R$ 199,90',
      image: '/img/produto4.jpg',
    },
    {
      id: 5,
      name: 'Produto 5',
      price: 'R$ 129,90',
      image: '/img/produto5.jpg',
    },
    { id: 6, name: 'Produto 6', price: 'R$ 89,90', image: '/img/produto6.jpg' },
  ];

  const brands = [
    { id: 1, name: 'Marca A', count: 12 },
    { id: 2, name: 'Marca B', count: 8 },
    { id: 3, name: 'Marca C', count: 15 },
  ];

  const categories = [
    { id: 1, name: 'Categoria 1', count: 10 },
    { id: 2, name: 'Categoria 2', count: 7 },
    { id: 3, name: 'Categoria 3', count: 13 },
  ];

  const prices = [
    { from: 0, to: 50, count: 5 },
    { from: 50, to: 100, count: 12 },
    { from: 100, to: 200, count: 8 },
    { from: 200, to: 0, count: 3 },
  ];

  const availability = [
    { name: 'Em estoque', count: 20 },
    { name: 'Fora de estoque', count: 5 },
  ];

  const properties = [
    {
      key: 'Tamanho',
      values: [
        { key: 'P', count: 10 },
        { key: 'M', count: 15 },
        { key: 'G', count: 8 },
      ],
    },
    {
      key: 'Cor',
      values: [
        { key: 'Azul', count: 7 },
        { key: 'Vermelho', count: 12 },
        { key: 'Verde', count: 5 },
      ],
    },
  ];

  // Componente de paginação
  const Pagination = () => (
    <div className={styles.pagination}>
      <div className={styles.paginateLinks}>
        <a href="#" className={`${styles.pageLink} ${styles.pageCurrent}`}>
          1
        </a>
        <a href="#" className={styles.pageLink}>
          2
        </a>
        <a href="#" className={`${styles.pageLink} ${styles.pageNext}`}>
          {'>'}
        </a>
      </div>
    </div>
  );

  // Componente de filtro
  const Filter = () => (
    <div className={`${styles.filter} ${showFilters ? styles.filterOpen : ''}`}>
      <div className={styles.filterClose} onClick={() => setShowFilters(false)}>
        <div className={styles.closeInner}>
          <svg
            fill="none"
            height="16"
            viewBox="0 0 16 16"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_358_5868)">
              <path
                d="M12.5 3.5L3.5 12.5"
                stroke="black"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
              <path
                d="M12.5 12.5L3.5 3.5"
                stroke="black"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </g>
            <defs>
              <clipPath id="clip0_358_5868">
                <rect fill="white" height="16" width="16" />
              </clipPath>
            </defs>
          </svg>
        </div>
      </div>

      <span className={styles.filterTitleForm}>Filtrar</span>

      <form className={styles.filterForm} method="get">
        <input type="hidden" name="loja" value="1" />

        {categories.length > 0 && (
          <div className={styles.filterBlock}>
            <span className={styles.filterTitleActive}>
              Categorias
              <div className={styles.filterArrow}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 10L12 14L16 10"
                    stroke="#141414"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </span>

            <ul className={styles.filterList}>
              {categories.map(category => (
                <li key={category.id} className={styles.filterItem}>
                  <div className={styles.fakeInput}></div>
                  <label
                    className={styles.filterLabel}
                    htmlFor={`category-${category.id}`}
                  >
                    <span className={styles.filterName}>{category.name}</span>
                    <span className={styles.filterCount}>
                      ({category.count})
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}

        {prices.length > 0 && (
          <div className={styles.filterBlock}>
            <span className={styles.filterTitleActive}>
              Preço
              <div className={styles.filterArrow}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 10L12 14L16 10"
                    stroke="#141414"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </span>

            <ul className={styles.filterList}>
              {prices.map((price, index) => (
                <li key={index} className={styles.filterItem}>
                  <div className={styles.fakeInput}></div>

                  <label
                    className={styles.filterLabel}
                    htmlFor={`price-${index}`}
                  >
                    <span className={styles.filterName}>
                      {index === 0
                        ? `Até R$ ${price.to}`
                        : index === prices.length - 1
                          ? `Acima de R$ ${price.from}`
                          : `De R$ ${price.from} à R$ ${price.to}`}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}

        {availability.length > 0 && (
          <div className={styles.filterBlock}>
            <span className={styles.filterTitleActive}>
              Disponibilidade
              <div className={styles.filterArrow}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 10L12 14L16 10"
                    stroke="#141414"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </span>

            <ul className={styles.filterList}>
              {availability.map((item, index) => (
                <li key={index} className={styles.filterItem}>
                  <div className={styles.fakeInput}></div>

                  <label
                    className={styles.filterLabel}
                    htmlFor={`availability-${index}`}
                  >
                    <span className={styles.filterName}>{item.name}</span>
                    <span className={styles.filterCount}>({item.count})</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}

        {brands.length > 0 && (
          <div className={styles.filterBlock}>
            <span className={styles.filterTitleActive}>
              Marcas
              <div className={styles.filterArrow}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 10L12 14L16 10"
                    stroke="#141414"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </span>

            <ul className={styles.filterList}>
              {brands.map(brand => (
                <li key={brand.id} className={styles.filterItem}>
                  <div className={styles.fakeInput}></div>

                  <label
                    className={styles.filterLabel}
                    htmlFor={`brand-${brand.id}`}
                  >
                    <span className={styles.filterName}>{brand.name}</span>
                    <span className={styles.filterCount}>({brand.count})</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}

        {properties.length > 0 &&
          properties.map(property => (
            <div key={property.key} className={styles.filterBlock}>
              <span className={styles.filterTitleActive}>
                {property.key}
                <div className={styles.filterArrow}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 10L12 14L16 10"
                      stroke="#141414"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </span>

              <ul className={styles.filterList}>
                {property.values.map(value => (
                  <li key={value.key} className={styles.filterItem}>
                    <div className={styles.fakeInput}></div>

                    <label
                      className={styles.filterLabel}
                      htmlFor={`prop-${property.key}-${value.key}`}
                    >
                      <span className={styles.filterName}>{value.key}</span>
                      <span className={styles.filterCount}>
                        ({value.count})
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}
      </form>
    </div>
  );

  return (
    <div className={styles.categoryMain}>
      <div className={`component__container`}>
        {/* Botões de filtro e ordenação */}
        <div className={styles.categoryButtons}>
          <div className={styles.buttonsContainer}>
            <div className={styles.buttonsRow}>
              <div className={styles.buttonsWrapper}>
                <span
                  className={styles.buttonsFilter}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <svg
                    fill="none"
                    height="24"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11 4H21"
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M13 19H21"
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M3 19H7"
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M3 11.5H13"
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M3 4H5"
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M19 11.5H21"
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M9.5 2C9.0341 2 8.8011 2 8.6173 2.07612C8.3723 2.17761 8.1776 2.37229 8.0761 2.61732C8 2.80109 8 3.03406 8 3.5V4.5C8 4.96594 8 5.19891 8.0761 5.38268C8.1776 5.62771 8.3723 5.82239 8.6173 5.92388C8.8011 6 9.0341 6 9.5 6C9.9659 6 10.1989 6 10.3827 5.92388C10.6277 5.82239 10.8224 5.62771 10.9239 5.38268C11 5.19891 11 4.96594 11 4.5V3.5C11 3.03406 11 2.80109 10.9239 2.61732C10.8224 2.37229 10.6277 2.17761 10.3827 2.07612C10.1989 2 9.9659 2 9.5 2Z"
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M11.5 17C11.0341 17 10.8011 17 10.6173 17.0761C10.3723 17.1776 10.1776 17.3723 10.0761 17.6173C10 17.8011 10 18.0341 10 18.5V19.5C10 19.9659 10 20.1989 10.0761 20.3827C10.1776 20.6277 10.3723 20.8224 10.6173 20.9239C10.8011 21 11.0341 21 11.5 21C11.9659 21 12.1989 21 12.3827 20.9239C12.6277 20.8224 12.8224 20.6277 12.9239 20.3827C13 20.1989 13 19.9659 13 19.5V18.5C13 18.0341 13 17.8011 12.9239 17.6173C12.8224 17.3723 12.6277 17.1776 12.3827 17.0761C12.1989 17 11.9659 17 11.5 17Z"
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M14.5 9.5C14.0341 9.5 13.8011 9.5 13.6173 9.57612C13.3723 9.67761 13.1776 9.87229 13.0761 10.1173C13 10.3011 13 10.5341 13 11V12C13 12.4659 13 12.6989 13.0761 12.8827C13.1776 13.1277 13.3723 13.3224 13.6173 13.4239C13.8011 13.5 14.0341 13.5 14.5 13.5C14.9659 13.5 15.1989 13.5 15.3827 13.4239C15.6277 13.3224 15.8224 13.1277 15.9239 12.8827C16 12.6989 16 12.4659 16 12V11C16 10.5341 16 10.3011 15.9239 10.1173C15.8224 9.87229 15.6277 9.67761 15.3827 9.57612C15.1989 9.5 14.9659 9.5 14.5 9.5Z"
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    />
                  </svg>
                  Filtrar
                  <svg
                    fill="none"
                    height="24"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 16L14 12L10 8"
                      stroke="#F5F5F5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    />
                  </svg>
                </span>

                <span
                  className={styles.buttonsOrder}
                  onClick={() => setShowSort(!showSort)}
                >
                  <svg
                    fill="none"
                    height="24"
                    viewBox="0 0 25 24"
                    width="25"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.5 10H18.5"
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M11.5 14H16.5"
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M11.5 18H14.5"
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M11.5 6H21.5"
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M7.5 18.8125C7.10678 19.255 6.06018 21 5.5 21M5.5 21C4.93982 21 3.89322 19.255 3.5 18.8125M5.5 21V15"
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M3.5 5.1875C3.89322 4.74501 4.93982 3 5.5 3M5.5 3C6.06018 3 7.10678 4.74501 7.5 5.1875M5.5 3V9"
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    />
                  </svg>
                  Ordenar Por
                  <svg
                    fill="none"
                    height="24"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 16L14 12L10 8"
                      stroke="#F5F5F5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de produtos */}
        <div className={styles.categoryList}>
          <div className={styles.listContainer}>
            <div className={styles.listRow}>
              <div className={styles.listFilter}>
                <div className={styles.filterMask}></div>
                <Filter />
              </div>

              <div
                className={`${styles.listOrderMobile} ${showSort ? styles.orderMobileOpen : ''}`}
              >
                <div className={styles.orderWrapper}>
                  <div className={styles.orderTitle}>
                    Ordenar por
                    <div
                      className={styles.orderClose}
                      onClick={() => setShowSort(false)}
                    >
                      <svg
                        fill="none"
                        height="16"
                        viewBox="0 0 16 16"
                        width="16"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_358_5868)">
                          <path
                            d="M12.5 3.5L3.5 12.5"
                            stroke="black"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                          />
                          <path
                            d="M12.5 12.5L3.5 3.5"
                            stroke="black"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_358_5868">
                            <rect fill="white" height="16" width="16" />
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                  </div>
                  <div className={styles.orderInner}></div>
                </div>
              </div>

              <div className={styles.listShowcase}>
                <div className={styles.listWrapper}>
                  <div className={styles.listOrder}>
                    <div className={styles.filterTotal}>
                      <span>
                        Mostrando <b>12</b> de 14
                      </span>
                    </div>

                    <div className={styles.listTotalMobile}>
                      <input type="hidden" id="def_page_size" value="28" />
                      <span>
                        Mostrando <b>6</b> de 28
                      </span>
                    </div>

                    <div className={styles.listFields}>
                      {/* Filtro de marcas */}
                      <strong>Ordenar por:</strong>
                      <div className={styles.brandFilter}>
                        <select className={styles.brandSelect}>
                          <option value="">Lançamentos</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className={styles.listSpots}>
                    {products.length > 0 ? (
                      <div className={styles.showcaseCatalog}>
                        <div className={styles.showcaseList}>
                          {products.map(product => (
                            <div key={product.id} className={styles.listSpot}>
                              {selectedSpots.length > 0
                                ? selectedSpots.map(
                                    (spot: { id: string; uid: string }) => {
                                      const layoutItem =
                                        LAYOUTS.spot.items.find(
                                          it => it.id === spot.id
                                        );
                                      if (!layoutItem) return null;

                                      const SpotComponent =
                                        TemplateRegistry[layoutItem.component];

                                      return SpotComponent ? (
                                        [1, 2, 3, 4].map((_, index) => (
                                          <SpotComponent
                                            key={`${spot?.uid}-${index}`}
                                          />
                                        ))
                                      ) : (
                                        <></>
                                      );
                                    }
                                  )
                                : [1, 2, 3, 4].map((_, index) => (
                                    <div key={index}>
                                      <Spot />
                                    </div>
                                  ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className={styles.productNotFound}>
                        Nenhum produto encontrado
                      </p>
                    )}
                  </div>

                  <div className={styles.listPagination}>
                    <Pagination />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryMain;
