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

## Publicar no GitHub Pages

O projeto pode ser publicado no navegador pelo GitHub Pages. A publicação foi
configurada em `.github/workflows/pages.yml` e ocorre automaticamente a cada
push na branch `main`.

Após a primeira publicação, ative **GitHub Pages** em:
`Settings > Pages > Source > GitHub Actions`.

O endereço público será:

```text
https://oullin-projeto-demoday.github.io/Oullin---Frontend/
```

## Project structure

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
