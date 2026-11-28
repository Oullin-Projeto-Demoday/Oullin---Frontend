import React, { useEffect, useMemo, useState } from 'react';
import { Sidebar } from './DashboardPages.jsx';
import {
  initialIngredients,
  ingredientDraftStorageKey,
  readIngredientDraft,
  readTechnicalSheetDraft,
  technicalSheetDraftStorageKey,
} from './dishFlowStorage.js';
import { findTbcaFood, nutritionPer100Grams, searchTbcaFoods } from './tbcaFoods.js';

function Stepper({ dishName }) {
  const dishQuery = `?prato=${encodeURIComponent(dishName)}`;
  return (
    <ol className="tbca-stepper" aria-label="Etapas do cadastro do prato">
      <li className="is-complete">
        <a href={`./utensilios.html${dishQuery}`}><span aria-hidden="true">✓</span>Utensílios</a>
      </li>
      <li className="is-complete">
        <a href={`./ingredientes-alergenicos.html${dishQuery}`}>
          <span aria-hidden="true">✓</span>Ingredientes e alergênicos
        </a>
      </li>
      <li className="is-complete">
        <a href={`./ficha-tecnica.html${dishQuery}`}><span aria-hidden="true">✓</span>Ficha técnica</a>
      </li>
      <li className="is-current" aria-current="step">
        <span>4</span><strong>Tabela TBCA</strong>
      </li>
    </ol>
  );
}

function readPageData(dishName) {
  const params = new URLSearchParams(window.location.search);
  const ingredientDraft = readIngredientDraft(dishName);
  const technicalDraft = readTechnicalSheetDraft(dishName);
  const ingredients = ingredientDraft?.ingredients || technicalDraft?.ingredients || initialIngredients;
  const selectedFood = findTbcaFood(params.get('ingrediente'), params.get('nome'));
  const existingIngredient = selectedFood && ingredients.find((ingredient) => (
    ingredient.id === selectedFood.id ||
    ingredient.name.trim().toLocaleLowerCase() === selectedFood.name.toLocaleLowerCase()
  ));

  return {
    ingredientDraft,
    technicalDraft,
    ingredients,
    selectedFood,
    search: selectedFood?.aliases[0] || params.get('nome') || '',
    quantity: existingIngredient?.amount || '120',
    origin: params.get('origem') === 'ingredientes' ? 'ingredients' : 'technical',
  };
}

function grams(value) {
  const amount = Number(value);
  return Number.isFinite(amount) && amount > 0 ? amount : 0;
}

function round(value) {
  return Math.round(value);
}

function PreviewDialog({ food, quantity, nutrients, onClose }) {
  return (
    <div className="tbca-preview-backdrop" role="presentation" onClick={onClose}>
      <section
        className="tbca-preview-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tbca-preview-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" aria-label="Fechar prévia" onClick={onClose}>×</button>
        <h2 id="tbca-preview-title">Informação nutricional do ingrediente</h2>
        <p>{food?.name || 'Selecione um ingrediente'} · {round(grams(quantity))} g</p>
        <strong>{round(nutrients.energy)} kcal</strong>
        <p>
          {round(nutrients.carbohydrates)} g de carboidratos · {round(nutrients.protein)} g de proteínas ·
          {` ${round(nutrients.fat)} g de gorduras`}
        </p>
      </section>
    </div>
  );
}

