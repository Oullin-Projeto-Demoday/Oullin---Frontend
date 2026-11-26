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
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  filterMealsForProfile,
  FoodDetailsScreen,
  getDietaryProfileRules,
  RESTAURANT_DIRECTORY,
  RestaurantDetailScreen,
} from './SearchScreen';

const COLORS = {
  orange: '#FF8900',
  navy: '#183F67',
  dark: '#191919',
  white: '#FFFFFF',
  muted: '#777777',
};

const scale = Math.min(Dimensions.get('window').width / 390, 1.15);
const size = (value) => Math.round(value * scale);
const HOME_SIDE_GUTTER = 20;

export const FOODS = [
  { image: require('./assets/food-fries-card.png'), price: 'R$ 40,00', name: 'Batata Frita', detail: 'Porção 300g', seller: 'Mcdonalds', rating: '4,8 (452)', category: 'Porções' },
  { image: require('./assets/food-pastel-card.png'), price: 'R$ 15,00', name: 'Pastel', detail: 'Queijo, Pizza e Carne', seller: 'Feira', rating: '4,8 (452)', category: 'Salgados' },
  { image: require('./assets/food-veggie-burger-card.png'), price: 'R$ 52,00', name: 'Hambúrguer veg...', detail: 'Pão e hambúrguer vegetal', seller: 'Vegan house', rating: '4,8 (452)', category: 'Hambúrgueres', detailName: 'Hambúrguer vegano' },
  { image: require('./assets/food-pizza-card.png'), price: 'R$ 45,00', name: 'Pizza grande', detail: 'Marguerita, mus...', seller: 'Habibs', rating: '4,8 (452)', category: 'Pizzas' },
  { image: require('./assets/drink-cola-card.png'), price: 'R$ 9,00', name: 'Coca cola', detail: '600ml', seller: 'Mercadinho da esquina', rating: '4,8 (452)', category: 'Bebidas' },
  { image: require('./assets/drink-cola-zero-card.png'), price: 'R$ 6,00', name: 'Coca-Cola Zero', detail: 'Lata 350ml', seller: 'Primus Adega', rating: '4,8 (452)', category: 'Bebidas' },
  { image: require('./assets/marmita-detail-frango.png'), price: 'R$ 15,99', name: 'Marmita de frango', detail: 'Frango, arroz e feijão', seller: 'Marmitas da Ana', rating: '4,8 (156)', category: 'Marmitas' },
  { image: require('./assets/marmita-card-salada.png'), price: 'R$ 15,99', name: 'Marmita de legumes', detail: 'Legumes, arroz e grão-de-bico', seller: 'Marmitas da Ana', rating: '4,8 (156)', category: 'Marmitas' },
  { image: require('./assets/marmita-card-caseira.png'), price: 'R$ 18,99', name: 'Marmita caseira', detail: 'Refeição completa do dia', seller: 'Marmitas da Ana', rating: '4,8 (156)', category: 'Marmitas' },
  { image: require('./assets/sushi-photo.jpg'), price: 'R$ 42,00', name: 'Combinado de sushi', detail: 'Seleção variada da casa', seller: 'Sushi Oullin', rating: '4,9 (180)', category: 'Sushi' },
  { image: require('./assets/salad-photo.jpg'), price: 'R$ 18,99', name: 'Salada da horta', detail: 'Folhas, vegetais e grãos', seller: 'Salada Viva', rating: '4,7 (112)', category: 'Saladas' },
  { image: require('./assets/dessert-photo.jpg'), price: 'R$ 12,99', name: 'Taça de frutas', detail: 'Frutas com creme', seller: 'Doce Cantinho', rating: '4,9 (208)', category: 'Sobremesas' },
];

const PROMOTIONS = [
  { image: require('./assets/promo-burger-normalized.png'), color: '#81231B', width: 400, height: 250 },
  { image: require('./assets/promo-pizza-figma.png'), color: '#791B3B', width: 400, height: 247 },
  { image: require('./assets/promo-salad-figma.png'), color: '#204D2B', width: 400, height: 247 },
  { image: require('./assets/promo-sushi-figma.png'), color: '#0F3E59', width: 401, height: 247 },
  { image: require('./assets/promo-dessert-normalized.png'), color: '#572C53', width: 400, height: 250 },
  { image: require('./assets/promo-pasta-figma.png'), color: '#913D0B', width: 408, height: 247 },
];

const HOME_FOOD_FEATURES = [
  { type: 'utensils', label: 'Utensílios utilizados' },
  { type: 'ingredientCard', label: 'Ingredientes atualizados' },
  { type: 'nutrition', label: 'Ficha nutricional' },
];

