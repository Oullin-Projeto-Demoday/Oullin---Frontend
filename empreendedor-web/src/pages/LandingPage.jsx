import React from 'react';
import BrandLink from '../components/BrandLink.jsx';
import koalaMascot from '../../assets/koala-mascot.png';

export default function LandingPage() {
  return (
    <>
      <header className="site-header">
        <BrandLink label="Oullin - início" />

        <nav className="main-nav" aria-label="Navegação principal">
          <a href="#para-estabelecimentos">Serviços</a>
          <a href="#portal-empreendedor">Produtos e preços</a>
          <a href="#para-estabelecimentos">Guia do Oullin</a>
          <a className="customer-link" href="./cliente/">
            <span className="customer-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <rect x="6.5" y="2.5" width="11" height="19" rx="2" />
                <path d="M10 5.5h4M11 18.5h2" />
              </svg>
            </span>
            <span>
              <small>É cliente?</small>
              Acesse o app
            </span>
          </a>
          <a href="#portal-empreendedor">Portal do empreendedor</a>
        </nav>

        <div className="header-actions">
          <a className="register-button" href="#portal-empreendedor">
            Cadastrar
          </a>
        </div>
      </header>

      <main>
        <section className="hero" id="para-estabelecimentos">
          <div className="hero-copy">
            <p className="eyebrow">Expanda suas vendas</p>
            <h1 className="hero-title">
              Venda para quem
              <span>valoriza o seu</span>
              <span>cuidado</span>
            </h1>
            <p className="hero-description">
              Ponte entre talento culinário e o público
            </p>
            <div className="hero-mascot-note">
              <img src={koalaMascot} alt="" aria-hidden="true" />
              <p>Titu está com você em cada etapa.</p>
            </div>
          </div>

          <aside
            className="highlight-card"
            aria-label="Cadastro de estabelecimento"
          >
            <div className="card-topline" aria-hidden="true" />
            <div className="card-content" id="portal-empreendedor">
              <h2>Cadastre seu estabelecimento</h2>
              <p className="login-prompt">
                Já tem um perfil? <span>Clique aqui</span>
              </p>
              <div className="signup-form">
                <label className="visually-hidden" htmlFor="business-phone">
                  Telefone
                </label>
                <input
                  id="business-phone"
                  name="phone"
                  type="tel"
                  placeholder="(00) 90000-0000"
                  autoComplete="tel"
                />
                <label className="visually-hidden" htmlFor="business-email">
                  E-mail
                </label>
                <input
                  id="business-email"
                  name="email"
                  type="email"
                  placeholder="email@gmail.com"
                  autoComplete="email"
                />
                <a className="signup-button" href="./criar-conta.html">
                  Cadastre-se
                </a>
                <p className="form-note">
                  Cadastro online em breve. Seus dados ainda não serão enviados.
                </p>
              </div>
            </div>
          </aside>
        </section>
      </main>
      <div className="bottom-bars" aria-hidden="true" />
    </>
  );
}
