import React, { useEffect, useMemo, useState } from 'react';
import { Sidebar } from './DashboardPages.jsx';
import {
  initialIngredients,
  ingredientDraftStorageKey,
  readIngredientDraft,
  readTechnicalSheetDraft,
  technicalSheetDraftStorageKey,
} from './dishFlowStorage.js';
import { nutritionPer100Grams } from './tbcaFoods.js';

const initialExtraNutrients = {
  sugars: '5',
  saturatedFat: '3',
  fiber: '6',
  sodium: '480',
};

const nutrientFields = [
  { id: 'sugars', label: 'Açúcares totais', unit: 'g' },
  { id: 'saturatedFat', label: 'Gorduras saturadas', unit: 'g' },
  { id: 'fiber', label: 'Fibra alimentar', unit: 'g' },
  { id: 'sodium', label: 'Sódio', unit: 'mg' },
];

function Stepper({ dishName }) {
  const dishQuery = `?prato=${encodeURIComponent(dishName)}`;
  const tbcaUrl = `./tabela-tbca.html${dishQuery}&origem=ficha`;
  return (
    <ol className="technical-stepper" aria-label="Etapas do cadastro do prato">
      <li className="is-complete">
        <a href={`./utensilios.html${dishQuery}`}><span aria-hidden="true">✓</span>Utensílios</a>
      </li>
      <li className="is-complete">
        <a href={`./ingredientes-alergenicos.html${dishQuery}`}>
          <span aria-hidden="true">✓</span>Ingredientes e alergênicos
        </a>
      </li>
      <li className="is-current" aria-current="step">
        <span>3</span><strong>Ficha técnica</strong>
      </li>
      <li><a href={tbcaUrl}><span>4</span>Tabela TBCA</a></li>
    </ol>
  );
}

function grams(value) {
  const amount = Number(value);
  return Number.isFinite(amount) && amount > 0 ? amount : 0;
}

function round(value) {
  return Math.round(value);
}

function NutritionSummary({ totals }) {
  return (
    <section className="technical-summary" aria-label="Resumo nutricional da porção">
      <article className="technical-energy-card">
        <span>Valor energético</span>
        <strong>{round(totals.energy)} kcal</strong>
        <small>Porção: {round(totals.portion)} g</small>
      </article>
      <article><span>Carboidratos</span><strong>{round(totals.carbohydrates)} g</strong></article>
      <article><span>Proteínas</span><strong>{round(totals.protein)} g</strong></article>
      <article><span>Gorduras</span><strong>{round(totals.fat)} g</strong></article>
    </section>
  );
}

function PreviewDialog({ dishName, ingredients, totals, onClose }) {
  return (
    <div className="technical-preview-backdrop" role="presentation" onClick={onClose}>
      <section
        className="technical-preview-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="technical-preview-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" aria-label="Fechar prévia" onClick={onClose}>×</button>
        <h2 id="technical-preview-title">Informações nutricionais</h2>
        <p>{dishName} · porção de {round(totals.portion)} g</p>
        <strong>{round(totals.energy)} kcal</strong>
        <ul>
          {ingredients.map((ingredient) => (
            <li key={ingredient.id}>{ingredient.name} · {round(grams(ingredient.amount))} g</li>
          ))}
        </ul>
        <p>
          Carboidratos {round(totals.carbohydrates)} g · Proteínas {round(totals.protein)} g ·
          Gorduras {round(totals.fat)} g
        </p>
      </section>
    </div>
  );
}

