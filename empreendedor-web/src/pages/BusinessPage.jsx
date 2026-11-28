import React from 'react';
import BrandLink from '../components/BrandLink.jsx';
import useBusinessAddress from '../hooks/useBusinessAddress.js';

export default function BusinessPage() {
  const {
    fields,
    cepStatus,
    mapStatus,
    mapPlaceholder,
    mapUrl,
    mapLink,
    isLookingUpCep,
    isSearchingMap,
    updateField,
    lookupAddressByCep,
    searchMap,
  } = useBusinessAddress();

  function continueToDetails(event) {
    event.preventDefault();
    window.location.href = './cadastro-mais-informacoes.html';
  }

  function field(name, label, props = {}) {
    const id =
      name === 'businessName'
        ? 'business-name'
        : name === 'streetNumber'
          ? 'business-number'
          : `business-${name}`;
    return (
      <label className="business-field" htmlFor={id}>
        {label}
        <input
          className="business-input"
          id={id}
          name={name}
          value={fields[name]}
          onChange={(event) => updateField(name, event.target.value)}
          {...props}
        />
      </label>
    );
  }

  return (
    <>
      <header className="site-header account-header business-header">
        <BrandLink />
      </header>

      <main className="business-main">
        <form className="business-form" id="business-form" onSubmit={continueToDetails}>
          <h1 className="business-title">
            Preencha as informações do seu estabelecimento
          </h1>
          <p className="business-intro">
            Preencha as informações a seguir para gerar a página do seu
            estabelecimento virtual
          </p>
          <p className="business-prototype-note">
            Protótipo: os dados preenchidos não serão enviados nem salvos.
          </p>

          <div className="business-primary-fields">
            {field('businessName', 'Nome do estabelecimento:', {
              autoComplete: 'organization',
            })}

            <div className="business-field business-cep-field">
              <label htmlFor="business-cep">CEP:</label>
              <div className="business-cep-control">
                <input
                  className="business-input"
                  id="business-cep"
                  name="postalCode"
                  value={fields.postalCode}
                  onChange={(event) =>
                    updateField('postalCode', event.target.value)
                  }
                  onBlur={(event) =>
                    void lookupAddressByCep(event.target.value)
                  }
                  type="text"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  placeholder="00000-000"
                  pattern="[0-9]{5}-?[0-9]{3}"
                  maxLength={9}
                />
                <button
                  className="cep-lookup-button"
                  id="cep-lookup"
                  type="button"
                  disabled={isLookingUpCep}
                  onClick={() =>
                    void lookupAddressByCep(fields.postalCode, true)
                  }
                >
                  {isLookingUpCep ? 'Buscando...' : 'Buscar CEP'}
                </button>
              </div>
              <p className="cep-status" id="cep-status" role="status" hidden={!cepStatus}>
                {cepStatus}
              </p>
              <p className="cep-lookup-note">
                Ao informar um CEP válido, a ViaCEP preencherá os campos de
                endereço.
              </p>
            </div>
          </div>

          <div className="business-address-grid">
            {field('state', 'Estado:', {
              autoComplete: 'address-level1',
              placeholder: 'SP',
              maxLength: 40,
            })}
            {field('city', 'Cidade:', { autoComplete: 'address-level2' })}
            {field('neighborhood', 'Bairro:', {
              autoComplete: 'address-level3',
            })}
            {field('street', 'Rua:', { autoComplete: 'address-line1' })}
            {field('streetNumber', 'Número:', { inputMode: 'numeric' })}
            {field('complement', 'Complemento', {
              autoComplete: 'address-line2',
            })}
          </div>

          <section className="business-location" aria-labelledby="location-title">
            <h2 id="location-title">Localização do estabelecimento</h2>
            <p>Confira no mapa se o endereço informado está correto.</p>
            <button
              className="map-search-button"
              id="map-search"
              type="button"
              disabled={isSearchingMap}
              onClick={() => void searchMap()}
            >
              {isSearchingMap
                ? 'Buscando localização...'
                : 'Mostrar localização no mapa'}
            </button>
            <p className="map-privacy-note">
              Ao buscar, o endereço será consultado pela Geoapify.{' '}
              <a
                href="https://www.geoapify.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Powered by Geoapify
              </a>{' '}
              · Mapa ©{' '}
              <a
                href="https://www.openstreetmap.org/copyright"
                target="_blank"
                rel="noopener noreferrer"
              >
                OpenStreetMap contributors
              </a>
              .
            </p>
            <p className="map-status" id="map-status" role="status" hidden={!mapStatus}>
              {mapStatus}
            </p>
            <div className="business-map">
              {mapUrl ? (
                <iframe
                  className="business-map-frame"
                  id="business-map"
                  title="Mapa do endereço do estabelecimento"
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  src={mapUrl}
                />
              ) : (
                <div
                  className="map-placeholder"
                  id="map-placeholder"
                  hidden={!mapPlaceholder}
                >
                  {mapPlaceholder}
                </div>
              )}
            </div>
            {mapLink && (
              <a
                className="map-link"
                id="map-link"
                href={mapLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Abrir no OpenStreetMap
              </a>
            )}
          </section>
        </form>
      </main>

      <footer className="bottom-bars account-footer">
        <button className="continue-button" type="submit" form="business-form">
          Continuar
        </button>
      </footer>
    </>
  );
}
