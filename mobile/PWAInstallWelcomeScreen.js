import React, { useEffect, useState } from 'react';
import {
  Image,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  isIosBrowser,
  isPwaInstalled,
  promptPwaInstall,
} from './pwaInstallation';

const COLORS = {
  blue: '#174D76',
  orange: '#F9A619',
  text: '#222222',
  muted: '#666666',
  background: '#FFFDF9',
  white: '#FFFFFF',
};

const LOGO = require('./assets/oullin-logo-cropped.png');

export default function PWAInstallWelcomeScreen({ firstName, onContinue }) {
  const [notice, setNotice] = useState('');
  const showIosInstructions = Platform.OS === 'web' && isIosBrowser();

  useEffect(() => {
    if (Platform.OS !== 'web' || !isPwaInstalled()) return undefined;

    onContinue();
    return undefined;
  }, [onContinue]);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return undefined;

    const handleAppInstalled = () => onContinue();
    window.addEventListener('appinstalled', handleAppInstalled);
    return () => window.removeEventListener('appinstalled', handleAppInstalled);
  }, [onContinue]);

  async function installApp() {
    setNotice('');
    try {
      const outcome = await promptPwaInstall();
      if (outcome === 'accepted') {
        onContinue();
      } else if (outcome === 'unavailable') {
        setNotice(showIosInstructions
          ? 'No Safari, toque em Compartilhar e escolha “Adicionar à Tela de Início”.'
          : 'Abra o menu do navegador e escolha “Instalar app” ou “Adicionar à tela inicial”.');
      }
    } catch (error) {
      console.error('Não foi possível iniciar a instalação do Oullin.', error);
      setNotice('Não foi possível abrir a instalação agora. Você pode continuar usando o Oullin normalmente.');
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.content}>
        <Image accessibilityLabel="Logo Oullin" resizeMode="contain" source={LOGO} style={styles.logo} />
        <Text style={styles.title}>
          {firstName ? `Bem-vindo(a), ${firstName}!` : 'Bem-vindo(a) ao Oullin!'}
        </Text>
        <Text style={styles.description}>
          Instale o Oullin na tela inicial do seu celular para encontrá-lo rapidinho.
        </Text>

        {showIosInstructions && (
          <View accessibilityLabel="Instruções para instalar no iPhone" style={styles.instructions}>
            <Text style={styles.instructionsTitle}>No iPhone ou iPad</Text>
            <View style={styles.instructionRow}>
              <Text style={styles.shareIcon} accessibilityLabel="Compartilhar">↑</Text>
              <Text style={styles.instructionText}>
                No Safari, toque em Compartilhar e depois em “Adicionar à Tela de Início”.
              </Text>
            </View>
          </View>
        )}

        <Pressable
          accessibilityRole="button"
          onPress={installApp}
          style={({ pressed }) => [styles.installButton, pressed && styles.pressed]}
        >
          <Text style={styles.downloadIcon} accessibilityElementsHidden importantForAccessibility="no">
            ↓
          </Text>
          <Text style={styles.installButtonText}>Instalar OULLIN</Text>
        </Pressable>

        {!!notice && (
          <Text accessibilityRole="alert" style={styles.notice}>
            {notice}
          </Text>
        )}

        <Pressable accessibilityRole="button" onPress={onContinue} style={styles.skipButton}>
          <Text style={styles.skipText}>Agora não</Text>
        </Pressable>
        <Text style={styles.optionalText}>A instalação é opcional. Você pode continuar usando o aplicativo.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: COLORS.background,
    flex: 1,
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  logo: {
    height: 74,
    marginBottom: 32,
    width: 220,
  },
  title: {
    color: COLORS.blue,
    fontSize: 25,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    color: COLORS.text,
    fontSize: 16,
    lineHeight: 23,
    marginBottom: 24,
    maxWidth: 360,
    textAlign: 'center',
  },
  instructions: {
    alignSelf: 'stretch',
    backgroundColor: COLORS.white,
    borderColor: '#F2D99C',
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
    padding: 16,
  },
  instructionsTitle: {
    color: COLORS.blue,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 10,
  },
  instructionRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  shareIcon: {
    color: COLORS.blue,
    fontSize: 30,
    fontWeight: '700',
    marginRight: 12,
  },
  instructionText: {
    color: COLORS.text,
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
  },
  installButton: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: COLORS.orange,
    borderRadius: 12,
    flexDirection: 'row',
    height: 54,
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
  downloadIcon: {
    color: COLORS.white,
    fontSize: 23,
    fontWeight: '700',
    marginRight: 10,
  },
  installButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  notice: {
    color: COLORS.blue,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 12,
    textAlign: 'center',
  },
  skipButton: {
    alignItems: 'center',
    height: 48,
    justifyContent: 'center',
    marginTop: 8,
    minWidth: 120,
  },
  skipText: {
    color: COLORS.blue,
    fontSize: 15,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  optionalText: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
    maxWidth: 320,
    textAlign: 'center',
  },
});
