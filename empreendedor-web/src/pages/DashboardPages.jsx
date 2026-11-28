import React, { useEffect, useMemo, useState } from 'react';
import BrandLink from '../components/BrandLink.jsx';
import browniePlaceholder from '../../assets/brownie-placeholder.svg';
import orangeJuicePlaceholder from '../../assets/orange-juice.svg';
import veganMealImage from '../../assets/marmita-vegana.png';
import fishMealImage from '../../assets/marmita-peixe.png';
import chickenMealImage from '../../assets/frango-parmegiana.png';
import mushroomMealImage from '../../assets/marmita-cogumelos.png';
import restaurantAvatar from '../../assets/saudavel-life-avatar.png';
import tituHelpMascot from '../../assets/titu-help.png';
import tituWelcomeMascot from '../../assets/titu-welcome.png';
import snackImage from '../../../mobile/assets/food-veggie-burger-card.png';
import saladImage from '../../../mobile/assets/salad-photo.jpg';

const salesBars = [
  16, 21, 18, 27, 23, 34, 26, 44, 29, 54, 36, 63, 49, 73, 56, 82, 66, 93,
];

export function Sidebar({ page, extendedMenu = false }) {
  const links = [
    { id: 'dashboard', label: 'Início', href: './' },
    { id: 'reviews', label: 'Avaliações', href: './avaliacoes.html' },
    { id: 'orders', label: 'Pedidos', href: './pedidos.html' },
    { id: 'menu', label: 'Cardápio', href: './cardapio.html' },
    { id: 'finance', label: 'Financeiro', href: './financeiro.html' },
  ];

  return (
    <aside className="sidebar">
      <BrandLink href="./" label="Oullin, início" />
      <div className="restaurant-hours">
        <strong>Restaurante aberto</strong>
        <span>13h às 17h</span>
      </div>
      <nav aria-label="Menu do restaurante">
        {links.filter((link) => !extendedMenu || link.id !== 'menu').map((link) => (
          <a
            key={link.id}
            className={page === link.id ? 'selected' : undefined}
            href={link.href}
            aria-current={page === link.id ? 'page' : undefined}
          >
            {link.label}
          </a>
        ))}
        {extendedMenu ? (
          <>
            <a
              className={page === 'menu' ? 'selected' : undefined}
              href="./cardapio.html"
              aria-current={page === 'menu' ? 'page' : undefined}
            >
              Cardápio
            </a>
            <a
              className={page === 'delivery' ? 'selected' : undefined}
              href="./area-entrega.html"
              aria-current={page === 'delivery' ? 'page' : undefined}
            >
              Área de entrega
            </a>
            <span>Formas de pagamento</span>
            <span>Promoções</span>
            <span>Serviços</span>
            <a
              className={page === 'profile' ? 'selected' : undefined}
              href="./perfil.html"
              aria-current={page === 'profile' ? 'page' : undefined}
            >
              Perfil
            </a>
            <a
              className={page === 'performance' ? 'selected' : undefined}
              href="./desempenho.html"
              aria-current={page === 'performance' ? 'page' : undefined}
            >
              Desempenho
            </a>
            <a
              className={page === 'help' ? 'selected' : undefined}
              href="./ajuda.html"
              aria-current={page === 'help' ? 'page' : undefined}
            >
              Ajuda
            </a>
          </>
        ) : (
          <>
            <a
              className={page === 'delivery' ? 'selected' : undefined}
              href="./area-entrega.html"
              aria-current={page === 'delivery' ? 'page' : undefined}
            >
              Área de entrega
            </a>
            <a
              className={page === 'profile' ? 'selected' : undefined}
              href="./perfil.html"
              aria-current={page === 'profile' ? 'page' : undefined}
            >
              Perfil
            </a>
            <a
              className={page === 'performance' ? 'selected' : undefined}
              href="./desempenho.html"
              aria-current={page === 'performance' ? 'page' : undefined}
            >
              Desempenho
            </a>
            <a
              className={page === 'help' ? 'selected' : undefined}
              href="./ajuda.html"
              aria-current={page === 'help' ? 'page' : undefined}
            >
              Ajuda
            </a>
          </>
        )}
      </nav>
    </aside>
  );
}

