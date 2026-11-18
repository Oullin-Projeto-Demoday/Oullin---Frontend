import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  blue: '#174D76',
  orange: '#F9A619',
  border: '#B8BDC3',
  text: '#222222',
  muted: '#777777',
  white: '#FFFFFF',
  error: '#B3261E',
};

const LOGO = require('./assets/oullin-logo.png');
const MASCOT = require('./assets/mascote-email.png');
const NAME_MASCOT = require('./assets/mascote-name.png');
const WELCOME_BACKGROUND = require('./assets/welcome-background.png');

function Splash({ onContinue }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.72)).current;
  const translateY = useRef(new Animated.Value(24)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const useNativeDriver = Platform.OS !== 'web';
    const entrance = Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 850,
        easing: Easing.out(Easing.cubic),
        useNativeDriver,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        tension: 65,
        useNativeDriver,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 750,
        easing: Easing.out(Easing.cubic),
        useNativeDriver,
      }),
    ]);

    entrance.start();
    const taglineTimer = setTimeout(() => {
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver,
      }).start();
    }, 500);
    const screenTimer = setTimeout(onContinue, 3400);

    return () => {
      clearTimeout(taglineTimer);
      clearTimeout(screenTimer);
      entrance.stop();
      taglineOpacity.stopAnimation();
    };
  }, [opacity, scale, translateY, taglineOpacity, onContinue]);

  return (
    <View style={styles.splash}>
      <Animated.Image
        accessibilityLabel="Logo Oullin"
        source={LOGO}
        style={[styles.splashLogo, { opacity, transform: [{ translateY }, { scale }] }]}
        resizeMode="contain"
      />
      <Animated.Text style={[styles.splashTagline, { opacity: taglineOpacity }]}>
        Mais segurança no prato{'\n'}menos peso na rotina
      </Animated.Text>
    </View>
  );
}

function SocialButton({ label, icon, iconColor, onPress }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.socialButton}>
      {!!icon && <Text style={[styles.socialIcon, { color: iconColor }]}>{icon}</Text>}
      <Text style={styles.socialText}>{label}</Text>
    </Pressable>
  );
}

