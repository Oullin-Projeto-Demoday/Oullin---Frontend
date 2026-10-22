import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FoodPreferences.css';

// Importação direta da imagem da pasta assets
import casalCozinhaImg from '../assets/casal-cozinha.jpg';

export default function FoodPreferences() {
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState([]);

  const categories = [
    { id: 'pizzas', label: 'PIZZAS' },
    { id: 'hamburger', label: 'HAMBÚRGER' },
    { id: 'sorvetes', label: 'SORVETES' },
    { id: 'pratos_prontos', label: 'PRATOS PRONTOS' },
    { id: 'doces', label: 'DOCES' },
    { id: 'asiatica', label: 'ASIÁTICA' },
    { id: 'massas', label: 'MASSAS' },
    { id: 'saladas', label: 'SALADAS' },
    { id: 'peixes', label: 'PEIXES' },
    { id: 'trigo', label: 'TRIGO' }
  ];

  const toggleSelect = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="fp-bg-container">
      <div className="fp-mobile-card">
        
        {/* Banner Superior com a Imagem Importada */}
        <div className="fp-image-container">
          <img
            src={casalCozinhaImg}
            alt="Casal na cozinha"
            className="fp-image"
          />
          <button 
            type="button" 
            className="fp-back-button"
            onClick={() => navigate(-1)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Conteúdo Azul */}
        <div className="fp-content-container">
          
          <div className="fp-text-group">
            <h1 className="fp-title">
              E O QUE VOCÊ AMA <br /> COMER?
            </h1>
            <p className="fp-subtitle">
              Com base em suas restrições alimentares selecione quais ingredientes você não pode comer
            </p>
          </div>

          {/* Caixa Laranja com Rolagem Interna */}
          <div className="fp-scroll-box">
            {categories.map((category) => {
              const isSelected = selectedItems.includes(category.id);
              return (
                <button
                  key={category.id}
                  onClick={() => toggleSelect(category.id)}
                  type="button"
                  className="fp-option-button"
                >
                  <div className={`fp-checkbox ${isSelected ? 'selected' : 'unselected'}`}>
                    {isSelected && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  <span className="fp-option-text">{category.label}</span>
                </button>
              );
            })}
          </div>

          {/* Botão Continuar */}
          <button
            type="button"
            className="fp-continue-button"
            onClick={() => alert(`Selecionados: ${selectedItems.join(', ')}`)}
          >
            Continuar
          </button>

        </div>
      </div>
    </div>
  );
}