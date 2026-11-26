import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import BottomNavigation from './BottomNavigation';

const ORANGE = '#FF8500';
const BLUE = '#124F8C';
const QR_SIZE = 27;
const PAYMENT_WINDOW_MS = 15 * 60 * 1000;

function inFinder(row, column, top, left) {
  const y = row - top;
  const x = column - left;
  if (x < 0 || x > 6 || y < 0 || y > 6) return null;
  return x === 0 || x === 6 || y === 0 || y === 6 || (x >= 2 && x <= 4 && y >= 2 && y <= 4);
}

function QRCodePlaceholder() {
  const modules = [];
  for (let row = 0; row < QR_SIZE; row += 1) {
    for (let column = 0; column < QR_SIZE; column += 1) {
      const finder = inFinder(row, column, 0, 0)
        ?? inFinder(row, column, 0, QR_SIZE - 7)
        ?? inFinder(row, column, QR_SIZE - 7, 0);
      const dark = finder ?? (((row * 13 + column * 7 + row * column * 3) % 11) < 5);
      modules.push(<View key={`${row}-${column}`} style={[styles.qrModule, dark && styles.qrDark]} />);
    }
  }
  return <View accessibilityLabel="Ilustração de código QR Pix" style={styles.qrCode}>{modules}</View>;
}

export default function PixScreen({
  onBack,
  onContinue,
  onSelectTab,
  onCopyPix,
  onSharePix,
  bottomInset = 0,
}) {
  const progress = useRef(new Animated.Value(1)).current;
  const hourglassRotation = useRef(new Animated.Value(0)).current;
  const [expired, setExpired] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: 0,
      duration: PAYMENT_WINDOW_MS,
      useNativeDriver: false,
    });
    animation.start(({ finished }) => {
      if (finished) setExpired(true);
    });
    return () => animation.stop();
  }, [progress]);

  useEffect(() => {
    const spin = Animated.loop(Animated.timing(hourglassRotation, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }));
    spin.start();
    return () => spin.stop();
  }, [hourglassRotation]);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={ORANGE} barStyle="light-content" />
      <View style={styles.header}>
        <Pressable accessibilityLabel="Voltar" accessibilityRole="button" onPress={onBack} style={styles.backButton}>
          <Text style={styles.backArrow}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Pix</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        <View style={styles.statusLine}>
          <Text style={styles.statusText}>{expired ? 'Tempo para pagamento expirado' : 'Aguardando Pagamento'}</Text>
          <Animated.View style={{ transform: [{ rotate: hourglassRotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }] }}>
            <Text style={styles.hourglass}>⌛</Text>
          </Animated.View>
        </View>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
        </View>
        <Text style={styles.instruction}>Pagar com Pix é rápido e seguro! É só seguir estes passos</Text>

        <View style={styles.qrWrap}><QRCodePlaceholder /></View>
        <Text style={styles.demoNote}>QR Code ilustrativo. Nenhum pagamento será processado.</Text>

        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              if (onCopyPix) {
                onCopyPix();
              } else {
                setFeedbackMessage('A cobrança Pix ainda não foi integrada; não há código válido para copiar.');
              }
            }}
            style={styles.actionButton}
          >
            <Text style={styles.actionText}>Copiar pix</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              if (onSharePix) {
                onSharePix();
              } else {
                setFeedbackMessage('A cobrança Pix ainda não foi integrada; não há dados de pagamento para compartilhar.');
              }
            }}
            style={styles.actionButton}
          >
            <Text style={styles.shareIcon}>⌯</Text>
            <Text style={styles.actionText}>Compartilhar</Text>
          </Pressable>
        </View>
        {!!feedbackMessage && (
          <Text accessibilityRole="alert" style={styles.feedbackMessage}>
            {feedbackMessage}
          </Text>
        )}
        <Text style={styles.confirmationNote}>A tela Pix está em modo demonstrativo.</Text>
      </View>
      <View style={styles.continueFooter}>
        <Pressable
          accessibilityRole="button"
          onPress={onContinue}
          style={({ pressed }) => [styles.continueButton, pressed && styles.continueButtonPressed]}
        >
          <Text style={styles.continueButtonText}>Continuar</Text>
          <Text style={styles.continueArrow}>›</Text>
        </Pressable>
      </View>
      <BottomNavigation activeTab="Pedidos" bottomInset={bottomInset} onSelectTab={onSelectTab} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { height: 68, alignItems: 'center', flexDirection: 'row', backgroundColor: ORANGE, borderBottomLeftRadius: 12, borderBottomRightRadius: 12 },
  backButton: { width: 56, height: '100%', justifyContent: 'center', paddingLeft: 19 },
  backArrow: { color: '#FFFFFF', fontSize: 37, lineHeight: 40, fontWeight: '300' },
  headerTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', flex: 1, textAlign: 'center' },
  headerSpacer: { width: 56 },
  content: { flex: 1, paddingHorizontal: 25, paddingTop: 29 },
  statusLine: { flexDirection: 'row', alignItems: 'center', marginLeft: 1 },
  statusText: { color: '#111111', fontSize: 10, fontWeight: '700' },
  hourglass: { fontSize: 10, marginLeft: 4 },
  progressTrack: { height: 5, borderRadius: 4, backgroundColor: '#FFDCE1', marginTop: 8 },
  progressFill: { height: 5, borderRadius: 4, backgroundColor: '#F23344' },
  instruction: { color: '#111111', fontSize: 8, lineHeight: 10, marginTop: 7, width: 200 },
  qrWrap: { alignItems: 'center', marginTop: 22 },
  qrCode: { width: 140, height: 140, flexDirection: 'row', flexWrap: 'wrap', alignContent: 'flex-start', backgroundColor: '#FFFFFF' },
  qrModule: { width: 5.18, height: 5.18 },
  qrDark: { backgroundColor: '#050505', borderRadius: 1 },
  demoNote: { color: '#A64B00', fontSize: 8, fontWeight: '700', marginTop: 8, textAlign: 'center' },
  actions: { flexDirection: 'row', justifyContent: 'center', marginTop: 66, gap: 13 },
  actionButton: { width: 77, height: 20, backgroundColor: BLUE, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  actionText: { color: '#FFFFFF', fontSize: 7 },
  shareIcon: { color: '#FFFFFF', fontSize: 14, marginRight: 4 },
  feedbackMessage: { color: '#A64B00', fontSize: 8, lineHeight: 11, marginTop: 8, textAlign: 'center' },
  confirmationNote: { color: '#111111', fontSize: 7, textAlign: 'center', marginTop: 10 },
  continueFooter: { paddingHorizontal: 25, paddingTop: 8, paddingBottom: 10, backgroundColor: '#FFFFFF' },
  continueButton: { height: 46, paddingHorizontal: 16, borderRadius: 9, backgroundColor: ORANGE, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  continueButtonPressed: { opacity: 0.86 },
  continueButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  continueArrow: { color: '#FFFFFF', fontSize: 24, lineHeight: 26, marginLeft: 8 },
});
