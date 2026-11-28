import React, { useEffect, useState } from 'react';
import { Sidebar } from './DashboardPages.jsx';
import {
  initialCustomerIngredients,
  initialIngredients,
  ingredientDraftStorageKey,
  readIngredientDraft,
  readTechnicalSheetDraft,
} from './dishFlowStorage.js';

const allergenOptions = [
  { id: 'gluten', label: 'Glúten', status: 'none' },
  { id: 'milk', label: 'Leite', status: 'contains' },
  { id: 'eggs', label: 'Ovos', status: 'none' },
  { id: 'fish', label: 'Peixes', status: 'none' },
  { id: 'crustaceans', label: 'Crustáceos', status: 'none' },
  { id: 'mollusks', label: 'Moluscos', status: 'none' },
  { id: 'peanuts', label: 'Amendoim', status: 'none' },
  { id: 'nuts', label: 'Castanhas e nozes', status: 'none' },
  { id: 'soy', label: 'Soja', status: 'none' },
  { id: 'sesame', label: 'Gergelim', status: 'none' },
  { id: 'mustard', label: 'Mostarda', status: 'none' },
  { id: 'celery', label: 'Aipo', status: 'none' },
  { id: 'sulfites', label: 'Sulfitos', status: 'none' },
  { id: 'lupin', label: 'Tremoço', status: 'none' },
];

const allergenStatusOptions = [
  { value: 'none', label: 'Não contém' },
  { value: 'traces', label: 'Pode conter' },
  { value: 'contains', label: 'Contém' },
];

const legacyAllergenIds = {
  milk: 'lactose',
  eggs: 'egg',
  crustaceans: 'shellfish',
};

function getAllergenStates(savedStates) {
  return Object.fromEntries(allergenOptions.map(({ id, status }) => {
    const savedStatus = savedStates?.[id] ?? savedStates?.[legacyAllergenIds[id]];
    return [id, allergenStatusOptions.some((option) => option.value === savedStatus) ? savedStatus : status];
  }));
}

function Stepper({ dishName }) {
  const dishQuery = `?prato=${encodeURIComponent(dishName)}`;
  const technicalSheetUrl = `./ficha-tecnica.html${dishQuery}`;
  const tbcaUrl = `./tabela-tbca.html${dishQuery}&origem=ingredientes`;
  return (
    <ol className="ingredient-stepper" aria-label="Etapas do cadastro do prato">
      <li className="is-complete">
        <a href={`./utensilios.html${dishQuery}`}>
          <span aria-hidden="true">✓</span>Utensílios
        </a>
      </li>
      <li className="is-current" aria-current="step">
        <span>2</span><strong>Ingredientes e alergênicos</strong>
      </li>
      <li><a href={technicalSheetUrl}><span>3</span>Ficha técnica</a></li>
      <li><a href={tbcaUrl}><span>4</span>Tabela TBCA</a></li>
    </ol>
  );
}

function IngredientRow({ dishName, ingredient, onChange, onDelete }) {
  const tbcaUrl = `./tabela-tbca.html?prato=${encodeURIComponent(dishName)}&ingrediente=${encodeURIComponent(ingredient.id)}&nome=${encodeURIComponent(ingredient.name)}&origem=ingredientes`;
  return (
    <li className="ingredient-row">
      <span className="ingredient-bullet" aria-hidden="true" />
      <strong>{ingredient.name}</strong>
      <label>
        <span className="visually-hidden">Quantidade de {ingredient.name} em gramas</span>
        <input
          type="number"
          min="1"
          step="1"
          value={ingredient.amount}
          onChange={(event) => onChange(ingredient.id, event.target.value)}
        />
        <span>g</span>
      </label>
      <a href={tbcaUrl}>
        Ver na TBCA
      </a>
      <button
        type="button"
        aria-label={`Remover ${ingredient.name}`}
        onClick={() => onDelete(ingredient.id)}
      >
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <path d="M5 6h10M8 6V4h4v2m-6 0 .6 10h6.8L14 6m-5 3v4m2-4v4" />
        </svg>
      </button>
    </li>
  );
}

