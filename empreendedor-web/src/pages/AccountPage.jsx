import React, { useRef, useState } from 'react';
import BrandLink from '../components/BrandLink.jsx';

export default function AccountPage() {
  const [method, setMethod] = useState('phone');
  const passwordConfirmRef = useRef(null);

  function submitAccount(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const password = form.elements.namedItem('password');
    const passwordConfirm = form.elements.namedItem('passwordConfirm');

    passwordConfirm.setCustomValidity(
      password.value === passwordConfirm.value
        ? ''
        : 'As senhas precisam ser iguais.',
    );

    if (!form.reportValidity()) return;
    window.location.href = './cadastro-estabelecimento.html';
  }

  return (
    <>
      <header className="site-header account-header">
        <BrandLink />
      </header>

      <main className="account-main">
        <form className="account-form" id="account-form" onSubmit={submitAccount}>
          <h1 className="account-title">Crie uma conta</h1>

          <div className="contact-methods" role="group" aria-label="Método de contato">
            <button
              className={`contact-method${method === 'phone' ? ' is-selected' : ''}`}
              type="button"
              aria-pressed={method === 'phone'}
              onClick={() => setMethod('phone')}
            >
              Usar número de telefone
            </button>
            <button
              className={`contact-method${method === 'email' ? ' is-selected' : ''}`}
              type="button"
              aria-pressed={method === 'email'}
              onClick={() => setMethod('email')}
            >
              Usar e-mail
            </button>
          </div>

          <div className="contact-field" id="phone-field" hidden={method !== 'phone'}>
            <label className="visually-hidden" htmlFor="account-phone">
              Número de telefone
            </label>
            <div className="phone-input">
              <select aria-label="Código do país" defaultValue="+55">
                <option value="+55">Brasil&nbsp;&nbsp; +55</option>
              </select>
              <input
                id="account-phone"
                name="phone"
                type="tel"
                placeholder="(11) 90000-0000"
                autoComplete="tel"
              />
            </div>
          </div>

          <div className="contact-field" id="email-field" hidden={method !== 'email'}>
            <label className="visually-hidden" htmlFor="account-email">
              E-mail
            </label>
            <input
              id="account-email"
              name="email"
              type="email"
              placeholder="email@gmail.com"
              autoComplete="email"
            />
          </div>

          <label className="visually-hidden" htmlFor="account-password">
            Senha
          </label>
          <input
            className="account-input"
            id="account-password"
            name="password"
            type="password"
            placeholder="Insira sua senha"
            minLength={8}
            maxLength={50}
            autoComplete="new-password"
            onInput={() => passwordConfirmRef.current?.setCustomValidity('')}
          />
          <ul className="password-hints">
            <li>A senha deve conter entre 8 e 50 caracteres.</li>
            <li>Use letras, números ou símbolos.</li>
          </ul>

          <label className="visually-hidden" htmlFor="account-password-confirm">
            Confirme sua senha
          </label>
          <input
            ref={passwordConfirmRef}
            className="account-input"
            id="account-password-confirm"
            name="passwordConfirm"
            type="password"
            placeholder="Insira sua senha novamente"
            autoComplete="new-password"
            onInput={() => passwordConfirmRef.current?.setCustomValidity('')}
          />

          <label className="visually-hidden" htmlFor="verification-code">
            Código de verificação
          </label>
          <input
            className="account-input"
            id="verification-code"
            name="verificationCode"
            type="text"
            placeholder="Código de verificação"
            autoComplete="one-time-code"
          />

          <label className="terms-checkbox">
            <input name="terms" type="checkbox" />
            <span>
              Aceito os <span className="terms-emphasis">Termos de Uso</span> e a{' '}
              <span className="terms-emphasis">Política de privacidade</span>.
            </span>
          </label>

          <button className="account-next" type="submit">
            Próximo
          </button>
          <p className="account-status" role="note">
            Protótipo: seus dados não serão enviados nem salvos.
          </p>
          <p className="account-login">
            Já tem uma conta? <span>Entrar aqui</span>
          </p>
        </form>

        <section className="account-promo" aria-label="Oullin para empreendedores">
          <h2>
            Expanda seus
            <br />
            negócios com a
            <br />
            Oullin
          </h2>
        </section>
      </main>

      <footer className="bottom-bars account-footer">
        <button className="continue-button" type="submit" form="account-form">
          Continuar
        </button>
      </footer>
    </>
  );
}
