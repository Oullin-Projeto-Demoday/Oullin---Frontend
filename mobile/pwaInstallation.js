const DISMISSED_KEY = 'oullin:pwa-install-dismissed';

let deferredInstallPrompt = null;

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
  });
}

export function isPwaInstalled() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;

  return Boolean(
    navigator.standalone ||
    window.matchMedia?.('(display-mode: standalone)').matches ||
    window.matchMedia?.('(display-mode: fullscreen)').matches,
  );
}

export function shouldOfferPwaInstall() {
  if (isPwaInstalled()) return false;

  try {
    return window.localStorage.getItem(DISMISSED_KEY) !== 'true';
  } catch (error) {
    console.error('Não foi possível verificar a preferência de instalação do Oullin.', error);
    return true;
  }
}

export function dismissPwaInstall() {
  try {
    window.localStorage.setItem(DISMISSED_KEY, 'true');
  } catch (error) {
    console.error('Não foi possível salvar a preferência de instalação do Oullin.', error);
  }
}

export async function promptPwaInstall() {
  if (!deferredInstallPrompt) return 'unavailable';

  const installPrompt = deferredInstallPrompt;
  deferredInstallPrompt = null;
  await installPrompt.prompt();
  const choice = await installPrompt.userChoice;

  return choice.outcome;
}

export function isIosBrowser() {
  if (typeof navigator === 'undefined') return false;

  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}
