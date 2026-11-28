import React from 'react';
import BrandLink from '../components/BrandLink.jsx';

export default function BusinessDetailsPage() {
  function continueToProgram(event) {
    event.preventDefault();
    window.location.href = './programa-parceria.html';
  }

  return (
    <>
      <header className="site-header account-header business-header">
        <BrandLink />
      </header>

      <main className="business-main">
        <form
          className="business-form business-details-form"
          id="additional-business-form"
          onSubmit={continueToProgram}
        >
          <h1 className="business-title">
            Preencha mais informações
            <br />
            sobre seu estabelecimento
          </h1>
          <p className="business-intro">
            Preencha as informações a seguir para gerar a página do seu estabelecimento virtual
          </p>

          <div className="business-details-fields">
            <label className="business-field" htmlFor="business-cnpj">
              CNPJ:
              <input
                className="business-input"
                id="business-cnpj"
                name="cnpj"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                placeholder="00.000.000/0000-00"
                maxLength={18}
              />
            </label>

            <label className="business-field" htmlFor="business-legal-name">
              Razão social
              <input
                className="business-input"
                id="business-legal-name"
                name="legalName"
                type="text"
                autoComplete="organization"
              />
            </label>

            <label
              className="business-field business-category-field"
              htmlFor="business-category"
            >
              Categoria principal
              <input
                className="business-input"
                id="business-category"
                name="category"
                type="text"
                placeholder="Categoria principal"
              />
            </label>
          </div>

        </form>
      </main>

      <footer className="bottom-bars account-footer">
        <button
          className="continue-button"
          type="submit"
          form="additional-business-form"
        >
          Continuar
        </button>
      </footer>
    </>
  );
}
