import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Pressable,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  orange: '#FF8900',
  navy: '#183F67',
  dark: '#191919',
  taupe: '#A89591',
  white: '#FFFFFF',
  muted: '#777777',
};

const scale = Math.min(Dimensions.get('window').width / 390, 1.15);
const size = (value) => Math.round(value * scale);

const FOODS = [
  { image: require('./assets/burger-photo.jpg'), price: 'R$ 32,90', name: 'Hambúrguer artesanal', detail: 'Pão brioche e queijo', rating: '4,8' },
  { image: require('./assets/pizza-photo.jpg'), price: 'R$ 45,00', name: 'Pizza da casa', detail: 'Queijo e tomate', rating: '4,9' },
  { image: require('./assets/pasta-photo.jpg'), price: 'R$ 29,90', name: 'Massa artesanal', detail: 'Receita especial da casa', rating: '4,8' },
  { image: require('./assets/sushi-photo.jpg'), price: 'R$ 39,90', name: 'Sushi variado', detail: 'Seleção especial', rating: '4,9' },
];

const PROMOTIONS = [
  { image: require('./assets/promo-burger.png'), color: '#81231B' },
  { image: require('./assets/promo-pizza.png'), color: '#791B3B' },
  { image: require('./assets/promo-salad.png'), color: '#204D2B' },
  { image: require('./assets/promo-sushi.png'), color: '#0F3E59' },
  { image: require('./assets/promo-dessert.png'), color: '#572C53' },
  { image: require('./assets/promo-pasta.png'), color: '#913D0B' },
];