const HOME_FOOD_DETAILS = {
  'Batata Frita': {
    description: 'Batatas fritas servidas quentes, em porção de 300g.',
    ingredients: 'Batata, óleo e sal. Consulte a loja sobre temperos e preparo.',
    utensils: 'Fritadeira, escumadeira e recipiente para servir.',
    filters: ['Porções', 'Vegetariano'],
    dietaryCompatibility: { vegetarian: true },
  },
  Pastel: {
    description: 'Pastel frito com recheio de queijo, pizza ou carne.',
    ingredients: 'O recheio varia entre queijo, pizza e carne. Confirme a opção com a loja.',
    utensils: 'Fritadeira, pegador e utensílios de montagem.',
    filters: ['Salgados', 'Recheio variável'],
    dietaryCompatibility: {},
  },
  'Hambúrguer veg...': {
    description: 'Pão e hambúrguer vegetal preparados pela Vegan House.',
    ingredients: 'Pão, hambúrguer vegetal e acompanhamentos. Consulte a loja para confirmar molhos e ingredientes.',
    utensils: 'Chapa, espátula e utensílios de montagem.',
    filters: ['Hambúrgueres', 'Vegano'],
    dietaryCompatibility: { vegan: true, vegetarian: true },
  },
  'Pizza grande': {
    description: 'Pizza grande de muçarela com molho de tomate e manjericão.',
    ingredients: 'Massa, molho de tomate, muçarela e manjericão. Confirme os ingredientes da massa com a loja.',
    utensils: 'Forno, pá de pizza e cortador.',
    filters: ['Pizzas', 'Vegetariano'],
    dietaryCompatibility: { vegetarian: true },
  },
  'Coca cola': {
    description: 'Refrigerante de cola em embalagem de 600ml.',
    ingredients: 'Consulte o rótulo da embalagem para a lista completa de ingredientes e alergênicos.',
    utensils: 'Embalagem original; copo quando solicitado.',
    filters: ['Bebidas'],
    dietaryCompatibility: {},
  },
  'Coca-Cola Zero': {
    description: 'Refrigerante de cola sem açúcar em lata de 350ml.',
    ingredients: 'Consulte o rótulo da embalagem para a lista completa de ingredientes e alergênicos.',
    utensils: 'Embalagem original; copo quando solicitado.',
    filters: ['Bebidas', 'Sem açúcar'],
    dietaryCompatibility: {},
  },
  'Marmita de frango': {
    description: 'Frango grelhado com arroz e feijão, preparado pela Marmitas da Ana.',
    ingredients: 'Frango, arroz e feijão. Consulte a loja sobre temperos e alergênicos.',
    utensils: 'Grelha, panela e utensílios de montagem.',
    filters: ['Marmitas', 'Refeição completa'],
    dietaryCompatibility: {},
  },
  'Marmita de legumes': {
    description: 'Legumes, arroz e grão-de-bico em uma refeição sem ingredientes de origem animal informados.',
    ingredients: 'Legumes, arroz e grão-de-bico. Confirme preparo e risco de contaminação cruzada com a loja.',
    utensils: 'Panelas, escumadeira e utensílios de montagem.',
    filters: ['Marmitas', 'Vegano', 'Vegetariano'],
    dietaryCompatibility: { vegan: true, vegetarian: true },
  },
  'Marmita caseira': {
    description: 'Refeição caseira completa preparada no dia pela Marmitas da Ana.',
    ingredients: 'A composição varia conforme o prato do dia. Consulte a loja antes de pedir.',
    utensils: 'Panelas, pegadores e utensílios de montagem.',
    filters: ['Marmitas', 'Prato do dia'],
    dietaryCompatibility: {},
  },
  'Combinado de sushi': {
    description: 'Seleção de peças variadas preparadas na hora pelo Sushi Oullin.',
    ingredients: 'Ingredientes variam conforme as peças. Consulte a loja para alergênicos e opções sem peixe.',
    utensils: 'Faca, tábua e utensílios de montagem.',
    filters: ['Sushi', 'Combinados'],
    dietaryCompatibility: {},
  },
  'Salada da horta': {
    description: 'Salada fresca de folhas, vegetais e grãos da Salada Viva.',
    ingredients: 'Folhas, vegetais e grãos. Confirme molhos e acompanhamentos com a loja.',
    utensils: 'Faca, tábua e utensílios de preparo.',
    filters: ['Saladas', 'Vegetariano'],
    dietaryCompatibility: { vegetarian: true },
  },
  'Taça de frutas': {
    description: 'Frutas servidas com creme pelo Doce Cantinho.',
    ingredients: 'Frutas e creme. Consulte a loja sobre ingredientes e alergênicos.',
    utensils: 'Faca, tábua e recipiente para servir.',
    filters: ['Sobremesas', 'Frutas'],
    dietaryCompatibility: { vegetarian: true },
  },
};

function getHomeFoodDetails(food, profileRules) {
  const foodDetails = HOME_FOOD_DETAILS[food.name] || HOME_FOOD_DETAILS[food.detailName] || {};
  const recommendations = filterMealsForProfile(
    FOODS
      .filter((candidate) => candidate.name !== food.name)
      .map((candidate) => ({
        ...candidate,
        ...HOME_FOOD_DETAILS[candidate.name],
      })),
    profileRules,
  );

  return {
    ...food,
    ...foodDetails,
    description: foodDetails.description || food.detail,
    features: HOME_FOOD_FEATURES,
    name: food.detailName || food.name,
    recommendations,
    restaurantName: food.seller || food.restaurantName,
  };
}

