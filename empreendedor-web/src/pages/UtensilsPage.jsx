import React, { useEffect, useState } from 'react';
import { Sidebar } from './DashboardPages.jsx';
import cuttingBoardImage from '../../assets/dedicated-cutting-board.png';
import fryingPanImage from '../../assets/dedicated-frying-pan.png';
import servingToolsImage from '../../assets/dedicated-serving-tools.png';
import uploadImageIcon from '../../assets/dedicated-utensil-upload.png';

const stages = [
  { value: 'raw', label: 'Frango cru' },
  { value: 'prep', label: 'Preparo' },
  { value: 'serve', label: 'Servir' },
];

const utensilImages = {
  board: cuttingBoardImage,
  pan: fryingPanImage,
  serving: servingToolsImage,
};

const initialUtensils = [
  {
    id: 'cutting-board',
    name: 'Tábua de corte',
    description: 'Usada para apoiar e cortar o frango cru.',
    stage: 'raw',
    exclusive: true,
    icon: 'board',
  },
  {
    id: 'kitchen-knife',
    name: 'Faca de cozinha',
    description: 'Usada para cortar e preparar o filé de frango.',
    stage: 'raw',
    exclusive: true,
    icon: 'knife',
  },
  {
    id: 'frying-pan',
    name: 'Frigideira',
    description: 'Usada para grelhar o frango.',
    stage: 'prep',
    exclusive: true,
    icon: 'pan',
  },
  {
    id: 'serving-tools',
    name: 'Pegador e espátula',
    description: 'Usados para virar e retirar o frango da frigideira.',
    stage: 'serve',
    exclusive: true,
    icon: 'serving',
  },
];

const initialCareSteps = [
  'Separar o frango cru dos outros ingredientes.',
  'Higienizar tábua, faca e superfícies após o uso.',
  'Usar utensílios limpos para retirar e servir o frango.',
];
const utensilsStorageKey = 'oullin-dedicated-utensils';

function readSavedUtensils(dishName) {
  try {
    const saved = sessionStorage.getItem(utensilsStorageKey);
    if (!saved) return null;

    const parsed = JSON.parse(saved);
    if (
      parsed?.dishName === dishName &&
      Array.isArray(parsed.utensils) &&
      Array.isArray(parsed.careSteps)
    ) {
      return parsed;
    }
    return null;
  } catch (error) {
    console.error('Não foi possível recuperar os utensílios salvos.', error);
    return null;
  }
}

function UtensilArtwork({ utensil, photo }) {
  if (photo) return <img className="utensil-art" src={photo} alt="" />;
  if (utensil.icon !== 'knife') {
    return <img className="utensil-art" src={utensilImages[utensil.icon]} alt="" />;
  }

  return (
    <div className="utensil-art utensil-knife-art" aria-hidden="true">
      <svg viewBox="0 0 363 104">
        <path d="M193 65 219 39c5-5 11-2 10 4l-6 15-18 17-11-10Z" />
        <path d="m193 65-10 10 8 8 14-8" />
      </svg>
    </div>
  );
}

function UtensilCard({ utensil, onEdit, onDelete }) {
  return (
    <article className="utensil-card">
      <UtensilArtwork utensil={utensil} photo={utensil.photo} />
      <div className="utensil-card-heading">
        <h3>{utensil.name}</h3>
        <span className={`utensil-stage-tag is-${utensil.stage}`}>
          {stages.find((stage) => stage.value === utensil.stage)?.label}
        </span>
      </div>
      <p>{utensil.description}</p>
      <div className="utensil-card-actions">
        <button type="button" onClick={() => onEdit(utensil)}>Editar</button>
        <button
          type="button"
          className="utensil-delete"
          aria-label={`Excluir ${utensil.name}`}
          onClick={() => onDelete(utensil.id)}
        >
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path d="M5 6h10M8 6V4h4v2m-6 0 .6 10h6.8L14 6m-5 3v4m2-4v4" />
          </svg>
        </button>
      </div>
    </article>
  );
}

