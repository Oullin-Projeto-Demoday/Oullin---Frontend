import React from 'react';
import { createRoot } from 'react-dom/client';
import AccountPage from './pages/AccountPage.jsx';
import BusinessDetailsPage from './pages/BusinessDetailsPage.jsx';
import BusinessPage from './pages/BusinessPage.jsx';
import ContractPage from './pages/ContractPage.jsx';
import DashboardPages from './pages/DashboardPages.jsx';
import IngredientsAllergensPage from './pages/IngredientsAllergensPage.jsx';
import LandingPage from './pages/LandingPage.jsx';
import NewDishPage from './pages/NewDishPage.jsx';
import PartnerProgramPage from './pages/PartnerProgramPage.jsx';
import TechnicalSheetPage from './pages/TechnicalSheetPage.jsx';
import TBCAPage from './pages/TBCAPage.jsx';
import UtensilsPage from './pages/UtensilsPage.jsx';
import { routeByPath } from './routes.js';

const pages = {
  landing: <LandingPage />,
  account: <AccountPage />,
  business: <BusinessPage />,
  'business-details': <BusinessDetailsPage />,
  'partner-program': <PartnerProgramPage />,
  contract: <ContractPage />,
  dashboard: <DashboardPages page="dashboard" />,
  reviews: <DashboardPages page="reviews" />,
  orders: <DashboardPages page="orders" />,
  finance: <DashboardPages page="finance" />,
  delivery: <DashboardPages page="delivery" />,
  profile: <DashboardPages page="profile" />,
  performance: <DashboardPages page="performance" />,
  help: <DashboardPages page="help" />,
  menu: <DashboardPages page="menu" />,
  'new-dish': <NewDishPage />,
  utensils: <UtensilsPage />,
  'ingredients-allergens': <IngredientsAllergensPage />,
  'technical-sheet': <TechnicalSheetPage />,
  tbca: <TBCAPage />,
};

const rootElement = document.querySelector('#root');
const pathname = window.location.pathname;
const matchingPath = Object.keys(routeByPath)
  .filter((path) => path !== '/' && pathname.endsWith(path))
  .sort((left, right) => right.length - left.length)[0];
const route =
  routeByPath[pathname] ||
  routeByPath[matchingPath] ||
  (pathname.endsWith('/') ? routeByPath['/'] : undefined);
const page = route && pages[route.page];

if (!rootElement || !page) {
  throw new Error(`A rota do portal empreendedor não foi identificada: ${window.location.pathname}`);
}

document.title = route.title;

if (
  route.page === 'dashboard' ||
  route.page === 'reviews' ||
  route.page === 'orders' ||
  route.page === 'finance' ||
  route.page === 'delivery' ||
  route.page === 'profile' ||
  route.page === 'performance' ||
  route.page === 'help' ||
  route.page === 'menu' ||
  route.page === 'new-dish' ||
  route.page === 'utensils' ||
  route.page === 'ingredients-allergens' ||
  route.page === 'technical-sheet' ||
  route.page === 'tbca'
) {
  await import('../painel/painel.css');
} else {
  await import('../styles.css');
}

createRoot(rootElement).render(page);