export default function TechnicalSheetPage() {
  const dishName = new URLSearchParams(window.location.search).get('prato') || 'Marmita de frango';
  const [savedIngredientDraft] = useState(() => readIngredientDraft(dishName));
  const [savedTechnicalDraft] = useState(() => readTechnicalSheetDraft(dishName));
  const [ingredients, setIngredients] = useState(
    () => savedIngredientDraft?.ingredients || savedTechnicalDraft?.ingredients || initialIngredients,
  );
  const [extraNutrients, setExtraNutrients] = useState(
    () => ({ ...initialExtraNutrients, ...savedTechnicalDraft?.extraNutrients }),
  );
  const [error, setError] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);

  const totals = useMemo(() => ingredients.reduce((sum, ingredient) => {
    const amount = grams(ingredient.amount);
    const values = nutritionPer100Grams[ingredient.id];
    sum.portion += amount;
    if (values) {
      sum.energy += round((amount / 100) * values.energy);
      sum.carbohydrates += round((amount / 100) * values.carbohydrates);
      sum.protein += round((amount / 100) * values.protein);
      sum.fat += round((amount / 100) * values.fat);
    }
    return sum;
  }, { portion: 0, energy: 0, carbohydrates: 0, protein: 0, fat: 0 }), [ingredients]);

  const ingredientsWithoutNutrition = ingredients.filter(
    (ingredient) => !nutritionPer100Grams[ingredient.id],
  );
  const dishQuery = `?prato=${encodeURIComponent(dishName)}`;
  const tbcaUrl = `./tabela-tbca.html${dishQuery}&origem=ficha`;

  useEffect(() => {
    try {
      sessionStorage.setItem(
        technicalSheetDraftStorageKey,
        JSON.stringify({ dishName, ingredients, extraNutrients }),
      );
      if (savedIngredientDraft) {
        sessionStorage.setItem(
          ingredientDraftStorageKey,
          JSON.stringify({ ...savedIngredientDraft, ingredients }),
        );
      }
    } catch (storageError) {
      setError('Não foi possível salvar a ficha técnica neste navegador.');
      console.error('Falha ao salvar a ficha técnica.', storageError);
    }
  }, [dishName, ingredients, extraNutrients, savedIngredientDraft]);

  function updateAmount(id, amount) {
    setIngredients((current) => current.map((ingredient) => (
      ingredient.id === id ? { ...ingredient, amount } : ingredient
    )));
  }

  function updateExtraNutrient(id, value) {
    setExtraNutrients((current) => ({ ...current, [id]: value }));
  }

  function persistDraft() {
    try {
      sessionStorage.setItem(
        technicalSheetDraftStorageKey,
        JSON.stringify({ dishName, ingredients, extraNutrients }),
      );
      if (savedIngredientDraft) {
        sessionStorage.setItem(
          ingredientDraftStorageKey,
          JSON.stringify({ ...savedIngredientDraft, ingredients }),
        );
      }
      return true;
    } catch (storageError) {
      setError('Não foi possível salvar a ficha técnica neste navegador.');
      console.error('Falha ao salvar a ficha técnica.', storageError);
      return false;
    }
  }

  function goBackToIngredients(event) {
    if (!persistDraft()) event.preventDefault();
  }

  function publishSheet() {
    if (persistDraft()) window.location.assign('./novo-prato.html');
  }

  return (
    <div className="merchant-site technical-site">
      <Sidebar page="menu" />
      <main className="main technical-page">
        <header className="technical-page-header">
          <div>
            <p className="technical-breadcrumb">
              <a href="./cardapio.html">Cardápio</a><span>›</span>{dishName}
            </p>
            <h1>Ficha técnica</h1>
            <p>Digite a quantidade de cada ingrediente. A composição nutricional é recalculada automaticamente.</p>
          </div>
          <button type="button" onClick={() => setPreviewOpen(true)}>Pré-visualizar no app</button>
        </header>

        <Stepper dishName={dishName} />
        <NutritionSummary totals={totals} />

        <div className="technical-workspace">
          <section className="technical-table-card" aria-labelledby="portion-ingredients-title">
            <header>
              <h2 id="portion-ingredients-title">Ingredientes da porção</h2>
              <a href={tbcaUrl}>+ Adicionar da TBCA</a>
            </header>
            <div className="technical-table-scroll">
              <table className="technical-table">
                <thead>
                  <tr>
                    <th scope="col">Ingrediente</th>
                    <th scope="col">Quantidade</th>
                    <th scope="col">Kcal</th>
                    <th scope="col">Carb.</th>
                    <th scope="col">Prot.</th>
                    <th scope="col">Gord.</th>
                  </tr>
                </thead>
                <tbody>
                  {ingredients.map((ingredient) => {
                    const values = nutritionPer100Grams[ingredient.id];
                    const amount = grams(ingredient.amount);
                    return (
                      <tr key={ingredient.id}>
                        <th scope="row">{ingredient.name}</th>
                        <td>
                          <label>
                            <span className="visually-hidden">Quantidade de {ingredient.name} em gramas</span>
                            <input
                              type="number"
                              min="0"
                              step="1"
                              value={ingredient.amount}
                              onChange={(event) => updateAmount(ingredient.id, event.target.value)}
                            />
                          </label>
                          <span className="technical-unit">g</span>
                        </td>
                        {values ? (
                          <>
                            <td>{round((amount / 100) * values.energy)}</td>
                            <td>{round((amount / 100) * values.carbohydrates)} g</td>
                            <td>{round((amount / 100) * values.protein)} g</td>
                            <td>{round((amount / 100) * values.fat)} g</td>
                          </>
                        ) : (
                          <td colSpan="4" className="technical-no-data">Sem dados TBCA</td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <th scope="row">Total da porção</th>
                    <td>{round(totals.portion)} g</td>
                    <td>{round(totals.energy)}</td>
                    <td>{round(totals.carbohydrates)} g</td>
                    <td>{round(totals.protein)} g</td>
                    <td>{round(totals.fat)} g</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            {ingredientsWithoutNutrition.length > 0 && (
              <p className="technical-data-warning" role="status">
                Dados nutricionais indisponíveis para: {ingredientsWithoutNutrition.map(({ name }) => name).join(', ')}.
                Consulte a TBCA para completar esses itens.
              </p>
            )}
            <p className="technical-source">
              Valores demonstrativos para o protótipo. Consulte a TBCA e confirme os dados antes de publicar.
            </p>
          </section>

          <section className="technical-complete-card" aria-labelledby="complete-table-title">
            <h2 id="complete-table-title">Complete a tabela</h2>
            <p>Itens que não vêm da TBCA. Preencha com o rótulo ou a receita.</p>
            {nutrientFields.map((field) => (
              <label className="technical-extra-field" key={field.id}>
                <span>{field.label}</span>
                <span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={extraNutrients[field.id]}
                    onChange={(event) => updateExtraNutrient(field.id, event.target.value)}
                  />
                  <small>{field.unit}</small>
                </span>
              </label>
            ))}
            <p className="technical-prototype-note">Valores ilustrativos para o protótipo.</p>
          </section>
        </div>

        {error && <p className="technical-error" role="alert">{error}</p>}

        <footer className="technical-page-footer">
          <span>Ficha atualizada agora · salva automaticamente</span>
          <div>
            <a href={`./ingredientes-alergenicos.html${dishQuery}`} onClick={goBackToIngredients}>Voltar</a>
            <button type="button" onClick={publishSheet}>Publicar ficha</button>
          </div>
        </footer>
      </main>

      {previewOpen && (
        <PreviewDialog
          dishName={dishName}
          ingredients={ingredients}
          totals={totals}
          onClose={() => setPreviewOpen(false)}
        />
      )}
    </div>
  );
}