function RegistrationOptions({ onContinue }) {
  const [notice, setNotice] = useState('');

  return (
    <ImageBackground
      accessibilityLabel="Pessoas trocando uma entrega da Oullin"
      imageStyle={styles.welcomeBackgroundImage}
      resizeMode="cover"
      source={WELCOME_BACKGROUND}
      style={styles.registrationScreen}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <View style={styles.registrationContent}>
        <View pointerEvents="none" style={styles.photoShade} />
        <SafeAreaView edges={['bottom']} style={styles.registrationPanel}>
          <Text style={styles.registrationTitle}>Crie sua conta</Text>
          <Text style={styles.registrationHint}>Escolha como deseja se cadastrar no Oullin</Text>
          {!!notice && <Text accessibilityRole="alert" style={styles.notice}>{notice}</Text>}
          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.orText}>ou</Text>
            <View style={styles.divider} />
          </View>
          <SocialButton
            icon="f"
            iconColor="#1877F2"
            label="Continuar com Facebook"
            onPress={() => setNotice('Facebook ainda não está configurado. Continue com email.')}
          />
          <SocialButton
            icon="G"
            iconColor="#4285F4"
            label="Continuar com Google"
            onPress={() => setNotice('Google ainda não está configurado. Continue com email.')}
          />
          <SocialButton label="Continuar com email" onPress={onContinue} />
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

function EmailScreen({ email, onChangeEmail, onBack, onContinue }) {
  const [error, setError] = useState('');

  function continueToName() {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Informe um email válido para continuar.');
      return;
    }
    setError('');
    onContinue();
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.formScreen}
    >
      <SafeAreaView style={styles.emailContent}>
        <View>
          <Text style={styles.formTitle}>Entre com seu email</Text>
          <Text style={styles.formHint}>Adicione seu e-mail para criar sua conta</Text>
          <TextInput
            accessibilityLabel="Email"
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            onChangeText={(value) => {
              onChangeEmail(value);
              if (error) setError('');
            }}
            onSubmitEditing={continueToName}
            placeholder="seuemail@exemplo.com"
            placeholderTextColor="#C0C0C0"
            returnKeyType="next"
            style={styles.input}
            value={email}
          />
          {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
        </View>
        <View style={styles.formActions}>
          <Image source={MASCOT} style={styles.cornerMascot} resizeMode="contain" />
          <Pressable accessibilityRole="button" onPress={onBack} style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={continueToName} style={styles.continueButton}>
            <Text style={styles.continueText}>Continuar</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

function NameScreen({ email, onBack, onComplete }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');

  function completeRegistration() {
    if (!firstName.trim() || !lastName.trim()) {
      setError('Informe seu nome e sobrenome para continuar.');
      return;
    }
    onComplete({ email: email.trim(), firstName: firstName.trim(), lastName: lastName.trim() });
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.formScreen}
    >
      <SafeAreaView style={styles.nameContent}>
        <Image source={NAME_MASCOT} style={styles.topMascot} resizeMode="contain" />
        <Text style={styles.formTitle}>Qual é seu nome?</Text>
        <Text style={styles.formHint}>Informe seu nome para concluir o cadastro</Text>
        <TextInput
          accessibilityLabel="Primeiro nome"
          autoComplete="given-name"
          onChangeText={(value) => {
            setFirstName(value);
            if (error) setError('');
          }}
          placeholder="Insira o primeiro nome"
          placeholderTextColor={COLORS.border}
          returnKeyType="next"
          style={styles.input}
          value={firstName}
        />
        <TextInput
          accessibilityLabel="Sobrenome"
          autoComplete="family-name"
          onChangeText={(value) => {
            setLastName(value);
            if (error) setError('');
          }}
          onSubmitEditing={completeRegistration}
          placeholder="Insira o sobrenome"
          placeholderTextColor={COLORS.border}
          returnKeyType="done"
          style={styles.input}
          value={lastName}
        />
        <Text style={styles.emailSummary}>Email: {email}</Text>
        {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
        <View style={styles.formActions}>
          <Pressable accessibilityRole="button" onPress={onBack} style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={completeRegistration}
            style={styles.continueButton}
          >
            <Text style={styles.continueText}>Continuar</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

export default function OnboardingScreen({ onComplete }) {
  const [screen, setScreen] = useState('splash');
  const [email, setEmail] = useState('');

  if (screen === 'splash') {
    return <Splash onContinue={() => setScreen('registration')} />;
  }
  if (screen === 'registration') {
    return <RegistrationOptions onContinue={() => setScreen('email')} />;
  }
  if (screen === 'email') {
    return (
      <EmailScreen
        email={email}
        onBack={() => setScreen('registration')}
        onChangeEmail={setEmail}
        onContinue={() => setScreen('name')}
      />
    );
  }
  return (
    <NameScreen
      email={email}
      onBack={() => setScreen('email')}
      onComplete={onComplete}
    />
  );
}

const styles = StyleSheet.create({
  splash: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    flex: 1,
    justifyContent: 'center',
  },
  splashLogo: {
    height: 225,
    width: 340,
  },
  splashTagline: {
    color: COLORS.blue,
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: 0.3,
    lineHeight: 21,
    marginTop: 2,
    textAlign: 'center',
  },
  registrationScreen: {
    flex: 1,
  },
  welcomeBackgroundImage: {
    transform: [{ translateY: -270 }],
  },
  registrationContent: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  photoShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(35,24,16,0.12)',
  },
  registrationPanel: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -18,
    paddingHorizontal: 28,
    paddingTop: 22,
  },
  registrationTitle: {
    color: COLORS.blue,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 7,
    textAlign: 'center',
  },
  registrationHint: {
    color: '#666666',
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
  notice: {
    color: '#A33A2F',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
    textAlign: 'center',
  },
  dividerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 13,
  },
  divider: {
    backgroundColor: COLORS.border,
    flex: 1,
    height: 1,
  },
  orText: {
    color: COLORS.muted,
    fontSize: 13,
    marginHorizontal: 12,
  },
  socialButton: {
    alignItems: 'center',
    borderColor: COLORS.border,
    borderRadius: 9,
    borderWidth: 1,
    flexDirection: 'row',
    height: 52,
    justifyContent: 'center',
    marginBottom: 10,
  },
  socialIcon: {
    fontSize: 21,
    fontWeight: '800',
    left: 18,
    position: 'absolute',
  },
  socialText: {
    color: '#555555',
    fontSize: 15,
    fontWeight: '500',
  },
  formScreen: {
    backgroundColor: COLORS.white,
    flex: 1,
  },
  emailContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 88,
  },
  nameContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  topMascot: {
    alignSelf: 'flex-end',
    height: 75,
    marginRight: -32,
    marginTop: -25,
    width: 96,
  },
  formTitle: {
    color: COLORS.blue,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 25,
  },
  formHint: {
    color: COLORS.text,
    fontSize: 14,
    marginBottom: 18,
  },
  input: {
    borderColor: COLORS.border,
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 15,
    height: 54,
    marginBottom: 20,
    paddingHorizontal: 14,
  },
  error: {
    color: COLORS.error,
    fontSize: 12,
    marginBottom: 12,
    marginTop: -12,
  },
  emailSummary: {
    color: COLORS.muted,
    fontSize: 13,
    marginBottom: 16,
    marginTop: -12,
  },
  formActions: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 100,
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  cornerMascot: {
    bottom: 130,
    height: 90,
    left: -44,
    position: 'absolute',
    width: 117,
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: COLORS.orange,
    borderRadius: 10,
    height: 54,
    justifyContent: 'center',
    width: 54,
  },
  backArrow: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: '600',
    lineHeight: 32,
  },
  continueButton: {
    alignItems: 'center',
    backgroundColor: COLORS.orange,
    borderRadius: 10,
    height: 54,
    justifyContent: 'center',
    width: 190,
  },
  continueText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
