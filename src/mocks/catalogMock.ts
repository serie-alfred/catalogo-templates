// ⚠️ CONTEÚDO PROVISÓRIO. Estes 8 itens são a home pública do E-temas (a faixa
// "Novos" e a grade com busca). Falta a lista real: quais temas mostrar, com que
// imagem e apontando para qual preview — decisão de conteúdo, ver o Passo 0.5 do
// CUTOVER-PARA-PRODUCAO.md.
//
// O que NÃO era decisão e saiu em 10/09: os 15 links de placeholder. Eram
// `href` de verdade, num `<a target="_blank">`, num site que vai para o ar — link
// morto é pior que link nenhum. Agora são strings vazias e o `Spot` simplesmente
// não desenha o botão sem destino.
export const catalogMock = [
  {
    novidade: [
      {
        id: 1,
        title: 'Template 2.4',
        subtitle: 'Perfumaria & Cosméticos',
        image: '/images/home/spot/default-template-image.png',
        desktopLink:
          'https://agenciaseriedesign2.fbits.store/?preview-theme=wchZ9NN0zhUzYzfCpAy3LA%3d%3d',
        mobileLink: '',
      },
      {
        id: 2,
        title: 'Template 2.3',
        subtitle: 'Moda Feminina',
        image: '/images/home/spot/default-template-image.png',
        desktopLink: '',
        mobileLink: '',
      },
      {
        id: 3,
        title: 'Template 2.4',
        subtitle: 'Moda Feminina',
        image: '/images/home/spot/default-template-image.png',
        desktopLink: '',
        mobileLink: '',
      },
      {
        id: 4,
        title: 'Template 2.5',
        subtitle: 'Moda Feminina',
        image: '/images/home/spot/default-template-image.png',
        desktopLink: '',
        mobileLink: '',
      },
    ],
    catalogo: [
      {
        id: 1,
        title: 'Template 3.1',
        subtitle: 'Loja de Calçados',
        image: '/images/home/spot/default-template-image.png',
        desktopLink: '',
        mobileLink: '',
      },
      {
        id: 2,
        title: 'Template 3.2',
        subtitle: 'Pet Shop',
        image: '/images/home/spot/default-template-image.png',
        desktopLink: '',
        mobileLink: '',
      },
      {
        id: 3,
        title: 'Template 3.3',
        subtitle: 'Moda Infantil',
        image: '/images/home/spot/default-template-image.png',
        desktopLink: '',
        mobileLink: '',
      },
      {
        id: 4,
        title: 'Template 3.4',
        subtitle: 'Papelaria',
        image: '/images/home/spot/default-template-image.png',
        desktopLink: '',
        mobileLink: '',
      },
    ],
  },
];
