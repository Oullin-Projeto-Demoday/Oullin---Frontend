import React, { useState } from 'react';
import BrandLink from '../components/BrandLink.jsx';

export default function PartnerProgramPage() {
  const [status, setStatus] = useState('');

  function continueToContract(event) {
    event.preventDefault();
    const selectedProgram = new FormData(event.currentTarget).get('deliveryProgram');

    if (!selectedProgram) {
      setStatus('Selecione um programa de parceria para continuar.');
      event.currentTarget
        .querySelector('input[name="deliveryProgram"]')
        .focus();
      return;
    }

    window.location.href = './resumo-contrato.html';
  }

  return (
    <>
      <header className="site-header business-header">
        <BrandLink />
      </header>

      <main className="partner-program-main">
        <form
          className="partner-program-form"
          id="partner-program-form"
          onChange={() => setStatus('')}
          onSubmit={continueToContract}
        >
          <h1 className="partner-program-title" id="partner-program-title">
            Selecione um programa de parceria
          </h1>

          <fieldset
            className="partner-plan-options"
            aria-labelledby="partner-program-title"
          >
            <legend className="visually-hidden">Programa de entrega</legend>

            <label className="partner-plan-card" htmlFor="oullin-delivery">
              <span className="partner-plan-heading">
                <span className="partner-plan-name">Entrega feita pelo Oullin</span>
                <span className="partner-recommendation">Recomendado</span>
                <input
                  id="oullin-delivery"
                  name="deliveryProgram"
                  type="radio"
                  value="oullin"
                  aria-describedby="partner-program-status"
                />
              </span>
              <ol className="partner-benefits">
                <li>Entrega rápida e segura.</li>
                <li>Acompanhamento do pedido.</li>
                <li>Entregadores parceiros.</li>
              </ol>
            </label>

            <label className="partner-plan-card" htmlFor="own-delivery">
              <span className="partner-plan-heading">
                <span className="partner-plan-name">Entrega própria</span>
                <input
                  id="own-delivery"
                  name="deliveryProgram"
                  type="radio"
                  value="own"
                  aria-describedby="partner-program-status"
                />
              </span>
              <ol className="partner-benefits">
                <li>Controle total das entregas.</li>
                <li>Entregadores da própria loja.</li>
                <li>Definição dos horários e das taxas de entrega.</li>
              </ol>
            </label>
          </fieldset>

          <p
            className="partner-program-status"
            id="partner-program-status"
            role="status"
            hidden={!status}
          >
            {status}
          </p>
        </form>
      </main>

      <footer className="account-footer partner-program-footer">
        <button
          className="continue-button"
          type="submit"
          form="partner-program-form"
        >
          Continuar
        </button>
      </footer>
    </>
  );
}
