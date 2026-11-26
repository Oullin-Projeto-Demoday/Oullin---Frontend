import React, { useEffect, useState } from 'react';
import {
  BackHandler,
  Image,
  Pressable,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationBar } from 'expo-navigation-bar';
import AddressScreen from './AddressScreen';
import CartScreen, { INITIAL_CART_ITEMS } from './CartScreen';
import DeliveryScreen from './DeliveryScreen';
import OrderSummaryScreen from './OrderSummaryScreen';
import PayScreen from './PayScreen';
import PixScreen from './PixScreen';
import ProfileScreen from './ProfileScreen';
import {
  HomeScreen,
  NotificationsScreen,
  RegistrationCompleteScreen,
} from './HomeScreens';
import OnboardingScreen from './OnboardingScreen';
import SearchScreen from './SearchScreen';

const COLORS = {
  amber: '#FFB400',
  blue: '#124F8C',
  text: '#101010',
  muted: '#777777',
  border: '#D5D5D5',
  white: '#FFFFFF',
};

const ROUTES = {
  onboarding: 'onboarding',
  registrationComplete: 'registrationComplete',
  home: 'home',
  search: 'search',
  orders: 'orders',
  preferences: 'preferences',
  profile: 'profile',
  address: 'address',
  notifications: 'notifications',
  payment: 'payment',
  pix: 'pix',
  delivery: 'delivery',
  summary: 'summary',
};

const PAYMENT_METHOD_LABELS = {
  apple: 'Apple Pay',
  nupay: 'NuPay',
  pix: 'Pix',
};

const TAB_ROUTES = {
  Início: ROUTES.home,
  Buscar: ROUTES.search,
  Pedidos: ROUTES.orders,
  Perfil: ROUTES.profile,
};

const QUESTIONS = [
  {
    id: 'restrictions',
    title: 'O que precisamos evitar no seu prato?',
    label: 'Selecionar restrições',
    options: [
      'Alimentação Kosher',
      'Alimentação Halal',
      'Restrição a sódio',
      'Intolerância à lactose',
      'Sensibilidade ao glúten',
      'Alergia à proteína do leite de vaca',
      'Alergia a amendoim e castanhas',
      'Alergia a frutos do mar',
      'Alergia a ovos',
      'Alergia à soja',
      'Doença celíaca',
      'Diabetes',
      'Hipertensão',
      'Vegetarianismo',
      'Veganismo',
    ],
  },
  {
    id: 'sensitivity',
    title: 'Qual é o seu nível de sensibilidade para esses ingredientes?',
    label: 'Selecione as opções',
    options: [
      'Severa / Anafilaxia / Celíaca',
      'Intolerância Moderada',
      'Preferência Alimentar',
    ],
  },
  {
    id: 'crossContamination',
    title: 'Precisamos ter atenção com contaminação cruzada?',
    label: 'Selecione as opções',
    options: ['Sim, zero traços', 'Não, apenas sem o ingrediente direto'],
  },
  {
    id: 'favoriteFoods',
    title: 'Quais são suas comidas prediletas?',
    label: 'Selecionar refeições preferidas',
    options: [
      'Pão francês sem glúten',
      'Pizza vegana',
      'Bolo de aniversário sem alergênicos',
      'Salgadinho de festa sem glúten',
      'Chocolate sem lactose',
      'Massa folhada sem glúten',
      'Sorvete sem leite de vaca',
      'Molho de tomate sem açúcar',
      'Bolacha recheada sem glúten',
      'Pão de forma sem soja',
      'Hambúrguer vegano sem soja',
      'Comida japonesa sem glúten',
      'Sobremesas para diabéticos',
      'Cerveja sem glúten',
      'Queijo vegetal que derrete',
      'Iogurte vegetal sem açúcar',
      'Pratos congelados com baixo sódio',
      'Doces de festa sem castanhas',
      'Pão de queijo sem leite',
    ],
  },
  {
    id: 'dailyMeals',
    title: 'Quais refeições você mais procura no seu dia a dia?',
    label: 'Selecione as opções',
    options: ['Café da manhã', 'Almoço', 'Doces', 'Marmitas da Semana', 'Jantar'],
  },
];

