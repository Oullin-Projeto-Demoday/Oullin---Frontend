# Oullin

Oullin is a React Native application built with Expo. The app and its complete
source, assets, dependencies, and Expo configuration are kept in `mobile/`.

## Requirements

- Node.js compatible with the Expo SDK configured in `mobile/package.json`
- npm

## Install and run

```bash
cd mobile
npm ci
npm start
```

From Expo's development menu, open the app on Android or iOS. To run the web
version in a browser:

```bash
npx expo start --web
```

To create a static web export:

```bash
npm run export:web
```

## Portal do empreendedor

O portal em `empreendedor-web/` usa React e Vite. Os endereços das telas,
incluindo os caminhos `.html` e o painel em `/painel/`, foram mantidos. A
navegação é resolvida pelo React; os arquivos de rota são gerados em `dist/`
durante o build, então só a entrada principal `index.html` fica na origem.

```bash
cd empreendedor-web
npm ci
npm run dev
```

Para gerar os arquivos estáticos de produção:

```bash
npm run build
```

## Publicar no GitHub Pages

O app mobile e o portal React/Vite podem ser publicados no GitHub Pages. O
workflow `.github/workflows/pages.yml` gera os dois builds e publica o site
automaticamente a cada push na branch `main`.

Após a primeira publicação, ative **GitHub Pages** em:
`Settings > Pages > Source > GitHub Actions`.

O endereço público será:

```text
https://oullin-projeto-demoday.github.io/Oullin---Frontend/
```

A página inicial apresenta o portal do empreendedor. O app de clientes fica
disponível em `/cliente/`.

O fluxo do empreendedor inclui a criação da conta, o endereço e os dados
complementares do estabelecimento, a escolha do programa de entrega e a leitura
do resumo demonstrativo do contrato. Após marcar as confirmações e selecionar
**Continuar**, a demonstração abre o painel de Início, Avaliações e Pedidos.
O Cardápio também permite buscar, filtrar, pausar e cadastrar itens em memória.
Essas telas usam dados demonstrativos, sem integração com backend nem persistência.
Ao informar um CEP válido, a ViaCEP preenche os campos de endereço; quando a
pessoa solicita a localização, a Geoapify pesquisa o endereço completo e o mapa é exibido pelo
OpenStreetMap. A busca depende dos
dados disponíveis para cada endereço; se o número da casa não for confirmado,
a tela avisa que o marcador pode ser aproximado. Os campos são opcionais e
este protótipo não salva nem envia o formulário.

Para habilitar a busca no site publicado:

1. Crie uma chave da Geocoding API na [Geoapify](https://myprojects.geoapify.com/).
2. Restrinja a chave ao domínio do GitHub Pages e à Geocoding API no painel da
   Geoapify.
3. No repositório, abra **Settings > Secrets and variables > Actions** e crie
   o secret `GEOAPIFY_API_KEY` com essa chave.
4. Execute novamente o workflow **Deploy Oullin web to GitHub Pages**.

O workflow injeta a chave no site publicado sem gravá-la nos arquivos do
repositório. Como a chamada da API é feita pelo navegador, a chave ficará
visível para visitantes; as restrições de domínio e de API são importantes.
Consulte os [limites e preços da Geoapify](https://www.geoapify.com/pricing/).

Para testar localmente sem publicar, adicione a chave em
`empreendedor-web/geoapify-config.js`:

```js
window.OULLIN_GEOAPIFY_API_KEY = 'SUA_CHAVE';
```

Esse arquivo é ignorado pelo Git para evitar que a chave seja enviada no
commit. No painel da Geoapify, permita temporariamente o referer e a origem
`http://127.0.0.1:5173` (ou `http://localhost:5173`); ajuste também a origem
CORS para esse endereço durante o teste. Inicie o portal com `npm run dev`
dentro de `empreendedor-web`. Antes de publicar, restaure as restrições do
domínio do GitHub Pages.

O app mobile usa a Geocoding API da Geoapify para buscar e confirmar endereços;
os mapas continuam sendo exibidos pelo provedor nativo/web existente. Para
configurar o Expo local, copie `mobile/.env.example` para
`mobile/.env.local` e preencha a chave mobile:

```text
EXPO_PUBLIC_GEOAPIFY_MOBILE_API_KEY=SUA_CHAVE_MOBILE
EXPO_PUBLIC_GEOAPIFY_WEB_API_KEY=SUA_CHAVE_WEB
```

Para testar somente no Android/iOS, basta preencher a chave mobile. Preencha a
chave web se também for testar o app no navegador e permita a origem local do
Expo (`http://localhost:8081` e, se usar, `http://127.0.0.1:8081`) nas
restrições dessa chave. O arquivo `mobile/.env.local` é ignorado pelo Git.
Reinicie o Expo depois de preencher as chaves.

Para a versão web publicada, o workflow usa o secret `GEOAPIFY_API_KEY`. Não
reutilize essa chave web no app nativo: a chave mobile não pode depender de
restrições de referer/origem do navegador. Ela fica embutida no app e pode ser
extraída; use essa abordagem apenas no protótipo e acompanhe o limite de uso.
Para builds EAS, configure `EXPO_PUBLIC_GEOAPIFY_MOBILE_API_KEY` no ambiente EAS
sem gravá-la no repositório.

## Project structure

- `empreendedor-web/` contains the React/Vite entrepreneur portal, its
  registration flow, and Geoapify address search with an OpenStreetMap preview.
- `empreendedor-web/painel/` contains the React dashboard for Início, Avaliações,
  Pedidos, and Cardápio. Its sample data are not connected to a backend.
- `mobile/App.js` is the application entry point and manages navigation.
- `mobile/HomeScreens.js`, `mobile/SearchScreen.js`, `mobile/CartScreen.js`,
  `mobile/ProfileScreen.js`, `mobile/AddressScreen.js`, and
  `mobile/OnboardingScreen.js` contain the app screens.
- `mobile/AddressMap.web.js` and `mobile/AddressMap.native.js` provide
  platform-specific address map behavior.
- `mobile/assets/` contains the images used by the application.
- `mobile/app.json` and `mobile/eas.json` contain Expo and EAS configuration.

The repository root contains this README and Git metadata; the Expo project is
maintained from `mobile/`.