export function PostRegistrationSplash({ onFinish }) {
  const koalaY = useRef(new Animated.Value(0)).current;
  const dots = useRef([0, 1, 2].map(() => new Animated.Value(0.35))).current;

  useEffect(() => {
    const useNativeDriver = Platform.OS !== 'web';
    const bob = Animated.loop(Animated.sequence([
      Animated.timing(koalaY, { toValue: -size(5), duration: 850, useNativeDriver }),
      Animated.timing(koalaY, { toValue: 0, duration: 850, useNativeDriver }),
    ]));
    const pulse = Animated.loop(Animated.stagger(180, dots.map((dot) => Animated.sequence([
      Animated.timing(dot, { toValue: 1, duration: 260, useNativeDriver }),
      Animated.timing(dot, { toValue: 0.35, duration: 360, useNativeDriver }),
    ]))));
    bob.start();
    pulse.start();
    const timer = setTimeout(onFinish, 2600);

    return () => {
      bob.stop();
      pulse.stop();
      clearTimeout(timer);
    };
  }, [dots, koalaY, onFinish]);

  return (
    <SafeAreaView style={styles.splash}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <View style={styles.splashContent}>
        <Animated.View style={[styles.koalaStage, { transform: [{ translateY: koalaY }] }]}>
          <Image
            accessibilityLabel="Mascote Oullin"
            resizeMode="contain"
            source={require('./assets/mascote-loading.png')}
            style={styles.koalaImage}
          />
        </Animated.View>
        <Text style={styles.splashTitle}>Só um instante...</Text>
        <Text style={styles.splashSubtitle}>Preparando tudo com carinho para você.</Text>
        <View style={styles.loadingDots}>
          {dots.map((dot, index) => (
            <Animated.View
              key={index}
              style={[styles.loadingDot, { opacity: dot, transform: [{ scale: dot }] }]}
            />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

function BellIcon() {
  return (
    <View style={styles.bellShape}>
      <View style={styles.bellClapper} />
    </View>
  );
}

function FoodCard({ food }) {
  return (
    <Pressable accessibilityRole="button" style={styles.foodCard}>
      <View style={styles.foodImageWrap}>
        <Image
          accessibilityLabel={food.name}
          source={food.image}
          style={styles.foodPhoto}
          resizeMode="cover"
        />
        <View style={styles.foodPriceBadge}>
          <Text style={styles.foodPrice}>{food.price}</Text>
        </View>
      </View>
      <View style={styles.foodCardInfo}>
        <Text numberOfLines={1} style={styles.foodName}>{food.name}</Text>
        <Text numberOfLines={1} style={styles.foodDetail}>{food.detail}</Text>
        <View style={styles.foodRatingRow}>
          <Text style={styles.ratingStar}>★</Text>
          <Text style={styles.foodRating}>{food.rating}</Text>
          <Text style={styles.foodRatingCount}>• popular</Text>
        </View>
      </View>
    </Pressable>
  );
}

export function HomeScreen({ firstName, onAddAddress, onNotifications, onSelectTab }) {
  const [promotionIndex, setPromotionIndex] = useState(0);
  const promotionOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let active = true;
    const interval = setInterval(() => {
      Animated.timing(promotionOpacity, {
        toValue: 0,
        duration: 240,
        useNativeDriver: Platform.OS !== 'web',
      }).start(({ finished }) => {
        if (!finished || !active) return;
        setPromotionIndex((current) => (current + 1) % PROMOTIONS.length);
        Animated.timing(promotionOpacity, {
          toValue: 1,
          duration: 240,
          useNativeDriver: Platform.OS !== 'web',
        }).start();
      });
    }, 4000);

    return () => {
      active = false;
      clearInterval(interval);
      promotionOpacity.stopAnimation();
    };
  }, [promotionOpacity]);

  return (
    <SafeAreaView edges={[]} style={styles.homeScreen}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.taupe} />
      <View style={styles.homeTitleBar}>
        <Text style={styles.homeTitle}>Home</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.homeScroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.greetingRow}>
          <View style={styles.avatar}>
            <Image
              accessibilityLabel="Foto de perfil"
              resizeMode="contain"
              source={require('./assets/koala-enhanced.png')}
              style={styles.avatarImage}
            />
          </View>
          <View style={styles.greetingText}>
            <Text style={styles.hello}>Olá {firstName || 'Ouli'}!</Text>
            <Pressable
              accessibilityLabel="Adicionar endereço de entrega"
              accessibilityRole="button"
              onPress={onAddAddress}
              style={styles.addressButton}
            >
              <Text style={styles.address}>Adicione seu endereço</Text>
            </Pressable>
          </View>
          <Pressable
            accessibilityLabel="Abrir notificações"
            accessibilityRole="button"
            onPress={onNotifications}
            style={styles.bellButton}
          >
            <BellIcon />
          </Pressable>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => onSelectTab('Perfil')}
          style={styles.tipBanner}
        >
          <View style={styles.tipBubble} />
          <Text style={styles.tipTitle}>Falta pouco para o match perfeito!</Text>
          <Text style={styles.tipText}>
            Defina o que você adora para receber nossas melhores opções.
          </Text>
        </Pressable>

        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>Promoções do dia</Text>
        </View>
        <View style={[styles.promoCard, { backgroundColor: PROMOTIONS[promotionIndex].color }]}>
          <Animated.Image
            source={PROMOTIONS[promotionIndex].image}
            style={[StyleSheet.absoluteFill, { opacity: promotionOpacity }]}
            resizeMode="cover"
          />
        </View>

        <View style={styles.foodHeading}>
          <View>
            <Text style={styles.foodSectionTitle}>Em alta</Text>
            <Text style={styles.foodSectionSubtitle}>Confira os mais amados</Text>
          </View>
        </View>
        <ScrollView
          contentContainerStyle={styles.foodList}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {FOODS.map((food) => <FoodCard key={food.name} food={food} />)}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

const NOTIFICATION_FILTERS = ['Todas', 'Pagamentos', 'Cancelados', 'Entregas', 'Outros'];

export function NotificationsScreen({ onBack, onConfigure }) {
  const [selectedFilter, setSelectedFilter] = useState('Todas');
  const [selectedSection, setSelectedSection] = useState('Notificações');

  return (
    <SafeAreaView edges={[]} style={styles.notificationsScreen}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <View style={styles.notificationTop}>
        <Pressable
          accessibilityLabel="Voltar para início"
          accessibilityRole="button"
          onPress={onBack}
          style={styles.backButton}
        >
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
      </View>
      <View style={styles.notificationTabs}>
        {['Notificações', 'Mensagens'].map((section, index) => (
          <React.Fragment key={section}>
            {index > 0 && <Text style={styles.tabDivider}>|</Text>}
            <Pressable onPress={() => setSelectedSection(section)}>
              <Text style={selectedSection === section ? styles.notificationTabActive : styles.notificationTab}>
                {section}
              </Text>
            </Pressable>
          </React.Fragment>
        ))}
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ScrollView
          contentContainerStyle={styles.filterRail}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {NOTIFICATION_FILTERS.map((filter) => {
            const active = selectedFilter === filter;
            return (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                key={filter}
                onPress={() => setSelectedFilter(filter)}
                style={[styles.filterChip, active && styles.filterSelected]}
              >
                <Text style={[styles.filterText, active && styles.filterTextSelected]}>
                  {filter}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {selectedSection === 'Notificações' ? (
          <View style={styles.notificationContent}>
            <Text style={styles.todayLabel}>Hoje</Text>
            <View style={styles.notificationRow}>
              <View style={styles.notificationIcon}>
                <Image
                  source={require('./assets/koala-enhanced.png')}
                  style={styles.notificationKoala}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.notificationMessage}>
                <View style={styles.notificationTitleRow}>
                  <Text style={styles.notificationTitle}>Alerta Titu</Text>
                  <Text style={styles.notificationDate}>1 OUT, 2026</Text>
                </View>
                <Text style={styles.notificationBody}>Vamos completar seu perfil</Text>
                <Text style={styles.notificationDescription}>
                  Adicione suas restrições e seus pratos preferidos para o Titu procurar as melhores
                  opções para você. Certifique-se de ter seu endereço de entrega cadastrado para
                  receber seu pedido!
                </Text>
                <Pressable accessibilityRole="button" onPress={onConfigure}>
                  <Text style={styles.configureLink}>CONFIGURAR AQUI</Text>
                </Pressable>
              </View>
            </View>
            <View style={styles.notificationDivider} />
          </View>
        ) : (
          <View style={styles.emptyMessages}>
            <Text style={styles.emptyMessagesText}>Você ainda não tem mensagens.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  splash: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    flex: 1,
    justifyContent: 'center',
  },
  splashContent: {
    alignItems: 'center',
    transform: [{ translateY: size(24) }],
    width: '100%',
  },
  koalaStage: {
    alignItems: 'center',
    height: size(88),
    justifyContent: 'center',
    marginBottom: size(7),
    width: size(88),
  },
  koalaImage: {
    height: size(58),
    width: size(58),
  },
  splashTitle: {
    color: COLORS.navy,
    fontSize: size(18),
    fontWeight: '700',
  },
  splashSubtitle: {
    color: '#969696',
    fontSize: size(13),
    marginTop: size(10),
  },
  loadingDots: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: size(6),
    marginTop: size(34),
  },
  loadingDot: {
    backgroundColor: COLORS.orange,
    borderRadius: 99,
    height: size(6),
    width: size(6),
  },
  homeScreen: {
    backgroundColor: COLORS.white,
    flex: 1,
  },
  homeTitleBar: {
    backgroundColor: COLORS.taupe,
    height: size(40),
    justifyContent: 'center',
    paddingLeft: size(14),
  },
  homeTitle: {
    color: COLORS.white,
    fontSize: size(16),
  },
  homeScroll: {
    paddingBottom: size(16),
  },
  greetingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: size(18),
    paddingHorizontal: size(20),
    paddingTop: size(14),
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: '#FFF1DF',
    borderColor: '#F3D7B5',
    borderRadius: size(23),
    borderWidth: 1,
    height: size(46),
    justifyContent: 'center',
    overflow: 'hidden',
    width: size(46),
  },
  avatarImage: {
    height: size(39),
    width: size(39),
  },
  greetingText: {
    flex: 1,
    marginLeft: size(10),
  },
  hello: {
    color: '#222222',
    fontSize: size(16),
    fontWeight: '700',
  },
  address: {
    color: COLORS.muted,
    fontSize: size(12),
    marginTop: size(2),
  },
  addressButton: {
    alignSelf: 'flex-start',
  },
  bellButton: {
    alignItems: 'center',
    height: size(38),
    justifyContent: 'center',
    width: size(38),
  },
  bellShape: {
    alignItems: 'center',
    borderColor: '#171717',
    borderTopLeftRadius: size(12),
    borderTopRightRadius: size(12),
    borderWidth: 1.8,
    height: size(20),
    width: size(18),
  },
  bellClapper: {
    backgroundColor: '#171717',
    borderRadius: 2,
    bottom: -size(5),
    height: size(4),
    position: 'absolute',
    width: size(7),
  },
  tipBanner: {
    backgroundColor: COLORS.orange,
    borderRadius: size(14),
    justifyContent: 'center',
    marginHorizontal: size(20),
    minHeight: size(76),
    overflow: 'visible',
    paddingHorizontal: size(15),
    paddingVertical: size(12),
  },
  tipBubble: {
    borderBottomColor: COLORS.orange,
    borderBottomWidth: size(12),
    borderLeftColor: 'transparent',
    borderLeftWidth: size(8),
    borderRightColor: 'transparent',
    borderRightWidth: size(8),
    position: 'absolute',
    right: size(12),
    top: -size(8),
  },
  tipTitle: {
    color: COLORS.white,
    fontSize: size(14),
    fontWeight: '800',
    marginBottom: size(4),
  },
  tipText: {
    color: '#FFF4E6',
    fontSize: size(12),
    lineHeight: size(16),
    paddingRight: size(8),
  },
  sectionHeading: {
    marginBottom: size(10),
    marginHorizontal: size(22),
    marginTop: size(24),
  },
  sectionTitle: {
    color: COLORS.dark,
    fontSize: size(17),
    fontWeight: '800',
  },
  promoCard: {
    borderRadius: size(14),
    height: size(205),
    marginHorizontal: size(20),
    overflow: 'hidden',
  },
  foodHeading: {
    marginBottom: size(10),
    marginHorizontal: size(22),
    marginTop: size(18),
  },
  foodSectionTitle: {
    color: '#222222',
    fontSize: size(17),
    fontWeight: '800',
  },
  foodSectionSubtitle: {
    color: '#666666',
    fontSize: size(13),
    marginTop: size(2),
  },
  foodList: {
    paddingLeft: size(20),
    paddingRight: size(10),
    paddingBottom: size(8),
  },
  foodCard: {
    backgroundColor: COLORS.white,
    borderColor: '#EFEAE5',
    borderRadius: size(14),
    borderWidth: 1,
    elevation: 2,
    marginRight: size(12),
    overflow: 'hidden',
    shadowColor: '#34281F',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    width: size(176),
  },
  foodImageWrap: {
    height: size(116),
    position: 'relative',
  },
  foodPhoto: {
    backgroundColor: '#F1EDE7',
    height: '100%',
    width: '100%',
  },
  foodPriceBadge: {
    backgroundColor: COLORS.white,
    borderRadius: size(8),
    bottom: size(8),
    left: size(8),
    paddingHorizontal: size(8),
    paddingVertical: size(4),
  },
  foodPrice: {
    color: COLORS.navy,
    fontSize: size(11),
    fontWeight: '700',
  },
  foodCardInfo: {
    paddingHorizontal: size(10),
    paddingBottom: size(10),
    paddingTop: size(9),
  },
  foodName: {
    color: '#242424',
    fontSize: size(13),
    fontWeight: '700',
  },
  foodDetail: {
    color: '#555555',
    fontSize: size(11),
    marginTop: size(4),
  },
  foodRatingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: size(7),
  },
  ratingStar: {
    color: '#F4A900',
    fontSize: size(12),
    marginRight: size(4),
  },
  foodRating: {
    color: '#333333',
    fontSize: size(11),
    fontWeight: '700',
  },
  foodRatingCount: {
    color: COLORS.muted,
    fontSize: size(10),
    marginLeft: size(5),
  },
  notificationsScreen: {
    backgroundColor: COLORS.white,
    flex: 1,
  },
  notificationTop: {
    height: size(52),
    justifyContent: 'center',
    paddingHorizontal: size(12),
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: '#FFB900',
    borderRadius: size(8),
    height: size(36),
    justifyContent: 'center',
    width: size(36),
  },
  backArrow: {
    color: COLORS.white,
    fontSize: size(24),
    fontWeight: '700',
    lineHeight: size(28),
    marginTop: -size(2),
  },
  notificationTabs: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: size(14),
    marginLeft: size(18),
    marginTop: size(8),
  },
  notificationTabActive: {
    color: COLORS.navy,
    fontSize: size(15),
    fontWeight: '800',
  },
  tabDivider: {
    color: '#C79D36',
    fontSize: size(15),
    marginHorizontal: size(10),
  },
  notificationTab: {
    color: COLORS.navy,
    fontSize: size(15),
    fontWeight: '700',
  },
  filterRail: {
    alignItems: 'center',
    paddingHorizontal: size(12),
  },
  filterChip: {
    alignItems: 'center',
    borderColor: '#DEDEDE',
    borderRadius: size(10),
    borderWidth: 1,
    height: size(36),
    justifyContent: 'center',
    marginRight: size(7),
    paddingHorizontal: size(14),
  },
  filterSelected: {
    backgroundColor: '#FFFDF5',
    borderColor: '#E0BD5B',
  },
  filterText: {
    color: COLORS.muted,
    fontSize: size(12),
  },
  filterTextSelected: {
    color: '#B9911B',
  },
  notificationContent: {
    paddingHorizontal: size(14),
  },
  todayLabel: {
    color: COLORS.navy,
    fontSize: size(14),
    fontWeight: '800',
    marginBottom: size(14),
    marginTop: size(18),
  },
  notificationRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  notificationIcon: {
    alignItems: 'center',
    borderColor: COLORS.navy,
    borderRadius: 999,
    borderWidth: 1.5,
    height: size(44),
    justifyContent: 'center',
    marginRight: size(12),
    width: size(44),
  },
  notificationKoala: {
    height: size(34),
    width: size(34),
  },
  notificationMessage: {
    flex: 1,
  },
  notificationTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  notificationTitle: {
    color: COLORS.navy,
    fontSize: size(13),
    fontWeight: '800',
  },
  notificationDate: {
    color: COLORS.navy,
    fontSize: size(10),
  },
  notificationBody: {
    color: COLORS.navy,
    fontSize: size(14),
    fontWeight: '700',
    marginTop: size(5),
  },
  notificationDescription: {
    color: COLORS.orange,
    fontSize: size(12),
    lineHeight: size(18),
    marginTop: size(6),
  },
  configureLink: {
    color: '#D2A000',
    fontSize: size(12),
    fontWeight: '800',
    marginTop: size(7),
    textAlign: 'right',
    textDecorationLine: 'underline',
  },
  notificationDivider: {
    borderBottomColor: '#F0F0F0',
    borderBottomWidth: 1,
    marginLeft: size(56),
    marginTop: size(16),
  },
  emptyMessages: {
    alignItems: 'center',
    padding: size(30),
  },
  emptyMessagesText: {
    color: COLORS.muted,
    fontSize: size(14),
  },
});