export default function TBCAPage() {
  const dishName = new URLSearchParams(window.location.search).get('prato') || 'Marmita de frango';
  const [pageData] = useState(() => readPageData(dishName));
  const [ingredients, setIngredients] = useState(pageData.ingredients);
  const [search, setSearch] = useState(pageData.search);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedFood, setSelectedFood] = useState(pageData.selectedFood);
  const [editingIngredientIndex, setEditingIngredientIndex] = useState(() => (
    pageData.selectedFood
      ? pageData.ingredients.findIndex((ingredient) => (
        ingredient.id === pageData.selectedFood.id ||
        ingredient.name.trim().toLocaleLowerCase() === pageData.selectedFood.name.toLocaleLowerCase()
      ))
      : -1
  ));
  const [quantity, setQuantity] = useState(pageData.quantity);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);

  const registeredFoods = useMemo(() => {
    const seenFoodIds = new Set();
    return ingredients
      .map((ingredient) => findTbcaFood(ingredient.id, ingredient.name))
      .filter((food) => {
        if (!food || seenFoodIds.has(food.id)) return false;
        seenFoodIds.add(food.id);
        return true;
      });
  }, [ingredients]);
  const results = useMemo(() => {
    const matchingFoods = searchTbcaFoods(search);
    if (hasSearched) return matchingFoods;

    const matchingFoodIds = new Set(matchingFoods.map((food) => food.id));
    return registeredFoods.filter((food) => matchingFoodIds.has(food.id));
  }, [hasSearched, registeredFoods, search]);
  const selectedNutrition = selectedFood ? nutritionPer100Grams[selectedFood.id] : null;
  const amount = grams(quantity);
  const editedIngredient = editingIngredientIndex >= 0 ? ingredients[editingIngredientIndex] : null;
  const isReplacingIngredient = Boolean(
    editedIngredient && selectedFood && editedIngredient.id !== selectedFood.id,
  );
  const portionNutrients = {
    energy: selectedNutrition ? amount / 100 * selectedNutrition.energy : 0,
    carbohydrates: selectedNutrition ? amount / 100 * selectedNutrition.carbohydrates : 0,
    protein: selectedNutrition ? amount / 100 * selectedNutrition.protein : 0,
    fat: selectedNutrition ? amount / 100 * selectedNutrition.fat : 0,
  };
  const dishQuery = `?prato=${encodeURIComponent(dishName)}`;
  const cancelUrl = pageData.origin === 'ingredients'
    ? `./ingredientes-alergenicos.html${dishQuery}`
    : `./ficha-tecnica.html${dishQuery}`;

  useEffect(() => {
    try {
      sessionStorage.setItem(
        technicalSheetDraftStorageKey,
        JSON.stringify({
          dishName,
          ingredients,
          extraNutrients: pageData.technicalDraft?.extraNutrients || {},
        }),
      );
      if (pageData.ingredientDraft) {
        sessionStorage.setItem(
          ingredientDraftStorageKey,
          JSON.stringify({ ...pageData.ingredientDraft, ingredients }),
        );
      }
    } catch (storageError) {
      setError('Não foi possível salvar as alterações da ficha técnica.');
      console.error('Falha ao salvar ingredientes consultados na TBCA.', storageError);
    }
  }, [dishName, ingredients, pageData.technicalDraft]);

  function selectFood(food) {
    const existingIndex = ingredients.findIndex((ingredient) => (
      ingredient.id === food.id ||
      ingredient.name.trim().toLocaleLowerCase() === food.name.toLocaleLowerCase()
    ));
    if (editingIngredientIndex < 0 && existingIndex >= 0) {
      setEditingIngredientIndex(existingIndex);
    }
    setSelectedFood(food);
    setQuantity(
      editingIngredientIndex >= 0
        ? ingredients[editingIngredientIndex]?.amount || '120'
        : ingredients[existingIndex]?.amount || '120',
    );
    setError('');
    setMessage('');
  }

  function selectDishIngredient(index, ingredient) {
    const food = findTbcaFood(ingredient.id, ingredient.name);
    setEditingIngredientIndex(index);
    setSelectedFood(food);
    setSearch(food?.name || ingredient.name);
    setHasSearched(false);
    setQuantity(ingredient.amount);
    setError('');
    setMessage('');
  }

  function updateIngredientAmount(index, nextAmount) {
    setIngredients((current) => current.map((ingredient, ingredientIndex) => (
      ingredientIndex === index ? { ...ingredient, amount: nextAmount } : ingredient
    )));
    if (index === editingIngredientIndex) setQuantity(nextAmount);
    setMessage('');
  }

  function removeIngredient(index) {
    setIngredients((current) => current.filter((_, ingredientIndex) => ingredientIndex !== index));
    if (editingIngredientIndex === index) {
      setEditingIngredientIndex(-1);
      setSelectedFood(null);
      setQuantity('120');
    } else if (editingIngredientIndex >= 0 && editingIngredientIndex > index) {
      setEditingIngredientIndex(editingIngredientIndex - 1);
    }
    setMessage('');
  }

  function addFood() {
    const parsedQuantity = Number(quantity);
    if (!selectedFood) {
      setError('Escolha um alimento da lista para continuar.');
      return;
    }
    if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
      setError('Informe uma quantidade maior que zero.');
      return;
    }

    const matchingIngredientIndex = ingredients.findIndex((ingredient, index) => (
      index !== editingIngredientIndex && (
        ingredient.id === selectedFood.id ||
        ingredient.name.trim().toLocaleLowerCase() === selectedFood.name.toLocaleLowerCase()
      )
    ));
    if (editingIngredientIndex >= 0 && matchingIngredientIndex >= 0) {
      setError(`${selectedFood.name} já está no prato. Selecione-o na lista para alterar a quantidade.`);
      setMessage('');
      return;
    }

    const updatedIngredient = {
      id: selectedFood.id,
      name: selectedFood.name,
      amount: String(parsedQuantity),
    };
    const updatedIngredients = editingIngredientIndex >= 0
      ? ingredients.map((ingredient, index) => (
        index === editingIngredientIndex ? updatedIngredient : ingredient
      ))
      : matchingIngredientIndex >= 0
        ? ingredients.map((ingredient, index) => (
          index === matchingIngredientIndex ? updatedIngredient : ingredient
        ))
        : [...ingredients, updatedIngredient];

    try {
      if (pageData.ingredientDraft) {
        sessionStorage.setItem(
          ingredientDraftStorageKey,
          JSON.stringify({ ...pageData.ingredientDraft, ingredients: updatedIngredients }),
        );
      }
      sessionStorage.setItem(
        technicalSheetDraftStorageKey,
        JSON.stringify({
          dishName,
          ingredients: updatedIngredients,
          extraNutrients: pageData.technicalDraft?.extraNutrients || {},
        }),
      );
      setIngredients(updatedIngredients);
      setMessage(
        editingIngredientIndex >= 0
          ? `${selectedFood.name} foi atualizado no prato.`
          : `${selectedFood.name} foi adicionado à ficha técnica.`,
      );
      setEditingIngredientIndex(-1);
      setSearch('');
      setHasSearched(false);
      setError('');
    } catch (storageError) {
      setError('Não foi possível salvar o ingrediente neste navegador.');
      console.error('Falha ao adicionar ingrediente da TBCA.', storageError);
    }
  }

  return (
    <div className="merchant-site tbca-site">
      <Sidebar page="menu" />
      <main className="main tbca-page">
        <header className="tbca-page-header">
          <div>
            <p className="tbca-breadcrumb">
              <a href="./cardapio.html">Cardápio</a><span>›</span>{dishName}
            </p>
            <h1>Tabela TBCA</h1>
            <p>Busque o ingrediente na Tabela Brasileira de Composição de Alimentos e adicione à ficha técnica.</p>
          </div>
          <button type="button" onClick={() => setPreviewOpen(true)}>Pré-visualizar no app</button>
        </header>

        <Stepper dishName={dishName} />

        <div className="tbca-workspace">
          <section className="tbca-results-panel" aria-label="Buscar ingredientes na TBCA">
            <label className="tbca-search">
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <circle cx="8.5" cy="8.5" r="5.5" />
                <path d="m13 13 4 4" />
              </svg>
              <span className="visually-hidden">Buscar alimento</span>
              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setHasSearched(Boolean(event.target.value.trim()));
                  setMessage('');
                }}
                placeholder="Buscar ingrediente..."
              />
            </label>
            <p className="tbca-result-count">
              {results.length} {hasSearched
                ? results.length === 1 ? 'resultado' : 'resultados'
                : results.length === 1 ? 'ingrediente cadastrado' : 'ingredientes cadastrados'}
            </p>
            {results.length > 0 ? (
              <ul>
                {results.map((food) => (
                  <li key={food.id}>
                    <button
                      type="button"
                      className={selectedFood?.id === food.id ? 'is-selected' : undefined}
                      aria-pressed={selectedFood?.id === food.id}
                      onClick={() => selectFood(food)}
                    >
                      <strong>{food.name}</strong>
                      <span>Valores por 100 g</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="tbca-no-results">
                {hasSearched
                  ? 'Nenhum alimento encontrado. Tente outro termo ou consulte a TBCA oficial.'
                  : 'Nenhum ingrediente do prato está na tabela. Busque um alimento para adicionar.'}
              </p>
            )}
          </section>

          <section className="tbca-details-panel" aria-label="Detalhes do alimento selecionado">
            {selectedFood ? (
              <>
                <header>
                  <span>TBCA</span>
                  <h2>{selectedFood.name}</h2>
                </header>
                <div className="tbca-components-scroll">
                  <table className="tbca-components-table">
                    <thead>
                      <tr>
                        <th scope="col">Componente</th>
                        <th scope="col">Unidades</th>
                        <th scope="col">Valor por 100 g</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedFood.components.map((component, index) => (
                        <tr key={`${component.name}-${index}`}>
                          <th scope="row">{component.name}</th>
                          <td>{component.unit}</td>
                          <td>{component.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="tbca-empty-details">
                <strong>Selecione um alimento</strong>
                <p>Escolha um resultado para consultar seus componentes nutricionais.</p>
              </div>
            )}
          </section>

          <section className="tbca-add-panel" aria-labelledby="tbca-add-title">
            <h2 id="tbca-add-title">
              {editingIngredientIndex >= 0
                ? isReplacingIngredient ? 'Substituir ingrediente do prato' : 'Editar ingrediente do prato'
                : 'Adicionar à ficha técnica'}
            </h2>
            <label>
              <span>Quantidade na marmita</span>
              <span className="tbca-quantity-input">
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={quantity}
                  onChange={(event) => {
                    setQuantity(event.target.value);
                    setMessage('');
                  }}
                  disabled={!selectedFood}
                />
                <span>g</span>
              </span>
            </label>
            <div className="tbca-portion-preview" aria-live="polite">
              <span>Na sua porção</span>
              <strong>{selectedFood ? `${round(portionNutrients.energy)} kcal` : '—'}</strong>
              <p>
                {round(portionNutrients.carbohydrates)} g carb. · {round(portionNutrients.protein)} g prot. ·
                {` ${round(portionNutrients.fat)} g gord.`}
              </p>
            </div>
            {error && <p className="tbca-error" role="alert">{error}</p>}
            {message && <p className="tbca-success" role="status">{message}</p>}
            <button type="button" className="tbca-add-button" disabled={!selectedFood} onClick={addFood}>
              {isReplacingIngredient
                ? 'Substituir ingrediente'
                : editingIngredientIndex >= 0
                  ? 'Atualizar ingrediente do prato'
                  : 'Adicionar ingrediente'}
            </button>
            <a className="tbca-cancel-button" href={cancelUrl}>Cancelar</a>
          </section>
        </div>

        <section className="tbca-dish-ingredients" aria-labelledby="tbca-dish-ingredients-title">
          <header>
            <div>
              <h2 id="tbca-dish-ingredients-title">Ingredientes do prato</h2>
              <p>Altere as quantidades, remova itens ou selecione um ingrediente para substituí-lo pela busca.</p>
            </div>
            <span>{ingredients.length} {ingredients.length === 1 ? 'ingrediente' : 'ingredientes'}</span>
          </header>
          {ingredients.length > 0 ? (
            <ul>
              {ingredients.map((ingredient, index) => (
                <li
                  key={`${ingredient.id}-${index}`}
                  className={editingIngredientIndex === index ? 'is-editing' : undefined}
                >
                  <button
                    type="button"
                    className="tbca-dish-ingredient-name"
                    aria-pressed={editingIngredientIndex === index}
                    onClick={() => selectDishIngredient(index, ingredient)}
                  >
                    <strong>{ingredient.name}</strong>
                    <span>{editingIngredientIndex === index ? 'Selecionado para edição' : 'Editar ou substituir'}</span>
                  </button>
                  <label className="tbca-dish-ingredient-amount">
                    <span className="visually-hidden">Quantidade de {ingredient.name} em gramas</span>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={ingredient.amount}
                      onChange={(event) => updateIngredientAmount(index, event.target.value)}
                    />
                    <span>g</span>
                  </label>
                  <button
                    type="button"
                    className="tbca-remove-ingredient"
                    aria-label={`Remover ${ingredient.name} do prato`}
                    onClick={() => removeIngredient(index)}
                  >
                    Remover
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="tbca-no-dish-ingredients">Nenhum ingrediente adicionado. Use a busca para incluir alimentos no prato.</p>
          )}
        </section>

        <footer className="tbca-page-footer">
          <span>Fonte: TBCA · Valores demonstrativos para o protótipo.</span>
          <div>
            <a href={`./ficha-tecnica.html${dishQuery}`}>Voltar à ficha</a>
            <a className="tbca-finish-button" href="./novo-prato.html">Concluir</a>
          </div>
        </footer>
      </main>

      {previewOpen && (
        <PreviewDialog
          food={selectedFood}
          quantity={quantity}
          nutrients={portionNutrients}
          onClose={() => setPreviewOpen(false)}
        />
      )}
    </div>
  );
}
