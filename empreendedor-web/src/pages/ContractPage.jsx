import React, { useState } from 'react';
import BrandLink from '../components/BrandLink.jsx';

export default function ContractPage() {
  const [status, setStatus] = useState('');

  function continueToDashboard(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const uncheckedAcknowledgement = form.querySelector(
      'input[name="acknowledgements"]:required:not(:checked)',
    );

    if (uncheckedAcknowledgement) {
      setStatus('Leia o resumo e marque as duas confirmações para continuar.');
      uncheckedAcknowledgement.focus();
      return;
    }

    window.location.href = './painel/index.html';
  }

  return (
    <>
      <header className="site-header business-header">
        <BrandLink />
      </header>

      <main className="contract-main">
        <form
          className="contract-form"
          id="contract-summary-form"
          noValidate
          onChange={() => setStatus('')}
          onSubmit={continueToDashboard}
        >
          <h1 className="contract-title">Resumo do contrato</h1>

          <article
            className="contract-document"
            aria-label="Resumo das condições da parceria"
            tabIndex="0"
          >
            <p className="contract-draft-note">
              <strong>Resumo demonstrativo.</strong> O contrato definitivo e suas
              responsabilidades precisam de revisão jurídica e sanitária antes
              de serem usados.
            </p>

            <section className="contract-section">
              <h2>1. Papel da Oullin e vistorias nutricionais</h2>
              <ul>
                <li>
                  <strong>Plataforma digital:</strong> a Oullin atua como
                  intermediadora tecnológica, conectando consumidores com
                  restrições alimentares a microempreendedores parceiros, sem
                  produzir, manipular ou armazenar alimentos.
                </li>
                <li>
                  <strong>Vistorias com nutricionistas parceiros:</strong> a
                  Oullin pode promover visitas técnicas iniciais e periódicas
                  para observar a estrutura do estabelecimento e orientar sobre
                  protocolos de prevenção à contaminação cruzada.
                </li>
                <li>
                  <strong>Caráter orientativo:</strong> as visitas são
                  educativas e preventivas. Não substituem a fiscalização
                  oficial, o licenciamento obrigatório nem as orientações da
                  Vigilância Sanitária competente.
                </li>
              </ul>
            </section>

            <section className="contract-section">
              <h2>2. Responsabilidades do estabelecimento</h2>
              <ul>
                <li>
                  <strong>A vistoria retrata o momento:</strong> a avaliação
                  registra as condições observadas no dia da visita. A
                  manutenção diária dos protocolos durante o preparo de cada
                  pedido cabe ao estabelecimento.
                </li>
                <li>
                  <strong>Alergênicos e contaminação cruzada:</strong> o
                  estabelecimento deve informar os riscos dos alimentos,
                  prevenir a contaminação cruzada e manter utensílios,
                  superfícies e equipamentos higienizados, observada a
                  legislação aplicável.
                </li>
                <li>
                  <strong>Ingredientes e cardápio:</strong> a avaliação cobre
                  somente os produtos e preparações observados. Mudanças de
                  marcas, ingredientes ou receitas — inclusive itens que possam
                  conter traços de alergênicos — devem ser comunicadas e
                  atualizadas na plataforma antes de serem oferecidas.
                </li>
                <li>
                  <strong>Plano de adequação:</strong> o estabelecimento deve
                  manter as medidas acordadas e cumprir as normas sanitárias
                  aplicáveis, incluindo, quando pertinente, as RDCs ANVISA
                  216/2004 e 26/2015. Consequências de descumprimento,
                  suspensão ou eventual ressarcimento precisam ser definidas no
                  contrato revisado, conforme a lei.
                </li>
              </ul>
            </section>
          </article>

          <div className="contract-acknowledgements">
            <label
              className="contract-acknowledgement"
              htmlFor="acknowledge-inspection"
            >
              <input
                id="acknowledge-inspection"
                name="acknowledgements"
                type="checkbox"
                value="inspection"
                required
                aria-describedby="contract-summary-status"
              />
              <span>
                Estou ciente de que as vistorias dos nutricionistas parceiros da
                Oullin são orientativas e não substituem a fiscalização ou o
                licenciamento da Vigilância Sanitária.
              </span>
            </label>

            <label
              className="contract-acknowledgement"
              htmlFor="acknowledge-responsibility"
            >
              <input
                id="acknowledge-responsibility"
                name="acknowledgements"
                type="checkbox"
                value="responsibility"
                required
                aria-describedby="contract-summary-status"
              />
              <span>
                Declaro que a operação diária, o controle de alergênicos, a
                atualização dos ingredientes e o cumprimento das normas
                sanitárias são responsabilidades do estabelecimento, conforme
                a lei.
              </span>
            </label>
          </div>

          <p
            className="contract-summary-status"
            id="contract-summary-status"
            role="status"
            hidden={!status}
          >
            {status}
          </p>
        </form>
      </main>

      <footer className="account-footer contract-footer">
        <button
          className="continue-button"
          type="submit"
          form="contract-summary-form"
        >
          Continuar
        </button>
      </footer>
    </>
  );
}