function AllergenRow({ allergen, status, onChange }) {
  return (
    <li className="ingredient-allergen-row">
      <strong>{allergen.label}</strong>
      <div role="group" aria-label={`Status de ${allergen.label}`}>
        {allergenStatusOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            className={status === option.value ? `is-${option.value}` : undefined}
            aria-pressed={status === option.value}
            onClick={() => onChange(allergen.id, option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </li>
  );
}

export default function IngredientsAllergensPage() {
  const dishName = new URLSearchParams(window.location.search).get('prato') || 'Marmita de frango';
  const [savedDraft] = useState(() => readIngredientDraft(dishName));
  const [savedTechnicalDraft] = useState(() => readTechnicalSheetDraft(dishName));
  const [ingredients, setIngredients] = useState(
    () => savedDraft?.ingredients || savedTechnicalDraft?.ingredients || initialIngredients,
  );
  const [allergenStates, setAllergenStates] = useState(() => (
    getAllergenStates(savedDraft?.allergenStates)
  ));
  const [customerIngredients, setCustomerIngredients] = useState(
    () => savedDraft?.customerIngredients || initialCustomerIngredients,
  );
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    try {
      sessionStorage.setItem(
        ingredientDraftStorageKey,
        JSON.stringify({ dishName, ingredients, allergenStates, customerIngredients }),
      );
    } catch (storageError) {
      setError('Não foi possível salvar automaticamente. Tente remover alguns ingredientes.');
      console.error('Falha ao salvar ingredientes e alergênicos.', storageError);
    }
  }, [dishName, ingredients, allergenStates, customerIngredients]);

  const containedCount = Object.values(allergenStates).filter((status) => status === 'contains').length;
  const dishQuery = `?prato=${encodeURIComponent(dishName)}`;

  function addIngredient(event) {
    event.preventDefault();
    const name = search.trim();
    if (!name) {
      setError('Digite o nome de um ingrediente para adicionar.');
      return;
    }
    if (ingredients.some((ingredient) => ingredient.name.toLocaleLowerCase() === name.toLocaleLowerCase())) {
      setError('Esse ingrediente já está na composição.');
      return;
    }

    setIngredients((current) => [...current, {
      id: `ingredient-${Date.now()}`,
      name,
      amount: '100',
    }]);
    setSearch('');
    setError('');
  }

  function updateIngredientAmount(id, amount) {
    setIngredients((current) => current.map((ingredient) => (
      ingredient.id === id ? { ...ingredient, amount } : ingredient
    )));
  }

  function removeIngredient(id) {
    setIngredients((current) => current.filter((ingredient) => ingredient.id !== id));
  }

  function updateAllergen(id, status) {
    setAllergenStates((current) => ({ ...current, [id]: status }));
  }

  function persistIngredients() {
    try {
      sessionStorage.setItem(
        ingredientDraftStorageKey,
        JSON.stringify({ dishName, ingredients, allergenStates, customerIngredients }),
      );
      return true;
    } catch (storageError) {
      setError('Não foi possível salvar os ingredientes neste navegador.');
      console.error('Falha ao salvar ingredientes e alergênicos.', storageError);
      return false;
    }
  }

  function saveAndContinue() {
    if (!persistIngredients()) return;
    window.location.assign(`./ficha-tecnica.html?prato=${encodeURIComponent(dishName)}`);
  }

  function goBackToUtensils(event) {
    if (!persistIngredients()) event.preventDefault();
  }

  return (
    <div className="merchant-site ingredients-site">
      <Sidebar page="menu" />
      <main className="main ingredients-page">
        <header className="ingredients-page-header">
          <div>
            <p className="ingredients-breadcrumb">
              <a href="./cardapio.html">Cardápio</a><span>›</span>{dishName}
            </p>
            <h1>Ingredientes e alergênicos</h1>
            <p>
              Informe o que compõe a marmita. O cliente vê isso como “Saiba exatamente o que compõe sua refeição”.
            </p>
          </div>
          <button type="button" onClick={() => setPreviewOpen(true)}>
            Pré-visualizar no app
          </button>
        </header>

        <Stepper dishName={dishName} />

        <div className="ingredients-workspace">
          <section className="ingredients-composition" aria-labelledby="composition-title">
            <h2 id="composition-title">Composição da marmita</h2>
            <form className="ingredient-search" onSubmit={addIngredient}>
              <input
                aria-label="Buscar ingrediente na TBCA"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar ingrediente na TBCA..."
              />
              <button type="submit">Adicionar</button>
            </form>

            <ul className="ingredient-list">
              {ingredients.map((ingredient) => (
                <IngredientRow
                  key={ingredient.id}
                  dishName={dishName}
                  ingredient={ingredient}
                  onChange={updateIngredientAmount}
                  onDelete={removeIngredient}
                />
              ))}
            </ul>

            <label className="customer-ingredients-field">
              <span>Ingredientes completos (texto exibido ao cliente)</span>
              <textarea
                value={customerIngredients}
                onChange={(event) => setCustomerIngredients(event.target.value)}
                rows={3}
              />
            </label>
            <p className="ingredient-hint">Ingredientes completos informados pelo responsável.</p>
          </section>

          <section className="ingredients-allergens" aria-labelledby="allergen-title">
            <h2 id="allergen-title">Confira antes de consumir</h2>
            <div className="allergen-legend">
              <span><i className="is-contained" />Contém</span>
              <span><i className="is-traces" />Pode conter traços (contaminação cruzada)</span>
            </div>
            <ul>
              {allergenOptions.map((allergen) => (
                <AllergenRow
                  key={allergen.id}
                  allergen={allergen}
                  status={allergenStates[allergen.id]}
                  onChange={updateAllergen}
                />
              ))}
            </ul>
            <p className="allergen-warning">
              Informações de alergênicos e risco de contaminação cruzada devem ser confirmadas com o responsável.
            </p>
          </section>
        </div>

        {error && <p className="ingredient-error" role="alert">{error}</p>}

        <footer className="ingredients-page-footer">
          <span>
            {ingredients.length} {ingredients.length === 1 ? 'ingrediente' : 'ingredientes'} · {containedCount}{' '}
            {containedCount === 1 ? 'item marcado' : 'itens marcados'} como “Contém”
          </span>
          <div>
            <a href={`./utensilios.html${dishQuery}`} onClick={goBackToUtensils}>Voltar</a>
            <button type="button" onClick={saveAndContinue}>Salvar e continuar</button>
          </div>
        </footer>
      </main>

      {previewOpen && (
        <div className="ingredients-preview-backdrop" role="presentation" onClick={() => setPreviewOpen(false)}>
          <section
            className="ingredients-preview-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ingredients-preview-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" aria-label="Fechar prévia" onClick={() => setPreviewOpen(false)}>×</button>
            <h2 id="ingredients-preview-title">Saiba exatamente o que compõe sua refeição</h2>
            <p>{dishName}</p>
            <p>{customerIngredients}</p>
            <ul>
              {ingredients.map((ingredient) => (
                <li key={ingredient.id}>{ingredient.name} · {ingredient.amount} g</li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}
