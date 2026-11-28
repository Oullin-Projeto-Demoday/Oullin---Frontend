import React, { useEffect, useMemo, useState } from 'react';
import { Sidebar } from './DashboardPages.jsx';
import platePlaceholder from '../../assets/new-dish-placeholder.png';
import panIcon from '../../assets/pan.png';
import verifiedCheckIcon from '../../assets/verified-check.png';
import nutritionSheetIcon from '../../assets/nutrition-sheet.png';
import { readTechnicalSheetDraft } from './dishFlowStorage.js';

const categories = ['Marmitas', 'Pratos', 'Lanches', 'Sobremesas', 'Bebidas', 'Saladas'];
const allergens = [
  'Glúten',
  'Leite',
  'Ovos',
  'Peixes',
  'Crustáceos',
  'Moluscos',
  'Amendoim',
  'Castanhas e nozes',
  'Soja',
  'Gergelim',
  'Mostarda',
  'Aipo',
  'Sulfitos',
  'Tremoço',
];
const dietaryLabels = ['Vegano', 'Vegetariano', 'Halal', 'Baixo carboidrato'];
const dishDraftStorageKey = 'oullin-new-dish-draft';

function readDishDraft() {
  try {
    const storedDraft = sessionStorage.getItem(dishDraftStorageKey);
    if (!storedDraft) return null;

    const draft = JSON.parse(storedDraft);
    if (draft && typeof draft === 'object' && draft.form) return draft;
    return null;
  } catch (error) {
    console.error('Não foi possível recuperar o rascunho do prato.', error);
    return null;
  }
}

const allergenStateLabels = {
  0: 'Não contém',
  1: 'Contém',
  2: 'Pode conter traços',
  3: 'Limpa',
};

function formatPrice(value) {
  const price = Number(value);
  return Number.isFinite(price) && price > 0
    ? price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    : 'R$ 0,00';
}