const RECOMMENDED_RESTAURANTS = [
  { id: 'subway', name: 'Subway', image: require('./assets/subway-logo.png') },
  { id: 'carolli-fit', name: 'Carólli Fit', image: require('./assets/carolli-fit-logo.png') },
  { id: 'ostia', name: 'Óstia', image: require('./assets/ostia-logo.png') },
  { id: 'emporio-frutaria', name: 'Empório Frutaria', image: require('./assets/emporio-frutaria-logo.png') },
  { id: 'paprica', name: 'Páprica', image: require('./assets/paprica-logo.png') },
  { id: 'grao-fino', name: 'Grão Fino', image: require('./assets/grao-fino-logo.png') },
  { id: 'slim-food', name: 'Slim Food', image: require('./assets/slim-food-logo.png') },
  { id: 'pandan', name: 'Pandan', image: require('./assets/pandan-logo.png') },
  { id: 'raizes', name: 'Raízes', image: require('./assets/natural-tree-logo.png') },
];

const NEARBY_RESTAURANTS = [
  { distance: '05 km', name: 'Vegan Food', category: 'Comidas vegan', rating: '4,8 (452)', image: require('./assets/nearby-vegan-food.png') },
  { distance: '08 km', name: 'Vege House', category: 'Vegetariano', rating: '4,7 (100)', image: require('./assets/nearby-vege-house.png') },
  { distance: '500 metros', name: 'The Pizza Place', category: 'Pizzas variadas', rating: '4,9 (553)', image: require('./assets/nearby-pizza-place.png') },
  { distance: '02 km', name: 'The Lounge', category: 'Apoio ao seu dia', rating: '5,0 (20)', image: require('./assets/nearby-lounge.png') },
];

const RECOMMENDATION_FILTERS = [
  { label: 'Frete grátis', width: 70 },
  { label: 'Retirada na Loja', width: 88 },
  { label: 'Entrega Rápida', width: 116 },
  { label: 'Em Promoção', width: 116 },
];

function getHomeRestaurantDetails(restaurant) {
  const registeredRestaurant = RESTAURANT_DIRECTORY.find(
    (candidate) =>
      candidate.id === restaurant.id ||
      candidate.name.toLocaleLowerCase('pt-BR') === restaurant.name.toLocaleLowerCase('pt-BR'),
  );
  if (registeredRestaurant) return registeredRestaurant;

  return {
    id: restaurant.id,
    name: restaurant.name,
    image: restaurant.image,
    heroImage: restaurant.image,
    rating: restaurant.rating || '4,8 (452)',
    deliveryTime: 'A confirmar',
    minimumOrder: 'A confirmar',
    description: 'Cardápio e dados de entrega ainda não cadastrados.',
    filters: ['Todo Oullin', 'Perfil alimentar', restaurant.category || 'Restaurantes'],
    features: [],
    sections: [],
  };
}