function DashboardHome() {
  const [tituMessageIndex, setTituMessageIndex] = useState(0);
  const tituMessages = ['Titu está torcendo por você.', 'Vamos juntos hoje!'];

  return (
    <main className="main dashboard-page">
      <header className="greeting dashboard-greeting">
        <div>
          <h1>Olá, Saudavel Life</h1>
          <p>Resumo de hoje</p>
        </div>
        <button
          type="button"
          className="dashboard-titu-note"
          aria-label="Titu. Clique para ver outra mensagem de incentivo."
          onClick={() => setTituMessageIndex((index) => (index + 1) % tituMessages.length)}
        >
          <span key={`mascot-${tituMessageIndex}`} className="dashboard-titu-mascot">
            <img src={tituWelcomeMascot} alt="" aria-hidden="true" />
          </span>
          <p key={`message-${tituMessageIndex}`} aria-live="polite">{tituMessages[tituMessageIndex]}</p>
        </button>
      </header>

      <section className="overview" aria-labelledby="overview-title">
        <div className="section-heading">
          <div>
            <h2 id="overview-title">Visão geral</h2>
            <p>Acompanhe o que está acontecendo no seu restaurante hoje.</p>
          </div>
          <span className="date">HOJE · 09 NOV</span>
        </div>
        <div className="metrics">
          <article>
            <span>Vendas hoje</span>
            <strong>R$ 4.820,50</strong>
            <small>+12,8% em relação a ontem</small>
          </article>
          <article>
            <span>Pedidos recebidos</span>
            <strong>86</strong>
            <small>+8 pedidos hoje</small>
          </article>
          <article>
            <span>Ticket médio</span>
            <strong>R$ 56,05</strong>
            <small>+4,2% esta semana</small>
          </article>
          <article>
            <span>Avaliação média</span>
            <b className="rating-icon" aria-hidden="true" />
            <strong>5,0 / 5</strong>
            <small>↑ 0,3 neste mês</small>
          </article>
        </div>
      </section>

      <section className="sales-card" aria-labelledby="sales-title">
        <div className="sales-heading">
          <div>
            <h2 id="sales-title">Vendas ao longo do dia</h2>
            <p>Faturamento por faixa de horário</p>
          </div>
          <strong>Últimas 24h</strong>
        </div>
        <div
          className="chart"
          role="img"
          aria-label="Gráfico demonstrativo de vendas por hora, das 08h às 20h"
        >
          <div className="y-labels" aria-hidden="true">
            <span>150</span>
            <span>100</span>
            <span>50</span>
            <span>0</span>
          </div>
          <div className="plot">
            <div className="gridlines" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </div>
            <div className="bars" aria-hidden="true">
              {salesBars.map((height, index) => (
                <i
                  key={index}
                  className={index === 16 ? 'orange' : undefined}
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
            <div className="x-labels" aria-hidden="true">
              <span>08h</span>
              <span>10h</span>
              <span>12h</span>
              <span>14h</span>
              <span>16h</span>
              <span>18h</span>
              <span>20h</span>
            </div>
          </div>
        </div>
      </section>

      <div className="bottom-grid">
        <section className="white-card recent" aria-labelledby="recent-orders-title">
          <header>
            <h2 id="recent-orders-title">Pedidos recentes</h2>
            <a href="./pedidos.html">Ver todos →</a>
          </header>
          <div className="recent-row">
            <strong>#1052</strong>
            <strong>Pizza vegana</strong>
            <span>12:42</span>
            <strong>R$ 58,90</strong>
            <b>Novo</b>
          </div>
          <div className="recent-row">
            <strong>#1051</strong>
            <strong>Burger da casa</strong>
            <span>12:38</span>
            <strong>R$ 46,50</strong>
            <b>Preparo</b>
          </div>
          <div className="recent-row">
            <strong>#1050</strong>
            <strong>Salada Caesar</strong>
            <span>12:31</span>
            <strong>R$ 39,90</strong>
            <b>Entrega</b>
          </div>
        </section>
        <section className="white-card best" aria-labelledby="best-sellers-title">
          <h2 id="best-sellers-title">Mais vendidos</h2>
          <div>
            <strong>Risoto de cogumelos</strong>
            <i className="orange" style={{ width: '100%' }} />
          </div>
          <div>
            <strong>Burger da casa</strong>
            <i style={{ width: '84%' }} />
          </div>
          <div>
            <strong>Pizza vegana</strong>
            <i style={{ width: '66%' }} />
          </div>
        </section>
      </div>
    </main>
  );
}

const financeBars = [28, 40, 35, 54, 48, 69, 61, 82, 66, 94, 76, 88];

function FinancePayoutDialog({ onClose }) {
  return (
    <div className="finance-dialog-backdrop" role="presentation" onClick={onClose}>
      <section
        className="finance-payout-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="finance-payout-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" aria-label="Fechar detalhes dos repasses" onClick={onClose}>×</button>
        <h2 id="finance-payout-title">Próximo repasse</h2>
        <strong>R$ 2.840,00</strong>
        <p>Previsão de recebimento: 15 de novembro</p>
        <p>O valor será enviado para a conta bancária cadastrada.</p>
      </section>
    </div>
  );
}

function FinancePage() {
  const [payoutDialogOpen, setPayoutDialogOpen] = useState(false);

  return (
    <main className="main finance-page">
      <header className="finance-page-header">
        <div className="greeting">
          <h1>Olá, Saudavel Life</h1>
          <p>Controle receitas, repasses e despesas</p>
        </div>
        <a className="finance-menu-button" href="./cardapio.html">Cardápio</a>
      </header>

      <section className="finance-intro" aria-labelledby="finance-title">
        <h2 id="finance-title">Financeiro</h2>
        <p>Visão clara de faturamento, taxas, saldo e repasses.</p>
      </section>

      <section className="finance-summary" aria-label="Resumo financeiro">
        <article>
          <span>Faturamento bruto</span>
          <strong>R$ 18.450,00</strong>
          <small>+12,8%</small>
        </article>
        <article>
          <span>Taxas e descontos</span>
          <strong>R$ 1.245,00</strong>
          <small>-2,4%</small>
        </article>
        <article>
          <span>Saldo disponível</span>
          <strong>R$ 6.840,00</strong>
          <small>Pronto para saque</small>
        </article>
      </section>

      <div className="finance-overview-grid">
        <section className="finance-chart-card" aria-labelledby="finance-chart-title">
          <header>
            <h2 id="finance-chart-title">Entradas e saídas</h2>
            <strong>NOV 2026</strong>
          </header>
          <div
            className="finance-month-chart"
            role="img"
            aria-label="Gráfico demonstrativo de entradas e saídas nos primeiros 12 dias de novembro"
          >
            {financeBars.map((height, index) => (
              <div className="finance-chart-column" key={index}>
                <div className="finance-bar-track">
                  <i style={{ height: `${height}%` }} />
                </div>
                <span>{String(index + 1).padStart(2, '0')}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="finance-next-payout" aria-labelledby="finance-next-payout-title">
          <h2 id="finance-next-payout-title">Próximo repasse</h2>
          <strong>R$ 2.840,00</strong>
          <p>Previsão de recebimento<br />15 de novembro · Banco cadastrado</p>
          <button type="button" onClick={() => setPayoutDialogOpen(true)}>Ver repasses</button>
        </section>
      </div>

      <section className="finance-transactions" aria-labelledby="finance-transactions-title">
        <header>
          <h2 id="finance-transactions-title">Extrato de movimentações</h2>
          <p>Últimas movimentações registradas na conta.</p>
        </header>
        <table>
          <thead>
            <tr>
              <th scope="col">Data</th>
              <th scope="col">Movimentação</th>
              <th scope="col">Tipo</th>
              <th scope="col">Valor</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>09 nov · 12:42</td>
              <th scope="row">Pedido #1052</th>
              <td>Venda</td>
              <td>R$ 58,90</td>
            </tr>
            <tr>
              <td>09 nov · 12:38</td>
              <th scope="row">Pedido #1051</th>
              <td>Venda</td>
              <td>R$ 46,50</td>
            </tr>
            <tr>
              <td>08 nov · 18:10</td>
              <th scope="row">Taxa da plataforma</th>
              <td>Desconto</td>
              <td>- R$ 4,50</td>
            </tr>
          </tbody>
        </table>
      </section>

      {payoutDialogOpen && <FinancePayoutDialog onClose={() => setPayoutDialogOpen(false)} />}
    </main>
  );
}

const initialDeliveryRegions = [
  { id: 'center', name: 'Centro', distance: '0–3 km', maxDistance: 3, duration: '25–35 min', fee: 5 },
  { id: 'vila-nova', name: 'Vila Nova', distance: '3–5 km', maxDistance: 5, duration: '35–45 min', fee: 7 },
  { id: 'jardim-america', name: 'Jardim América', distance: '5–7 km', maxDistance: 7, duration: '40–55 min', fee: 9 },
  { id: 'parque-sul', name: 'Parque Sul', distance: '7–8 km', maxDistance: 8, duration: '45–60 min', fee: 10 },
];

function DeliveryRegionDialog({ onClose, onSubmit }) {
  return (
    <div className="delivery-dialog-backdrop" role="presentation" onClick={onClose}>
      <section
        className="delivery-region-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delivery-region-dialog-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" aria-label="Fechar" onClick={onClose}>×</button>
        <h2 id="delivery-region-dialog-title">Adicionar região</h2>
        <form onSubmit={onSubmit}>
          <label>
            Nome da região
            <input name="name" required maxLength="50" autoFocus />
          </label>
          <label>
            Distância máxima (km)
            <input name="maxDistance" type="number" min="0.1" max="100" step="0.1" required />
          </label>
          <label>
            Prazo estimado
            <input name="duration" placeholder="Ex.: 45–60 min" required maxLength="30" />
          </label>
          <label>
            Taxa de entrega (R$)
            <input name="fee" type="number" min="0" step="0.01" required />
          </label>
          <button type="submit">Salvar região</button>
        </form>
      </section>
    </div>
  );
}

function DeliveryPage() {
  const [regions, setRegions] = useState(initialDeliveryRegions);
  const [regionDialogOpen, setRegionDialogOpen] = useState(false);
  const maxCoverage = Math.max(...regions.map((region) => region.maxDistance));

  function addDeliveryRegion(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get('name')).trim();
    const maxDistance = Number(formData.get('maxDistance'));
    const duration = String(formData.get('duration')).trim();
    const fee = Number(formData.get('fee'));

    setRegions((currentRegions) => [
      ...currentRegions,
      {
        id: `region-${Date.now()}`,
        name,
        distance: `0–${maxDistance} km`,
        maxDistance,
        duration,
        fee,
      },
    ]);
    setRegionDialogOpen(false);
  }

  return (
    <main className="main delivery-page">
      <header className="delivery-page-header">
        <div className="greeting">
          <h1>Olá, Saudavel Life</h1>
          <p>Configure regiões, taxas e prazos</p>
        </div>
        <a className="delivery-menu-button" href="./cardapio.html">Cardápio</a>
      </header>

      <section className="delivery-intro" aria-labelledby="delivery-title">
        <h2 id="delivery-title">Área de entrega</h2>
        <p>Defina onde entregar, quanto cobrar e o prazo estimado.</p>
      </section>

      <div className="delivery-content-grid">
        <section className="delivery-map-card" aria-labelledby="delivery-map-title">
          <header>
            <h2 id="delivery-map-title">Mapa de cobertura</h2>
            <strong>{regions.length} regiões ativas</strong>
          </header>
          <div className="delivery-map" role="img" aria-label={`Área de cobertura ilustrativa até ${maxCoverage} quilômetros`}>
            <div className="delivery-map-grid" aria-hidden="true">
              <div className="delivery-coverage-ring" />
              <div className="delivery-restaurant-marker"><span>S</span></div>
            </div>
            <strong>Até {maxCoverage} km</strong>
          </div>
        </section>

        <section className="delivery-regions-card" aria-labelledby="delivery-regions-title">
          <h2 id="delivery-regions-title">Regiões e taxas</h2>
          <ul className="delivery-region-list">
            {regions.map((region) => (
              <li key={region.id}>
                <div>
                  <strong>{region.name}</strong>
                  <span>{region.distance} · {region.duration}</span>
                </div>
                <strong className="delivery-region-fee">
                  {region.fee.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </strong>
              </li>
            ))}
          </ul>
          <button type="button" onClick={() => setRegionDialogOpen(true)}>+ Adicionar região</button>
        </section>
      </div>

      {regionDialogOpen && (
        <DeliveryRegionDialog
          onClose={() => setRegionDialogOpen(false)}
          onSubmit={addDeliveryRegion}
        />
      )}
    </main>
  );
}

function ProfilePage() {
  return (
    <main className="main profile-page">
      <header className="profile-page-header">
        <div className="greeting">
          <h1>Olá, Saudavel Life</h1>
          <p>Informações e dados do restaurante</p>
        </div>
        <a className="profile-menu-button" href="./cardapio.html">Cardápio</a>
      </header>

      <section className="profile-intro" aria-labelledby="profile-title">
        <h2 id="profile-title">Perfil do restaurante</h2>
        <p>Mantenha os dados públicos e de contato sempre atualizados.</p>
      </section>

      <div className="profile-content-grid">
        <section className="profile-details-card" aria-label="Dados do restaurante">
          <header className="profile-restaurant-heading">
            <img src={restaurantAvatar} alt="Logo do restaurante Saudavel Life" />
            <div>
              <h2>Saudavel Life</h2>
              <p>Restaurante · Cozinha saudável</p>
              <strong>Perfil publicado</strong>
            </div>
          </header>
          <dl className="profile-fields">
            <div>
              <dt>Nome do restaurante</dt>
              <dd>Saudavel Life</dd>
            </div>
            <div>
              <dt>E-mail comercial</dt>
              <dd>contato@saudavellife.com</dd>
            </div>
            <div>
              <dt>Telefone</dt>
              <dd>(11) 99999-0000</dd>
            </div>
            <div>
              <dt>Endereço</dt>
              <dd>Av. Principal, 1200</dd>
            </div>
            <div>
              <dt>Descrição</dt>
              <dd>Comida leve, saborosa e feita com cuidado.</dd>
            </div>
          </dl>
        </section>

        <div className="profile-side-column">
          <section className="profile-hours-card" aria-labelledby="profile-hours-title">
            <h2 id="profile-hours-title">Funcionamento</h2>
            <dl>
              <div><dt>Segunda a sexta</dt><dd>11h–22h</dd></div>
              <div><dt>Sábado</dt><dd>11h–23h</dd></div>
              <div><dt>Domingo</dt><dd>Fechado</dd></div>
            </dl>
          </section>

          <section className="profile-identity-card" aria-labelledby="profile-identity-title">
            <h2 id="profile-identity-title">Identidade da loja</h2>
            <strong className="profile-identity-brand">Oullin</strong>
            <div className="profile-brand-colors">
              <span>Cor principal</span>
              <div aria-label="Cores da marca: laranja e preto">
                <i className="profile-color-orange" />
                <i className="profile-color-black" />
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

const performanceBars = [34, 48, 41, 58, 52, 72, 64, 83, 69, 96, 78, 89];
const maxPerformanceBar = Math.max(...performanceBars);

const bestSellingItems = [
  { name: 'Marmita vegana', orders: 128, percentage: 100 },
  { name: 'Frango à parmegiana', orders: 96, percentage: 75 },
  { name: 'Marmita de peixe', orders: 74, percentage: 58 },
];

function PerformancePage() {
  return (
    <main className="main performance-page">
      <header className="performance-page-header">
        <div className="greeting">
          <h1>Olá, Saudavel Life</h1>
          <p>Resultados e indicadores do restaurante</p>
        </div>
        <a className="performance-menu-button" href="./cardapio.html">Cardápio</a>
      </header>

      <section className="performance-intro" aria-labelledby="performance-title">
        <h2 id="performance-title">Desempenho</h2>
        <p>Resumo demonstrativo do período de 1 a 30 de novembro de 2026.</p>
      </section>

      <section className="performance-summary" aria-label="Indicadores demonstrativos">
        <article>
          <span>Vendas no período</span>
          <strong>R$ 18.450,00</strong>
          <small>+12,8% em relação ao período anterior</small>
        </article>
        <article>
          <span>Pedidos recebidos</span>
          <strong>326</strong>
          <small>+8,4% em relação ao período anterior</small>
        </article>
        <article>
          <span>Ticket médio</span>
          <strong>R$ 56,60</strong>
          <small>+4,2% em relação ao período anterior</small>
        </article>
        <article>
          <span>Avaliação média</span>
          <strong>4,8 de 5</strong>
          <small>284 avaliações</small>
        </article>
      </section>

      <div className="performance-content-grid">
        <section className="performance-chart-card" aria-labelledby="performance-chart-title">
          <header>
            <div>
              <h2 id="performance-chart-title">Vendas por dia</h2>
              <p>Valores ilustrativos · novembro de 2026</p>
            </div>
            <strong>NOV 2026</strong>
          </header>
          <div className="performance-chart-plot">
            <div className="performance-chart-gridlines" aria-hidden="true">
              <i /><i /><i /><i />
            </div>
            <div
              className="finance-month-chart performance-month-chart"
              role="img"
              aria-label="Gráfico demonstrativo de vendas nos primeiros 12 dias de novembro"
            >
              {performanceBars.map((height, index) => (
                <div className="finance-chart-column" key={index}>
                  <div className="finance-bar-track">
                    <i
                      className={`performance-bar${height === maxPerformanceBar ? ' is-highlighted' : ''}`}
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="performance-products-card" aria-labelledby="performance-products-title">
          <header>
            <div>
              <h2 id="performance-products-title">Mais vendidos</h2>
              <p>Pratos com mais pedidos no período.</p>
            </div>
          </header>
          <ol className="performance-product-list">
            {bestSellingItems.map((item) => (
              <li key={item.name}>
                <div>
                  <strong>{item.name}</strong>
                  <span>{item.orders} pedidos</span>
                </div>
                <div className="performance-product-track" aria-hidden="true">
                  <i style={{ width: `${item.percentage}%` }} />
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </main>
  );
}

const helpTopics = [
  {
    id: 'orders',
    initials: 'PE',
    title: 'Pedidos e entregas',
    description: 'Acompanhe, aceite e atualize pedidos.',
    keywords: 'pedidos entregas status aceite',
    articles: [
      'Como acompanhar o status de um pedido',
      'Aceitar e atualizar pedidos',
      'Dúvidas sobre entrega',
    ],
  },
  {
    id: 'finance',
    initials: 'FI',
    title: 'Financeiro',
    description: 'Taxas, repasses e extratos.',
    keywords: 'taxas repasses extratos saldo pagamento pagamentos',
    articles: [
      'Entenda as taxas e os descontos',
      'Consultar repasses',
      'Conferir o extrato de movimentações',
    ],
  },
  {
    id: 'menu',
    initials: 'CA',
    title: 'Cardápio',
    description: 'Produtos, categorias e preços.',
    keywords: 'produtos categorias preços pratos',
    articles: [
      'Cadastrar ou editar um produto',
      'Alterar preços e disponibilidade',
      'Organizar categorias do cardápio',
    ],
  },
  {
    id: 'account',
    initials: 'SE',
    title: 'Conta e segurança',
    description: 'Dados cadastrais e acesso.',
    keywords: 'conta segurança cadastro acesso senha',
    articles: [
      'Atualizar dados do estabelecimento',
      'Alterar informações de acesso',
      'Proteger sua conta',
    ],
  },
];

function normalizeHelpText(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .trim();
}

function HelpContactDialog({ onClose }) {
  return (
    <div className="help-dialog-backdrop" role="presentation" onClick={onClose}>
      <section
        className="help-contact-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-contact-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" aria-label="Fechar" onClick={onClose}>×</button>
        <h2 id="help-contact-title">Falar com suporte</h2>
        <p>O canal de atendimento ainda não está conectado neste protótipo.</p>
        <button type="button" onClick={onClose}>Fechar</button>
      </section>
    </div>
  );
}

function HelpPage() {
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [contactOpen, setContactOpen] = useState(false);

  const filteredTopics = helpTopics.filter((topic) => (
    !appliedSearch ||
    normalizeHelpText(`${topic.title} ${topic.description} ${topic.keywords} ${topic.articles.join(' ')}`)
      .includes(normalizeHelpText(appliedSearch))
  ));

  function searchHelp(event) {
    event.preventDefault();
    setAppliedSearch(search.trim());
  }

  return (
    <main className="main help-page">
      <header className="help-page-header">
        <div className="greeting">
          <h1>Olá, Saudavel Life</h1>
          <p>Central de suporte OULLIN</p>
        </div>
        <a className="help-menu-button" href="./cardapio.html">Cardápio</a>
      </header>

      <section className="help-center" aria-labelledby="help-center-title">
        <h2 id="help-center-title">Central de ajuda</h2>
        <p>Encontre respostas e volte a focar no seu restaurante.</p>
        <form className="help-search" onSubmit={searchHelp}>
          <label>
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <circle cx="8.5" cy="8.5" r="5.5" />
              <path d="m13 13 4 4" />
            </svg>
            <span className="visually-hidden">Buscar artigos de ajuda</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por pedidos, pagamentos, cardápio..."
            />
          </label>
          <button type="submit">Buscar</button>
        </form>
      </section>

      <section className="help-topics" aria-labelledby="help-topics-title">
        <header>
          <h2 id="help-topics-title">Explore por assunto</h2>
          <p>Acesse orientações rápidas para as principais tarefas.</p>
        </header>
        {filteredTopics.length > 0 ? (
          <div className="help-topic-grid">
            {filteredTopics.map((topic) => (
              <article className="help-topic-card" key={topic.id}>
                <span className={`help-topic-icon help-topic-icon-${topic.id}`} aria-hidden="true">
                  {topic.initials}
                </span>
                <div>
                  <h3>{topic.title}</h3>
                  <p>{topic.description}</p>
                  <details>
                    <summary>Ver artigos <span aria-hidden="true">→</span></summary>
                    <ul>
                      {topic.articles.map((article) => <li key={article}>{article}</li>)}
                    </ul>
                  </details>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="help-no-results" role="status">
            Não encontramos assuntos para essa busca. Tente outros termos.
          </p>
        )}
      </section>

      <section className="help-support" aria-label="Falar com suporte">
        <div className="help-support-message">
          <img src={tituHelpMascot} alt="" aria-hidden="true" />
          <div>
            <h2>Ainda precisa de ajuda?</h2>
            <p>Nossa equipe está disponível para orientar você.</p>
          </div>
        </div>
        <button type="button" onClick={() => setContactOpen(true)}>Falar com suporte</button>
      </section>

      {contactOpen && <HelpContactDialog onClose={() => setContactOpen(false)} />}
    </main>
  );
}

function ReviewsPage() {
  const reviews = [
    {
      initials: 'MC',
      name: 'Mariana Costa',
      stars: '★★★★★',
      rating: '5 estrelas',
      comment: 'A comida chegou quentinha e estava deliciosa!',
      product: 'Pizza vegana · há 12 min',
      action: 'Responder',
      pending: true,
    },
    {
      initials: 'RS',
      name: 'Rafael Souza',
      stars: '★★★★★',
      rating: '5 estrelas',
      comment: 'Atendimento excelente, vou pedir novamente.',
      product: 'Burger da casa · há 1 h',
      action: 'Respondida',
    },
    {
      initials: 'CO',
      name: 'Camila Oliveira',
      stars: '★★★★☆',
      rating: '4 estrelas',
      comment: 'Muito bom! Só achei a entrega um pouco demorada.',
      product: 'Risoto · há 3 h',
      action: 'Responder',
      pending: true,
    },
  ];

  return (
    <main className="main reviews-page">
      <header className="greeting">
        <h1>Olá, Saudavel Life</h1>
        <p>Acompanhe a experiência dos clientes</p>
      </header>

      <section className="reviews-intro">
        <h2>Avaliações dos clientes</h2>
        <p>Entenda a satisfação e responda aos comentários recentes.</p>
      </section>

      <section className="review-summary" aria-label="Resumo das avaliações">
        <article className="white-card overall">
          <h3>NOTA GERAL</h3>
          <div className="score">
            <strong>5,0</strong>
            <span aria-label="5 estrelas">★★★★★</span>
          </div>
          <p>Baseado em 2.000 avaliações</p>
          <b>Excelente</b>
        </article>

        <article className="white-card distribution">
          <h3>Distribuição das notas</h3>
          <div className="distribution-rows">
            {[
              ['5 ★', '94', '94%'],
              ['4 ★', '5', '5%'],
              ['3 ★', '1', '1%'],
              ['2 ★', '0', '0%'],
              ['1 ★', '0', '0%'],
            ].map(([label, percent, result]) => (
              <div key={label}>
                <strong>{label}</strong>
                <i>
                  <b style={{ width: `${percent}%` }} />
                </i>
                <strong>{result}</strong>
              </div>
            ))}
          </div>
        </article>

        <article className="white-card response">
          <h3>Tempo de resposta</h3>
          <strong>2h 18min</strong>
          <p>Média de resposta</p>
          <hr />
          <strong>94% respondidas</strong>
          <p>Meta recomendada: 100%</p>
        </article>
      </section>

      <section className="recent-reviews" aria-labelledby="recent-reviews-title">
        <h2 id="recent-reviews-title">Comentários recentes</h2>
        <p>Priorize comentários sem resposta para manter a reputação.</p>
        <div className="review-list">
          {reviews.map((review) => (
            <article key={review.initials}>
              <b className={`initial${review.pending ? ' orange-text' : ''}`}>
                {review.initials}
              </b>
              <div className="review-body">
                <div>
                  <strong>{review.name}</strong>
                  <span aria-label={review.rating}>{review.stars}</span>
                </div>
                <p>{review.comment}</p>
                <small>{review.product}</small>
              </div>
              <b className={review.pending ? 'orange-text' : undefined}>
                {review.action}
              </b>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function OrdersPage() {
  const orderColumns = [
    {
      name: 'Novos',
      count: '02',
      className: 'new',
      orders: [
        ['#1052', 'Ana Paula', 'Pizza vegana', '12:42', 'R$ 58,90', 'Aceitar'],
        ['#1053', 'Bruno Lima', 'Salada + suco', '12:45', 'R$ 42,00', 'Aceitar'],
      ],
    },
    {
      name: 'Em preparo',
      count: '02',
      className: 'preparing',
      orders: [
        ['#1051', 'João Pedro', 'Burger da casa', '12:38', 'R$ 46,50', 'Ver preparo'],
        ['#1048', 'Lucas Reis', 'Risoto de cogumelos', '12:25', 'R$ 52,00', 'Ver preparo'],
      ],
    },
    {
      name: 'Prontos para sair',
      count: '01',
      className: 'ready',
      orders: [
        ['#1050', 'Mariana Lima', 'Salada Caesar', '12:31', 'R$ 39,90', 'Despachar'],
      ],
    },
    {
      name: 'Concluídos',
      count: '02',
      className: 'done',
      orders: [
        ['#1047', 'Pedro Alves', 'Batata rústica', '12:18', 'R$ 28,00', 'Detalhes'],
        ['#1046', 'Julia Santos', 'Combo saudável', '12:10', 'R$ 64,00', 'Detalhes'],
      ],
    },
  ];

  return (
    <main className="main orders-page">
      <header className="greeting">
        <h1>Olá, Saudavel Life</h1>
        <p>Gerencie pedidos recebidos e entregues</p>
      </header>
      <section className="orders-intro">
        <h2>Central de pedidos</h2>
        <p>Acompanhe cada etapa do atendimento em um só lugar.</p>
      </section>

      <section className="totals" aria-label="Totais de pedidos demonstrativos">
        <article>Novos<strong>08</strong></article>
        <article>Em preparo<strong>12</strong></article>
        <article>Prontos para sair<strong>05</strong></article>
        <article>Concluídos<strong>61</strong></article>
      </section>

      <section className="board" aria-label="Pedidos por etapa">
        {orderColumns.map((column) => (
          <article
            key={column.name}
            className={`order-column ${column.className}`}
          >
            <header>
              <h3>{column.name}</h3>
              <strong>{column.count}</strong>
            </header>
            {column.orders.map(([id, customer, product, time, total, action]) => (
              <div className="ticket" key={id}>
                <b>{id}</b>
                <strong>{customer}</strong>
                <span>{product}</span>
                <div>
                  <span>{time}</span>
                  <strong>{total}</strong>
                </div>
                <b>{action}</b>
              </div>
            ))}
          </article>
        ))}
      </section>
    </main>
  );
}

const initialMenuItems = [
  {
    id: 'vegan-meal',
    name: 'Marmita vegana',
    category: 'Marmitas',
    price: 58.9,
    description: 'Feijoada de legumes, feita com feijão e vegetais.',
    image: veganMealImage,
    available: true,
    allergenReview: true,
    dietaryTags: ['Vegano', 'Vegetariano'],
  },
  {
    id: 'chicken-meal',
    name: 'Marmita de frango',
    category: 'Marmitas',
    price: 46.5,
    description: 'Frango à parmegiana com molho de tomate e arroz integral.',
    image: chickenMealImage,
    available: true,
    allergenReview: true,
    dietaryTags: [],
  },
  {
    id: 'fish-meal',
    name: 'Marmita de peixe',
    category: 'Marmitas',
    price: 62,
    description: 'Bacalhau cremoso acompanhado de batata-doce.',
    image: fishMealImage,
    available: true,
    allergenReview: true,
    dietaryTags: [],
  },
  {
    id: 'mushroom-meal',
    name: 'Marmita de cogumelos',
    category: 'Marmitas',
    price: 49.5,
    description: 'Polenta cremosa com ragu de cogumelos.',
    image: mushroomMealImage,
    available: true,
    allergenReview: true,
    dietaryTags: ['Vegetariano'],
  },
  {
    id: 'brownie-dessert',
    name: 'Brownie com sorvete',
    category: 'Sobremesas',
    price: 26,
    description: 'Brownie de chocolate meio amargo com sorvete de creme.',
    image: browniePlaceholder,
    available: false,
    contains: ['Glúten', 'Ovos', 'Leite'],
    mayContain: ['Castanhas e nozes', 'Amendoim'],
    dietaryTags: ['Vegetariano'],
  },
  {
    id: 'orange-juice',
    name: 'Suco de laranja',
    category: 'Bebidas',
    price: 12,
    description: 'Laranja espremida na hora, sem açúcar. 400 ml.',
    image: orangeJuicePlaceholder,
    available: true,
    noDeclaredAllergens: true,
    dietaryTags: ['Vegano', 'Vegetariano'],
  },
  {
    id: 'veggie-sandwich',
    name: 'Sanduíche vegetariano',
    category: 'Lanches',
    price: 32,
    description: 'Pão artesanal com legumes grelhados e folhas frescas.',
    image: snackImage,
    available: true,
    allergenReview: true,
    dietaryTags: ['Vegetariano'],
  },
  {
    id: 'garden-salad',
    name: 'Salada da horta',
    category: 'Saladas',
    price: 35,
    description: 'Mix de folhas, legumes da estação e molho da casa.',
    image: saladImage,
    available: true,
    allergenReview: true,
    dietaryTags: [],
  },
];

const menuFilters = ['Todos', 'Sem glúten', 'Sem lactose', 'Vegano', 'Sem alergênicos'];

function formatPrice(price) {
  return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function MenuProductCard({ item, onToggleAvailability }) {
  return (
    <article className={`menu-product-card${item.available ? '' : ' is-paused'}`}>
      <div className="menu-product-photo">
        <img src={item.image} alt={item.name} />
        {(item.image === browniePlaceholder || item.photoAdded === false) && (
          <span className="menu-photo-hint">Adicionar foto real</span>
        )}
      </div>
      <div className="menu-product-content">
        <div className="menu-product-heading">
          <h3>{item.name}</h3>
          <strong>{formatPrice(item.price)}</strong>
        </div>
        <p className="menu-product-description">{item.description}</p>
        {item.preparationNotice && (
          <p className="menu-preparation-note">Aviso de preparo: {item.preparationNotice}</p>
        )}
        <div className="menu-allergen-details">
          {item.noDeclaredAllergens ? (
            <span className="menu-allergen-safe">Sem alergênicos declarados</span>
          ) : item.allergenReview &&
            !item.contains?.length &&
            !item.mayContain?.length &&
            !item.allergenClean?.length ? (
            <strong className="menu-allergen-review">
              Alergênicos: confirmar receita
            </strong>
          ) : (
            <>
              {item.contains?.length > 0 && (
                <div>
                  <strong>Contém</strong>
                  <div className="menu-allergen-tags">
                    {item.contains.map((allergen) => (
                      <span key={allergen}>{allergen}</span>
                    ))}
                  </div>
                </div>
              )}
              {item.mayContain?.length > 0 && (
                <div>
                  <strong>Pode conter traços</strong>
                  <div className="menu-trace-tags">
                    {item.mayContain.map((allergen) => (
                      <span key={allergen}>{allergen}</span>
                    ))}
                  </div>
                </div>
              )}
              {item.allergenClean?.length > 0 && (
                <div>
                  <strong>Sem traços declarados</strong>
                  <div className="menu-clean-tags">
                    {item.allergenClean.map((allergen) => (
                      <span key={allergen}>{allergen}</span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        {item.dietaryTags.length > 0 && (
          <div className="menu-dietary-tags" aria-label="Características alimentares">
            {item.dietaryTags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        )}
        <footer className="menu-product-footer">
          <span>{item.category}</span>
          <div className="menu-availability">
            <span>{item.available ? 'Disponível' : 'Pausado'}</span>
            <button
              type="button"
              className={`menu-switch${item.available ? ' is-on' : ''}`}
              role="switch"
              aria-checked={item.available}
              aria-label={`${item.name}: ${item.available ? 'disponível' : 'pausado'}`}
              onClick={() => onToggleAvailability(item.id)}
            />
          </div>
        </footer>
      </div>
    </article>
  );
}

function MenuPage() {
  const [items, setItems] = useState(initialMenuItems);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [pendingItemError, setPendingItemError] = useState('');

  useEffect(() => {
    try {
      const pendingItemJson = sessionStorage.getItem('oullin-pending-menu-item');
      if (!pendingItemJson) return;

      const pendingItem = JSON.parse(pendingItemJson);
      if (
        !pendingItem ||
        typeof pendingItem !== 'object' ||
        typeof pendingItem.name !== 'string' ||
        typeof pendingItem.category !== 'string' ||
        typeof pendingItem.price !== 'number'
      ) {
        throw new Error('Dados do prato inválidos.');
      }

      setItems((currentItems) => [...currentItems, pendingItem]);
      sessionStorage.removeItem('oullin-pending-menu-item');
    } catch {
      setPendingItemError('Não foi possível carregar o prato salvo. Tente cadastrar novamente.');
    }
  }, []);

  const categories = [...new Set(items.map((item) => item.category))];
  const filteredItems = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('pt-BR');
    return items.filter((item) => {
      const matchesSearch =
        !normalizedSearch ||
        `${item.name} ${item.description} ${item.category}`
          .toLocaleLowerCase('pt-BR')
          .includes(normalizedSearch);
      const matchesFilter =
        activeFilter === 'Todos' ||
        (activeFilter === 'Sem alergênicos'
          ? item.noDeclaredAllergens
          : item.dietaryTags.includes(activeFilter));
      return matchesSearch && matchesFilter;
    });
  }, [activeFilter, items, search]);
  const availableCount = items.filter((item) => item.available).length;
  const pausedCount = items.length - availableCount;
  const noAllergenCount = items.filter((item) => item.noDeclaredAllergens).length;

  function toggleAvailability(itemId) {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId ? { ...item, available: !item.available } : item,
      ),
    );
  }

  return (
    <main className="main menu-page">
      <header className="menu-page-header">
        <div className="greeting">
          <h1>Olá, Saudavel Life</h1>
          <p>Cardápio da loja</p>
        </div>
        <a className="menu-primary-button" href="./novo-prato.html">
          Novo prato
        </a>
      </header>
      {pendingItemError && <p className="menu-save-error" role="alert">{pendingItemError}</p>}

      <section className="menu-intro" aria-labelledby="menu-title">
        <h2 id="menu-title">Seu cardápio</h2>
        <p>Gerencie as marmitas e as informações de alergênicos que o cliente vê.</p>
      </section>

      <section className="menu-stats" aria-label="Resumo do cardápio">
        <article>
          <span>Itens no cardápio</span>
          <strong>{items.length}</strong>
          <small>em {categories.length} categorias</small>
        </article>
        <article>
          <span>Disponíveis agora</span>
          <strong>{availableCount}</strong>
          <small>visíveis ao cliente</small>
        </article>
        <article>
          <span>Pausados</span>
          <strong>{pausedCount}</strong>
          <small>ocultos do app</small>
        </article>
        <article>
          <span>Sem alergênicos</span>
          <strong>{noAllergenCount}</strong>
          <small>declarados</small>
        </article>
      </section>

      <section className="menu-controls" aria-label="Buscar e filtrar cardápio">
        <label className="menu-search">
          <span className="visually-hidden">Buscar no cardápio</span>
          <input
            type="search"
            placeholder="Buscar marmita"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        <div className="menu-filters" role="group" aria-label="Filtros alimentares">
          {menuFilters.map((filter) => (
            <button
              key={filter}
              type="button"
              className={activeFilter === filter ? 'is-active' : undefined}
              aria-pressed={activeFilter === filter}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      <div className="menu-allergen-legend" aria-label="Legenda de alergênicos">
        <span><i className="legend-contained" />Contém</span>
        <span>
          <i className="legend-cross-contact" />
          Pode conter traços (contaminação cruzada)
        </span>
      </div>

      {categories.map((category) => {
        const categoryItems = filteredItems.filter((item) => item.category === category);
        if (categoryItems.length === 0) return null;
        const countLabel =
          category === 'Marmitas'
            ? `${categoryItems.length} marmitas`
            : `${categoryItems.length} ${categoryItems.length === 1 ? 'prato' : 'pratos'}`;

        return (
          <section className="menu-category" key={category} aria-label={category}>
            <header>
              <h2>{category}</h2>
              <span>{countLabel}</span>
            </header>
            <div className="menu-product-grid">
              {categoryItems.map((item) => (
                <MenuProductCard
                  key={item.id}
                  item={item}
                  onToggleAvailability={toggleAvailability}
                />
              ))}
            </div>
          </section>
        );
      })}

      {filteredItems.length === 0 && (
        <p className="menu-empty-state">Nenhum item corresponde à busca ou ao filtro selecionado.</p>
      )}

    </main>
  );
}

export default function DashboardPages({ page }) {
  const Page =
    page === 'reviews'
      ? ReviewsPage
      : page === 'orders'
        ? OrdersPage
        : page === 'finance'
          ? FinancePage
            : page === 'delivery'
              ? DeliveryPage
              : page === 'profile'
                ? ProfilePage
              : page === 'performance'
                ? PerformancePage
          : page === 'help'
            ? HelpPage
          : page === 'menu'
          ? MenuPage
          : DashboardHome;

  return (
    <div className="merchant-site">
      <Sidebar page={page} />
      <Page />
    </div>
  );
}