export default function NewDishPage() {
  const [draft] = useState(readDishDraft);
  const [form, setForm] = useState(() => draft?.form || {
    name: '',
    category: '',
    price: '',
    description: '',
    preparationNotice: '',
    reviewedAllergens: false,
  });
  const [allergenStates, setAllergenStates] = useState(
    () => draft?.allergenStates || Object.fromEntries(allergens.map((allergen) => [allergen, 0])),
  );
  const [dietaryTags, setDietaryTags] = useState(() => draft?.dietaryTags || []);
  const [photo, setPhoto] = useState(() => draft?.photo || '');
  const [photoError, setPhotoError] = useState('');
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    if (draft) sessionStorage.removeItem(dishDraftStorageKey);
  }, [draft]);

  const contains = useMemo(
    () => allergens.filter((allergen) => allergenStates[allergen] === 1),
    [allergenStates],
  );
  const mayContain = useMemo(
    () => allergens.filter((allergen) => allergenStates[allergen] === 2),
    [allergenStates],
  );
  const cleanOf = useMemo(
    () => allergens.filter((allergen) => allergenStates[allergen] === 3),
    [allergenStates],
  );

  const missingFields = [];
  if (!form.name.trim()) missingFields.push('nome');
  if (!form.category) missingFields.push('categoria');
  if (!Number.isFinite(Number(form.price)) || Number(form.price) <= 0) {
    missingFields.push('preço');
  }
  if (!form.description.trim()) missingFields.push('descrição');
  if (!form.reviewedAllergens) missingFields.push('confirmação dos alergênicos');

  const canSave = missingFields.length === 0;

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handlePhotoChange(event) {
    const file = event.target.files?.[0];
    setPhotoError('');
    setSaveError('');
    if (!file) {
      setPhoto('');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setPhoto('');
      setPhotoError('Escolha uma imagem JPG, PNG ou WebP.');
      event.target.value = '';
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setPhoto('');
      setPhotoError('A imagem deve ter no máximo 2 MB.');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPhoto(reader.result);
      } else {
        setPhotoError('Não foi possível carregar esta imagem. Tente outro arquivo.');
      }
    };
    reader.onerror = () => {
      setPhotoError('Não foi possível carregar esta imagem. Tente outro arquivo.');
    };
    reader.readAsDataURL(file);
  }

  function cycleAllergen(allergen) {
    setAllergenStates((current) => ({
      ...current,
      [allergen]: (current[allergen] + 1) % 4,
    }));
  }

  function toggleDietaryTag(tag) {
    setDietaryTags((current) =>
      current.includes(tag) ? current.filter((value) => value !== tag) : [...current, tag],
    );
  }

  function saveDraftBeforeNavigation(event) {
    try {
      sessionStorage.setItem(
        dishDraftStorageKey,
        JSON.stringify({ form, allergenStates, dietaryTags, photo }),
      );
    } catch (error) {
      event.preventDefault();
      setSaveError('Não foi possível guardar o rascunho antes de avançar.');
      console.error('Falha ao guardar o rascunho do prato.', error);
    }
  }

  function saveDish(event) {
    event.preventDefault();
    if (!canSave) return;

    const item = {
      id: `new-dish-${Date.now()}`,
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      description: form.description.trim(),
      preparationNotice: form.preparationNotice.trim(),
      image: photo || platePlaceholder,
      photoAdded: Boolean(photo),
      available: true,
      allergenReview: form.reviewedAllergens,
      noDeclaredAllergens: contains.length === 0 && mayContain.length === 0,
      contains,
      mayContain,
      allergenClean: cleanOf,
      dietaryTags,
      technicalSheet: readTechnicalSheetDraft(form.name.trim() || 'Marmita de frango'),
    };

    try {
      sessionStorage.setItem('oullin-pending-menu-item', JSON.stringify(item));
      window.location.assign('./cardapio.html');
    } catch {
      setSaveError('Não foi possível salvar neste navegador. Tente uma foto menor.');
    }
  }

  return (
    <div className="merchant-site new-dish-site">
      <Sidebar page="menu" />
      <main className="main new-dish-page">
        <header className="new-dish-header">
          <div>
            <h1>Olá, Saudavel Life</h1>
            <p>Cadastro de prato</p>
          </div>
          <a className="new-dish-back" href="./cardapio.html">Voltar ao cardápio</a>
        </header>

        <div className="new-dish-layout">
          <div className="new-dish-form-column">
            <div className="new-dish-title">
              <h2>Novo prato</h2>
              <p>Os alergênicos aparecem para o cliente antes de pedir.</p>
            </div>

            <form className="new-dish-form" onSubmit={saveDish}>
              <section className="new-dish-panel" aria-labelledby="dish-information-title">
                <header className="new-dish-panel-heading">
                  <h3 id="dish-information-title">Informações do prato</h3>
                  <p>O que o cliente vê no cardápio.</p>
                </header>

                <label className="new-dish-field">
                  <span>Nome do prato</span>
                  <input
                    required
                    maxLength={70}
                    value={form.name}
                    onChange={(event) => updateForm('name', event.target.value)}
                    placeholder="Ex.: Risoto de cogumelos"
                  />
                </label>

                <div className="new-dish-field-row">
                  <label className="new-dish-field">
                    <span>Categoria</span>
                    <select
                      required
                      value={form.category}
                      onChange={(event) => updateForm('category', event.target.value)}
                    >
                      <option value="">Selecione</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </label>
                  <label className="new-dish-field">
                    <span>Preço (R$)</span>
                    <input
                      required
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={form.price}
                      onChange={(event) => updateForm('price', event.target.value)}
                      placeholder="0,00"
                    />
                  </label>
                </div>

                <label className="new-dish-field">
                  <span>Descrição e ingredientes</span>
                  <textarea
                    required
                    maxLength={240}
                    rows={3}
                    value={form.description}
                    onChange={(event) => updateForm('description', event.target.value)}
                    placeholder="Liste os ingredientes principais"
                  />
                  <small className="new-dish-character-count">{form.description.length}/240</small>
                </label>

                <label className="new-dish-field">
                  <span>Foto (JPG, PNG ou WebP, até 2 MB)</span>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                    onChange={handlePhotoChange}
                  />
                </label>
                {photoError && <p className="new-dish-error" role="alert">{photoError}</p>}
              </section>

              <section className="new-dish-panel" aria-labelledby="food-safety-title">
                <header className="new-dish-panel-heading">
                  <h3 id="food-safety-title">Segurança alimentar</h3>
                  <p>
                    Toque só no que se aplica. 1 toque: contém. 2 toques: pode conter traços.
                    3 toques: limpa. Sem marcação conta como “não contém”.
                  </p>
                </header>

                <div className="new-dish-allergens" role="group" aria-label="Alergênicos">
                  {allergens.map((allergen) => {
                    const status = allergenStates[allergen];
                    return (
                      <button
                        key={allergen}
                        type="button"
                        className={`new-dish-allergen status-${status}`}
                        aria-label={`${allergen}: ${allergenStateLabels[status]}. Clique para alterar.`}
                        aria-pressed={status !== 0}
                        onClick={() => cycleAllergen(allergen)}
                      >
                        <strong>{allergen}</strong>
                        <small>{allergenStateLabels[status]}</small>
                      </button>
                    );
                  })}
                </div>

                <fieldset className="new-dish-dietary">
                  <legend>Selos do prato</legend>
                  <div>
                    {dietaryLabels.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        className={dietaryTags.includes(tag) ? 'is-selected' : undefined}
                        aria-pressed={dietaryTags.includes(tag)}
                        onClick={() => toggleDietaryTag(tag)}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <label className="new-dish-field">
                  <span>Aviso de preparo (opcional)</span>
                  <input
                    maxLength={120}
                    value={form.preparationNotice}
                    onChange={(event) => updateForm('preparationNotice', event.target.value)}
                    placeholder="Ex.: Frito no mesmo óleo de pratos com camarão"
                  />
                </label>

                <label className="new-dish-review-check">
                  <input
                    type="checkbox"
                    checked={form.reviewedAllergens}
                    onChange={(event) => updateForm('reviewedAllergens', event.target.checked)}
                  />
                  <span>
                    Revisei os alergênicos e a possibilidade de contaminação cruzada deste prato.
                    O cliente usa estas informações para decidir o que comer.
                  </span>
                </label>
              </section>

              <footer className="new-dish-submit-row">
                <p aria-live="polite">
                  {missingFields.length
                    ? `Falta: ${missingFields.join(', ')}.`
                    : 'Tudo pronto para salvar.'}
                </p>
                <button type="submit" disabled={!canSave}>Salvar prato</button>
              </footer>
              {saveError && <p className="new-dish-error" role="alert">{saveError}</p>}
            </form>
          </div>

          <aside className="new-dish-preview-column">
            <h3>Como o cliente vê</h3>
            <article className="new-dish-preview-card">
              <div className="new-dish-preview-photo">
                <img src={photo || platePlaceholder} alt="" />
              </div>
              <div className="new-dish-preview-content">
                <header>
                  <strong>{form.name.trim() || 'Nome do prato'}</strong>
                  <b>{formatPrice(form.price)}</b>
                </header>
                <p>{form.description.trim() || 'A descrição aparece aqui.'}</p>
                <div className="new-dish-preview-allergens">
                  {contains.length === 0 && mayContain.length === 0 ? (
                    <span>Sem alergênicos declarados</span>
                  ) : (
                    <>
                      {contains.length > 0 && <span>Contém: {contains.join(', ')}</span>}
                      {mayContain.length > 0 && <span>Pode conter: {mayContain.join(', ')}</span>}
                    </>
                  )}
                </div>
                <footer>
                  <span>{form.category || 'Categoria'}</span>
                  <span>Disponível</span>
                </footer>
              </div>
            </article>

            <div className="new-dish-feature-cards">
              <article>
                <a
                  className="new-dish-utensils-link"
                  href={`./utensilios.html?prato=${encodeURIComponent(form.name.trim() || 'Marmita de frango')}`}
                  onClick={saveDraftBeforeNavigation}
                >
                  <img className="new-dish-pan-icon" src={panIcon} alt="" />
                  <span>Utensílios dedicados</span>
                </a>
              </article>
              <article>
                <a
                  className="new-dish-utensils-link"
                  href={`./ingredientes-alergenicos.html?prato=${encodeURIComponent(form.name.trim() || 'Marmita de frango')}`}
                  onClick={saveDraftBeforeNavigation}
                >
                  <img src={verifiedCheckIcon} alt="" />
                  <span>Ingredientes e alergênicos</span>
                </a>
              </article>
              <article>
                <a
                  className="new-dish-utensils-link"
                  href={`./ficha-tecnica.html?prato=${encodeURIComponent(form.name.trim() || 'Marmita de frango')}`}
                  onClick={saveDraftBeforeNavigation}
                >
                  <img src={nutritionSheetIcon} alt="" />
                  <span>Ficha nutricional</span>
                </a>
              </article>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
