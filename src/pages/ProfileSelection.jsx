import React from 'react';
import './ProfileSelection.css';

export default function ProfileSelection() {
  const handleSelectCustomer = () => {
    console.log('Navegar para: Quero pedir comida');
  };

  const handleSelectKitchen = () => {
    console.log('Navegar para: Quero cadastrar minha cozinha');
  };

  return (
    <div className="profile-selection-container">
      {/* Imagem em formato PNG da pasta public */}
      <header className="hero-section">
        <img
          src="/profile.png"
          alt="Tigela com frutas e açaí"
          className="hero-image"
        />
        <div className="hero-overlay" />

        {/* Marca Oullin */}
        <div className="brand-logo-container">
          <h1 className="brand-logo">Oullin</h1>
        </div>
      </header>

      {/* Cartão Azul de Seleção */}
      <main className="selection-card">
        <h2 className="selection-title">Vamos começar!</h2>

        <nav className="actions-group">
          <button
            type="button"
            className="btn-primary"
            onClick={handleSelectCustomer}
          >
            Quero pedir comida
          </button>

          <button
            type="button"
            className="btn-primary"
            onClick={handleSelectKitchen}
          >
            Quero cadastrar minha cozinha
          </button>
        </nav>
      </main>
    </div>
  );
}