function SelectionField({ question, selected, onToggle }) {
  const [expanded, setExpanded] = useState(false);
  const [search, setSearch] = useState('');
  const filteredOptions = question.options.filter((option) =>
    option.toLocaleLowerCase('pt-BR').includes(search.trim().toLocaleLowerCase('pt-BR')),
  );

  function toggleExpanded() {
    setExpanded((isExpanded) => !isExpanded);
    setSearch('');
  }

  return (
    <View style={styles.question}>
      <Text style={styles.questionTitle}>{question.title}</Text>
      <Text style={styles.fieldLabel}>{question.label}</Text>
      <View style={styles.dropdown}>
        {expanded ? (
          <View style={styles.searchRow}>
            <TextInput
              accessibilityLabel={`Pesquisar em ${question.label.toLocaleLowerCase('pt-BR')}`}
              autoCapitalize="none"
              onChangeText={setSearch}
              placeholder="Pesquisar"
              placeholderTextColor={COLORS.muted}
              returnKeyType="search"
              style={styles.searchInput}
              value={search}
            />
            <Pressable
              accessibilityLabel="Fechar opções"
              accessibilityRole="button"
              accessibilityState={{ expanded: true }}
              onPress={toggleExpanded}
              style={styles.chevronButton}
            >
              <View style={[styles.chevron, styles.chevronUp]}>
                <View style={[styles.chevronArm, styles.chevronArmLeft]} />
                <View style={[styles.chevronArm, styles.chevronArmRight]} />
              </View>
            </Pressable>
          </View>
        ) : (
          <Pressable
            accessibilityLabel={selected.length ? `${selected.length} selecionadas` : 'Pesquisar opções'}
            accessibilityRole="button"
            accessibilityState={{ expanded }}
            onPress={toggleExpanded}
            style={styles.collapsedField}
          >
            <Text style={[styles.collapsedText, selected.length > 0 && styles.selectedSummary]}>
              {selected.length ? `${selected.length} selecionada${selected.length > 1 ? 's' : ''}` : 'Pesquisar'}
            </Text>
            <View style={styles.chevron}>
              <View style={[styles.chevronArm, styles.chevronArmLeft]} />
              <View style={[styles.chevronArm, styles.chevronArmRight]} />
            </View>
          </Pressable>
        )}
        {expanded && (
          <ScrollView
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
            style={styles.optionsList}
          >
            {filteredOptions.length ? (
              filteredOptions.map((option) => {
                const checked = selected.includes(option);
                return (
                  <Pressable
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked }}
                    key={option}
                    onPress={() => onToggle(option)}
                    style={styles.optionRow}
                  >
                    <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
                      {checked && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                    <Text style={styles.optionText}>{option}</Text>
                  </Pressable>
                );
              })
            ) : (
              <Text style={styles.emptySearch}>Nenhuma opção encontrada.</Text>
            )}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

function TabIcon({ label, active, compact = false }) {
  if (label === 'Início') {
    return (
      <View style={[styles.koalaBadge, compact && styles.compactKoalaBadge]}>
        <Image
          accessibilityLabel="Coala"
          resizeMode="contain"
          source={require('./assets/nav-koala.png')}
          style={[styles.koalaIcon, compact && styles.compactKoalaIcon]}
        />
      </View>
    );
  }

  const iconStyle = [
    styles.tabIconShape,
    compact && styles.compactTabIconShape,
    active && styles.activeTabIconShape,
  ];
  if (label === 'Buscar') {
    return (
      <View style={[styles.searchIcon, compact && styles.compactSearchIcon]}>
        <View style={iconStyle} />
        <View
          style={[
            styles.searchHandle,
            compact && styles.compactSearchHandle,
            active && styles.activeSearchHandle,
          ]}
        />
      </View>
    );
  }
  if (label === 'Pedidos') {
    return (
      <View
        style={[
          styles.receiptIcon,
          compact && styles.compactReceiptIcon,
          active && styles.activeReceiptIcon,
        ]}
      >
        <View style={[styles.receiptLine, compact && styles.compactReceiptLine, active && styles.activeReceiptLine]} />
        <View style={[styles.receiptLine, compact && styles.compactReceiptLine, active && styles.activeReceiptLine]} />
        <View style={[styles.receiptLine, compact && styles.compactReceiptLine, active && styles.activeReceiptLine]} />
      </View>
    );
  }
  return (
    <View style={[styles.profileIcon, compact && styles.compactProfileIcon]}>
      <View style={[styles.profileHead, compact && styles.compactProfileHead, active && styles.activeProfileIcon]} />
      <View style={[styles.profileBody, compact && styles.compactProfileBody, active && styles.activeProfileIcon]} />
    </View>
  );
}

function PreferencesScreen({ onBack, onContinue, selections, setSelections }) {

  function toggleOption(questionId, option) {
    setSelections((current) => {
      const selected = current[questionId] || [];
      const next = selected.includes(option)
        ? selected.filter((item) => item !== option)
        : [...selected, option];
      return { ...current, [questionId]: next };
    });
  }

  return (
    <View style={styles.screen}>
      <Pressable
        accessibilityLabel="Voltar"
        accessibilityRole="button"
        onPress={onBack}
        style={styles.backButton}
      >
        <Text style={styles.backArrow}>‹</Text>
      </Pressable>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {QUESTIONS.map((question) => (
          <SelectionField
            key={question.id}
            onToggle={(option) => toggleOption(question.id, option)}
            question={question}
            selected={selections[question.id] || []}
          />
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <Pressable
          accessibilityRole="button"
          onPress={onContinue}
          style={({ pressed }) => [styles.continueButton, pressed && styles.pressed]}
        >
          <Text style={styles.continueText}>Continuar</Text>
        </Pressable>
      </View>
    </View>
  );
}

function BottomNavigation({ activeTab, onSelectTab, bottomInset, compact = false }) {
  const compactWebNavigation = compact && Platform.OS === 'web';
  const displayedActiveTab = compactWebNavigation ? 'Pedidos' : activeTab;

  return (
    <View
      style={[
        styles.bottomNav,
        compactWebNavigation && styles.compactBottomNav,
        { paddingBottom: compactWebNavigation ? 2 : Math.max(bottomInset + 6, 14) },
      ]}
    >
      {[
        { label: 'Início' },
        { label: 'Buscar' },
        { label: 'Pedidos' },
        { label: 'Perfil' },
      ].map((tab) => {
        const active = displayedActiveTab === tab.label;
        return (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            key={tab.label}
            onPress={() => onSelectTab(tab.label)}
            hitSlop={compactWebNavigation ? { top: 6, bottom: 6 } : undefined}
            style={[styles.tab, compactWebNavigation && styles.compactTab]}
          >
            <TabIcon active={active} compact={compactWebNavigation} label={tab.label} />
            <Text
              style={[
                styles.tabLabel,
                compactWebNavigation && styles.compactTabLabel,
                active && styles.activeTabText,
              ]}
            >
              {tab.label}
            </Text>
            {compactWebNavigation && active && (
              <View style={styles.compactActiveTabIndicator} />
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

function PlaceholderScreen({ tab }) {
  const isOrders = tab === ROUTES.orders;
  const isProfile = tab === ROUTES.profile;

  return (
    <View style={styles.placeholder}>
      <Text style={styles.placeholderTitle}>
        {isOrders ? 'Seus pedidos' : isProfile ? 'Seu perfil' : 'Bem-vindo ao Oullin'}
      </Text>
      <Text style={styles.placeholderDescription}>
        {isOrders
          ? 'Seus pedidos aparecerão aqui quando você fizer uma compra.'
          : isProfile
            ? 'Para completar seu perfil alimentar e endereço, acesse as notificações.'
          : 'Esta tela ainda está sendo preparada.'}
      </Text>
    </View>
  );
}

function AppContent() {
  const insets = useSafeAreaInsets();
  const [routeStack, setRouteStack] = useState([ROUTES.onboarding]);
  const [selections, setSelections] = useState({});
  const [firstName, setFirstName] = useState('');
  const [userProfile, setUserProfile] = useState({});
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [cartItems, setCartItems] = useState(INITIAL_CART_ITEMS);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('apple');
  const [profileSetupComplete, setProfileSetupComplete] = useState(false);
  const [searchStatusBarBackground, setSearchStatusBarBackground] = useState('#FF8500');
  const [compactSearchNavigation, setCompactSearchNavigation] = useState(false);
  const [hideBottomNavigation, setHideBottomNavigation] = useState(false);
  const currentRoute = routeStack[routeStack.length - 1];
  const isPaymentFlowRoute = [
    ROUTES.payment,
    ROUTES.pix,
    ROUTES.delivery,
    ROUTES.summary,
  ].includes(currentRoute);
  const cartItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const cartTotalCents = cartItems.reduce(
    (total, item) => total + item.priceCents * item.quantity,
    0,
  );
  const cartTotal = `R$ ${(cartTotalCents / 100).toFixed(2).replace('.', ',')}`;
  const statusBarBackground = currentRoute === ROUTES.search
    ? searchStatusBarBackground
    : COLORS.white;

  function resetNavigation(route) {
    setRouteStack([route]);
  }

  function navigate(route) {
    setRouteStack((current) => [...current, route]);
  }

  function goBack() {
    setRouteStack((current) => {
      if (current.length > 1) return current.slice(0, -1);
      if (current[0] !== ROUTES.home && current[0] !== ROUTES.onboarding) {
        return [ROUTES.home];
      }
      return current;
    });
  }

  function logOut() {
    setUserProfile({});
    setFirstName('');
    setSelectedAddress(null);
    setCartItems(INITIAL_CART_ITEMS);
    setProfileSetupComplete(false);
    setSelections({});
    resetNavigation(ROUTES.onboarding);
  }

  useEffect(() => {
    if (Platform.OS !== 'android') return undefined;

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (routeStack.length > 1) {
        goBack();
        return true;
      }
      if (currentRoute !== ROUTES.home && currentRoute !== ROUTES.onboarding) {
        resetNavigation(ROUTES.home);
        return true;
      }
      return false;
    });

    return () => subscription.remove();
  }, [currentRoute, routeStack]);

  if (currentRoute === ROUTES.onboarding) {
    return (
      <OnboardingScreen
        onComplete={(registration) => {
          setUserProfile(registration);
          setFirstName(registration.firstName);
          resetNavigation(ROUTES.registrationComplete);
        }}
      />
    );
  }
  if (currentRoute === ROUTES.registrationComplete) {
    return (
      <RegistrationCompleteScreen
        onFinish={() => resetNavigation(ROUTES.home)}
      />
    );
  }

  const activeTab = currentRoute === ROUTES.notifications || currentRoute === ROUTES.address
    ? 'Pedidos'
    : Object.keys(TAB_ROUTES).find((tab) => TAB_ROUTES[tab] === currentRoute);

  return (
    <SafeAreaView
      edges={currentRoute === ROUTES.search ? [] : ['top']}
      style={[styles.safeArea, { backgroundColor: statusBarBackground }]}
    >
      <StatusBar
        barStyle={statusBarBackground === '#FF8500' ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        hidden={false}
        translucent
      />
      <View style={styles.mainContent}>
        {currentRoute === ROUTES.summary ? (
          <OrderSummaryScreen
            items={cartItems}
            onBack={goBack}
            onFinishPayment={() => resetNavigation(ROUTES.delivery)}
            onSelectTab={(tab) => resetNavigation(TAB_ROUTES[tab])}
          />
        ) : currentRoute === ROUTES.delivery ? (
          <DeliveryScreen
            address={
              selectedAddress
                ? [selectedAddress.street, selectedAddress.number].filter(Boolean).join(', ')
                : 'Endereço não informado'
            }
            addressDetails={
              selectedAddress
                ? [
                    selectedAddress.complement,
                    selectedAddress.neighborhood,
                    [selectedAddress.city, selectedAddress.state].filter(Boolean).join(' - '),
                    selectedAddress.reference,
                  ].filter(Boolean).join(' • ')
                : ''
            }
            itemCount={cartItemCount}
            onBack={goBack}
            onSelectTab={(tab) => resetNavigation(TAB_ROUTES[tab])}
            onViewOrders={() => resetNavigation(ROUTES.orders)}
            paymentMethod={PAYMENT_METHOD_LABELS[selectedPaymentMethod]}
            total={cartTotal}
          />
        ) : currentRoute === ROUTES.payment ? (
          <PayScreen
            itemCount={cartItemCount}
            onBack={goBack}
            onChoosePix={() => navigate(ROUTES.pix)}
            onFinishPayment={() => resetNavigation(ROUTES.delivery)}
            onOpenSummary={() => navigate(ROUTES.summary)}
            onSelectPaymentMethod={setSelectedPaymentMethod}
            onSelectTab={(tab) => resetNavigation(TAB_ROUTES[tab])}
            selectedPaymentMethod={selectedPaymentMethod}
            total={cartTotal}
          />
        ) : currentRoute === ROUTES.pix ? (
          <PixScreen
            onBack={goBack}
            onSelectTab={(tab) => resetNavigation(TAB_ROUTES[tab])}
          />
        ) : currentRoute === ROUTES.notifications ? (
          <NotificationsScreen
            onBack={goBack}
            onConfigureAddress={() => navigate(ROUTES.address)}
            onConfigureProfile={() => navigate(ROUTES.preferences)}
          />
        ) : currentRoute === ROUTES.address ? (
          <View style={styles.addressSafeArea}>
            <AddressScreen
              completeLabel="Confirmar endereço"
              onBack={goBack}
              onComplete={(address) => {
                setSelectedAddress(address);
                setProfileSetupComplete(true);
                if (routeStack[routeStack.length - 2] === ROUTES.orders) {
                  navigate(ROUTES.payment);
                } else {
                  resetNavigation(ROUTES.home);
                }
              }}
            />
          </View>
        ) : currentRoute === ROUTES.search ? (
          <SearchScreen
            onCompactNavigationChange={setCompactSearchNavigation}
            onStatusBarBackgroundChange={setSearchStatusBarBackground}
            onChickenInfoScreenChange={setHideBottomNavigation}
            profileSelections={selections}
          />
        ) : currentRoute === ROUTES.home ? (
          <HomeScreen
            deliveryAddress={
              selectedAddress
                ? [selectedAddress.street, selectedAddress.number].filter(Boolean).join(', ')
                : ''
            }
            firstName={firstName}
            onNotifications={() => navigate(ROUTES.notifications)}
            onSelectTab={(tab) => resetNavigation(TAB_ROUTES[tab])}
            onChickenInfoScreenChange={setHideBottomNavigation}
            profileSetupComplete={profileSetupComplete}
            profileSelections={selections}
          />
        ) : currentRoute === ROUTES.preferences ? (
          <PreferencesScreen
            onBack={goBack}
            onContinue={() => navigate(ROUTES.address)}
            selections={selections}
            setSelections={setSelections}
          />
        ) : currentRoute === ROUTES.orders ? (
          <CartScreen
            items={cartItems}
            onBack={() => resetNavigation(ROUTES.home)}
            onContinueDelivery={() => navigate(ROUTES.address)}
            onItemsChange={setCartItems}
          />
        ) : currentRoute === ROUTES.profile ? (
          <ProfileScreen
            address={selectedAddress}
            onLogout={logOut}
            selections={selections}
            user={userProfile}
          />
        ) : (
          <PlaceholderScreen tab={currentRoute} />
        )}
      </View>
      {!hideBottomNavigation && !isPaymentFlowRoute && (
        <BottomNavigation
          activeTab={activeTab}
          bottomInset={insets.bottom}
          compact={compactSearchNavigation}
          onSelectTab={(tab) => resetNavigation(TAB_ROUTES[tab])}
        />
      )}
    </SafeAreaView>
  );
}

export default function App() {
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined' || typeof document === 'undefined') {
      return undefined;
    }

    const ensureLink = (rel, href, extra = {}) => {
      let link = document.querySelector(`link[rel="${rel}"]`);
      if (!link) {
        link = document.createElement('link');
        link.rel = rel;
        document.head.appendChild(link);
      }
      link.href = href;
      Object.entries(extra).forEach(([name, value]) => link.setAttribute(name, value));
    };

    ensureLink('manifest', './manifest.webmanifest');
    ensureLink('icon', './favicon.png', { type: 'image/png', sizes: '64x64' });
    ensureLink('apple-touch-icon', './icon-192.png', { sizes: '192x192' });

    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute(
        'content',
        'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=5, viewport-fit=cover',
      );
    }

    let themeColor = document.querySelector('meta[name="theme-color"]');
    if (!themeColor) {
      themeColor = document.createElement('meta');
      themeColor.name = 'theme-color';
      document.head.appendChild(themeColor);
    }
    themeColor.content = '#FF8500';

    let appleCapable = document.querySelector('meta[name="apple-mobile-web-app-capable"]');
    if (!appleCapable) {
      appleCapable = document.createElement('meta');
      appleCapable.name = 'apple-mobile-web-app-capable';
      document.head.appendChild(appleCapable);
    }
    appleCapable.content = 'yes';

    let appleStatusBar = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (!appleStatusBar) {
      appleStatusBar = document.createElement('meta');
      appleStatusBar.name = 'apple-mobile-web-app-status-bar-style';
      document.head.appendChild(appleStatusBar);
    }
    appleStatusBar.content = 'default';

    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch((error) => {
          console.error('Não foi possível ativar a PWA do Oullin.', error);
        });
      });
    }

    return undefined;
  }, []);

  return (
    <SafeAreaProvider>
      {Platform.OS === 'android' && <NavigationBar hidden style="dark" />}
      <View style={styles.appViewport}>
        <View style={Platform.OS === 'web' ? styles.webAppFrame : styles.nativeAppFrame}>
          <AppContent />
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  appViewport: {
    flex: 1,
    width: '100%',
  },
  webAppFrame: {
    backgroundColor: COLORS.white,
    flex: 1,
    maxWidth: 430,
    width: '100%',
    alignSelf: 'center',
    overflow: 'hidden',
  },
  nativeAppFrame: {
    flex: 1,
    width: '100%',
  },
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  mainContent: {
    flex: 1,
  },
  addressSafeArea: {
    flex: 1,
  },
  screen: {
    backgroundColor: COLORS.white,
    flex: 1,
  },
  backButton: {
    height: 54,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  backArrow: {
    color: COLORS.amber,
    fontSize: 34,
    lineHeight: 38,
  },
  content: {
    paddingHorizontal: 32,
    paddingTop: 22,
    paddingBottom: 18,
  },
  question: {
    marginBottom: 26,
  },
  questionTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 25,
    marginBottom: 9,
  },
  fieldLabel: {
    color: COLORS.muted,
    fontSize: 10,
    marginBottom: 3,
  },
  dropdown: {
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    overflow: 'hidden',
  },
  collapsedField: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 36,
    justifyContent: 'space-between',
    paddingHorizontal: 13,
  },
  collapsedText: {
    color: COLORS.muted,
    fontSize: 12,
  },
  selectedSummary: {
    color: COLORS.text,
  },
  searchRow: {
    alignItems: 'center',
    borderBottomColor: '#E7E7E7',
    borderBottomWidth: 1,
    flexDirection: 'row',
    height: 38,
    paddingLeft: 13,
  },
  searchInput: {
    color: COLORS.text,
    flex: 1,
    fontSize: 12,
    height: '100%',
    paddingVertical: 0,
  },
  chevronButton: {
    alignItems: 'center',
    height: 38,
    justifyContent: 'center',
    width: 40,
  },
  chevron: {
    height: 8,
    position: 'relative',
    width: 10,
  },
  chevronUp: {
    transform: [{ rotate: '180deg' }],
  },
  chevronArm: {
    backgroundColor: COLORS.muted,
    borderRadius: 0.75,
    height: 1.5,
    position: 'absolute',
    top: 2.5,
    width: 6,
  },
  chevronArmLeft: {
    left: 0,
    transform: [{ rotate: '45deg' }],
  },
  chevronArmRight: {
    right: 0,
    transform: [{ rotate: '-45deg' }],
  },
  optionsList: {
    maxHeight: 220,
  },
  optionRow: {
    alignItems: 'center',
    borderBottomColor: '#E7E7E7',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    minHeight: 39,
    paddingHorizontal: 12,
  },
  checkbox: {
    alignItems: 'center',
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    height: 16,
    justifyContent: 'center',
    marginRight: 9,
    width: 16,
  },
  checkboxChecked: {
    backgroundColor: COLORS.amber,
    borderColor: COLORS.amber,
  },
  checkmark: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 14,
  },
  optionText: {
    color: '#333333',
    flex: 1,
    fontSize: 12,
  },
  emptySearch: {
    color: COLORS.muted,
    fontSize: 12,
    padding: 14,
  },
  footer: {
    backgroundColor: COLORS.white,
    paddingBottom: 8,
  },
  continueButton: {
    alignItems: 'center',
    backgroundColor: COLORS.amber,
    borderRadius: 9,
    height: 47,
    justifyContent: 'center',
    marginBottom: 19,
    marginHorizontal: 13,
  },
  continueText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.8,
  },
  bottomNav: {
    backgroundColor: COLORS.blue,
    flexDirection: 'row',
    justifyContent: 'space-around',
    minHeight: 68,
    paddingTop: 6,
  },
  compactBottomNav: {
    backgroundColor: '#0D4889',
    minHeight: 0,
    paddingTop: 1,
  },
  tab: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  compactTab: {
    paddingVertical: 0,
  },
  compactKoalaBadge: {
    height: 14,
    width: 26,
  },
  compactKoalaIcon: {
    height: 14,
    width: 26,
  },
  compactSearchIcon: {
    height: 14,
    width: 14,
  },
  compactTabIconShape: {
    borderRadius: 6,
    borderWidth: 1,
    height: 9,
    width: 9,
  },
  compactSearchHandle: {
    height: 1,
    left: 9,
    top: 9,
    width: 5,
  },
  compactReceiptIcon: {
    borderRadius: 2,
    borderWidth: 1,
    height: 14,
    paddingHorizontal: 1,
    width: 11,
  },
  compactReceiptLine: {
    height: 1,
    width: 5,
  },
  compactProfileIcon: {
    height: 14,
    width: 14,
  },
  compactProfileHead: {
    borderRadius: 3,
    borderWidth: 1,
    height: 5,
    marginBottom: 1,
    width: 5,
  },
  compactProfileBody: {
    borderWidth: 1,
    height: 6,
    width: 11,
  },
  compactTabLabel: {
    fontSize: 6,
    lineHeight: 7,
    marginTop: 1,
  },
  compactActiveTabIndicator: {
    backgroundColor: COLORS.amber,
    borderRadius: 1,
    height: 1.5,
    marginTop: 1,
    width: 10,
  },
  koalaBadge: {
    alignItems: 'center',
    height: 30,
    justifyContent: 'center',
    width: 46,
  },
  koalaIcon: {
    height: 30,
    width: 46,
  },
  searchIcon: {
    height: 25,
    justifyContent: 'flex-start',
    position: 'relative',
    width: 25,
  },
  tabIconShape: {
    borderColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 2,
    height: 17,
    width: 17,
  },
  activeTabIconShape: {
    borderColor: COLORS.amber,
  },
  searchHandle: {
    backgroundColor: COLORS.white,
    height: 2,
    left: 16,
    position: 'absolute',
    top: 17,
    transform: [{ rotate: '45deg' }],
    width: 8,
  },
  activeSearchHandle: {
    backgroundColor: COLORS.amber,
  },
  receiptIcon: {
    alignItems: 'center',
    borderColor: COLORS.white,
    borderRadius: 2,
    borderWidth: 2,
    height: 21,
    justifyContent: 'space-evenly',
    paddingHorizontal: 3,
    width: 17,
  },
  activeReceiptIcon: {
    borderColor: COLORS.amber,
  },
  receiptLine: {
    backgroundColor: COLORS.white,
    height: 1.5,
    width: 8,
  },
  activeReceiptLine: {
    backgroundColor: COLORS.amber,
  },
  profileIcon: {
    alignItems: 'center',
    height: 24,
    justifyContent: 'flex-end',
    width: 24,
  },
  profileHead: {
    borderColor: COLORS.white,
    borderRadius: 6,
    borderWidth: 2,
    height: 10,
    marginBottom: 2,
    width: 10,
  },
  profileBody: {
    borderColor: COLORS.white,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderWidth: 2,
    height: 9,
    width: 17,
  },
  activeProfileIcon: {
    borderColor: COLORS.amber,
  },
  tabLabel: {
    color: COLORS.white,
    fontSize: 11,
    marginTop: 3,
  },
  activeTabText: {
    color: COLORS.amber,
  },
  placeholder: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  placeholderTitle: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  placeholderDescription: {
    color: COLORS.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 10,
    textAlign: 'center',
  },
});