export function RegistrationCompleteScreen({ onFinish }) {
  const dotOne = useRef(new Animated.Value(0.35)).current;
  const dotTwo = useRef(new Animated.Value(0.35)).current;
  const dotThree = useRef(new Animated.Value(0.35)).current;
  const mascotOffset = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const useNativeDriver = Platform.OS !== 'web';
    const dotLoop = (value, delay) => Animated.sequence([
      Animated.delay(delay),
      Animated.loop(Animated.sequence([
        Animated.timing(value, { toValue: 1, duration: 360, useNativeDriver }),
        Animated.timing(value, { toValue: 0.35, duration: 520, useNativeDriver }),
        Animated.delay(220),
      ])),
    ]);
    const dotsAnimation = Animated.parallel([
      dotLoop(dotOne, 0),
      dotLoop(dotTwo, 170),
      dotLoop(dotThree, 340),
    ]);
    const mascotAnimation = Animated.loop(Animated.sequence([
      Animated.timing(mascotOffset, { toValue: -4, duration: 650, useNativeDriver }),
      Animated.timing(mascotOffset, { toValue: 0, duration: 650, useNativeDriver }),
    ]));
    dotsAnimation.start();
    mascotAnimation.start();
    const finishTimer = setTimeout(onFinish, 3800);

    return () => {
      clearTimeout(finishTimer);
      dotsAnimation.stop();
      mascotAnimation.stop();
    };
  }, [dotOne, dotTwo, dotThree, mascotOffset, onFinish]);

  return (
    <SafeAreaView style={styles.splash}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <View style={styles.completeContent}>
        <Animated.Image
          accessibilityLabel="Mascote Oullin carregando"
          resizeMode="contain"
          source={require('./assets/mascote-loading.png')}
          style={[styles.completeMascot, { transform: [{ translateY: mascotOffset }] }]}
        />
        <Image
          accessibilityElementsHidden
          pointerEvents="none"
          resizeMode="stretch"
          source={require('./assets/splash-shadow.png')}
          style={styles.completeShadow}
        />
        <Text style={styles.completeTitle}>{'S\u00f3 um instante...'}</Text>
        <Text style={styles.completeSubtitle}>
          {'Preparando tudo com carinho para voc\u00ea.'}
        </Text>
        <View accessibilityLabel="Carregando" accessibilityRole="progressbar" style={styles.loadingDots}>
          {[dotOne, dotTwo, dotThree].map((opacity, index) => (
            <Animated.View key={index} style={[styles.loadingDot, { opacity }]} />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}
function BellIcon() {
  return (
    <View style={styles.bellIcon}>
      <View style={styles.bellTopDot} />
      <View style={styles.bellShape} />
      <View style={styles.bellBase} />
      <View style={styles.bellClapper} />
    </View>
  );
}

function FoodCard({ food, onPress }) {
  return (
    <Pressable
      accessibilityLabel={`Ver informações de ${food.detailName || food.name}`}
      accessibilityRole="button"
      onPress={onPress}
      style={styles.foodCard}
    >
      <View style={styles.foodImageWrap}>
        <Image
          accessibilityLabel={food.name}
          source={food.image}
          style={styles.foodPhoto}
          resizeMode="cover"
        />
      </View>
      <View style={styles.foodCardInfo}>
        <Text style={styles.foodPrice}>{food.price}</Text>
        <Text numberOfLines={1} style={styles.foodName}>{food.name}</Text>
        <Text numberOfLines={1} style={styles.foodDetail}>{food.detail}</Text>
        <Text numberOfLines={1} style={styles.foodSeller}>{food.seller}</Text>
        <View style={styles.foodRatingRow}>
          <Text style={styles.foodRating}>{food.rating}</Text>
          <Image
            accessibilityLabel="Estrela de avaliação"
            source={require('./assets/rating-star.png')}
            style={styles.ratingStar}
          />
        </View>
      </View>
    </Pressable>
  );
}

function RecommendedRestaurantCard({ restaurant, onPress, showDivider = true }) {
  return (
    <Pressable
      accessibilityLabel={`Ver restaurante ${restaurant.name}`}
      accessibilityRole="button"
      onPress={onPress}
      style={styles.recommendedRestaurantCard}
    >
      <Image source={restaurant.image} resizeMode="contain" style={styles.recommendedLogo} />
      <View style={styles.recommendedRestaurantInfo}>
        <Text numberOfLines={1} style={styles.recommendedRestaurantName}>{restaurant.name}</Text>
        <View style={styles.recommendedRatingRow}>
          <Image
            accessibilityLabel="Estrela de avaliação"
            source={require('./assets/rating-star.png')}
            style={styles.ratingStar}
          />
          <Text style={styles.recommendedRating}>4,8 (452)</Text>
        </View>
        {showDivider && <View style={styles.recommendedDivider} />}
      </View>
    </Pressable>
  );
}

function NearbyRestaurantCard({ restaurant, onPress }) {
  return (
    <Pressable
      accessibilityLabel={`Ver restaurante ${restaurant.name}`}
      accessibilityRole="button"
      onPress={onPress}
      style={styles.nearbyRestaurantCard}
    >
      <Image source={restaurant.image} resizeMode="cover" style={styles.nearbyRestaurantImage} />
      <Text style={styles.nearbyRestaurantDistance}>{restaurant.distance}</Text>
      <Text numberOfLines={1} style={styles.nearbyRestaurantName}>{restaurant.name}</Text>
      <Text numberOfLines={1} style={styles.nearbyRestaurantCategory}>{restaurant.category}</Text>
      <View style={styles.nearbyRatingRow}>
        <Text style={styles.nearbyRating}>{restaurant.rating}</Text>
        <Image
          accessibilityLabel="Estrela de avaliação"
          source={require('./assets/rating-star.png')}
          style={styles.ratingStar}
        />
      </View>
    </Pressable>
  );
}

export function HomeScreen({
  deliveryAddress,
  firstName,
  onAddToCart,
  onNotifications,
  onSelectTab,
  onChickenInfoScreenChange,
  profileSetupComplete,
  profileSelections = {},
}) {
  const [promotionIndex, setPromotionIndex] = useState(0);
  const [selectedFood, setSelectedFood] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const { width: screenWidth } = useWindowDimensions();
  const promotionOpacity = useRef(new Animated.Value(1)).current;
  const currentPromotion = PROMOTIONS[promotionIndex];
  const availablePromotionWidth = Math.max(0, screenWidth - size(40));
  const promotionWidth = Platform.OS === 'web'
    ? Math.min(availablePromotionWidth, 400)
    : availablePromotionWidth;
  const promotionHeight = promotionWidth * 250 / 400;
  const profileRules = getDietaryProfileRules(profileSelections);

  useEffect(() => {
    let active = true;
    const interval = setInterval(() => {
      Animated.timing(promotionOpacity, {
        toValue: 0,
        duration: 220,
        useNativeDriver: Platform.OS !== 'web',
      }).start(({ finished }) => {
        if (!finished || !active) return;
        setPromotionIndex((current) => (current + 1) % PROMOTIONS.length);
        Animated.timing(promotionOpacity, {
          toValue: 1,
          duration: 220,
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

  if (selectedFood) {
    return (
      <FoodDetailsScreen
        item={selectedFood}
        onBack={() => setSelectedFood(null)}
        onAddToCart={onAddToCart}
        onChickenInfoScreenChange={onChickenInfoScreenChange}
        onSelectItem={(food) => setSelectedFood(getHomeFoodDetails(food, profileRules))}
        homeReferenceLayout
        profileSelections={profileSelections}
        screenWidth={screenWidth}
      />
    );
  }

  if (selectedRestaurant) {
    return (
      <RestaurantDetailScreen
        onAddToCart={onAddToCart}
        onBack={() => setSelectedRestaurant(null)}
        onChickenInfoScreenChange={onChickenInfoScreenChange}
        profileSelections={profileSelections}
        restaurant={getHomeRestaurantDetails(selectedRestaurant)}
        screenWidth={screenWidth}
      />
    );
  }

  return (
    <SafeAreaView edges={[]} style={styles.homeScreen}>
      <ScrollView
        contentContainerStyle={styles.homeScroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.greetingRow}>
          <View accessibilityLabel="Foto de perfil" style={styles.avatar} />
          <View style={styles.greetingText}>
            <Text style={styles.hello}>Olá {firstName || 'Oulis'}!</Text>
            <Pressable
              accessibilityLabel={
                deliveryAddress
                  ? 'Gerenciar perfil e endereço pelas notificações'
                  : 'Adicionar endereço pelas notificações'
              }
              accessibilityRole="button"
              onPress={onNotifications}
              style={styles.addressButton}
            >
              <Text numberOfLines={1} style={styles.address}>
                {deliveryAddress || 'Adicionar local de entrega'}
              </Text>
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

        {!profileSetupComplete && (
          <Pressable
            accessibilityRole="button"
            onPress={onNotifications}
            style={styles.tipBanner}
          >
            <View style={styles.tipBubble} />
            <Text style={styles.tipTitle}>Falta pouco para o match perfeito!</Text>
            <Text numberOfLines={1} style={styles.tipText}>
              Defina o que precisa evitar para mostrarmos apenas pratos seguros.
            </Text>
          </Pressable>
        )}
        <View style={[styles.promoCard, {
          width: promotionWidth,
          height: promotionHeight,
          backgroundColor: currentPromotion.color,
        }]}>
          <Animated.Image
            source={currentPromotion.image}
            style={[styles.promoImage, { opacity: promotionOpacity }]}
            resizeMode="contain"
          />
        </View>
        <View style={styles.foodHeading}>
          <View>
            <Text style={styles.foodSectionTitle}>Em alta</Text>
            <Text style={styles.foodSectionSubtitle}>Confira os mais acessados</Text>
          </View>
          <Text style={styles.allOptions}>Todas opções</Text>
        </View>
        <ScrollView
          contentContainerStyle={styles.foodList}
          horizontal
          nestedScrollEnabled
          showsHorizontalScrollIndicator={false}
        >
          {FOODS.map((food) => (
            <FoodCard
              key={food.name}
              food={food}
              onPress={() => setSelectedFood(getHomeFoodDetails(food, profileRules))}
            />
          ))}
        </ScrollView>

        <View style={styles.recommendedSection}>
          <Text style={styles.recommendedHeading}>Recomendados com base no seu perfil</Text>
          <ScrollView
            contentContainerStyle={styles.recommendationFilters}
            horizontal
            nestedScrollEnabled
            showsHorizontalScrollIndicator={false}
          >
            {RECOMMENDATION_FILTERS.map((filter) => (
              <View
                key={filter.label}
                style={[styles.recommendationFilter, { width: size(filter.width) }]}
              >
                <Text style={styles.recommendationFilterText}>{filter.label}</Text>
              </View>
            ))}
          </ScrollView>
          <ScrollView horizontal nestedScrollEnabled showsHorizontalScrollIndicator={false}>
            <View style={styles.recommendationGrid}>
              {[0, 1, 2].map((row) => (
                <View key={row} style={styles.recommendationRow}>
                  {RECOMMENDED_RESTAURANTS.slice(row * 3, row * 3 + 3).map((restaurant) => (
                    <RecommendedRestaurantCard
                      key={restaurant.id}
                      onPress={() => setSelectedRestaurant(restaurant)}
                      restaurant={restaurant}
                      showDivider={row < 2}
                    />
                  ))}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.nearbySection}>
          <Text style={styles.nearbyHeading}>Oullin indica</Text>
          <Text style={styles.nearbySubtitle}>Os melhores perto de você</Text>
          <ScrollView
            contentContainerStyle={styles.nearbyRestaurantList}
            horizontal
            nestedScrollEnabled
            showsHorizontalScrollIndicator={false}
          >
            {NEARBY_RESTAURANTS.map((restaurant) => (
              <NearbyRestaurantCard
                key={restaurant.name}
                onPress={() => setSelectedRestaurant(restaurant)}
                restaurant={restaurant}
              />
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const NOTIFICATION_FILTERS = ['Todas', 'Pagamentos', 'Comidas', 'Entregas', 'Em Promoção'];
const HOME_NOTIFICATIONS = [
  {
    action: 'profile',
    title: 'Vamos completar seu perfil',
    description: 'Adicione suas restrições e seus pratos prediletos para o Titu procurar as melhores opções para você. Certifique-se de logo após cadastrar seu endereço de entrega!',
  },
  {
    action: 'address',
    title: 'Vamos adicionar seu endereço de entrega',
    description: 'Adicione seu endereço de entrega para localizar onde será feita sua entrega.',
  },
];

export function NotificationsScreen({ onBack, onConfigureProfile, onConfigureAddress }) {
  const [selectedFilter, setSelectedFilter] = useState('Todas');
  const [selectedSection, setSelectedSection] = useState('Notificações');

  return (
    <SafeAreaView edges={[]} style={styles.notificationsScreen}>
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
      <ScrollView
        horizontal
        style={styles.notificationFilterScroll}
        contentContainerStyle={styles.filterRail}
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
        <ScrollView
          style={styles.notificationFeed}
          contentContainerStyle={styles.notificationContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.todayLabel}>Hoje</Text>
          {HOME_NOTIFICATIONS.map((notification) => (
            <Pressable
              accessibilityLabel={`${notification.title}. Abrir cadastro`}
              accessibilityRole="button"
              key={notification.title}
              onPress={notification.action === 'profile' ? onConfigureProfile : onConfigureAddress}
              style={styles.notificationCard}
            >
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
                <Text style={styles.notificationBody}>{notification.title}</Text>
                <Text style={styles.notificationDescription}>
                  {notification.description}
                </Text>
              </View>
              <View style={styles.notificationUnreadDot} />
            </Pressable>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.notificationFeed} />
      )}
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
  completeContent: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: size(24),
    paddingTop: size(70),
    position: 'relative',
  },
  completeMascot: {
    height: size(112),
    width: size(112),
  },
  completeShadow: {
    height: size(10),
    marginTop: size(8),
    width: size(100),
  },
  completeTitle: {
    color: '#111111',
    fontSize: size(20),
    fontWeight: '700',
    marginTop: size(4),
    textAlign: 'center',
  },
  completeSubtitle: {
    color: COLORS.muted,
    fontSize: size(16),
    lineHeight: size(23),
    marginTop: size(20),
    textAlign: 'center',
  },
  loadingDots: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: size(12),
    marginTop: size(70),
  },
  loadingDot: {
    backgroundColor: '#FF8500',
    borderRadius: size(5),
    height: size(8),
    width: size(8),
  },
  homeScreen: {
    backgroundColor: COLORS.white,
    flex: 1,
  },
  homeScroll: {
    paddingBottom: size(16),
  },
  greetingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: size(36),
    paddingHorizontal: size(20),
    paddingTop: size(14),
  },
  avatar: {
    backgroundColor: '#D9D9D9',
    borderRadius: size(20),
    height: size(40),
    width: size(40),
  },
  greetingText: {
    flex: 1,
    marginLeft: size(10),
  },
  hello: {
    color: '#222222',
    fontSize: size(10),
    fontWeight: '400',
  },
  address: {
    color: COLORS.muted,
    fontSize: size(7),
    marginTop: size(2),
  },
  addressButton: {
    alignSelf: 'flex-start',
  },
  bellButton: {
    alignItems: 'center',
    backgroundColor: COLORS.orange,
    borderRadius: size(20),
    height: size(40),
    justifyContent: 'center',
    width: size(40),
  },
  bellShape: {
    borderColor: COLORS.white,
    borderTopLeftRadius: size(7),
    borderTopRightRadius: size(7),
    borderTopWidth: size(2),
    borderLeftWidth: size(2),
    borderRightWidth: size(2),
    height: size(15),
    left: size(5),
    position: 'absolute',
    top: size(4),
    width: size(14),
  },
  bellIcon: {
    height: size(24),
    position: 'relative',
    width: size(24),
  },
  bellTopDot: {
    backgroundColor: COLORS.white,
    borderRadius: size(2),
    height: size(3),
    left: size(10),
    position: 'absolute',
    top: size(1),
    width: size(3),
  },
  bellBase: {
    backgroundColor: COLORS.white,
    height: size(2),
    left: size(3),
    position: 'absolute',
    top: size(19),
    width: size(18),
  },
  bellClapper: {
    backgroundColor: COLORS.white,
    borderRadius: size(1.5),
    bottom: size(1),
    height: size(3),
    position: 'absolute',
    width: size(4),
    alignSelf: 'center',
  },
  tipBanner: {
    backgroundColor: COLORS.orange,
    borderRadius: size(14),
    justifyContent: 'center',
    marginHorizontal: size(22),
    minHeight: size(52),
    overflow: 'visible',
    paddingHorizontal: size(18),
    paddingVertical: size(6),
  },
  tipBubble: {
    borderBottomColor: COLORS.orange,
    borderBottomWidth: size(16),
    borderLeftColor: 'transparent',
    borderLeftWidth: size(10),
    borderRightColor: 'transparent',
    borderRightWidth: size(10),
    position: 'absolute',
    right: size(12),
    top: -size(14),
  },
  tipTitle: {
    color: COLORS.white,
    fontSize: size(11),
    fontWeight: '600',
    marginBottom: size(2),
  },
  tipText: {
    color: '#FFF4E6',
    fontSize: size(7),
    lineHeight: size(9),
    paddingRight: size(8),
  },
  promoCard: {
    alignSelf: 'center',
    backgroundColor: '#81231B',
    borderRadius: size(10),
    marginTop: size(28),
    overflow: 'hidden',
  },
  promoImage: {
    height: '100%',
    borderRadius: size(10),
    width: '100%',
  },
  foodHeading: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: size(16),
    marginHorizontal: size(HOME_SIDE_GUTTER),
    marginTop: size(24),
  },
  foodSectionTitle: {
    color: '#222222',
    fontSize: size(10),
    fontWeight: '400',
  },
  foodSectionSubtitle: {
    color: '#777777',
    fontSize: size(7),
    fontWeight: '400',
    marginTop: size(2),
  },
  allOptions: {
    backgroundColor: '#FFD21A',
    borderRadius: size(8),
    color: '#222222',
    fontSize: size(6),
    overflow: 'hidden',
    paddingHorizontal: size(7),
    paddingVertical: size(2),
  },
  foodList: {
    paddingLeft: size(HOME_SIDE_GUTTER),
    paddingRight: size(HOME_SIDE_GUTTER),
    paddingBottom: size(8),
  },
  foodCard: {
    marginRight: size(12),
    width: size(94),
  },
  foodImageWrap: {
    backgroundColor: '#F7F7F7',
    borderRadius: size(9),
    height: size(94),
    overflow: 'hidden',
    width: '100%',
  },
  foodPhoto: {
    height: '100%',
    width: '100%',
  },
  foodPrice: {
    color: COLORS.dark,
    fontSize: size(10),
    marginBottom: size(4),
  },
  foodCardInfo: {
    paddingBottom: size(8),
    paddingHorizontal: size(4),
    paddingTop: size(7),
  },
  foodName: {
    color: '#242424',
    fontSize: size(10),
    fontWeight: '400',
    lineHeight: size(13),
  },
  foodDetail: {
    color: '#555555',
    fontSize: size(9),
    lineHeight: size(12),
    marginTop: size(2),
  },
  foodSeller: {
    color: '#444444',
    fontSize: size(6),
    lineHeight: size(11),
    marginTop: size(2),
  },
  foodRatingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: size(4),
    justifyContent: 'center',
    marginTop: size(7),
  },
  foodRating: {
    color: '#333333',
    fontSize: size(9),
  },
  ratingStar: {
    height: size(10),
    width: size(10),
  },
  recommendedSection: {
    marginTop: size(16),
  },
  recommendedHeading: {
    color: '#161616',
    fontSize: size(13),
    fontWeight: '700',
    marginBottom: size(16),
    marginHorizontal: size(HOME_SIDE_GUTTER),
  },
  recommendationFilters: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: size(9),
    paddingHorizontal: size(HOME_SIDE_GUTTER),
    paddingBottom: size(5),
  },
  recommendationFilter: {
    alignItems: 'center',
    backgroundColor: '#124F8C',
    borderRadius: 99,
    height: size(27),
    justifyContent: 'center',
  },
  recommendationFilterText: {
    color: COLORS.white,
    fontSize: size(8),
  },
  recommendationGrid: {
    paddingHorizontal: size(HOME_SIDE_GUTTER),
    paddingTop: size(5),
  },
  recommendationRow: {
    flexDirection: 'row',
    gap: size(20),
  },
  recommendedRestaurantCard: {
    alignItems: 'center',
    flexDirection: 'row',
    height: size(84),
    width: size(220),
  },
  recommendedLogo: {
    height: size(66),
    marginRight: size(10),
    width: size(66),
  },
  recommendedRestaurantInfo: {
    alignSelf: 'stretch',
    flex: 1,
    justifyContent: 'center',
    paddingRight: size(5),
  },
  recommendedRestaurantName: {
    color: '#1B1B1B',
    fontSize: size(10),
    fontWeight: '400',
    marginBottom: size(4),
  },
  recommendedRatingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: size(4),
  },
  recommendedRating: {
    color: '#222222',
    fontSize: size(10),
  },
  recommendedDivider: {
    borderBottomColor: '#D1D1D1',
    borderBottomWidth: 1,
    marginTop: size(15),
    width: '100%',
  },
  nearbySection: {
    marginTop: size(12),
  },
  nearbyHeading: {
    color: '#1A1A1A',
    fontSize: size(12),
    fontWeight: '500',
    marginHorizontal: size(HOME_SIDE_GUTTER),
  },
  nearbySubtitle: {
    color: '#1A1A1A',
    fontSize: size(12),
    marginBottom: size(14),
    marginHorizontal: size(HOME_SIDE_GUTTER),
  },
  nearbyRestaurantList: {
    paddingHorizontal: size(HOME_SIDE_GUTTER),
    paddingBottom: size(16),
  },
  nearbyRestaurantCard: {
    marginRight: size(10),
    width: size(90),
  },
  nearbyRestaurantImage: {
    borderRadius: size(14),
    height: size(90),
    width: '100%',
  },
  nearbyRestaurantDistance: {
    color: '#202020',
    fontSize: size(10),
    marginTop: size(6),
  },
  nearbyRestaurantName: {
    color: '#202020',
    fontSize: size(10),
    marginTop: size(3),
  },
  nearbyRestaurantCategory: {
    color: '#202020',
    fontSize: size(10),
    marginTop: size(3),
  },
  nearbyRatingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: size(5),
    marginTop: size(5),
  },
  nearbyRating: {
    color: '#202020',
    fontSize: size(10),
  },
  notificationsScreen: {
    backgroundColor: '#F2F2F2',
    flex: 1,
  },
  notificationTop: {
    backgroundColor: COLORS.white,
    height: size(85),
    justifyContent: 'center',
    paddingHorizontal: size(14),
  },
  backButton: {
    alignItems: 'center',
    height: size(28),
    justifyContent: 'center',
    width: size(28),
  },
  backArrow: {
    color: '#FFB400',
    fontSize: size(22),
    fontWeight: '400',
    lineHeight: size(26),
  },
  notificationTabs: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    height: size(42),
    paddingHorizontal: size(16),
  },
  notificationTabActive: {
    color: '#111111',
    fontSize: size(16),
    fontWeight: '700',
  },
  tabDivider: {
    color: '#FFB400',
    fontSize: size(16),
    marginHorizontal: size(7),
  },
  notificationTab: {
    color: '#111111',
    fontSize: size(16),
    fontWeight: '700',
  },
  notificationFilterScroll: {
    backgroundColor: COLORS.white,
    flexGrow: 0,
    flexShrink: 0,
    height: size(60),
  },
  filterRail: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: size(12),
  },
  filterChip: {
    alignItems: 'center',
    borderColor: '#D4D4D4',
    borderRadius: size(7),
    borderWidth: 1,
    height: size(30),
    justifyContent: 'center',
    marginRight: size(7),
    paddingHorizontal: size(12),
  },
  filterSelected: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.orange,
  },
  filterText: {
    color: '#124F8C',
    fontSize: size(9),
  },
  filterTextSelected: {
    color: '#124F8C',
  },
  notificationFeed: {
    backgroundColor: '#F2F2F2',
    flex: 1,
  },
  notificationContent: {
    paddingBottom: size(10),
    paddingTop: size(16),
  },
  todayLabel: {
    color: '#111111',
    fontSize: size(14),
    fontWeight: '700',
    marginBottom: size(18),
    marginHorizontal: size(18),
  },
  notificationCard: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: size(7),
    flexDirection: 'row',
    marginBottom: size(5),
    marginHorizontal: size(8),
    paddingHorizontal: size(7),
    paddingVertical: size(6),
  },
  notificationIcon: {
    alignItems: 'center',
    borderColor: COLORS.navy,
    borderRadius: 999,
    borderWidth: size(1.5),
    height: size(36),
    justifyContent: 'center',
    marginRight: size(6),
    width: size(36),
  },
  notificationKoala: {
    height: size(28),
    width: size(28),
  },
  notificationMessage: {
    flex: 1,
    paddingRight: size(5),
  },
  notificationTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  notificationTitle: {
    color: '#124F8C',
    fontSize: size(12),
    fontWeight: '700',
  },
  notificationDate: {
    color: '#111111',
    fontSize: size(9),
  },
  notificationBody: {
    color: '#111111',
    fontSize: size(12),
    fontWeight: '400',
    marginTop: size(1),
  },
  notificationDescription: {
    color: '#333333',
    fontSize: size(8),
    lineHeight: size(12),
    marginTop: size(2),
  },
  notificationUnreadDot: {
    backgroundColor: '#FF8900',
    borderRadius: size(3),
    height: size(7),
    width: size(7),
  },
});