export default function UtensilsPage() {
  const dishName = new URLSearchParams(window.location.search).get('prato') || 'Marmita de frango';
  const [savedUtensils] = useState(() => readSavedUtensils(dishName));
  const [utensils, setUtensils] = useState(() => savedUtensils?.utensils || initialUtensils);
  const [careSteps, setCareSteps] = useState(() => savedUtensils?.careSteps || initialCareSteps);
  const [form, setForm] = useState({
    name: '',
    description: '',
    stage: 'raw',
    exclusive: true,
    icon: 'board',
  });
  const [photo, setPhoto] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    try {
      sessionStorage.setItem(
        utensilsStorageKey,
        JSON.stringify({ dishName, utensils, careSteps }),
      );
    } catch (storageError) {
      setError('Não foi possível salvar automaticamente. Tente remover uma foto.');
      console.error('Falha ao salvar automaticamente os utensílios.', storageError);
    }
  }, [dishName, utensils, careSteps]);

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handlePhotoChange(event) {
    const file = event.target.files?.[0];
    setError('');
    if (!file) {
      setPhoto('');
      return;
    }

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setError('Escolha uma foto JPG ou PNG.');
      event.target.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('A foto deve ter no máximo 5 MB.');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') setPhoto(reader.result);
      else setError('Não foi possível carregar esta foto. Tente outro arquivo.');
    };
    reader.onerror = () => setError('Não foi possível carregar esta foto. Tente outro arquivo.');
    reader.readAsDataURL(file);
  }

  function resetForm() {
    setForm({ name: '', description: '', stage: 'raw', exclusive: true, icon: 'board' });
    setPhoto('');
    setEditingId(null);
  }

  function saveUtensil(event) {
    event.preventDefault();
    const utensil = {
      id: editingId || `utensil-${Date.now()}`,
      name: form.name.trim(),
      description: form.description.trim(),
      stage: form.stage,
      exclusive: form.exclusive,
      icon: form.icon,
      photo,
    };

    setUtensils((current) => (
      editingId
        ? current.map((item) => (item.id === editingId ? utensil : item))
        : [...current, utensil]
    ));
    setError('');
    resetForm();
  }

  function editUtensil(utensil) {
    setForm({
      name: utensil.name,
      description: utensil.description,
      stage: utensil.stage,
      exclusive: utensil.exclusive,
      icon: utensil.icon,
    });
    setPhoto(utensil.photo || '');
    setEditingId(utensil.id);
  }

  function addCareStep() {
    setCareSteps((current) => [...current, '']);
  }

  function updateCareStep(index, value) {
    setCareSteps((current) => current.map((step, stepIndex) => (
      stepIndex === index ? value : step
    )));
  }

  function saveAndContinue() {
    try {
      sessionStorage.setItem(
        utensilsStorageKey,
        JSON.stringify({ dishName, utensils, careSteps }),
      );
      window.location.assign(`./ingredientes-alergenicos.html?prato=${encodeURIComponent(dishName)}`);
    } catch (storageError) {
      setError('Não foi possível salvar os utensílios neste navegador. Tente remover uma foto.');
      console.error('Falha ao salvar utensílios dedicados.', storageError);
    }
  }

  return (
    <div className="merchant-site utensil-site">
      <Sidebar page="menu" />
      <main className="main utensil-page">
        <header className="utensil-page-header">
          <div>
            <p className="utensil-breadcrumb">
              <a href="./cardapio.html">Cardápio</a><span>›</span>{dishName}
            </p>
            <h1>Utensílios dedicados</h1>
            <p className="utensil-intro">
              Mostre ao cliente quais utensílios você usa só para {dishName.toLowerCase()}.
              Isso aparece no app na tela “Utensílios para {dishName.toLowerCase()}”.
            </p>
          </div>
          <button
            type="button"
            className="utensil-preview-button"
            onClick={() => setPreviewOpen(true)}
          >
            Pré-visualizar no app
          </button>
        </header>

        <ol className="utensil-stepper" aria-label="Etapas do cadastro do prato">
          <li className="is-current"><span>1</span><strong>Utensílios</strong></li>
          <li>
            <a href={`./ingredientes-alergenicos.html?prato=${encodeURIComponent(dishName)}`}>
              <span>2</span>Ingredientes e alergênicos
            </a>
          </li>
          <li>
            <a href={`./ficha-tecnica.html?prato=${encodeURIComponent(dishName)}`}>
              <span>3</span>Ficha técnica
            </a>
          </li>
          <li><span>4</span>Tabela TBCA</li>
        </ol>

        <div className="utensil-workspace">
          <section className="utensil-list-column" aria-label="Utensílios cadastrados">
            <div className="utensil-card-grid">
              {utensils.map((utensil) => (
                <UtensilCard
                  key={utensil.id}
                  utensil={utensil}
                  onEdit={editUtensil}
                  onDelete={(id) => setUtensils((current) => current.filter((item) => item.id !== id))}
                />
              ))}
            </div>

            <section className="utensil-care-panel" aria-labelledby="utensil-care-title">
              <header>
                <h2 id="utensil-care-title">Cuidados durante o preparo</h2>
                <button type="button" onClick={addCareStep}>+ Adicionar cuidado</button>
              </header>
              <ol>
                {careSteps.map((step, index) => (
                  <li key={`care-${index}`}>
                    <span>{index + 1}</span>
                    <input
                      aria-label={`Cuidado ${index + 1}`}
                      value={step}
                      onChange={(event) => updateCareStep(index, event.target.value)}
                    />
                  </li>
                ))}
              </ol>
            </section>
          </section>

          <form className="utensil-form" onSubmit={saveUtensil}>
            <h2>{editingId ? 'Editar utensílio' : 'Novo utensílio'}</h2>
            <label className="utensil-upload">
              <input
                type="file"
                accept="image/jpeg,image/png,.jpg,.jpeg,.png"
                onChange={handlePhotoChange}
              />
              {photo ? (
                <img className="utensil-upload-preview" src={photo} alt="Prévia do utensílio" />
              ) : (
                <>
                  <img src={uploadImageIcon} alt="" />
                  <strong>Enviar foto do utensílio</strong>
                  <span>JPG ou PNG, até 5 MB</span>
                </>
              )}
            </label>

            <label className="utensil-form-field">
              <span>Nome do utensílio</span>
              <input
                required
                value={form.name}
                onChange={(event) => updateForm('name', event.target.value)}
                placeholder="Ex.: Tábua de corte"
              />
            </label>

            <label className="utensil-form-field">
              <span>Para que é usado</span>
              <textarea
                required
                rows={2}
                value={form.description}
                onChange={(event) => updateForm('description', event.target.value)}
                placeholder="Ex.: Usada para apoiar e cortar o frango cru."
              />
            </label>

            <fieldset className="utensil-stage-picker">
              <legend>Etapa em que é usado</legend>
              <div>
                {stages.map((stage) => (
                  <button
                    key={stage.value}
                    type="button"
                    className={form.stage === stage.value ? 'is-selected' : undefined}
                    aria-pressed={form.stage === stage.value}
                    onClick={() => updateForm('stage', stage.value)}
                  >
                    {stage.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <label className="utensil-exclusive">
              <input
                type="checkbox"
                checked={form.exclusive}
                onChange={(event) => updateForm('exclusive', event.target.checked)}
              />
              <span>Uso exclusivo para {dishName.toLowerCase()} (não é compartilhado com outros alimentos)</span>
            </label>

            {error && <p className="utensil-error" role="alert">{error}</p>}

            <div className="utensil-form-actions">
              {editingId && (
                <button type="button" className="utensil-cancel-button" onClick={resetForm}>
                  Cancelar
                </button>
              )}
              <button type="submit">{editingId ? 'Salvar alterações' : 'Salvar utensílio'}</button>
            </div>
          </form>
        </div>

        <footer className="utensil-page-footer">
          <span>{utensils.length} utensílios cadastrados · salvo automaticamente</span>
          <button type="button" onClick={saveAndContinue}>Salvar e continuar</button>
        </footer>
      </main>

      {previewOpen && (
        <div className="utensil-preview-backdrop" role="presentation" onClick={() => setPreviewOpen(false)}>
          <section
            className="utensil-preview-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="utensil-preview-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" aria-label="Fechar prévia" onClick={() => setPreviewOpen(false)}>×</button>
            <h2 id="utensil-preview-title">Utensílios para {dishName}</h2>
            <p>Estes são os utensílios dedicados que o cliente verá no aplicativo.</p>
            <ul>
              {utensils.map((utensil) => <li key={utensil.id}>{utensil.name} · {utensil.description}</li>)}
            </ul>
            <p>{careSteps.filter(Boolean).length} cuidados durante o preparo</p>
          </section>
        </div>
      )}
    </div>
  );
}
