export const routes = [
  {
    path: '/',
    output: 'index.html',
    page: 'landing',
    title: 'Oullin | Portal do empreendedor',
  },
  {
    path: '/index.html',
    output: 'index.html',
    page: 'landing',
    title: 'Oullin | Portal do empreendedor',
  },
  {
    path: '/criar-conta.html',
    output: 'criar-conta.html',
    page: 'account',
    title: 'Oullin | Crie uma conta',
  },
  {
    path: '/cadastro-estabelecimento.html',
    output: 'cadastro-estabelecimento.html',
    page: 'business',
    title: 'Oullin | Dados do estabelecimento',
  },
  {
    path: '/cadastro-mais-informacoes.html',
    output: 'cadastro-mais-informacoes.html',
    page: 'business-details',
    title: 'Oullin | Mais informações',
  },
  {
    path: '/programa-parceria.html',
    output: 'programa-parceria.html',
    page: 'partner-program',
    title: 'Oullin | Programa de parceria',
  },
  {
    path: '/resumo-contrato.html',
    output: 'resumo-contrato.html',
    page: 'contract',
    title: 'Oullin | Resumo do contrato',
  },
  {
    path: '/painel/',
    output: 'painel/index.html',
    page: 'dashboard',
    title: 'Oullin | Início do painel',
  },
  {
    path: '/painel/index.html',
    output: 'painel/index.html',
    page: 'dashboard',
    title: 'Oullin | Início do painel',
  },
  {
    path: '/painel/avaliacoes.html',
    output: 'painel/avaliacoes.html',
    page: 'reviews',
    title: 'Oullin | Avaliações',
  },
  {
    path: '/painel/pedidos.html',
    output: 'painel/pedidos.html',
    page: 'orders',
    title: 'Oullin | Pedidos',
  },
  {
    path: '/painel/financeiro.html',
    output: 'painel/financeiro.html',
    page: 'finance',
    title: 'Oullin | Financeiro',
  },
  {
    path: '/painel/area-entrega.html',
    output: 'painel/area-entrega.html',
    page: 'delivery',
    title: 'Oullin | Área de entrega',
  },
  {
    path: '/painel/perfil.html',
    output: 'painel/perfil.html',
    page: 'profile',
    title: 'Oullin | Perfil',
  },
  {
    path: '/painel/desempenho.html',
    output: 'painel/desempenho.html',
    page: 'performance',
    title: 'Oullin | Desempenho',
  },
  {
    path: '/painel/ajuda.html',
    output: 'painel/ajuda.html',
    page: 'help',
    title: 'Oullin | Ajuda',
  },
  {
    path: '/painel/cardapio.html',
    output: 'painel/cardapio.html',
    page: 'menu',
    title: 'Oullin | Cardápio',
  },
  {
    path: '/painel/novo-prato.html',
    output: 'painel/novo-prato.html',
    page: 'new-dish',
    title: 'Oullin | Cadastro de prato',
  },
  {
    path: '/painel/utensilios.html',
    output: 'painel/utensilios.html',
    page: 'utensils',
    title: 'Oullin | Utensílios dedicados',
  },
  {
    path: '/painel/ingredientes-alergenicos.html',
    output: 'painel/ingredientes-alergenicos.html',
    page: 'ingredients-allergens',
    title: 'Oullin | Ingredientes e alergênicos',
  },
  {
    path: '/painel/ficha-tecnica.html',
    output: 'painel/ficha-tecnica.html',
    page: 'technical-sheet',
    title: 'Oullin | Ficha técnica',
  },
  {
    path: '/painel/tabela-tbca.html',
    output: 'painel/tabela-tbca.html',
    page: 'tbca',
    title: 'Oullin | Tabela TBCA',
  },
];

export const routeByPath = Object.fromEntries(
  routes.map(({ path, page, title }) => [path, { page, title }]),
);

export const generatedRouteFiles = [
  ...new Set(
    routes
      .filter(({ path, output }) => path !== '/' && output !== 'index.html')
      .map(({ output }) => output),
  ),
];
