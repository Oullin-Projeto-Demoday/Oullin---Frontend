import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Image,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const COLORS = {
  orange: '#FF8500',
  amber: '#FFB400',
  blue: '#124F8C',
  text: '#171717',
  muted: '#777777',
  white: '#FFFFFF',
};

const FOOD_CATEGORIES = [
  {
    label: 'Hambúrguer',
    background: require('./assets/search-circle-orange-1.png'),
    image: require('./assets/search-food-burger.png'),
  },
  {
    label: 'Sushi',
    background: require('./assets/search-circle-yellow-1.png'),
    image: require('./assets/search-food-sushi.png'),
  },
  {
    label: 'Pizza',
    background: require('./assets/search-circle-orange-2.png'),
    image: require('./assets/search-food-pizza.png'),
  },
  {
    label: 'Porções',
    background: require('./assets/search-circle-yellow-2.png'),
    image: require('./assets/search-food-fries.png'),
  },
];

const HOME_PROFILE_PROMOTIONS = [
  {
    label: 'Hambúrguer',
    category: 'Hambúrguer',
    start: 16,
  },
  {
    label: 'Pizza',
    category: 'Pizza',
    start: 206,
  },
  {
    label: 'Saladas',
    category: 'Saladas',
    start: 397,
  },
  {
    label: 'Sushi',
    category: 'Sushi',
    start: 588,
  },
  {
    label: 'Doces',
    category: 'Doces',
    start: 778,
  },
  {
    label: 'Massas',
    category: 'Massas',
    start: 969,
  },
];

const HOME_PROFILE_PROMOTION_PAGES = [
  { start: 16, promotions: HOME_PROFILE_PROMOTIONS.slice(0, 2) },
  { start: 397, promotions: HOME_PROFILE_PROMOTIONS.slice(2, 4) },
  { start: 778, promotions: HOME_PROFILE_PROMOTIONS.slice(4, 6) },
];

const FOOD_CARDS = [
  {
    id: 'burger',
    restaurantId: 'burger-house',
    name: 'Hambúrguer artesanal',
    category: 'Hambúrguer',
    image: require('./assets/burger-photo.jpg'),
    backgroundColor: '#B43724',
  },
  {
    id: 'pizza',
    restaurantId: 'pizza-da-vila',
    name: 'Pizza artesanal',
    category: 'Pizza',
    image: require('./assets/pizza-photo.jpg'),
    backgroundColor: '#8D1737',
  },
  {
    id: 'salad',
    restaurantId: 'salada-viva',
    name: 'Salada fresca',
    category: 'Saladas',
    image: require('./assets/salad-photo.jpg'),
    backgroundColor: '#387C4B',
  },
  {
    id: 'pasta',
    restaurantId: 'massa-da-casa',
    name: 'Massa da casa',
    category: 'Massas',
    image: require('./assets/pasta-photo.jpg'),
    backgroundColor: '#B76520',
  },
  {
    id: 'dessert',
    restaurantId: 'doce-cantinho',
    name: 'Doces especiais',
    category: 'Doces',
    image: require('./assets/dessert-photo.jpg'),
    backgroundColor: '#A74569',
  },
  {
    id: 'drink',
    restaurantId: 'bebidas-geladas',
    name: 'Bebidas geladas',
    category: 'Bebidas',
    image: require('./assets/drink-photo.jpg'),
    backgroundColor: '#357C91',
  },
  {
    id: 'sushi',
    restaurantId: 'sushi-oullin',
    name: 'Sushi variado',
    category: 'Sushi',
    image: require('./assets/sushi-photo.jpg'),
    backgroundColor: '#624332',
  },
  {
    id: 'meal',
    restaurantId: 'marmitas-da-ana',
    name: 'Marmitas da semana',
    category: 'Marmitas',
    image: require('./assets/meal-banner-user.png'),
    backgroundColor: '#537344',
  },
  {
    id: 'fries',
    restaurantId: 'burger-house',
    name: 'Batata frita',
    category: 'Porções',
    image: require('./assets/food-fries-card.png'),
    backgroundColor: '#A85A18',
  },
  {
    id: 'pastel',
    restaurantId: 'doce-cantinho',
    name: 'Pastel de feira',
    category: 'Salgados',
    image: require('./assets/food-pastel-card.png'),
    backgroundColor: '#B46B20',
  },
  {
    id: 'veggie-burger',
    restaurantId: 'burger-house',
    name: 'Hambúrguer vegano',
    category: 'Hambúrguer',
    image: require('./assets/food-veggie-burger-card.png'),
    backgroundColor: '#3D6944',
  },
  {
    id: 'pizza-margherita',
    restaurantId: 'pizza-da-vila',
    name: 'Pizza marguerita',
    category: 'Pizza',
    image: require('./assets/food-pizza-card.png'),
    backgroundColor: '#9A3A25',
  },
  {
    id: 'cola',
    restaurantId: 'bebidas-geladas',
    name: 'Refrigerante de cola',
    category: 'Bebidas',
    image: require('./assets/drink-cola-card.png'),
    backgroundColor: '#872928',
  },
  {
    id: 'cola-zero',
    restaurantId: 'bebidas-geladas',
    name: 'Refrigerante cola zero',
    category: 'Bebidas',
    image: require('./assets/drink-cola-zero-card.png'),
    backgroundColor: '#333333',
  },
  {
    id: 'meal-chicken',
    restaurantId: 'marmitas-da-ana',
    name: 'Marmita de frango',
    category: 'Marmitas',
    image: require('./assets/marmita-detail-frango.png'),
    backgroundColor: '#7B5933',
  },
  {
    id: 'meal-vegetables',
    restaurantId: 'marmitas-da-ana',
    name: 'Marmita de legumes',
    category: 'Marmitas',
    image: require('./assets/marmita-card-salada.png'),
    backgroundColor: '#477044',
  },
  {
    id: 'meal-homestyle',
    restaurantId: 'marmitas-da-ana',
    name: 'Marmita caseira',
    category: 'Marmitas',
    image: require('./assets/marmita-card-caseira.png'),
    backgroundColor: '#76513C',
  },
];

const SEARCH_RESULT_PRODUCTS = [
  {
    id: 'lanche-natural',
    name: 'Lanche Natural - Subway',
    detailName: 'Lanche Natural',
    restaurantName: 'Subway',
    price: 'R$ 24,90',
    description: 'Pão integral com frango, cenoura, alface e molho leve.',
    restaurantLabel: 'Restaurante',
    image: require('./assets/subway-logo.png'),
  },
  {
    id: 'marmita-200g',
    name: 'Marmita 200g - Marmitas da jô',
    detailName: 'Marmita 200g',
    restaurantName: 'Marmitas da jô',
    price: 'R$ 15,99',
    description: 'Arroz, feijão, frango grelhado e legumes da estação.',
    restaurantLabel: 'restaurante',
    image: require('./assets/search-result-store-marmitas-ju.png'),
  },
  {
    id: 'batata-cozida',
    name: 'Batata Cozida - Potato House',
    detailName: 'Batata Cozida',
    restaurantName: 'Potato House',
    price: 'R$ 12,00',
    description: 'Batata cozida com ervas, sal e azeite.',
    restaurantLabel: 'restaurante',
    image: require('./assets/search-result-store-potato-house.png'),
  },
  {
    id: 'sanduiche-frango',
    name: 'Sanduíche de Frango - KFC',
    detailName: 'Sanduíche de Frango',
    restaurantName: 'KFC',
    price: 'R$ 19,90',
    description: 'Pão, frango, alface, tomate e molho da casa.',
    restaurantLabel: 'restaurante',
    image: require('./assets/search-result-store-kfc.png'),
  },
  {
    id: 'suco-natural',
    name: 'Suco Natural - Saudavel Life',
    detailName: 'Suco Natural',
    restaurantName: 'Saudavel Life',
    price: 'R$ 10,00',
    description: 'Suco de fruta preparado com água e gelo.',
    restaurantLabel: 'restaurante',
    image: require('./assets/search-result-store-saudavel-life.png'),
  },
  {
    id: 'brigadeiro',
    name: 'Brigadeiro - Doce Abraço',
    detailName: 'Brigadeiro',
    restaurantName: 'Doce Abraço',
    price: 'R$ 8,99',
    description: 'Brigadeiro de chocolate com cobertura granulada.',
    restaurantLabel: 'restaurante',
    image: require('./assets/search-result-store-doce-abraco.png'),
  },
  {
    id: 'bife-acebolado',
    name: 'Bife Acebolado - Outback',
    detailName: 'Bife Acebolado',
    restaurantName: 'Outback',
    price: 'R$ 34,90',
    description: 'Bife grelhado com cebola dourada e temperos.',
    restaurantLabel: 'restaurante',
    image: require('./assets/search-result-store-outback.png'),
  },
  {
    id: 'cafe-da-manha',
    name: 'Cafés Da Manhã - Manhã Leve',
    detailName: 'Café da Manhã',
    restaurantName: 'Manhã Leve',
    price: 'R$ 22,90',
    description: 'Café da manhã completo com pão e fruta.',
    restaurantLabel: 'restaurante',
    image: require('./assets/search-result-store-manha-leve.png'),
  },
  {
    id: 'bolo-de-milho',
    name: 'Bolo De Milho - Quintal Do Milho',
    detailName: 'Bolo de Milho',
    restaurantName: 'Quintal Do Milho',
    price: 'R$ 12,00',
    description: 'Fatia de bolo de milho preparada pela casa.',
    restaurantLabel: 'restaurante',
    image: require('./assets/search-result-store-quintal-milho.png'),
  },
];

const SEARCH_FILTERS = [
  'Todo Oullin',
  'Perfil alimentar',
  'restaurantes',
  'bebidas',
  'região',
  'menor preço',
];

const SEARCH_FILTER_WIDTHS = {
  'Todo Oullin': 70,
  'Perfil alimentar': 92,
  restaurantes: 82,
  bebidas: 89,
  região: 70,
  'menor preço': 90,
};

const FOOD_CARD_PRICES = {
  burger: 28.9,
  pizza: 38.9,
  salad: 18.99,
  pasta: 18.99,
  dessert: 12.99,
  drink: 9.99,
  sushi: 32,
  meal: 15.99,
  fries: 12,
  pastel: 8.99,
  'veggie-burger': 24.9,
  'pizza-margherita': 34.9,
  cola: 6.99,
  'cola-zero': 6.99,
  'meal-chicken': 15.99,
  'meal-vegetables': 15.99,
  'meal-homestyle': 18.99,
};

const RECENT_STORES = [
  {
    id: 'saudavel-life',
    name: 'Saudável Life',
    label: 'Saudável\nLife',
    image: require('./assets/saudavel-life-logo.png'),
  },
  {
    id: 'subway',
    name: 'Subway',
    label: 'Subway',
    image: require('./assets/recent-store-ubuwa.png'),
  },
  {
    id: 'burger-house',
    name: 'KFC',
    label: 'KFC',
    image: require('./assets/recent-store-kfc.png'),
  },
  {
    id: 'marmitas-da-ana',
    name: 'Marmitas da Ju',
    label: 'Marmitas\nda Ju',
    image: require('./assets/recent-store-marmitas-ju.png'),
  },
];
const INITIAL_RECENT_SEARCHES = ['Pizza', 'Pastel', 'torta', 'filé a parmegiana'];
const SEARCH_HISTORY_STORAGE_KEY = '@oullin/search-history';

const PRODUCT_INFORMATION_FEATURES = [
  { type: 'utensils', label: 'Utensílios utilizados' },
  { type: 'ingredients', label: 'Ingredientes atualizados' },
  { type: 'nutrition', label: 'Ficha nutricional' },
];

const MEAL_FEATURES = PRODUCT_INFORMATION_FEATURES;

const DEFAULT_RESTAURANT_FEATURES = [
  { type: 'utensils', label: 'Utensílios do preparo' },
  { type: 'ingredientCard', label: 'Dados de ingredientes' },
];

const DEFAULT_FOOD_FEATURES = PRODUCT_INFORMATION_FEATURES;

const MEAL_SEARCH_ITEMS = [
  {
    id: 'meal-chicken',
    name: 'Marmita Simples',
    detailName: 'Marmita de frango',
    price: 'R$ 15,99',
    description: 'Frango grelhado, arroz e feijão.',
    image: require('./assets/marmita-detail-frango.png'),
    filters: ['Sem glúten', 'Sem lactose'],
    dietaryCompatibility: { vegan: false, vegetarian: false, glutenFree: true, lactoseFree: true },
    features: MEAL_FEATURES,
  },
  {
    id: 'meal-vegetables',
    name: 'Marmita de legumes',
    detailName: 'Marmita vegana de legumes',
    price: 'R$ 15,99',
    description: 'Legumes, arroz integral e grão-de-bico.',
    image: require('./assets/marmita-card-salada.png'),
    filters: ['Vegano', 'Sem glúten', 'Sem lactose'],
    dietaryCompatibility: { vegan: true, vegetarian: true, glutenFree: true, lactoseFree: true },
    features: MEAL_FEATURES,
  },
  {
    id: 'meal-homestyle',
    name: 'Marmita caseira',
    detailName: 'Marmita caseira de frango',
    price: 'R$ 18,99',
    description: 'Frango, arroz, feijão e legumes preparados no dia.',
    image: require('./assets/marmita-card-caseira.png'),
    filters: ['Sem glúten', 'Sem lactose'],
    dietaryCompatibility: { vegan: false, vegetarian: false, glutenFree: true, lactoseFree: true },
    features: MEAL_FEATURES,
  },
];

const SAUDAVEL_LIFE_CHICKEN_FILTERS = ['Sem Glúten', 'Sem Lactose', 'Proteico', 'Low Carb'];

const SAUDAVEL_LIFE_CHICKEN_FEATURES = [
  { type: 'utensils', label: 'Utensílios dedicados' },
  { type: 'ingredients', label: 'Ingredientes atualizados' },
  { type: 'nutrition', label: 'Ficha nutricional' },
];

const CHICKEN_UTENSILS = [
  {
    title: 'Tábua de corte',
    description: 'Usada para apoiar e cortar o frango cru.',
    image: require('./assets/chicken-cutting-board.png'),
  },
  {
    title: 'Faca de cozinha',
    description: 'Usada para cortar e preparar o filé de frango.',
    image: require('./assets/chicken-kitchen-knife.png'),
  },
  {
    title: 'Frigideira',
    description: 'Usada para grelhar o frango.',
    image: require('./assets/chicken-frying-pan.png'),
  },
  {
    title: 'Pegador e espátula',
    description: 'Usados para virar e retirar o frango da frigideira.',
    image: require('./assets/chicken-tongs-spatula.png'),
  },
];

const CHICKEN_INGREDIENTS = [
  'Peito de frango grelhado',
  'Arroz Cozido',
  'Purê de batata',
  'Cebolinha e temperos',
];

const CHICKEN_ALLERGENS = [
  { name: 'Glúten', isContained: false },
  { name: 'Lactose', isContained: false },
  { name: 'Ovo', isContained: false },
  { name: 'Soja', isContained: false },
  { name: 'Amendoim e castanhas', isContained: false },
  { name: 'Carne', isContained: true },
  { name: 'Batata', isContained: true },
  { name: 'Arroz', isContained: true },
];

const CHICKEN_NUTRITION_COMPONENTS = [
  { component: 'Energia', unit: 'KJ' },
  { component: 'Energia', unit: 'kcal' },
  { component: 'Umidade', unit: 'g' },
  { component: 'Carboidrato total', unit: 'g' },
  { component: 'Carboidrato disponível', unit: 'g' },
  { component: 'Proteína', unit: 'g' },
  { component: 'Lipídios', unit: 'g' },
  { component: 'Fibra alimentar', unit: 'g' },
  { component: 'Álcool', unit: 'g' },
  { component: 'Cinzas', unit: 'g' },
  { component: 'Colesterol', unit: 'Mg' },
  { component: 'Ácidos graxos saturados', unit: 'g' },
  { component: 'Ácidos graxos monoinsaturados', unit: 'g' },
  { component: 'Ácidos Graxos polinsaturados', unit: 'g' },
];

const CHICKEN_NUTRITION_TABLES = {
  'Peito de frango grelhado': {
    title: 'Peito de frango grelhado',
    values: [
      '637', '150', '64,0', '0,00', '0,00', '32,1', '2,45',
      '0,00', '0,00', '1,44', '1,44', '89,1', '0,90', '0,30',
    ],
  },
  'Arroz Cozido': {
    title: 'Arroz cozido',
    values: [
      '555', '131', '66,9', '30,0', '28,8', '32,1', '2,45',
      '0,00', '0,00', '1,44', '1,44', '89,1', '0,90', '0,30',
    ],
  },
  'Purê de batata': {
    title: 'Pure Batata',
    values: [
      '272', '65', '85,2', '10,9', '9,62', '1,60', '1,93',
      '1,21', '0,00', '0,48', '1,98', '0,75', '0,44', '0,57',
    ],
  },
  'Cebolinha e temperos': {
    title: 'Cebolinha e Temperos',
    values: [
      '42', '10', '97,0', '1,60', '0,92', '0,89', '0,15',
      '0,68', '0,00', '0,37', '0,00', '0,03', '0,02', '0,06',
    ],
  },
};

const SAUDAVEL_LIFE_CHICKEN_RECOMMENDATIONS = [
  {
    id: 'saudavel-life-chicken-simple-1',
    name: 'Marmita Simples',
    detailName: 'Marmita de frango',
    price: 'R$ 15,99',
    description: 'Frango grelhado, arroz e feijão.',
    ingredients: 'Frango, arroz, feijão e temperos. Confirme ingredientes e alergênicos com a loja.',
    utensils: 'Grelha ou frigideira, panela, pegadores e utensílios de montagem.',
    image: require('./assets/restaurant-search-marmitas-ju-1.png'),
  },
  {
    id: 'saudavel-life-chicken-simple-2',
    name: 'Marmita Simples',
    detailName: 'Marmita de legumes',
    price: 'R$ 15,99',
    description: 'Legumes, arroz integral e grão-de-bico.',
    ingredients: 'Legumes, arroz integral e grão-de-bico. Confirme preparo e contaminação cruzada com a loja.',
    utensils: 'Panelas, escumadeira e utensílios de montagem.',
    image: require('./assets/restaurant-search-marmitas-ju-3.png'),
  },
  {
    id: 'saudavel-life-chicken-simple-3',
    name: 'Marmita Simples',
    detailName: 'Marmita caseira',
    price: 'R$ 15,99',
    description: 'Refeição completa preparada no dia; a composição varia conforme o cardápio.',
    ingredients: 'A composição varia conforme o prato do dia. Consulte a loja para confirmar ingredientes e alergênicos.',
    utensils: 'Panelas, pegadores e utensílios de montagem.',
    image: require('./assets/restaurant-search-marmitas-ju-2.png'),
  },
];

const RESTAURANT_MEALS = [
  {
    id: 'saudavel-life-chicken',
    name: 'Marmita simples',
    detailName: 'Marmita de frango',
    price: 'R$ 15,99',
    description: 'Arroz, frango e legumes preparados no dia.',
    ingredients: 'Arroz, frango, legumes e temperos. Confirme a composição e os alergênicos com a loja.',
    utensils: 'Panelas, pegadores e utensílios de montagem.',
    image: require('./assets/marmita-detail-frango.png'),
    filters: SAUDAVEL_LIFE_CHICKEN_FILTERS,
    features: SAUDAVEL_LIFE_CHICKEN_FEATURES,
    recommendations: SAUDAVEL_LIFE_CHICKEN_RECOMMENDATIONS,
  },
  {
    name: 'Marmita de legumes',
    price: 'R$ 15,99',
    description: 'Legumes frescos, arroz integral e grão-de-bico.',
    ingredients: 'Legumes, arroz integral e grão-de-bico. Confirme preparo e risco de contaminação cruzada com a loja.',
    utensils: 'Panelas, escumadeira e utensílios de montagem.',
    image: require('./assets/marmita-card-salada.png'),
  },
  {
    name: 'Marmita caseira',
    price: 'R$ 18,99',
    description: 'Uma refeição completa feita com ingredientes selecionados.',
    ingredients: 'A composição varia conforme o prato do dia. Consulte a loja para confirmar ingredientes e alergênicos.',
    utensils: 'Panelas, pegadores e utensílios de montagem.',
    image: require('./assets/marmita-card-caseira.png'),
  },
];

const RESTAURANT_FOODS = [
  {
    name: 'Salada fresca',
    price: 'R$ 12,99',
    description: 'Salada fresca com folhas e vegetais variados.',
    image: require('./assets/salad-photo.jpg'),
  },
  {
    name: 'Massa da casa',
    price: 'R$ 18,99',
    description: 'Massa preparada com molho e ingredientes frescos.',
    image: require('./assets/pasta-photo.jpg'),
  },
  {
    name: 'Hambúrguer artesanal',
    price: 'R$ 25,00',
    description: 'Hambúrguer artesanal com ingredientes selecionados.',
    image: require('./assets/burger-photo.jpg'),
  },
];

function makeMenuItem(name, price, description, image) {
  return { name, detailName: name, price, description, image };
}

const UNCONFIRMED_FOOD_SAFETY = {
  glutenFree: 'Não confirmado com o restaurante',
  lactoseFree: 'Não confirmado com o restaurante',
  crossContamination: 'Não informado pelo restaurante',
  equipment: 'Não informado pelo restaurante',
};

export const RESTAURANT_DIRECTORY = [
  {
    id: 'subway',
    name: 'Subway',
    verified: true,
    image: require('./assets/subway-logo.png'),
    heroImage: require('./assets/subway-logo.png'),
    rating: '4,8 (452)',
    deliveryTime: '25–40 min',
    minimumOrder: 'R$ 20,00',
    description: 'Lanches naturais e opções frescas.',
    foodSafety: UNCONFIRMED_FOOD_SAFETY,
    filters: ['Todo Oullin', 'Perfil alimentar', 'lanches', 'menor preço'],
    features: [],
    sections: [{
      title: 'Lanches',
      items: [
        makeMenuItem('Lanche Natural', 'R$ 24,90', 'Lanche natural preparado pela loja.', require('./assets/subway-logo.png')),
      ],
    }],
  },
  {
    id: 'marmitas-da-jo',
    name: 'Marmitas da Jô',
    verified: true,
    image: require('./assets/search-result-store-marmitas-ju.png'),
    heroImage: require('./assets/restaurant-search-marmitas-ju-1.png'),
    rating: '4,8 (452)',
    deliveryTime: '40-50 min',
    deliveryFee: 'R$ 5,99',
    minimumOrder: 'R$ 5,99',
    description: 'Marmitas preparadas pela loja.',
    foodSafety: UNCONFIRMED_FOOD_SAFETY,
    filters: ['Todo Oullin', 'Perfil alimentar', 'marmitas', 'menor preço'],
    features: [],
    sections: [{
      title: 'Marmitas',
      items: [
        {
          id: 'marmitas-da-jo-simples-1',
          ...makeMenuItem(
            'Frango ao molho com arroz',
            'R$ 15,99',
            'Frango ao molho acompanhado de arroz e legumes.',
            require('./assets/restaurant-search-marmitas-ju-1.png'),
          ),
          ingredients: 'Frango, arroz, legumes e molho da casa. Consulte a loja para confirmar temperos e alergênicos.',
          utensils: 'Panela ou frigideira, pegadores e utensílios de montagem.',
        },
        {
          id: 'marmitas-da-jo-simples-2',
          ...makeMenuItem(
            'Carne com purê',
            'R$ 15,99',
            'Carne moída com purê de batata e arroz.',
            require('./assets/restaurant-search-marmitas-ju-2.png'),
          ),
          ingredients: 'Carne moída, batata, arroz e temperos. Confirme com a loja os ingredientes do purê.',
          utensils: 'Panelas, colher ou espátula e utensílios de montagem.',
        },
        {
          id: 'marmitas-da-jo-simples-3',
          ...makeMenuItem(
            'Frango com legumes',
            'R$ 15,99',
            'Frango acompanhado de arroz e legumes variados.',
            require('./assets/restaurant-search-marmitas-ju-3.png'),
          ),
          ingredients: 'Frango, arroz, legumes e temperos. Consulte a loja sobre ingredientes e alergênicos.',
          utensils: 'Frigideira, panela, pegadores e utensílios de montagem.',
        },
      ],
    }],
  },
  {
    id: 'doce-abraco',
    name: 'Doce Abraço',
    verified: true,
    image: require('./assets/search-result-store-doce-abraco.png'),
    heroImage: require('./assets/restaurant-search-doce-abraco-1.png'),
    rating: '4,8 (452)',
    deliveryTime: '40-50 min',
    deliveryFee: 'R$ 5,99',
    minimumOrder: 'R$ 5,99',
    description: 'Doces preparados pela loja.',
    foodSafety: UNCONFIRMED_FOOD_SAFETY,
    filters: ['Todo Oullin', 'Perfil alimentar', 'doces', 'menor preço'],
    features: [],
    sections: [{
      title: 'Doces',
      items: [
        {
          id: 'doce-abraco-brigadeiros-fit',
          ...makeMenuItem(
            'Brigadeiros Fit',
            'R$ 24,99',
            'Brigadeiros de chocolate com cobertura granulada.',
            require('./assets/restaurant-search-doce-abraco-1.png'),
          ),
          ingredients: 'Cacau ou chocolate, leite ou leite condensado e cobertura. Confirme adoçantes, ingredientes e alergênicos com a loja.',
          utensils: 'Panela, espátula, tigela e utensílios para porcionar e servir.',
        },
        {
          id: 'doce-abraco-fatia-bolo',
          ...makeMenuItem(
            'Fatia de bolo de chocolate',
            'R$ 15,99',
            'Bolo de chocolate coberto com frutas vermelhas.',
            require('./assets/restaurant-search-doce-abraco-2.png'),
          ),
          ingredients: 'Massa de bolo, chocolate e frutas vermelhas. Confirme com a loja a receita, coberturas e alergênicos.',
          utensils: 'Tigelas de preparo, forma, espátula e utensílios para cortar e servir.',
        },
        {
          id: 'doce-abraco-donuts',
          ...makeMenuItem(
            'Donuts de chocolate',
            'R$ 15,99',
            'Donuts com cobertura de chocolate e confeitos.',
            require('./assets/restaurant-search-doce-abraco-3.png'),
          ),
          ingredients: 'Massa, chocolate e confeitos. Confirme com a loja a receita, ingredientes e alergênicos.',
          utensils: 'Tigelas, espátula, assadeira ou fritadeira e utensílios para decorar e servir.',
        },
      ],
    }],
  },
  {
    id: 'saudavel-life',
    name: 'Saudável Life',
    verified: true,
    image: require('./assets/saudavel-life-logo.png'),
    heroImage: require('./assets/saudavel-life-chefs.png'),
    rating: '4,6 (200 avaliações)',
    deliveryTime: '30–45 min',
    minimumOrder: 'R$ 25,00',
    description: 'Marmitas e refeições para a rotina.',
    compatibilityText: '80% adequado com seu perfil\n(Sem glúten & Sem lactose)',
    foodSafety: {
      ...UNCONFIRMED_FOOD_SAFETY,
      equipment: 'Utensílios dedicados e higienizados',
    },
    filters: ['Todo Oullin', 'Perfil alimentar', 'Marmitas', 'alimentos', 'menor preço'],
    features: [
      { type: 'utensils', label: 'Utensílios dedicados' },
      { type: 'ingredientCard', label: 'Dados de ingredientes' },
    ],
    sections: [
      { title: 'Marmitas', items: RESTAURANT_MEALS },
      { title: 'Alimentos', items: RESTAURANT_FOODS },
    ],
  },
  {
    id: 'burger-house',
    name: 'Burger House',
    image: require('./assets/burger-photo.jpg'),
    heroImage: require('./assets/burger-photo.jpg'),
    rating: '4,8 (320 avaliações)',
    deliveryTime: '25–40 min',
    minimumOrder: 'R$ 20,00',
    description: 'Hambúrgueres artesanais e acompanhamentos.',
    foodSafety: UNCONFIRMED_FOOD_SAFETY,
    filters: ['Todo Oullin', 'Perfil alimentar', 'hambúrgueres', 'acompanhamentos', 'menor preço'],
    features: [
      { type: 'ingredients', label: 'Ingredientes frescos' },
      { type: 'nutrition', label: 'Carne selecionada' },
      { type: 'certificate', label: 'Preparo na hora' },
    ],
    sections: [{
      title: 'Hambúrgueres e acompanhamentos',
      items: [
        makeMenuItem('Burger da casa', 'R$ 28,90', 'Hambúrguer artesanal com queijo e molho da casa.', require('./assets/burger-photo.jpg')),
        makeMenuItem('Burger vegetariano', 'R$ 24,90', 'Hambúrguer vegetariano com salada fresca.', require('./assets/food-veggie-burger-card.png')),
        makeMenuItem('Batata crocante', 'R$ 12,00', 'Batatas douradas e crocantes.', require('./assets/food-fries-card.png')),
      ],
    }],
  },
  {
    id: 'pizza-da-vila',
    name: 'Pizza da Vila',
    image: require('./assets/pizza-photo.jpg'),
    heroImage: require('./assets/pizza-photo.jpg'),
    rating: '4,7 (245 avaliações)',
    deliveryTime: '35–50 min',
    minimumOrder: 'R$ 30,00',
    description: 'Pizzas artesanais feitas para compartilhar.',
    foodSafety: {
      ...UNCONFIRMED_FOOD_SAFETY,
      equipment: 'Forno dedicado',
    },
    filters: ['Todo Oullin', 'Perfil alimentar', 'pizzas', 'bebidas', 'menor preço'],
    features: [
      { type: 'ingredients', label: 'Ingredientes frescos' },
      { type: 'nutrition', label: 'Massa artesanal' },
      { type: 'certificate', label: 'Forno especial' },
    ],
    sections: [{
      title: 'Pizzas',
      items: [
        makeMenuItem('Pizza da Vila', 'R$ 38,90', 'Pizza artesanal preparada com ingredientes frescos.', require('./assets/pizza-photo.jpg')),
        makeMenuItem('Pizza marguerita', 'R$ 34,90', 'Molho de tomate, queijo, tomate e manjericão.', require('./assets/food-pizza-card.png')),
        makeMenuItem('Pizza especial', 'R$ 42,90', 'Uma combinação especial da casa.', require('./assets/promo-pizza.png')),
      ],
    }],
  },
  {
    id: 'sushi-oullin',
    name: 'Sushi Oullin',
    image: require('./assets/sushi-photo.jpg'),
    heroImage: require('./assets/sushi-photo.jpg'),
    rating: '4,9 (180 avaliações)',
    deliveryTime: '30–45 min',
    minimumOrder: 'R$ 35,00',
    description: 'Combinados e peças variadas.',
    foodSafety: UNCONFIRMED_FOOD_SAFETY,
    filters: ['Todo Oullin', 'Perfil alimentar', 'combinados', 'bebidas', 'menor preço'],
    features: [
      { type: 'ingredients', label: 'Ingredientes frescos' },
      { type: 'nutrition', label: 'Preparo cuidadoso' },
      { type: 'certificate', label: 'Qualidade verificada' },
    ],
    sections: [{
      title: 'Combinados',
      items: [
        makeMenuItem('Combinado Oullin', 'R$ 42,00', 'Seleção de sushis variados preparados na hora.', require('./assets/sushi-photo.jpg')),
        makeMenuItem('Sushi variado', 'R$ 32,00', 'Peças variadas para compartilhar.', require('./assets/sushi-photo.jpg')),
        makeMenuItem('Combo especial', 'R$ 49,90', 'Combo especial da casa.', require('./assets/promo-sushi.png')),
      ],
    }],
  },
  {
    id: 'marmitas-da-ana',
    name: 'Marmitas da Ana',
    image: require('./assets/marmita-detail-frango.png'),
    heroImage: require('./assets/marmita-detail-frango.png'),
    rating: '4,8 (156 avaliações)',
    deliveryTime: '25–40 min',
    minimumOrder: 'R$ 18,00',
    description: 'Marmitas caseiras para a rotina.',
    foodSafety: UNCONFIRMED_FOOD_SAFETY,
    filters: ['Todo Oullin', 'Perfil alimentar', 'marmitas', 'saladas', 'menor preço'],
    features: [
      { type: 'ingredients', label: 'Ingredientes do dia' },
      { type: 'nutrition', label: 'Receitas caseiras' },
      { type: 'certificate', label: 'Embalagem segura' },
    ],
    sections: [{
      title: 'Marmitas',
      items: [
        makeMenuItem('Marmita de frango', 'R$ 15,99', 'Frango grelhado, arroz e feijão.', require('./assets/marmita-detail-frango.png')),
        makeMenuItem('Frango com legumes', 'R$ 15,99', 'Frango acompanhado de legumes variados.', require('./assets/marmita-card-salada.png')),
        makeMenuItem('Marmita caseira', 'R$ 18,99', 'Refeição completa preparada no dia.', require('./assets/marmita-card-caseira.png')),
      ],
    }],
  },
  {
    id: 'salada-viva',
    name: 'Salada Viva',
    image: require('./assets/salad-photo.jpg'),
    heroImage: require('./assets/salad-photo.jpg'),
    rating: '4,7 (112 avaliações)',
    deliveryTime: '20–35 min',
    minimumOrder: 'R$ 16,00',
    description: 'Saladas e bowls com combinações variadas.',
    foodSafety: UNCONFIRMED_FOOD_SAFETY,
    filters: ['Todo Oullin', 'Perfil alimentar', 'saladas', 'sucos', 'menor preço'],
    features: [
      { type: 'ingredients', label: 'Folhas frescas' },
      { type: 'nutrition', label: 'Ingredientes selecionados' },
      { type: 'certificate', label: 'Preparo cuidadoso' },
    ],
    sections: [{
      title: 'Saladas e bowls',
      items: [
        makeMenuItem('Salada da horta', 'R$ 18,99', 'Salada fresca com folhas e vegetais variados.', require('./assets/salad-photo.jpg')),
        makeMenuItem('Bowl de legumes', 'R$ 21,99', 'Bowl colorido com legumes e grãos.', require('./assets/marmita-card-salada.png')),
        makeMenuItem('Salada tropical', 'R$ 19,99', 'Combinação fresca da casa.', require('./assets/promo-salad.png')),
      ],
    }],
  },
  {
    id: 'doce-cantinho',
    name: 'Doce Cantinho',
    image: require('./assets/dessert-photo.jpg'),
    heroImage: require('./assets/dessert-photo.jpg'),
    rating: '4,9 (208 avaliações)',
    deliveryTime: '20–35 min',
    minimumOrder: 'R$ 15,00',
    description: 'Doces e sobremesas da casa.',
    foodSafety: UNCONFIRMED_FOOD_SAFETY,
    filters: ['Todo Oullin', 'Perfil alimentar', 'doces', 'bebidas', 'menor preço'],
    features: [
      { type: 'ingredients', label: 'Ingredientes frescos' },
      { type: 'nutrition', label: 'Receitas artesanais' },
      { type: 'certificate', label: 'Feito com carinho' },
    ],
    sections: [{
      title: 'Doces especiais',
      items: [
        makeMenuItem('Doce da casa', 'R$ 12,99', 'Sobremesa preparada artesanalmente.', require('./assets/dessert-photo.jpg')),
        makeMenuItem('Pastel doce', 'R$ 8,99', 'Massa dourada com recheio doce.', require('./assets/food-pastel-card.png')),
        makeMenuItem('Sobremesa especial', 'R$ 14,99', 'Uma sobremesa especial para adoçar o dia.', require('./assets/promo-dessert.png')),
      ],
    }],
  },
  {
    id: 'massa-da-casa',
    name: 'Massa da Casa',
    image: require('./assets/pasta-photo.jpg'),
    heroImage: require('./assets/pasta-photo.jpg'),
    rating: '4,6 (174 avaliações)',
    deliveryTime: '30–45 min',
    minimumOrder: 'R$ 25,00',
    description: 'Massas e receitas da casa.',
    foodSafety: UNCONFIRMED_FOOD_SAFETY,
    filters: ['Todo Oullin', 'Perfil alimentar', 'massas', 'saladas', 'menor preço'],
    features: [
      { type: 'ingredients', label: 'Ingredientes frescos' },
      { type: 'nutrition', label: 'Molhos da casa' },
      { type: 'certificate', label: 'Preparo na hora' },
    ],
    sections: [{
      title: 'Massas',
      items: [
        makeMenuItem('Massa da casa', 'R$ 18,99', 'Massa preparada com molho e ingredientes frescos.', require('./assets/pasta-photo.jpg')),
        makeMenuItem('Penne especial', 'R$ 22,99', 'Penne servido com molho especial da casa.', require('./assets/promo-pasta.png')),
        makeMenuItem('Lasanha caseira', 'R$ 24,99', 'Lasanha preparada no forno.', require('./assets/pasta-photo.jpg')),
      ],
    }],
  },
  {
    id: 'bebidas-geladas',
    name: 'Bebidas Geladas',
    image: require('./assets/drink-photo.jpg'),
    heroImage: require('./assets/drink-photo.jpg'),
    rating: '4,8 (97 avaliações)',
    deliveryTime: '15–25 min',
    minimumOrder: 'R$ 10,00',
    description: 'Sucos e bebidas para acompanhar seu pedido.',
    foodSafety: {
      ...UNCONFIRMED_FOOD_SAFETY,
      equipment: 'Refrigeração (tipo de equipamento não informado)',
    },
    filters: ['Todo Oullin', 'Perfil alimentar', 'sucos', 'refrigerantes', 'menor preço'],
    features: [
      { type: 'ingredients', label: 'Opções variadas' },
      { type: 'nutrition', label: 'Informações claras' },
      { type: 'certificate', label: 'Bem refrigeradas' },
    ],
    sections: [{
      title: 'Bebidas',
      items: [
        makeMenuItem('Suco natural', 'R$ 9,99', 'Suco gelado para acompanhar sua refeição.', require('./assets/drink-photo.jpg')),
        makeMenuItem('Refrigerante cola', 'R$ 6,99', 'Bebida gelada.', require('./assets/drink-cola-card.png')),
        makeMenuItem('Refrigerante zero', 'R$ 6,99', 'Bebida gelada sem açúcar.', require('./assets/drink-cola-zero-card.png')),
      ],
    }],
  },
];

function normalizeSearchTerm(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .trim();
}

function getSearchPriceValue(price) {
  const normalizedPrice = String(price || '')
    .replace(/[^\d,]/g, '')
    .replace(/\./g, '')
    .replace(',', '.');
  if (!normalizedPrice) return Number.POSITIVE_INFINITY;
  const value = Number(normalizedPrice);
  return Number.isFinite(value) ? value : Number.POSITIVE_INFINITY;
}

function isSaudavelLifeChicken(item, restaurantName = item.restaurantName) {
  const isChickenMeal =
    normalizeSearchTerm(item.detailName || item.name || '') === 'marmita de frango';
  const isSaudavelLife =
    item.id === 'saudavel-life-chicken' ||
    normalizeSearchTerm(restaurantName || '') === 'saudavel life';

  return isChickenMeal && isSaudavelLife;
}

const FOOD_FILTER_TAG_COLORS = {
  'sem gluten': { backgroundColor: '#DDF3D7', color: '#37833B' },
  'sem lactose': { backgroundColor: '#E8E8E8', color: '#676767' },
  proteico: { backgroundColor: '#F1D4F8', color: '#9B49A9' },
  'low carb': { backgroundColor: '#FFE4CC', color: '#B86A27' },
};

const FOOD_FILTER_TAG_ICONS = {
  'sem gluten': '🌱',
  'sem lactose': '🥛',
  proteico: '💪',
  'low carb': '🔥',
};

function getDietaryTagColors(filter) {
  const normalizedFilter = normalizeSearchTerm(filter);
  if (normalizedFilter.includes('gluten')) {
    return { backgroundColor: '#AEE59A', color: '#2F7537' };
  }
  if (normalizedFilter.includes('vegano')) {
    return { backgroundColor: '#F4C7DF', color: '#B83278' };
  }
  if (normalizedFilter.includes('lactose') || normalizedFilter.includes('vegetariano')) {
    return { backgroundColor: '#DDF1FF', color: '#2380A8' };
  }
  if (normalizedFilter.includes('sodio') || normalizedFilter.includes('baixo')) {
    return { backgroundColor: '#FFB246', color: '#FFFFFF' };
  }
  if (normalizedFilter.includes('amendoim') || normalizedFilter.includes('castanha')) {
    return { backgroundColor: '#BDE68A', color: '#3F7D2D' };
  }
  if (normalizedFilter.includes('contaminacao')) {
    return { backgroundColor: '#EAEAEA', color: '#555555' };
  }
  return { backgroundColor: '#F4C7DF', color: '#B83278' };
}

export function getDietaryProfileRules(profileSelections = {}) {
  const restrictions = (profileSelections.restrictions || []).map(normalizeSearchTerm);
  const rules = [];
  const restrictionRules = [
    ['alimentacao kosher', 'kosher', 'Kosher'],
    ['alimentacao halal', 'halal', 'Halal'],
    ['restricao a sodio', 'lowSodium', 'Baixo sódio'],
    ['intolerancia a lactose', 'lactoseFree', 'Sem lactose'],
    ['sensibilidade ao gluten', 'glutenFree', 'Sem glúten'],
    ['alergia a proteina do leite de vaca', 'milkFree', 'Sem proteína do leite'],
    ['alergia a amendoim e castanhas', 'nutsFree', 'Sem amendoim e castanhas'],
    ['alergia a frutos do mar', 'seafoodFree', 'Sem frutos do mar'],
    ['alergia a ovos', 'eggFree', 'Sem ovos'],
    ['alergia a soja', 'soyFree', 'Sem soja'],
    ['doenca celiaca', 'glutenFree', 'Sem glúten'],
    ['diabetes', 'diabeticFriendly', 'Adequado para diabetes'],
    ['hipertensao', 'lowSodium', 'Baixo sódio'],
  ];
  restrictionRules.forEach(([restriction, key, label]) => {
    if (restrictions.includes(restriction)) rules.push({ key, label });
  });
  if (restrictions.includes('veganismo')) rules.push({ key: 'vegan', label: 'Vegano' });
  else if (restrictions.includes('vegetarianismo')) rules.push({ key: 'vegetarian', label: 'Vegetariano' });
  const crossContamination = (profileSelections.crossContamination || []).map(normalizeSearchTerm);
  const sensitivity = (profileSelections.sensitivity || []).map(normalizeSearchTerm);
  if (
    crossContamination.includes('sim zero tracos') ||
    sensitivity.some((level) => level.startsWith('severa'))
  ) rules.push({ key: 'crossContaminationSafe', label: 'Sem contaminação cruzada' });
  return rules;
}

export function filterMealsForProfile(meals, rules) {
  if (!rules.length) return meals;
  return meals.filter((meal) =>
    rules.every((rule) => meal.dietaryCompatibility?.[rule.key] === true),
  );
}

function FoodFeatureCard({ label, type, size, useReferenceIcons = false }) {
  if (type === 'utensils' || type === 'ingredientCard') {
    const source = type === 'utensils'
      ? require('./assets/restaurant-dedicated-utensils.png')
      : require('./assets/restaurant-ingredient-data.png');

    return (
      <Image
        accessibilityLabel={label}
        source={source}
        style={{ height: size, width: size }}
      />
    );
  }

  return (
    <View style={[styles.foodFeatureCard, { height: size, width: size }]}>
      {type === 'ingredients' ? (
        useReferenceIcons ? (
          <Image
            accessibilityLabel={label}
            source={require('./assets/check-circle.png')}
            style={styles.foodReferenceCheckIcon}
          />
        ) : (
          <View style={styles.foodUpdatedIcon}>
            <Text style={styles.foodUpdatedCheck}>✓</Text>
          </View>
        )
      ) : type === 'nutrition' ? (
        useReferenceIcons ? (
          <Image
            accessibilityLabel={label}
            source={require('./assets/survey.png')}
            style={styles.foodReferenceSurveyIcon}
          />
        ) : (
          <View style={styles.foodNutritionIcon}>
            <View style={styles.foodNutritionLine} />
            {[0, 1, 2].map((row) => (
              <View key={row} style={styles.foodNutritionRow}>
                <View style={styles.foodNutritionBullet} />
                <View style={[styles.foodNutritionTextLine, row === 2 && styles.foodNutritionShortLine]} />
              </View>
            ))}
          </View>
        )
      ) : (
        <View style={styles.foodCertificateIcon}>
          <Text style={styles.foodCertificateStar}>★</Text>
          <View style={styles.foodCertificateRibbons}>
            <View style={styles.foodCertificateRibbon} />
            <View style={styles.foodCertificateRibbon} />
          </View>
        </View>
      )}
      <Text numberOfLines={2} style={styles.foodFeatureLabel}>{label}</Text>
    </View>
  );
}

function formatFoodInformation(value) {
  if (typeof value === 'string') return value.trim();
  if (Array.isArray(value)) return value.map((entry) => String(entry)).join('\n');
  if (value && typeof value === 'object') {
    return Object.entries(value)
      .map(([label, amount]) => `${label}: ${amount}`)
      .join('\n');
  }
  return '';
}

function getDemonstrationIngredients(item, searchableText, description) {
  if (item.ingredients) return item.ingredients;
  const productNameText = normalizeSearchTerm(item.detailName || item.name || '');
  if (/cafe.*manha/.test(searchableText)) {
    return 'Café, pão e fruta conforme a descrição; confirme acompanhamentos e alergênicos com a loja.';
  }
  if (/marmita.*legumes|legumes.*marmita|bowl.*legumes/.test(productNameText)) {
    return `Legumes, grãos e acompanhamentos conforme a descrição: ${description.replace(/[.!?]+$/, '')}. Confirme a composição com a loja.`;
  }
  if (/marmita caseira|prato do dia|composicao varia/.test(searchableText)) {
    return 'A composição pode variar conforme o prato do dia. Consulte a loja para confirmar ingredientes e alergênicos.';
  }
  if (/marmita|refeicao/.test(searchableText)) {
    return `Ingredientes principais indicados: ${description.replace(/[.!?]+$/, '')}. Confirme a composição completa e os alergênicos com a loja.`;
  }
  if (/vegan|vegano|vegana/.test(searchableText)) {
    return 'Base vegetal, proteína de origem vegetal, vegetais e molho da casa.';
  }
  if (/vegetari/.test(searchableText)) {
    return 'Hambúrguer vegetal, pão, vegetais e molho. Confirme se há queijo, ovos ou outros ingredientes de origem animal.';
  }
  if (/hamburg|burger/.test(searchableText)) {
    return 'Pão, hambúrguer, queijo, alface, tomate e molho da casa.';
  }
  if (/sanduiche|lanche/.test(searchableText)) {
    return `Pão e recheio conforme a descrição: ${description.replace(/[.!?]+$/, '')}. Confirme molhos e alergênicos com a loja.`;
  }
  if (/bife|carne/.test(searchableText)) {
    return 'Carne, cebola, óleo vegetal, sal e temperos.';
  }
  if (/pizza|marguerita/.test(searchableText)) {
    return `Massa, molho e coberturas conforme a descrição: ${description.replace(/[.!?]+$/, '')}. Confirme a composição com a loja.`;
  }
  if (/sushi/.test(searchableText)) {
    return 'Arroz temperado, alga nori, peixe ou vegetais e acompanhamentos.';
  }
  if (/salada/.test(searchableText)) {
    return 'Folhas, tomate, cenoura, grãos e molho servido à parte.';
  }
  if (/batata|fritas|porcao/.test(searchableText)) {
    return /cozida/.test(searchableText)
      ? 'Batata cozida, ervas, sal e azeite conforme a descrição; confirme temperos com a loja.'
      : 'Batata, óleo de preparo, sal e temperos. Confirme ingredientes e preparo com a loja.';
  }
  if (/pastel/.test(searchableText)) {
    return /doce|chocolate/.test(searchableText)
      ? 'Massa e recheio doce conforme a descrição. Confirme ingredientes e alergênicos com a loja.'
      : 'Massa, recheio conforme a opção escolhida e óleo de preparo. Confirme ingredientes e alergênicos com a loja.';
  }
  if (/milho/.test(searchableText)) {
    return 'Milho, farinha, ovos, leite, açúcar e óleo vegetal.';
  }
  if (/brigadeiro/.test(searchableText)) {
    return 'Cacau ou chocolate, leite ou leite condensado e cobertura. Confirme adoçantes e alergênicos com a loja.';
  }
  if (/donut|rosquinha/.test(searchableText)) {
    return 'Massa e cobertura conforme a descrição. Confirme ingredientes, fritura e alergênicos com a loja.';
  }
  if (/bolo/.test(searchableText)) {
    return `Massa e cobertura conforme a descrição: ${description.replace(/[.!?]+$/, '')}. Confirme ingredientes e alergênicos com a loja.`;
  }
  if (/doce|sobremesa/.test(searchableText)) {
    return `A composição varia conforme a sobremesa: ${description.replace(/[.!?]+$/, '')}. Consulte a loja para confirmar os ingredientes.`;
  }
  if (/lasanha/.test(searchableText)) {
    return 'Massa em camadas, molho e recheio conforme a receita. Confirme ingredientes e alergênicos com a loja.';
  }
  if (/massa|penne/.test(searchableText)) {
    return 'Massa e molho conforme a descrição. Confirme ingredientes e alergênicos com a loja.';
  }
  if (/suco/.test(searchableText)) return 'Fruta, água e gelo; açúcar opcional.';
  if (/\b(bebida|bebidas|refrigerante|refrigerantes|suco|sucos|cola|agua)\b/.test(searchableText)) {
    return 'Bebida pronta e ingredientes descritos no rótulo original.';
  }
  if (/cafe/.test(searchableText)) return 'Café e, conforme a opção, leite e açúcar. Confirme os ingredientes com a loja.';
  return `Composição informada na descrição: ${description.replace(/[.!?]+$/, '')}.`;
}

function getDemonstrationUtensils(item, searchableText) {
  if (item.utensils) return item.utensils;
  if (/cafe.*manha/.test(searchableText)) {
    return 'Cafeteira, xícaras, pratos e utensílios para montar e servir o pão e a fruta.';
  }
  if (/cafe/.test(searchableText)) {
    return 'Cafeteira, xícara e colher para preparar e servir.';
  }
  if (/\b(bebida|bebidas|refrigerante|refrigerantes|suco|sucos|cola|agua)\b/.test(searchableText)) {
    return 'Embalagem original, abridor e copo para servir.';
  }
  if (/pizza/.test(searchableText)) {
    return 'Forno, pá de pizza, cortador e utensílios de montagem.';
  }
  if (/pastel/.test(searchableText)) {
    return 'Fritadeira, escumadeira ou pegador e recipiente para servir.';
  }
  if (/bife|carne/.test(searchableText)) {
    return 'Grelha ou frigideira, pinça e utensílios para dourar a cebola e servir.';
  }
  if (/lasanha/.test(searchableText)) {
    return 'Forno, refratário, espátula e utensílios para servir.';
  }
  if (/massa|penne/.test(searchableText)) {
    return 'Panela para massa, escorredor, concha e utensílios para servir.';
  }
  if (/sushi|peixe/.test(searchableText)) {
    return 'Faca afiada, tábua de preparo, utensílio para arroz e hashi para servir.';
  }
  if (/marmita|refeicao/.test(searchableText)) {
    return 'Panelas, colher de preparo, pegadores e utensílios de montagem.';
  }
  if (/batata|fritas|porcao/.test(searchableText)) {
    return /cozida/.test(searchableText)
      ? 'Panela, escumadeira e recipiente para servir.'
      : 'Fritadeira, cesto ou escumadeira e recipiente para servir.';
  }
  if (/salada|legumes|frutas|vegetais/.test(searchableText)) {
    return 'Faca, tábua de corte, tigela e utensílios para servir.';
  }
  if (/hamburg|burger/.test(searchableText)) {
    return 'Chapa, espátula e utensílios de montagem.';
  }
  if (/sanduiche|lanche/.test(searchableText)) {
    return 'Faca, tábua de corte e utensílios para montar e servir.';
  }
  if (/bolo/.test(searchableText)) {
    return 'Tigelas de preparo, forma, espátula e utensílios para cortar e servir.';
  }
  if (/brigadeiro|doce|sobremesa/.test(searchableText)) {
    return 'Tigela, espátula e utensílios para porcionar, decorar e servir.';
  }
  return 'Utensílios de preparo e serviço a confirmar com o estabelecimento.';
}

function getDemonstrationFoodInformation(item) {
  const productName = item.detailName || item.name || 'Produto';
  const productNameText = normalizeSearchTerm(productName);
  const searchableText = normalizeSearchTerm([
    productName,
    item.category,
    item.description,
    item.detail,
  ].filter(Boolean).join(' '));
  const seed = Array.from(normalizeSearchTerm(`${item.id || ''} ${productName}`)).reduce(
    (total, character) => total + character.charCodeAt(0),
    0,
  );
  const isDrink = /\b(bebida|bebidas|refrigerante|refrigerantes|suco|sucos|cola|agua)\b/.test(searchableText) ||
    (/cafe/.test(productNameText) && !/manha/.test(productNameText));
  const isZeroSugarDrink = isDrink && /zero|sem acucar|diet/.test(searchableText);
  const isFreshProduce = /salada|legumes|frutas|vegetais/.test(searchableText);
  const isProteinMeal = /marmita|frango|bife|hamburg|burger|sushi|sanduiche|lanche|carne/.test(searchableText);
  let carbohydrates;
  let protein;
  let fat;
  let fiber;

  if (isDrink) {
    carbohydrates = isZeroSugarDrink ? 0 : 8 + seed % 16;
    protein = 0;
    fat = 0;
    fiber = 0;
  } else if (isProteinMeal) {
    carbohydrates = 20 + seed % 17;
    protein = 14 + seed % 17;
    fat = 6 + seed % 12;
    fiber = 3 + seed % 5;
  } else if (isFreshProduce) {
    carbohydrates = 12 + seed % 18;
    protein = 2 + seed % 8;
    fat = 2 + seed % 8;
    fiber = 3 + seed % 5;
  } else {
    carbohydrates = 28 + seed % 19;
    protein = 3 + seed % 9;
    fat = 8 + seed % 13;
    fiber = 1 + seed % 5;
  }

  const energy = carbohydrates * 4 + protein * 4 + fat * 9;
  const description = item.description || item.detail || productName;

  return {
    ...item,
    ingredients: getDemonstrationIngredients(item, searchableText, description),
    utensils: getDemonstrationUtensils(item, searchableText),
    nutritionInfo: item.nutritionInfo || item.nutritionalInfo || item.nutrients || [
      'Porção de referência: 100 g/ml',
      `Valor energético: ${energy} kcal`,
      `Carboidratos: ${carbohydrates} g`,
      `Proteínas: ${protein} g`,
      `Gorduras totais: ${fat} g`,
      `Fibra alimentar: ${fiber} g`,
      `Sódio: ${100 + seed % 500} mg`,
    ],
    demonstrationInformation: true,
  };
}

function getHomeFoodInfoType(featureType) {
  if (featureType === 'utensils') return 'utensils';
  if (['ingredients', 'ingredientCard'].includes(featureType)) return 'ingredients';
  if (featureType === 'nutrition') return 'nutrition';
  return null;
}

function HomeFoodInfoScreen({ item, infoType, onBack, screenWidth }) {
  const screenDetails = {
    utensils: {
      title: 'Utensílios utilizados',
      value: item.utensils,
      unavailable: 'A loja ainda não informou quais utensílios são usados no preparo.',
    },
    ingredients: {
      title: 'Ingredientes atualizados',
      value: item.ingredients,
      unavailable: 'Os ingredientes ainda não foram atualizados para este produto.',
    },
    nutrition: {
      title: 'Ficha nutricional',
      value: item.nutritionInfo || item.nutritionalInfo || item.nutrients,
      unavailable: 'A ficha nutricional ainda não foi cadastrada para este produto.',
    },
  }[infoType];
  const content = formatFoodInformation(screenDetails.value) || screenDetails.unavailable;

  return (
    <View style={styles.homeFoodInfoScreen}>
      <ScrollView
        contentContainerStyle={[
          styles.homeFoodInfoContent,
          {
            paddingHorizontal: Math.min(screenWidth * 0.06, 24),
            paddingTop: Math.max(24, screenWidth * 0.07),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          accessibilityLabel="Voltar aos detalhes do produto"
          accessibilityRole="button"
          onPress={onBack}
          style={styles.homeFoodInfoBack}
        >
          <Text style={styles.homeFoodInfoBackText}>‹ Voltar</Text>
        </Pressable>
        <Text style={styles.homeFoodInfoTitle}>{screenDetails.title}</Text>
        <Text style={styles.homeFoodInfoProduct}>
          {item.detailName || item.name}
        </Text>
        <View style={styles.homeFoodInfoCard}>
          <Text style={styles.homeFoodInfoText}>{content}</Text>
        </View>
        <Text style={styles.homeFoodInfoNote}>
          Informações de composição e preparo fornecidas pela loja. Em caso de alergia, confirme diretamente com {item.restaurantName || 'o estabelecimento'} antes de pedir.
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={onBack}
          style={styles.homeFoodInfoButton}
        >
          <Text style={styles.homeFoodInfoButtonText}>Entendi</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function getUtensilCards(item) {
  const productName = normalizeSearchTerm(item.detailName || item.name || '');
  if (/marmita.*frango|frango.*marmita/.test(productName)) {
    return CHICKEN_UTENSILS;
  }

  const createCard = (title, description, image) => ({
    title,
    description,
    image,
  });

  let template = null;
  if (/batata|pastel|porcao/.test(productName)) {
    template = [
      createCard('Fritadeira', `Usada para preparar ${item.detailName || item.name}.`, require('./assets/chicken-frying-pan.png')),
      createCard('Escumadeira', 'Usada para retirar o alimento da fritura.', require('./assets/chicken-tongs-spatula.png')),
      createCard('Pegador', 'Usado para separar e porcionar o pedido.', require('./assets/chicken-tongs-spatula.png')),
      createCard('Recipiente', 'Usado para servir o alimento com segurança.', null),
    ];
  } else if (/hamburg|burger/.test(productName)) {
    template = [
      createCard('Chapa', 'Usada para grelhar o hambúrguer.', require('./assets/chicken-frying-pan.png')),
      createCard('Espátula', 'Usada para virar e retirar o hambúrguer.', require('./assets/chicken-tongs-spatula.png')),
      createCard('Faca de cozinha', 'Usada para cortar e montar o lanche.', require('./assets/chicken-kitchen-knife.png')),
      createCard('Utensílio de montagem', 'Usado para finalizar e servir o pedido.', null),
    ];
  } else if (/pizza/.test(productName)) {
    template = [
      createCard('Forno', 'Usado para assar a pizza.', require('./assets/chicken-frying-pan.png')),
      createCard('Pá de pizza', 'Usada para colocar e retirar a pizza do forno.', require('./assets/chicken-tongs-spatula.png')),
      createCard('Cortador', 'Usado para cortar a pizza em porções.', require('./assets/chicken-kitchen-knife.png')),
      createCard('Tábua de apoio', 'Usada para apoiar e servir as fatias.', require('./assets/chicken-cutting-board.png')),
    ];
  } else if (/coca|cola|bebida|refrigerante|suco|agua/.test(productName)) {
    template = [
      createCard('Embalagem original', 'Mantém o produto protegido até a abertura.', null),
      createCard('Abridor', 'Usado para abrir a embalagem quando necessário.', require('./assets/chicken-tongs-spatula.png')),
      createCard('Copo', 'Usado para servir a bebida ao cliente.', null),
      createCard('Bandeja', 'Usada para transportar o pedido com segurança.', null),
    ];
  } else if (/sushi/.test(productName)) {
    template = [
      createCard('Faca afiada', 'Usada para cortar e finalizar os sushis.', require('./assets/chicken-kitchen-knife.png')),
      createCard('Tábua de corte', 'Usada para preparar as peças na bancada.', require('./assets/chicken-cutting-board.png')),
      createCard('Utensílio de arroz', 'Usado para porcionar e montar as peças.', require('./assets/chicken-tongs-spatula.png')),
      createCard('Hashi', 'Usado para servir o combinado.', null),
    ];
  } else if (/salada|legume|fruta|sobremesa|taca/.test(productName)) {
    template = [
      createCard('Faca de cozinha', 'Usada para cortar folhas e frutas.', require('./assets/chicken-kitchen-knife.png')),
      createCard('Tábua de corte', 'Usada para preparar os ingredientes.', require('./assets/chicken-cutting-board.png')),
      createCard('Tigela', 'Usada para misturar ou porcionar o alimento.', require('./assets/chicken-frying-pan.png')),
      createCard('Recipiente de serviço', 'Usado para servir o pedido.', null),
    ];
  }
  if (template) return template;

  const utensilsText = formatFoodInformation(item.utensils);
  if (!utensilsText) return [];

  const entries = utensilsText
    .split(/[;,]/)
    .map((entry) => entry.trim())
    .filter(Boolean)
    .slice(0, 4);

  const cards = entries.map((entry) => {
    const normalized = normalizeSearchTerm(entry);
    let image = null;
    if (/tabua|faca/.test(normalized)) {
      image = normalized.includes('tabua')
        ? require('./assets/chicken-cutting-board.png')
        : require('./assets/chicken-kitchen-knife.png');
    } else if (/frigideira|grelha|forno|chapa|panela|tigela/.test(normalized)) {
      image = require('./assets/chicken-frying-pan.png');
    } else if (/pegador|espatula|escumadeira|pa/.test(normalized)) {
      image = require('./assets/chicken-tongs-spatula.png');
    }

    return {
      title: entry.charAt(0).toUpperCase() + entry.slice(1),
      description: `Usado para preparar ou servir ${item.detailName || item.name}.`,
      image,
    };
  });

  while (cards.length < 4) {
    cards.push(
      cards.length === 3
        ? createCard('Recipiente de serviço', 'Usado para servir o pedido com segurança.', null)
        : createCard('Utensílio de preparo', `Usado no preparo de ${item.detailName || item.name}.`, null),
    );
  }

  return cards.slice(0, 4);
}

function ChickenUtensilsScreen({ item, onBack, screenWidth }) {
  const { height: screenHeight } = useWindowDimensions();
  const [showQuestionHelp, setShowQuestionHelp] = useState(false);
  const scale = Math.min(
    screenWidth / 320,
    Math.max(0.9, screenHeight / 674),
    1,
  );
  const size = (value) => value * scale;
  const productName = item?.detailName || item?.name || 'frango';
  const isSpecificChicken = normalizeSearchTerm(productName).includes('frango');
  const utensilCards = isSpecificChicken && !item
    ? CHICKEN_UTENSILS
    : getUtensilCards(item || {});
  const visibleUtensilCards = utensilCards.length
    ? utensilCards
    : CHICKEN_UTENSILS;
  const title = `Utensílios para ${normalizeSearchTerm(productName)}`;
  const subtitle = `Veja os utensílios usados para preparar ${normalizeSearchTerm(productName)}.`;
  const careTips = isSpecificChicken
    ? [
        'Separar o alimento cru dos outros ingredientes.',
        'Higienizar os utensílios e superfícies após o uso.',
        'Usar utensílios limpos para retirar e servir o alimento.',
      ]
    : [
        'Higienizar os utensílios antes do preparo.',
        'Evitar misturar utensílios usados em alimentos diferentes.',
        'Usar utensílios limpos para retirar e servir o pedido.',
      ];

  return (
    <View style={styles.chickenUtensilsScreen}>
      <ScrollView
        contentContainerStyle={[
          styles.chickenUtensilsContent,
          {
            paddingHorizontal: size(21),
            paddingTop: size(38),
            paddingBottom: size(16),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={[
            styles.chickenUtensilsTitle,
            {
              fontSize: size(16),
              lineHeight: size(19),
            },
          ]}
        >
          {title.charAt(0).toUpperCase() + title.slice(1)}
        </Text>
        <Text
          style={[
            styles.chickenUtensilsSubtitle,
            {
              fontSize: size(9),
              lineHeight: size(11),
            },
          ]}
        >
          {subtitle.charAt(0).toUpperCase() + subtitle.slice(1)}
        </Text>

        <View style={[styles.chickenUtensilsList, { marginTop: size(30) }]}>
          {visibleUtensilCards.map((utensil) => (
            <View
              key={utensil.title}
              style={[
                styles.chickenUtensilCard,
                {
                  borderRadius: size(10),
                  height: size(74),
                  marginBottom: size(6),
                  paddingHorizontal: size(8),
                },
              ]}
            >
              {utensil.image ? (
                <Image
                  accessibilityLabel={utensil.title}
                  resizeMode="contain"
                  source={utensil.image}
                  style={{
                    height: size(46),
                    width: size(59),
                  }}
                />
              ) : (
                <View
                  accessibilityLabel={utensil.title}
                  style={{
                    alignItems: 'center',
                    backgroundColor: '#FFF6DF',
                    borderRadius: size(14),
                    height: size(46),
                    justifyContent: 'center',
                    width: size(46),
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.orange,
                      fontSize: size(20),
                    }}
                  >
                    ◦
                  </Text>
                </View>
              )}
              <View style={{ flex: 1, marginLeft: size(6) }}>
                <Text
                  style={[
                    styles.chickenUtensilTitle,
                    {
                      fontSize: size(10.5),
                      lineHeight: size(13),
                    },
                  ]}
                >
                  {utensil.title}
                </Text>
                <Text
                  style={[
                    styles.chickenUtensilDescription,
                    {
                      fontSize: size(7.5),
                      lineHeight: size(9.5),
                    },
                  ]}
                >
                  {utensil.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View
          style={[
            styles.chickenPreparationCare,
            {
              borderRadius: size(10),
              marginTop: size(7),
              minHeight: size(150),
              padding: size(12),
            },
          ]}
        >
          <Text
            style={[
              styles.chickenPreparationCareTitle,
              {
                fontSize: size(12),
                lineHeight: size(15),
              },
            ]}
          >
            Cuidados durante o preparo
          </Text>
          {careTips.map((tip, index) => (
            <Text
              key={tip}
              style={[
                styles.chickenPreparationTip,
                {
                  fontSize: size(9),
                  lineHeight: size(13),
                  marginTop: index === 0 ? size(5) : size(2),
                },
              ]}
            >
              {index + 1}. {tip}
            </Text>
          ))}
        </View>
      </ScrollView>

      <View
        style={[
          styles.chickenUtensilsFooter,
          {
            paddingHorizontal: size(21),
            paddingBottom: size(21),
            paddingTop: size(4),
          },
        ]}
      >
        <Pressable
          accessibilityRole="button"
          onPress={() => setShowQuestionHelp(true)}
          style={({ pressed }) => [
            styles.chickenUtensilsButton,
            styles.chickenUtensilsQuestionButton,
            {
              borderRadius: size(10),
              height: size(35),
              marginRight: size(7),
            },
            pressed && styles.chickenUtensilsPressed,
          ]}
        >
          <Text
            style={[
              styles.chickenUtensilsQuestionText,
              { fontSize: size(9.5) },
            ]}
          >
            Tenho dúvidas
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={onBack}
          style={({ pressed }) => [
            styles.chickenUtensilsButton,
            styles.chickenUtensilsConfirmButton,
            {
              borderRadius: size(10),
              height: size(35),
            },
            pressed && styles.chickenUtensilsPressed,
          ]}
        >
          <Text
            style={[
              styles.chickenUtensilsConfirmText,
              { fontSize: size(9.5) },
            ]}
          >
            Entendi
          </Text>
        </Pressable>
      </View>
      <Modal
        animationType="fade"
        onRequestClose={() => setShowQuestionHelp(false)}
        transparent
        visible={showQuestionHelp}
      >
        <View style={styles.chickenQuestionModalBackdrop}>
          <View style={styles.chickenQuestionModal}>
            <Text style={styles.chickenQuestionModalTitle}>Dúvidas sobre o preparo</Text>
            <Text style={styles.chickenQuestionModalText}>
              Confirme com a loja como os utensílios são higienizados e usados no preparo.
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => setShowQuestionHelp(false)}
              style={({ pressed }) => [
                styles.chickenQuestionModalClose,
                pressed && styles.chickenUtensilsPressed,
              ]}
            >
              <Text style={styles.chickenQuestionModalCloseText}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function ChickenNutritionTableScreen({ ingredient, onBack, screenWidth }) {
  const { height: screenHeight } = useWindowDimensions();
  const scale = Math.min(
    screenWidth / 320,
    Math.max(0.9, screenHeight / 674),
    1.25,
  );
  const size = (value) => value * scale;
  const nutritionRows = CHICKEN_NUTRITION_COMPONENTS.map((row, index) => ({
    ...row,
    value: ingredient.values[index],
  }));

  return (
    <View style={styles.chickenNutritionScreen}>
      <ScrollView
        contentContainerStyle={styles.chickenNutritionContent}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.chickenNutritionTopSpace,
            {
              height: size(55),
              paddingHorizontal: size(15),
            },
          ]}
        >
          <Pressable
            accessibilityLabel="Voltar aos ingredientes"
            accessibilityRole="button"
            onPress={onBack}
            style={({ pressed }) => [
              styles.chickenNutritionBackButton,
              {
                height: size(34),
                width: size(34),
              },
              pressed && styles.chickenUtensilsPressed,
            ]}
          >
            <Text
              style={[
                styles.chickenNutritionBackText,
                { fontSize: size(25), lineHeight: size(29) },
              ]}
            >
              ‹
            </Text>
          </Pressable>
        </View>

        <View
          style={[
            styles.chickenNutritionTitleBar,
            {
              height: size(61),
              paddingHorizontal: size(19),
            },
          ]}
        >
          <Text
            style={[
              styles.chickenNutritionSource,
              {
                fontSize: size(10),
                marginRight: size(19),
              },
            ]}
          >
            TBCA
          </Text>
          <Text
            style={[
              styles.chickenNutritionTitle,
              {
                fontSize: size(13),
                lineHeight: size(17),
              },
            ]}
          >
            {ingredient.title}
          </Text>
        </View>

        <View
          style={[
            styles.chickenNutritionTable,
            {
              paddingHorizontal: size(15),
              paddingTop: size(8),
            },
          ]}
        >
          <View
            style={[
              styles.chickenNutritionHeaderRow,
              {
                minHeight: size(34),
                paddingBottom: size(4),
              },
            ]}
          >
            <Text
              style={[
                styles.chickenNutritionHeaderComponent,
                { fontSize: size(9) },
              ]}
            >
              Componente
            </Text>
            <Text
              style={[
                styles.chickenNutritionHeaderUnit,
                { fontSize: size(9) },
              ]}
            >
              Unidades
            </Text>
            <Text
              style={[
                styles.chickenNutritionHeaderValue,
                { fontSize: size(9) },
              ]}
            >
              Valor por 100g
            </Text>
          </View>
          {nutritionRows.map((row, index) => (
            <View
              key={`${row.component}-${row.unit}`}
              style={[
                styles.chickenNutritionDataRow,
                {
                  minHeight: size(40),
                  paddingVertical: size(3),
                },
              ]}
            >
              <Text
                style={[
                  styles.chickenNutritionComponent,
                  {
                    fontSize: size(10),
                    lineHeight: size(13),
                  },
                ]}
              >
                {row.component}
              </Text>
              <Text
                style={[
                  styles.chickenNutritionUnit,
                  { fontSize: size(10) },
                ]}
              >
                {row.unit}
              </Text>
              <Text
                style={[
                  styles.chickenNutritionValue,
                  { fontSize: size(10) },
                ]}
              >
                {row.value}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function ChickenNutritionInfoScreen({ onBack, screenWidth }) {
  const { height: screenHeight } = useWindowDimensions();
  const [showQuestionHelp, setShowQuestionHelp] = useState(false);
  const scale = Math.min(
    screenWidth / 320,
    Math.max(0.9, screenHeight / 674),
    1,
  );
  const size = (value) => value * scale;
  const nutrients = [
    ['Carboidratos', '58 g'],
    ['Açúcares totais', '5 g'],
    ['Proteínas', '32 g'],
    ['Gorduras totais', '12 g'],
    ['Gorduras saturadas', '3 g'],
    ['Fibra alimentar', '6 g'],
    ['Sódio', '480 mg'],
  ];

  return (
    <View style={styles.chickenNutritionInfoScreen}>
      <ScrollView
        contentContainerStyle={[
          styles.chickenNutritionInfoContent,
          {
            paddingHorizontal: size(19),
            paddingTop: size(34),
            paddingBottom: size(12),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={[
            styles.chickenNutritionInfoTitle,
            {
              fontSize: size(14),
              lineHeight: size(18),
            },
          ]}
        >
          Informações nutricionais
        </Text>
        <Text
          style={[
            styles.chickenNutritionInfoSubtitle,
            {
              fontSize: size(8),
              lineHeight: size(11),
            },
          ]}
        >
          Entenda os nutrientes da sua marmita.
        </Text>

        <View
          style={[
            styles.chickenNutritionEnergyCard,
            {
              borderRadius: size(9),
              marginTop: size(15),
              minHeight: size(65),
              padding: size(9),
            },
          ]}
        >
          <Text
            style={[
              styles.chickenNutritionEnergyLabel,
              { fontSize: size(7), lineHeight: size(9) },
            ]}
          >
            Valor energético
          </Text>
          <Text
            style={[
              styles.chickenNutritionEnergyValue,
              {
                fontSize: size(19),
                lineHeight: size(23),
              },
            ]}
          >
            480 kcal
          </Text>
          <Text
            style={[
              styles.chickenNutritionServing,
              { fontSize: size(7), lineHeight: size(9) },
            ]}
          >
            Porção: 350 g
          </Text>
        </View>

        <View
          style={[
            styles.chickenNutritionSummary,
            { marginTop: size(10) },
          ]}
        >
          {[
            ['58 g', 'Carboidratos'],
            ['32 g', 'Proteínas'],
            ['12 g', 'Gorduras'],
          ].map(([value, label]) => (
            <View
              key={label}
              style={[
                styles.chickenNutritionSummaryCard,
                {
                  borderRadius: size(7),
                  height: size(36),
                  marginRight: size(5),
                  paddingHorizontal: size(6),
                },
              ]}
            >
              <Text
                style={[
                  styles.chickenNutritionSummaryValue,
                  { fontSize: size(10), lineHeight: size(12) },
                ]}
              >
                {value}
              </Text>
              <Text
                style={[
                  styles.chickenNutritionSummaryLabel,
                  { fontSize: size(6.5), lineHeight: size(8) },
                ]}
              >
                {label}
              </Text>
            </View>
          ))}
        </View>

        <View
          style={[
            styles.chickenNutritionDetailCard,
            {
              borderRadius: size(9),
              marginTop: size(6),
              minHeight: size(206),
              padding: size(9),
            },
          ]}
        >
          <View
            style={[
              styles.chickenNutritionDetailHeader,
              { marginBottom: size(4) },
            ]}
          >
            <Text
              style={[
                styles.chickenNutritionDetailHeading,
                { fontSize: size(7), lineHeight: size(9) },
              ]}
            >
              Nutriente
            </Text>
            <Text
              style={[
                styles.chickenNutritionDetailHeading,
                { fontSize: size(7), lineHeight: size(9) },
              ]}
            >
              Quantidade
            </Text>
          </View>
          {nutrients.map(([label, amount]) => (
            <View
              key={label}
              style={[
                styles.chickenNutritionDetailRow,
                { minHeight: size(19) },
              ]}
            >
              <Text
                style={[
                  styles.chickenNutritionDetailLabel,
                  { fontSize: size(7), lineHeight: size(9) },
                ]}
              >
                {label}
              </Text>
              <Text
                style={[
                  styles.chickenNutritionDetailAmount,
                  { fontSize: size(7), lineHeight: size(9) },
                ]}
              >
                {amount}
              </Text>
            </View>
          ))}
          <Text
            style={[
              styles.chickenNutritionDisclaimer,
              {
                fontSize: size(6),
                lineHeight: size(8),
                marginTop: size(3),
              },
            ]}
          >
            Valores nutricionais por porção.
          </Text>
        </View>
      </ScrollView>

      <View
        style={[
          styles.chickenUtensilsFooter,
          {
            paddingHorizontal: size(19),
            paddingBottom: size(21),
            paddingTop: size(4),
          },
        ]}
      >
        <Pressable
          accessibilityRole="button"
          onPress={() => setShowQuestionHelp(true)}
          style={({ pressed }) => [
            styles.chickenUtensilsButton,
            styles.chickenUtensilsQuestionButton,
            {
              borderRadius: size(9),
              height: size(35),
              marginRight: size(7),
            },
            pressed && styles.chickenUtensilsPressed,
          ]}
        >
          <Text
            style={[
              styles.chickenUtensilsQuestionText,
              { fontSize: size(8) },
            ]}
          >
            Tenho dúvidas
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={onBack}
          style={({ pressed }) => [
            styles.chickenUtensilsButton,
            styles.chickenUtensilsConfirmButton,
            {
              borderRadius: size(9),
              height: size(35),
            },
            pressed && styles.chickenUtensilsPressed,
          ]}
        >
          <Text
            style={[
              styles.chickenUtensilsConfirmText,
              { fontSize: size(8) },
            ]}
          >
            Entendi
          </Text>
        </Pressable>
      </View>

      <Modal
        animationType="fade"
        onRequestClose={() => setShowQuestionHelp(false)}
        transparent
        visible={showQuestionHelp}
      >
        <View style={styles.chickenQuestionModalBackdrop}>
          <View style={styles.chickenQuestionModal}>
            <Text style={styles.chickenQuestionModalTitle}>Tenho dúvidas</Text>
            <Text style={styles.chickenQuestionModalText}>
              Confirme as informações nutricionais com o responsável pelo preparo.
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => setShowQuestionHelp(false)}
              style={({ pressed }) => [
                styles.chickenQuestionModalClose,
                pressed && styles.chickenUtensilsPressed,
              ]}
            >
              <Text style={styles.chickenQuestionModalCloseText}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function getIngredientCards(item) {
  const productName = normalizeSearchTerm(item.detailName || item.name || '');
  if (/marmita.*frango|frango.*marmita/.test(productName)) {
    return CHICKEN_INGREDIENTS;
  }

  const ingredientsText = formatFoodInformation(item.ingredients);
  if (!ingredientsText) return [];

  return ingredientsText
    .split(/[;,]/)
    .map((entry) => entry.trim())
    .filter(Boolean)
    .slice(0, 5);
}

function getIngredientNutritionTable(ingredient) {
  if (CHICKEN_NUTRITION_TABLES[ingredient]) {
    return CHICKEN_NUTRITION_TABLES[ingredient];
  }

  const normalized = normalizeSearchTerm(ingredient);
  let values;
  if (/batata/.test(normalized)) {
    values = ['335', '80', '79,6', '18,6', '17,2', '2,10', '0,10', '1,70', '0,00', '0,90', '0,00', '0,05', '0,02', '0,03'];
  } else if (/arroz/.test(normalized)) {
    values = ['555', '131', '69,0', '28,1', '27,3', '2,54', '0,34', '1,60', '0,00', '0,41', '0,00', '0,09', '0,10', '0,12'];
  } else if (/frango|carne/.test(normalized)) {
    values = ['637', '150', '64,0', '0,00', '0,00', '32,1', '2,45', '0,00', '0,00', '1,44', '89,1', '0,90', '0,98', '0,30'];
  } else if (/vegetal|legume|folha|tomate|cenoura|cebola/.test(normalized)) {
    values = ['84', '20', '91,0', '4,10', '3,20', '1,20', '0,20', '2,00', '0,00', '0,70', '0,00', '0,02', '0,01', '0,04'];
  } else if (/queijo|leite|creme/.test(normalized)) {
    values = ['1251', '299', '39,0', '1,50', '0,00', '20,8', '22,8', '0,00', '0,00', '3,80', '80,0', '14,2', '6,30', '1,20'];
  } else if (/massa|pao|farinha|açúcar|acucar/.test(normalized)) {
    values = ['1129', '270', '35,0', '54,2', '52,0', '8,20', '1,40', '2,60', '0,00', '1,30', '0,00', '0,32', '0,20', '0,18'];
  } else if (/bebida|refrigerante|suco|agua|embalagem/.test(normalized)) {
    values = ['180', '43', '89,0', '10,8', '10,8', '0,00', '0,00', '0,00', '0,00', '0,10', '0,00', '0,00', '0,00', '0,00'];
  } else {
    values = ['418', '100', '85,0', '12,0', '10,0', '3,00', '2,00', '1,50', '0,00', '0,80', '10,0', '0,50', '0,30', '0,20'];
  }

  return {
    title: ingredient.charAt(0).toUpperCase() + ingredient.slice(1),
    values,
  };
}

function ChickenIngredientsScreen({ item, onBack, screenWidth }) {
  const { height: screenHeight } = useWindowDimensions();
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [showQuestionHelp, setShowQuestionHelp] = useState(false);
  const scale = Math.min(
    screenWidth / 320,
    Math.max(0.9, screenHeight / 674),
    1,
  );
  const size = (value) => value * scale;
  const closeModal = () => {
    setShowQuestionHelp(false);
  };
  const productName = item?.detailName || item?.name || 'marmita';
  const ingredientCards = getIngredientCards(item || {});
  const visibleIngredients = ingredientCards.length
    ? ingredientCards
    : CHICKEN_INGREDIENTS;
  const allergenInfo = [
    { name: 'Glúten', isContained: /pastel|pizza|hamburg|pao|massa|biscoito|sanduiche/.test(normalizeSearchTerm(productName)) },
    { name: 'Lactose', isContained: /pizza|creme|queijo|fruta|sobremesa|bolo|taca/.test(normalizeSearchTerm(productName)) },
    { name: 'Ovo', isContained: /pastel|bolo|massa|maionese/.test(normalizeSearchTerm(productName)) },
    { name: 'Soja', isContained: /vegano|vegetal|hamburg|molho/.test(normalizeSearchTerm(productName)) },
    { name: 'Amendoim e castanhas', isContained: /sobremesa|fruta|granola/.test(normalizeSearchTerm(productName)) },
    { name: 'Peixe', isContained: /sushi/.test(normalizeSearchTerm(productName)) },
  ];

  if (selectedIngredient) {
    return (
      <ChickenNutritionTableScreen
        ingredient={selectedIngredient}
        onBack={() => setSelectedIngredient(null)}
        screenWidth={screenWidth}
      />
    );
  }

  return (
    <View style={styles.chickenUtensilsScreen}>
      <ScrollView
        contentContainerStyle={[
          styles.chickenUtensilsContent,
          {
            paddingHorizontal: size(21),
            paddingTop: size(34),
            paddingBottom: size(16),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={[
            styles.chickenUtensilsTitle,
            {
              fontSize: size(16),
              lineHeight: size(20),
            },
          ]}
        >
          Ingredientes e alergênicos
        </Text>

        <Text
          style={[
            styles.chickenUtensilsSubtitle,
            {
              fontSize: size(9),
              lineHeight: size(12),
              marginTop: size(4),
            },
          ]}
        >
          Saiba exatamente o que compõe sua refeição.
        </Text>

        <View
          style={[
            styles.chickenIngredientsCard,
            {
              borderRadius: size(10),
              marginTop: size(12),
              padding: size(12),
            },
          ]}
        >
          <Text
            style={[
              styles.chickenIngredientsSectionTitle,
              {
                fontSize: size(11),
                lineHeight: size(14),
                marginBottom: size(7),
              },
            ]}
          >
            {`Composição de ${normalizeSearchTerm(productName)}`}
          </Text>
          {visibleIngredients.map((ingredient) => (
            <View
              key={ingredient}
              style={[
                styles.chickenIngredientRow,
                {
                  minHeight: size(27),
                  paddingVertical: size(3),
                },
              ]}
            >
              <View
                style={[
                  styles.chickenIngredientCopy,
                  {
                    marginRight: size(4),
                  },
                ]}
              >
                <View
                  style={[
                    styles.chickenIngredientBullet,
                    {
                      height: size(4),
                      marginRight: size(6),
                      width: size(4),
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.chickenIngredientName,
                    {
                      fontSize: size(9),
                      lineHeight: size(12),
                    },
                  ]}
                >
                  {ingredient}
                </Text>
              </View>
              {getIngredientNutritionTable(ingredient) ? (
                <Pressable
                  accessibilityLabel={`Ver mais sobre ${ingredient}`}
                  accessibilityRole="button"
                  onPress={() => setSelectedIngredient(getIngredientNutritionTable(ingredient))}
                  style={({ pressed }) => [
                    styles.chickenIngredientMoreButton,
                    {
                      borderRadius: size(7),
                      minHeight: size(20),
                      paddingHorizontal: size(8),
                    },
                    pressed && styles.chickenUtensilsPressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.chickenIngredientMoreText,
                      { fontSize: size(8) },
                    ]}
                  >
                    Ver mais
                  </Text>
                </Pressable>
              ) : null}
            </View>
          ))}
          <Text
            style={[
              styles.chickenIngredientsNoteText,
              {
                fontSize: size(7),
                lineHeight: size(9),
                marginTop: size(13),
              },
            ]}
          >
            Ingredientes completos informados pelo responsável.
          </Text>
        </View>

        <View
          style={[
            styles.chickenIngredientsAllergenCard,
            {
              borderRadius: size(10),
              marginTop: size(10),
              padding: size(12),
            },
          ]}
        >
          <Text
            style={[
              styles.chickenIngredientsSectionTitle,
              {
                fontSize: size(10),
                lineHeight: size(13),
                marginBottom: size(7),
              },
            ]}
          >
            Confira antes de consumir
          </Text>
          {allergenInfo.map((allergen) => (
            <View
              key={allergen.name}
              style={[
                styles.chickenAllergenRow,
                {
                  minHeight: size(22),
                },
              ]}
            >
              <Text
                style={[
                  styles.chickenAllergenName,
                  {
                    fontSize: size(8),
                    lineHeight: size(10),
                  },
                ]}
              >
                {allergen.name}
              </Text>
              <Image
                accessibilityLabel={allergen.isContained ? 'Contém' : 'Não contém'}
                resizeMode="contain"
                source={allergen.isContained
                  ? require('./assets/allergen-contained.png')
                  : require('./assets/allergen-not-contained.png')}
                style={{
                  height: size(17),
                  width: size(allergen.isContained ? 43 : 57),
                }}
              />
            </View>
          ))}
          <Text
            style={[
              styles.chickenIngredientsWarning,
              {
                fontSize: size(7),
                lineHeight: size(9),
                marginTop: size(5),
              },
            ]}
          >
            Informações de alergênicos e risco de contaminação cruzada devem
            ser confirmadas com o responsável.
          </Text>
        </View>
      </ScrollView>

      <View
        style={[
          styles.chickenUtensilsFooter,
          {
            paddingHorizontal: size(21),
            paddingBottom: size(21),
            paddingTop: size(4),
          },
        ]}
      >
        <Pressable
          accessibilityRole="button"
          onPress={() => setShowQuestionHelp(true)}
          style={({ pressed }) => [
            styles.chickenUtensilsButton,
            styles.chickenUtensilsQuestionButton,
            {
              borderRadius: size(10),
              height: size(35),
              marginRight: size(7),
            },
            pressed && styles.chickenUtensilsPressed,
          ]}
        >
          <Text
            style={[
              styles.chickenUtensilsQuestionText,
              { fontSize: size(9.5) },
            ]}
          >
            Tenho dúvidas
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={onBack}
          style={({ pressed }) => [
            styles.chickenUtensilsButton,
            styles.chickenUtensilsConfirmButton,
            {
              borderRadius: size(10),
              height: size(35),
            },
            pressed && styles.chickenUtensilsPressed,
          ]}
        >
          <Text
            style={[
              styles.chickenUtensilsConfirmText,
              { fontSize: size(9.5) },
            ]}
          >
            Entendi
          </Text>
        </Pressable>
      </View>

      <Modal
        animationType="fade"
        onRequestClose={closeModal}
        transparent
        visible={showQuestionHelp}
      >
        <View style={styles.chickenQuestionModalBackdrop}>
          <View style={styles.chickenQuestionModal}>
            <Text style={styles.chickenQuestionModalTitle}>Tenho dúvidas</Text>
            <Text style={styles.chickenQuestionModalText}>
              Informações de alergênicos e risco de contaminação cruzada devem
              ser confirmadas com o responsável.
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={closeModal}
              style={({ pressed }) => [
                styles.chickenQuestionModalClose,
                pressed && styles.chickenUtensilsPressed,
              ]}
            >
              <Text style={styles.chickenQuestionModalCloseText}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export function FoodDetailsScreen({
  item,
  onBack,
  onSelectItem,
  onAddToCart,
  onChickenInfoScreenChange,
  profileSelections = {},
  screenWidth,
  homeReferenceLayout = false,
}) {
  const [detailSearchQuery, setDetailSearchQuery] = useState('');
  const [showChickenUtensils, setShowChickenUtensils] = useState(false);
  const [showChickenIngredients, setShowChickenIngredients] = useState(false);
  const [showChickenNutrition, setShowChickenNutrition] = useState(false);
  const [homeInfoScreen, setHomeInfoScreen] = useState(null);
  const [cartFeedback, setCartFeedback] = useState('');
  const isSaudavelChicken = isSaudavelLifeChicken(item);
  const productFeatures = item.features?.length ? item.features : DEFAULT_FOOD_FEATURES;
  const featureSize = productFeatures.length >= 4
    ? Math.min(56, (screenWidth - 72) / 4)
    : Math.min(56, screenWidth * 116 / 608);
  const featureGap = screenWidth * 32 / 608;
  const cardWidth = Math.min(116, (screenWidth - 40) / 3);
  const recommendations = item.recommendations || [];
  const profileRules = getDietaryProfileRules(profileSelections);
  const profileTags = isSaudavelChicken
    ? []
    : profileRules
      .filter((rule) => item.dietaryCompatibility?.[rule.key] === true)
      .map((rule) => rule.label);
  const productFilters = [...new Set([...(item.filters || []), ...profileTags])].filter(
    (filter) => !['todo oullin', 'perfil alimentar', 'menor preco'].includes(
      normalizeSearchTerm(filter),
    ),
  );
  useEffect(() => {
    setCartFeedback('');
  }, [item.detailName, item.name]);

  useEffect(() => {
    const showProductInfoScreen =
      homeInfoScreen || showChickenUtensils || showChickenIngredients || showChickenNutrition;
    if (!showProductInfoScreen) return undefined;
    onChickenInfoScreenChange?.(true);
    return () => onChickenInfoScreenChange?.(false);
  }, [
    homeInfoScreen,
    onChickenInfoScreenChange,
    showChickenIngredients,
    showChickenNutrition,
    showChickenUtensils,
  ]);

  if (showChickenUtensils) {
    return (
      <ChickenUtensilsScreen
        item={getDemonstrationFoodInformation(item)}
        onBack={() => setShowChickenUtensils(false)}
        screenWidth={screenWidth}
      />
    );
  }
  if (showChickenIngredients) {
    return (
      <ChickenIngredientsScreen
        item={getDemonstrationFoodInformation(item)}
        onBack={() => setShowChickenIngredients(false)}
        screenWidth={screenWidth}
      />
    );
  }
  if (showChickenNutrition) {
    return (
      <ChickenNutritionInfoScreen
        onBack={() => setShowChickenNutrition(false)}
        screenWidth={screenWidth}
      />
    );
  }
  if (homeInfoScreen) {
    if (homeInfoScreen === 'utensils') {
      return (
        <ChickenUtensilsScreen
          item={getDemonstrationFoodInformation(item)}
          onBack={() => setHomeInfoScreen(null)}
          screenWidth={screenWidth}
        />
      );
    }
    if (homeInfoScreen === 'ingredients') {
      return (
        <ChickenIngredientsScreen
          item={getDemonstrationFoodInformation(item)}
          onBack={() => setHomeInfoScreen(null)}
          screenWidth={screenWidth}
        />
      );
    }
    return (
      <HomeFoodInfoScreen
        infoType={homeInfoScreen}
        item={getDemonstrationFoodInformation(item)}
        onBack={() => setHomeInfoScreen(null)}
        screenWidth={screenWidth}
      />
    );
  }

  const normalizedDetailQuery = normalizeSearchTerm(detailSearchQuery);
  const visibleRecommendations = normalizedDetailQuery
    ? recommendations.filter((recommendation) =>
        normalizeSearchTerm([
          recommendation.name,
          recommendation.detailName,
          recommendation.description,
          ...(recommendation.filters || []),
        ].filter(Boolean).join(' ')).includes(normalizedDetailQuery),
      )
    : recommendations;
  const searchBar = (
    <View
      style={[
        styles.foodDetailsSearchBox,
        {
          height: screenWidth * 70 / 608,
          paddingHorizontal: screenWidth * 20 / 608,
        },
      ]}
    >
      <Text style={styles.searchIcon}>⌕</Text>
      <TextInput
        accessibilityLabel="Buscar produtos relacionados"
        autoCapitalize="none"
        onChangeText={setDetailSearchQuery}
        placeholder={isSaudavelChicken ? 'Menos peso na sua rotina' : 'Peça na oullin'}
        placeholderTextColor={COLORS.muted}
        returnKeyType="search"
        style={[
          styles.foodDetailsSearchInput,
          { fontSize: screenWidth * 20 / 608 },
        ]}
        value={detailSearchQuery}
      />
      {!!detailSearchQuery && (
        <Pressable
          accessibilityLabel="Limpar busca de produtos"
          accessibilityRole="button"
          onPress={() => setDetailSearchQuery('')}
        >
          <Text style={styles.foodDetailsSearchClear}>×</Text>
        </Pressable>
      )}
    </View>
  );

  function addCurrentItemToCart() {
    const added = onAddToCart?.(item);
    setCartFeedback(
      added
        ? 'Adicionado ao carrinho.'
        : 'Não foi possível adicionar; confira o preço cadastrado.',
    );
  }

  return (
    <View style={styles.foodDetailsScreen}>
      <ScrollView
        contentContainerStyle={[
          styles.foodDetailsScroll,
          styles.foodReferenceDetailsScroll,
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.foodReferenceHero,
            { height: screenWidth * 500 / 608 },
          ]}
        >
          <Image
            accessibilityLabel={item.detailName || item.name}
            resizeMode="cover"
            source={item.image}
            style={styles.foodReferenceHeroImage}
          />
          <View
            style={[
              styles.foodReferenceHeroSearch,
              {
                left: screenWidth * 8 / 608,
                right: screenWidth * 8 / 608,
                top: screenWidth * 112 / 608,
              },
            ]}
          >
            {searchBar}
          </View>
        </View>

        <View
          style={[
            styles.foodReferenceSummary,
            {
              paddingHorizontal: screenWidth * 32 / 608,
              paddingTop: screenWidth * 56 / 608,
            },
          ]}
        >
          <Text
            style={[
              styles.foodReferenceTitle,
              {
                fontSize: screenWidth * 30 / 608,
                lineHeight: screenWidth * 36 / 608,
                marginBottom: screenWidth * 16 / 608,
              },
            ]}
          >
            {item.detailName || item.name}
          </Text>
          {!homeReferenceLayout && !!item.price && !isSaudavelChicken && (
            <Text
              style={[
                styles.foodProductPrice,
                {
                  fontSize: screenWidth * 18 / 608,
                  marginTop: 0,
                },
              ]}
            >
              {item.price}
            </Text>
          )}
          {!!item.description && (
            <Text
              style={[
                styles.foodProductDescription,
                {
                  fontSize: screenWidth * 14 / 608,
                  lineHeight: screenWidth * 20 / 608,
                  marginTop: screenWidth * 5 / 608,
                },
              ]}
            >
              {item.description}
            </Text>
          )}
          {!homeReferenceLayout && !!item.restaurantName && !isSaudavelChicken && (
            <Text
              style={[
                styles.foodProductRestaurant,
                {
                  fontSize: screenWidth * 13 / 608,
                  marginTop: screenWidth * 4 / 608,
                },
              ]}
            >
              {item.restaurantName}
            </Text>
          )}
        </View>

        {!!productFilters.length && (
          <View
            style={[
              styles.foodDetailsTags,
              styles.foodReferenceTags,
              { paddingHorizontal: screenWidth * 36 / 608 },
            ]}
          >
            {productFilters.map((filter) => (
              <View
                key={filter}
                style={[
                  styles.foodDetailTag,
                  styles.foodReferenceTag,
                  {
                    backgroundColor: (
                      FOOD_FILTER_TAG_COLORS[normalizeSearchTerm(filter)] ||
                      getDietaryTagColors(filter)
                    ).backgroundColor,
                    marginBottom: screenWidth * 12 / 608,
                    marginRight: screenWidth * 10 / 608,
                    minHeight: screenWidth * 32 / 608,
                    paddingHorizontal: screenWidth * 12 / 608,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.foodDetailTagText,
                    styles.foodReferenceTagText,
                    {
                      color: (
                        FOOD_FILTER_TAG_COLORS[normalizeSearchTerm(filter)] ||
                        getDietaryTagColors(filter)
                      ).color,
                      fontSize: screenWidth * 15 / 608,
                      lineHeight: screenWidth * 20 / 608,
                    },
                  ]}
                >
                  {!!FOOD_FILTER_TAG_ICONS[normalizeSearchTerm(filter)] && (
                    <Text
                      style={{
                        fontSize: screenWidth * 12 / 608,
                        marginRight: screenWidth * 3 / 608,
                      }}
                    >
                      {FOOD_FILTER_TAG_ICONS[normalizeSearchTerm(filter)]}
                    </Text>
                  )}
                  {filter}
                </Text>
              </View>
            ))}
          </View>
        )}
        {!!profileRules.length && !isSaudavelChicken && !homeReferenceLayout && (
          <Text style={styles.foodProfileNote}>
            Confirme ingredientes e risco de contaminação cruzada com a loja antes de pedir.
          </Text>
        )}

        {!!productFeatures.length && (
          <View
            style={[
              styles.foodDetailFeatures,
              styles.foodReferenceFeatures,
              {
                marginTop: screenWidth * 29 / 608,
                paddingHorizontal: screenWidth * 32 / 608,
                justifyContent: productFeatures.length >= 4 ? 'space-between' : 'flex-start',
              },
            ]}
          >
            {productFeatures.map((feature, index) => {
              const homeInfoType = getHomeFoodInfoType(feature.type);
              const featureCard = (
                <FoodFeatureCard
                  label={feature.label}
                  size={featureSize}
                  type={feature.type}
                  useReferenceIcons
                />
              );

              return (
                <View
                  key={`${feature.label}-${index}`}
                  style={productFeatures.length >= 4 ? undefined : [
                    styles.foodReferenceFeatureSpacing,
                    { marginRight: featureGap },
                  ]}
                >
                  {isSaudavelChicken && feature.type === 'utensils' ? (
                    <Pressable
                      accessibilityLabel="Abrir utensílios do frango"
                      accessibilityRole="button"
                      onPress={() => setShowChickenUtensils(true)}
                    >
                      {featureCard}
                    </Pressable>
                  ) : isSaudavelChicken && ['ingredients', 'ingredientCard'].includes(feature.type) ? (
                    <Pressable
                      accessibilityLabel="Abrir ingredientes e alergênicos"
                      accessibilityRole="button"
                      onPress={() => setShowChickenIngredients(true)}
                    >
                      {featureCard}
                    </Pressable>
                  ) : isSaudavelChicken && feature.type === 'nutrition' ? (
                    <Pressable
                      accessibilityLabel="Abrir ficha nutricional"
                      accessibilityRole="button"
                      onPress={() => setShowChickenNutrition(true)}
                    >
                      {featureCard}
                    </Pressable>
                  ) : homeInfoType ? (
                    <Pressable
                      accessibilityLabel={`Abrir ${feature.label}`}
                      accessibilityRole="button"
                      onPress={() => setHomeInfoScreen(homeInfoType)}
                    >
                      {featureCard}
                    </Pressable>
                  ) : (
                    featureCard
                  )}
                </View>
              );
            })}
          </View>
        )}

        {!!(item.ingredients || item.utensils) && !isSaudavelChicken && !homeReferenceLayout && (
          <View style={styles.productPreparation}>
            {!!item.ingredients && (
              <View style={styles.productPreparationBlock}>
                <Text style={styles.productPreparationTitle}>Ingredientes</Text>
                <Text style={styles.productPreparationText}>{item.ingredients}</Text>
              </View>
            )}
            {!!item.utensils && (
              <View style={styles.productPreparationBlock}>
                <Text style={styles.productPreparationTitle}>Utensílios utilizados</Text>
                <Text style={styles.productPreparationText}>{item.utensils}</Text>
              </View>
            )}
          </View>
        )}

        {!!visibleRecommendations.length && (
          <View
            style={[
              styles.foodRecommendations,
              styles.foodReferenceRecommendations,
              {
                marginTop: screenWidth * 66 / 608,
                paddingTop: screenWidth * 21 / 608,
              },
            ]}
          >
            <Text
              style={[
                styles.foodRecommendationsTitle,
                styles.foodReferenceRecommendationsTitle,
                {
                  fontSize: screenWidth * 28 / 608,
                  lineHeight: screenWidth * 34 / 608,
                  marginBottom: screenWidth * 24 / 608,
                  paddingHorizontal: screenWidth * 32 / 608,
                },
              ]}
            >
              Seu perfil alimentar
            </Text>
            <ScrollView
              contentContainerStyle={[
                styles.foodRecommendationList,
                styles.foodReferenceRecommendationList,
                {
                  paddingHorizontal: screenWidth * 32 / 608,
                },
              ]}
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {visibleRecommendations.map((recommendation) => (
                <View
                  key={recommendation.id || recommendation.name}
                  style={[
                    styles.foodRecommendationCard,
                    { width: cardWidth },
                    styles.foodReferenceRecommendationCard,
                    {
                      marginRight: screenWidth * 24 / 608,
                    },
                  ]}
                >
                  <Pressable
                    accessibilityLabel={`Ver ${recommendation.detailName || recommendation.name}`}
                    accessibilityRole="button"
                    onPress={() => onSelectItem({ ...recommendation, recommendations })}
                  >
                    <Image
                      accessibilityLabel={recommendation.detailName || recommendation.name}
                      resizeMode="cover"
                      source={recommendation.image}
                      style={[
                        styles.foodRecommendationImage,
                        { height: cardWidth * 0.66 },
                      ]}
                    />
                    <Text
                      style={[
                        styles.foodRecommendationPrice,
                        styles.foodReferenceRecommendationPrice,
                        {
                          fontSize: screenWidth * 18 / 608,
                          marginTop: screenWidth * 30 / 608,
                        },
                      ]}
                    >
                      {recommendation.price}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.foodRecommendationName,
                        styles.foodReferenceRecommendationName,
                        {
                          fontSize: screenWidth * 16 / 608,
                          marginTop: screenWidth * 6 / 608,
                        },
                      ]}
                    >
                      {recommendation.name}
                    </Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => onSelectItem({ ...recommendation, recommendations })}
                    style={[
                      styles.foodRecommendationButton,
                      styles.foodReferenceRecommendationButton,
                      {
                        marginTop: screenWidth * 20 / 608,
                        minHeight: screenWidth * 26 / 608,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.foodRecommendationButtonText,
                        styles.foodReferenceRecommendationButtonText,
                        {
                          fontSize: screenWidth * 12 / 608,
                        },
                      ]}
                    >
                      Ver informações
                    </Text>
                  </Pressable>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
        {!!profileRules.length && !recommendations.length && (
          <View style={styles.foodRecommendations}>
            <Text style={styles.foodRecommendationsTitle}>Seu perfil alimentar</Text>
            <Text style={styles.foodProductDescription}>
              Esta é a opção compatível encontrada. Confira os ingredientes e o preparo com a loja antes de pedir.
            </Text>
          </View>
        )}
      </ScrollView>
      {homeReferenceLayout && onAddToCart && (
        <View style={styles.homeAddToCartBar}>
          <Pressable
            accessibilityLabel={`Adicionar ${item.detailName || item.name} ao carrinho`}
            accessibilityRole="button"
            onPress={addCurrentItemToCart}
            style={styles.homeAddToCartButton}
          >
            <Text style={styles.homeAddToCartButtonText}>Adicionar ao carrinho</Text>
            {!!item.price && (
              <Text style={styles.homeAddToCartPrice}>{item.price}</Text>
            )}
          </Pressable>
          {!!cartFeedback && (
            <Text style={styles.homeAddToCartFeedback}>{cartFeedback}</Text>
          )}
        </View>
      )}
    </View>
  );
}

function RestaurantProductRow({ title, items, screenWidth, onSelectItem }) {
  const cardWidth = Math.min(128, (screenWidth - 48) / 3);

  return (
    <View style={styles.restaurantProductSection}>
      <View style={styles.restaurantProductsGrid}>
        {items.map((item) => (
          <View key={item.id || item.name} style={[styles.restaurantProduct, { width: cardWidth }]}>
            <Pressable
              accessibilityLabel={`Ver ${item.detailName || item.name}`}
              accessibilityRole="button"
              onPress={() => onSelectItem(item, title)}
            >
              <Image
                accessibilityLabel={item.detailName || item.name}
                resizeMode="cover"
                source={item.image}
                style={[styles.restaurantProductImage, { height: cardWidth * 0.66 }]}
              />
              <Text style={styles.restaurantProductPrice}>{item.price}</Text>
              <Text numberOfLines={1} style={styles.restaurantProductName}>
                {item.name}
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => onSelectItem(item, title)}
              style={styles.mealInfoButton}
            >
              <Text style={styles.mealInfoButtonText}>Ver informações</Text>
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  );
}

export function RestaurantDetailScreen({
  restaurant,
  screenWidth,
  onBack,
  onStatusBarBackgroundChange,
  onCompactNavigationChange,
  onChickenInfoScreenChange,
  profileSelections = {},
}) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [restaurantSearchQuery, setRestaurantSearchQuery] = useState('');
  const scrollRef = useRef(null);
  const restaurantSections = Array.isArray(restaurant.sections) ? restaurant.sections : [];
  const recommendations = restaurantSections.flatMap((section) => section.items);
  const preparationFeatures = restaurant.features?.length
    ? restaurant.features.slice(0, 2)
    : DEFAULT_RESTAURANT_FEATURES;
  const profileRules = getDietaryProfileRules(profileSelections);
  const hasConfirmedCompatibility = Boolean(restaurant.compatibilityText);
  const compatibilityText = restaurant.compatibilityText || (
    profileRules.length
      ? `Compatibilidade a confirmar para: ${profileRules.map((rule) => rule.label).join(', ')}. Consulte a loja.`
      : 'Compatibilidade alimentar não informada; confirme ingredientes e alergênicos com a loja.'
  );
  const normalizedRestaurantQuery = normalizeSearchTerm(restaurantSearchQuery);
  const filteredSections = normalizedRestaurantQuery
    ? restaurantSections.map((section) => ({
        ...section,
        items: section.items.filter((item) => {
        const ingredients = Array.isArray(item.ingredients)
          ? item.ingredients
          : item.ingredients
            ? [item.ingredients]
            : [];
        const searchValues = [
            item.name,
            item.detailName,
            item.description,
            item.category,
            item.price,
            ...(item.filters || []),
          ...ingredients,
            restaurant.name,
            section.title,
        ];
        const haystack = normalizeSearchTerm(searchValues.filter(Boolean).join(' '));
          return haystack.includes(normalizedRestaurantQuery);
        }),
      })).filter((section) => section.items.length > 0)
    : restaurantSections;

  useEffect(() => {
    onStatusBarBackgroundChange?.(selectedItem ? COLORS.white : COLORS.orange);
  }, [onStatusBarBackgroundChange, selectedItem]);

  useEffect(() => {
    onCompactNavigationChange?.(Boolean(selectedItem));
    return () => onCompactNavigationChange?.(false);
  }, [onCompactNavigationChange, selectedItem]);

  function selectProduct(item, sectionTitle) {
    const itemSection = restaurantSections.find((section) =>
      section.items.some((candidate) =>
        candidate === item ||
        (item.id && candidate.id === item.id) ||
        candidate.name === item.name,
      ),
    );
    const isChickenMeal = isSaudavelLifeChicken(item, restaurant.name);
    const productFeatures = isChickenMeal
      ? SAUDAVEL_LIFE_CHICKEN_FEATURES
      : PRODUCT_INFORMATION_FEATURES;

    setSelectedItem({
      ...item,
      category: item.category || sectionTitle || itemSection?.title,
      features: productFeatures,
      filters: item.filters?.length
        ? item.filters
        : [sectionTitle || itemSection?.title || 'Cardápio'],
      recommendations: item.recommendations || recommendations,
      restaurantName: restaurant.name,
    });
  }

  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, []);

  if (selectedItem) {
    return (
      <FoodDetailsScreen
        item={selectedItem}
        onBack={() => setSelectedItem(null)}
        onSelectItem={selectProduct}
        onChickenInfoScreenChange={onChickenInfoScreenChange}
        profileSelections={profileSelections}
        screenWidth={screenWidth}
      />
    );
  }

  return (
    <View style={styles.restaurantScreen}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.restaurantScroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.restaurantHero}>
          <Image
            accessibilityLabel={`Imagem de ${restaurant.name}`}
            resizeMode="cover"
            source={restaurant.heroImage}
            style={styles.restaurantHeroImage}
          />
          <View style={styles.restaurantHeroShade} />
          <View style={styles.restaurantHeroHeader}>
            <View style={styles.restaurantSearchBox}>
              <Text style={styles.searchIcon}>⌕</Text>
              <TextInput
                accessibilityLabel={`Buscar no restaurante ${restaurant.name}`}
                autoCapitalize="none"
                onChangeText={setRestaurantSearchQuery}
                placeholder="Peça na Oullin"
                placeholderTextColor={COLORS.muted}
                returnKeyType="search"
                style={styles.restaurantSearchInput}
                value={restaurantSearchQuery}
              />
              {!!restaurantSearchQuery && (
                <Pressable
                  accessibilityLabel="Limpar busca do restaurante"
                  accessibilityRole="button"
                  onPress={() => setRestaurantSearchQuery('')}
                  style={styles.restaurantSearchClear}
                >
                  <Text style={styles.restaurantSearchClearText}>×</Text>
                </Pressable>
              )}
            </View>
          </View>
        </View>

        <View style={styles.restaurantInfo}>
          <View style={styles.restaurantInfoRow}>
            <Image
              accessibilityLabel={`Imagem de ${restaurant.name}`}
              source={restaurant.image}
              style={styles.restaurantLogo}
            />
            <View style={styles.restaurantInfoText}>
              <View style={styles.restaurantNameRow}>
                <Text style={styles.restaurantName}>{restaurant.name}</Text>
                {restaurant.verified && (
                  <Image
                    accessibilityLabel="Restaurante verificado"
                    source={require('./assets/restaurant-verified.png')}
                    style={styles.restaurantVerifiedIcon}
                  />
                )}
              </View>
              <View style={styles.restaurantRatingRow}>
                <Image source={require('./assets/restaurant-star.png')} style={styles.restaurantMetaIcon} />
                <Text style={styles.restaurantRating}> {restaurant.rating}</Text>
              </View>
              <View style={styles.restaurantMetaRow}>
                <Image source={require('./assets/restaurant-clock.png')} style={styles.restaurantMetaIcon} />
                <Text style={styles.restaurantMeta}>{restaurant.deliveryTime}</Text>
                <Image source={require('./assets/restaurant-tag.png')} style={[styles.restaurantMetaIcon, styles.restaurantMetaIconSpaced]} />
                <Text style={styles.restaurantMeta}>{restaurant.deliveryFee || 'A confirmar'}</Text>
                <Image source={require('./assets/restaurant-cart.png')} style={[styles.restaurantMetaIcon, styles.restaurantMetaIconSpaced]} />
                <Text style={styles.restaurantMeta}>Min. {restaurant.minimumOrder || 'A confirmar'}</Text>
              </View>
            </View>
            <Image
              accessibilityLabel="Abrir detalhes"
              source={require('./assets/restaurant-arrow.png')}
              style={styles.restaurantArrowIcon}
            />
          </View>
          <View
            style={[
              styles.restaurantCompatibility,
              !hasConfirmedCompatibility && styles.restaurantCompatibilityUnverified,
            ]}
          >
            <View
              style={[
                styles.restaurantCompatibilityIcon,
                !hasConfirmedCompatibility && styles.restaurantCompatibilityIconUnverified,
              ]}
            >
              <Text
                style={[
                  styles.restaurantCompatibilityCheck,
                  !hasConfirmedCompatibility && styles.restaurantCompatibilityInfo,
                ]}
              >
                {hasConfirmedCompatibility ? '✓' : 'i'}
              </Text>
            </View>
            <Text style={styles.restaurantCompatibilityText}>{compatibilityText}</Text>
          </View>
          {!hasConfirmedCompatibility && !!restaurant.description && (
            <Text style={styles.restaurantDescription}>{restaurant.description}</Text>
          )}

          <View style={styles.preparationSection}>
            <Text style={styles.restaurantSectionTitle}>
              {restaurant.featuresTitle || 'Como preparamos seu prato'}
            </Text>
            <View style={styles.preparationFeatures}>
              {preparationFeatures.map((feature, index) => (
                <View
                  key={`${feature.label}-${index}`}
                  style={index === 0 ? styles.preparationFeatureSpacing : undefined}
                >
                  <FoodFeatureCard
                    label={feature.label}
                    size={76}
                    type={feature.type}
                  />
                </View>
              ))}
            </View>
          </View>
        </View>
        <ScrollView
          contentContainerStyle={styles.restaurantFilters}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {restaurant.filters.map((filter, index) => (
            <View
              key={filter}
              style={[styles.restaurantFilter, index === 0 && styles.restaurantFilterActive]}
            >
              <Text style={[styles.restaurantFilterText, index === 0 && styles.restaurantFilterTextActive]}>
                {filter}
              </Text>
            </View>
          ))}
        </ScrollView>

        {normalizedRestaurantQuery && filteredSections.length === 0 && (
          <View style={styles.restaurantSearchEmpty}>
            <Text style={styles.restaurantSearchEmptyText}>
              Nenhum item encontrado para "{restaurantSearchQuery}".
            </Text>
          </View>
        )}
        {filteredSections.map((section) => (
          <RestaurantProductRow
            key={section.title}
            items={section.items}
            onSelectItem={selectProduct}
            screenWidth={screenWidth}
            title={section.title}
          />
        ))}
        {!recommendations.length && !normalizedRestaurantQuery && (
          <View style={styles.restaurantSearchEmpty}>
            <Text style={styles.restaurantSearchEmptyText}>
              Cardápio ainda não cadastrado. As informações da loja serão atualizadas quando disponíveis.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function MarmitaSearchResults({ items, onBack, onOpenRestaurant, onSelectFood }) {
  const [favorite, setFavorite] = useState(false);

  return (
    <ScrollView
      contentContainerStyle={styles.mealResultsContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.mealResultsHeading}>
        <Pressable accessibilityLabel="Voltar às categorias" onPress={onBack} style={styles.mealResultsBack}>
          <Text style={styles.mealResultsBackText}>‹</Text>
        </Pressable>
        <View>
          <Text style={styles.mealResultsTitle}>{'Marmitas para voc\u00ea'}</Text>
          <Text style={styles.mealResultsSubtitle}>Opções de acordo com seu perfil alimentar</Text>
        </View>
      </View>
      <View style={styles.mealStoreHeader}>
        <Pressable
          accessibilityLabel="Ver restaurante Saudável Life"
          accessibilityRole="button"
          onPress={onOpenRestaurant}
          style={styles.mealStoreSummary}
        >
          <Image
            accessibilityLabel="Logo Saudável Life"
            source={require('./assets/saudavel-life-logo.png')}
            style={styles.mealStoreImage}
          />
          <View style={styles.mealStoreInfo}>
            <Text style={styles.mealStoreName}>Saudável Life</Text>
            <Text style={styles.mealStoreDetails}>
              ★ 4,6 (200)   30–45 min   Min. R$ 25,00
            </Text>
          </View>
          <Text style={styles.mealStoreArrow}>›</Text>
        </Pressable>
        <Pressable
          accessibilityLabel={favorite ? 'Remover loja dos favoritos' : 'Favoritar loja'}
          accessibilityRole="button"
          onPress={() => setFavorite((current) => !current)}
          style={styles.mealFavoriteButton}
        >
          <Text style={styles.mealFavoriteIcon}>{favorite ? '♥' : '♡'}</Text>
        </Pressable>
      </View>
      {items.length ? items.map((item) => (
          <View key={item.id} style={styles.mealListItem}>
            <Pressable
              accessibilityLabel={`Ver ${item.detailName || item.name}`}
              accessibilityRole="button"
              onPress={() => onSelectFood(item)}
              style={styles.mealListItemContent}
            >
              <Image
                accessibilityLabel={item.detailName || item.name}
                resizeMode="cover"
                source={item.image}
                style={styles.mealListImage}
              />
              <View style={styles.mealListDetails}>
                <Text style={styles.mealListName}>{item.detailName || item.name}</Text>
                <Text style={styles.mealListPrice}>{item.price}</Text>
                <Text numberOfLines={2} style={styles.mealListDescription}>{item.description}</Text>
                <Text numberOfLines={1} style={styles.mealListTags}>{(item.filters || []).join(' · ')}</Text>
              </View>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => onSelectFood(item)}
              style={styles.mealInfoButton}
            >
              <Text style={styles.mealInfoButtonText}>Ver informações</Text>
            </Pressable>
          </View>
        )) : (
          <View style={styles.mealEmptyState}>
            <Text style={styles.mealProductName}>Ainda não encontramos marmitas compatíveis.</Text>
            <Text style={styles.mealListDescription}>Revise seu perfil alimentar ou confira outras opções com a loja.</Text>
          </View>
        )}
    </ScrollView>
  );
}

function RestaurantSearchResultCard({ restaurant, onSelectFood, onSelectRestaurant, screenWidth }) {
  const scale = screenWidth / 401;
  const restaurantItems = restaurant.sections.flatMap((section) => section.items).slice(0, 3);

  const cardWidth = Math.min(110, (screenWidth - 44) / 3);

  return (
    <View style={[styles.restaurantGenericResult, { marginBottom: 30 * scale }]}>
      <View style={styles.restaurantGenericHeader}>
        <Pressable
          accessibilityLabel={`Ver restaurante ${restaurant.name}`}
          accessibilityRole="button"
          onPress={() => onSelectRestaurant(restaurant.id)}
          style={styles.restaurantGenericStore}
        >
          <Image source={restaurant.image} style={styles.restaurantGenericLogo} />
          <View style={styles.restaurantGenericStoreInfo}>
            <Text numberOfLines={1} style={styles.restaurantGenericName}>
              {restaurant.name}
            </Text>
            <Text numberOfLines={1} style={styles.restaurantGenericMetadata}>
              {restaurant.rating}   {restaurant.deliveryTime}   {restaurant.deliveryFee || restaurant.minimumOrder}
            </Text>
          </View>
        </Pressable>
        <Text style={styles.restaurantGenericFavorite}>♡</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.restaurantGenericProducts}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {restaurantItems.map((item) => (
          <View key={item.id || item.name} style={[styles.restaurantGenericProduct, { width: cardWidth }]}>
            <Pressable
              accessibilityLabel={`Ver ${item.detailName || item.name}`}
              accessibilityRole="button"
              onPress={() => onSelectFood(restaurant, item)}
            >
              <Image
                accessibilityLabel={item.detailName || item.name}
                resizeMode="cover"
                source={item.image}
                style={[styles.restaurantGenericProductImage, { height: cardWidth * 0.66 }]}
              />
              <Text style={styles.restaurantGenericProductPrice}>{item.price}</Text>
              <Text numberOfLines={1} style={styles.restaurantGenericProductName}>
                {item.name}
              </Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function RestaurantSearchResults({
  restaurants,
  onSelectRestaurant,
  onSelectFood,
  screenWidth,
  heading = 'Opções encontradas',
  notice,
}) {
  const scale = screenWidth / 393;

  return (
    <ScrollView
      contentContainerStyle={[
        styles.restaurantSearchResultsContent,
        {
          paddingBottom: 24 * scale,
          paddingTop: 18 * scale,
        },
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Text
        style={[
          styles.restaurantSearchHeading,
          {
            fontSize: 18 * scale,
            lineHeight: 22 * scale,
            marginBottom: 30 * scale,
            paddingHorizontal: 24 * scale,
          },
        ]}
      >
        {heading}
      </Text>
      {!!notice && (
        <Text style={[styles.productSearchEmpty, { fontSize: 11 * scale, paddingHorizontal: 24 * scale }]}>
          {notice}
        </Text>
      )}
      {restaurants.length ? restaurants.map((restaurant) => (
        <RestaurantSearchResultCard
          key={restaurant.id}
          onSelectFood={onSelectFood}
          onSelectRestaurant={onSelectRestaurant}
          restaurant={restaurant}
          screenWidth={screenWidth}
        />
      )) : (
        <Text style={[styles.productSearchEmpty, { fontSize: 13 * scale, paddingHorizontal: 24 * scale }]}>
          Nenhum restaurante encontrado.
        </Text>
      )}
    </ScrollView>
  );
}

function ProductSearchResults({
  items,
  onSelectProduct,
  screenWidth,
  heading = 'Opções encontradas',
}) {
  const scale = screenWidth / 393;
  const isWeb = Platform.OS === 'web';

  return (
    <ScrollView
      contentContainerStyle={[
        styles.productSearchResultsContent,
        {
          paddingBottom: 24 * scale,
          paddingHorizontal: (isWeb ? 30 : 20) * scale,
          paddingRight: (isWeb ? 44 : 20) * scale,
          paddingTop: (isWeb ? 20 : 14) * scale,
        },
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Text
        style={[
          styles.productSearchHeading,
          {
            fontSize: 18 * scale,
            lineHeight: 22 * scale,
            marginBottom: 6 * scale,
          },
        ]}
      >
        {heading}
      </Text>
      {items.length ? (
        items.map((item) => (
          <Pressable
            accessibilityLabel={`Ver informações de ${item.detailName || item.name}`}
            accessibilityRole="button"
            key={item.id}
            onPress={() => onSelectProduct(item)}
            style={[
              styles.productSearchRow,
              {
                minHeight: (isWeb ? 66 : 72) * scale,
                paddingVertical: 8 * scale,
              },
            ]}
          >
            <View style={styles.productSearchText}>
              <Text
                numberOfLines={2}
                style={[styles.productSearchName, { fontSize: 15 * scale, lineHeight: 18 * scale }]}
              >
                {item.name}
              </Text>
              {!!item.price && (
                <Text style={[styles.productSearchPrice, { fontSize: 10 * scale }]}>
                  {item.price}
                </Text>
              )}
              <Text
                numberOfLines={1}
                ellipsizeMode="clip"
                style={[
                  styles.productSearchRestaurant,
                  {
                    flexShrink: 1,
                    fontSize: 10 * scale,
                    lineHeight: 13 * scale,
                    width: '100%',
                  },
                ]}
              >
                {item.restaurantLabel}
              </Text>
            </View>
            <Image
              accessibilityLabel={`Logo de ${item.restaurantName}`}
              resizeMode="contain"
              source={item.image}
              style={[
                styles.productSearchLogo,
                {
                  height: 30 * scale,
                  marginLeft: 4 * scale,
                  width: 32 * scale,
                },
              ]}
            />
          </Pressable>
        ))
      ) : (
        <Text style={[styles.productSearchEmpty, { fontSize: 13 * scale }]}>
          Nenhum produto encontrado.
        </Text>
      )}
    </ScrollView>
  );
}

export default function SearchScreen({
  profileSelections = {},
  onStatusBarBackgroundChange,
  onCompactNavigationChange,
  onChickenInfoScreenChange,
}) {
  const { width: screenWidth } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const layoutWidth = Math.min(screenWidth, 430);
  const isCompactScreen = layoutWidth <= 430;
  const promotionCardScale = isWeb ? 265 : 255;
  const bannerScale = isWeb ? 245 : 230;
  const categoryCircleScale = isWeb ? 94 / 608 : 0.17;
  const profileSectionTopScale = isWeb ? 68 : 52;
  const landingContentWidth = screenWidth * 568 / 608;
  const profilePromotionWidth = Math.min(landingContentWidth, 568);
  const profilePromotionCardWidth = Math.min(screenWidth * promotionCardScale / 608, promotionCardScale);
  const profilePromotionHeight = profilePromotionCardWidth * 263 / 181;
  const profilePromotionImageWidth = profilePromotionHeight * 1173 / 263;
  const profilePromotionPageImageWidth = profilePromotionImageWidth * 387 / 1173;
  const bannerHeight = Math.min(screenWidth * bannerScale / 608, bannerScale);
  const bannerBadgeSize = Math.min(screenWidth * 28 / 608, 28);
  const bannerTextFontSize = Math.min(screenWidth * 16 / 608, 16);
  const categoryRowWidth = isWeb ? screenWidth : Math.min(screenWidth * 568 / 608, 568);
  const categoryCircleSize = isCompactScreen
    ? Math.min(screenWidth * categoryCircleScale, 68)
    : Math.min(screenWidth * 92 / 608, 92);
  const categoryGap = isCompactScreen
    ? Math.max(12, (screenWidth - categoryCircleSize * 4 - 28) / 3)
    : screenWidth * 56 / 608;
  const categoryInset = isCompactScreen
    ? (isWeb ? screenWidth * 34 / 608 : 14)
    : screenWidth * 14 / 608;
  const profileSectionMarginTop = Math.min(
    screenWidth * profileSectionTopScale / 608,
    profileSectionTopScale,
  );
  const profileSectionFontSize = Math.min(screenWidth * 30 / 608, 30);
  const categoryMarginTop = 0;
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedSearchFilter, setSelectedSearchFilter] = useState('Todo Oullin');
  const [filterApplied, setFilterApplied] = useState(false);
  const [recentSearches, setRecentSearches] = useState(INITIAL_RECENT_SEARCHES);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const [showRestaurantFilter, setShowRestaurantFilter] = useState(false);
  useEffect(() => {
    onStatusBarBackgroundChange?.(selectedProduct ? COLORS.white : COLORS.orange);
  }, [onStatusBarBackgroundChange, selectedProduct]);
  useEffect(() => {
    onCompactNavigationChange?.(Boolean(selectedProduct));
    return () => onCompactNavigationChange?.(false);
  }, [onCompactNavigationChange, selectedProduct]);
  const profileRules = useMemo(() => getDietaryProfileRules(profileSelections), [profileSelections]);
  const compatibleMealItems = useMemo(
    () => filterMealsForProfile(MEAL_SEARCH_ITEMS, profileRules),
    [profileRules],
  );
  const visibleRecentSearches = recentSearches.filter((item) =>
    item.toLocaleLowerCase('pt-BR').includes(query.trim().toLocaleLowerCase('pt-BR')),
  );
  const showSearchFilters =
    searchOpen || query.trim().length > 0 || selectedSearchFilter !== 'Todo Oullin' || filterApplied;
  const normalizedQuery = normalizeSearchTerm(query);
  const normalizedSelectedFilter = normalizeSearchTerm(selectedSearchFilter);
  const visibleSearchResults = useMemo(
    () => SEARCH_RESULT_PRODUCTS.filter((item) =>
      normalizeSearchTerm(`${item.name} ${item.restaurantName}`).includes(normalizedQuery),
    ),
    [normalizedQuery],
  );
  const catalogSearchProducts = useMemo(
    () => RESTAURANT_DIRECTORY.flatMap((restaurant) => (
      (restaurant.sections || []).flatMap((section, sectionIndex) => (
        section.items.map((item, itemIndex) => ({
          ...item,
          id: `${restaurant.id}-${item.id || `${sectionIndex}-${itemIndex}`}`,
          detailName: item.detailName || item.name,
          restaurantName: restaurant.name,
          restaurantLabel: restaurant.name,
          category: section.title,
          image: item.image || restaurant.image,
        }))
      ))
    )),
    [],
  );
  const filteredCatalogProducts = useMemo(() => {
    let products = catalogSearchProducts;
    if (normalizedSelectedFilter === 'bebidas') {
      products = products.filter((item) =>
        /\b(bebida|bebidas|suco|sucos|refri|refrigerante|refrigerantes|agua|cha|cafe)\b/.test(
          normalizeSearchTerm(`${item.name} ${item.description || ''} ${item.category || ''}`),
        ),
      );
    }
    if (normalizedSelectedFilter === 'menor preco') {
      return [...products].sort(
        (first, second) => getSearchPriceValue(first.price) - getSearchPriceValue(second.price),
      );
    }
    return products;
  }, [catalogSearchProducts, normalizedSelectedFilter]);
  const productSearchResults = visibleSearchResults.length
    ? visibleSearchResults
    : SEARCH_RESULT_PRODUCTS;
  const matchingRestaurants = normalizedQuery
    ? RESTAURANT_DIRECTORY.filter((restaurant) =>
        normalizeSearchTerm(restaurant.name).includes(normalizedQuery),
      )
    : [];
  const exactRestaurantMatch = matchingRestaurants.some(
    (restaurant) => normalizeSearchTerm(restaurant.name) === normalizedQuery,
  );
  const showSaudavelLife = selectedCategory === 'Marmitas' || normalizedQuery.includes('saudavel') ||
    (normalizedQuery.includes('marmita') && !exactRestaurantMatch);
  const saudavelLifeRestaurant = RESTAURANT_DIRECTORY.find(
    (restaurant) => restaurant.id === 'saudavel-life',
  );

  useEffect(() => {
    let isMounted = true;

    async function loadSearchHistory() {
      try {
        const storedHistory = await AsyncStorage.getItem(SEARCH_HISTORY_STORAGE_KEY);
        if (!isMounted) return;
        if (storedHistory) {
          const parsedHistory = JSON.parse(storedHistory);
          if (!Array.isArray(parsedHistory) || !parsedHistory.every((item) => typeof item === 'string')) {
            throw new Error('O histórico salvo não possui o formato esperado.');
          }
          setRecentSearches(parsedHistory.slice(0, 8));
        }
      } catch (error) {
        console.error('Não foi possível carregar o histórico de buscas.', error);
      } finally {
        if (isMounted) setHistoryLoaded(true);
      }
    }

    loadSearchHistory();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!historyLoaded) return;
    AsyncStorage.setItem(SEARCH_HISTORY_STORAGE_KEY, JSON.stringify(recentSearches)).catch((error) => {
      console.error('Não foi possível salvar o histórico de buscas.', error);
    });
  }, [historyLoaded, recentSearches]);

  function submitSearch(value = query) {
    const searchTerm = value.trim();
    if (!searchTerm) return;
    setRecentSearches((previousSearches) => [
      searchTerm,
      ...previousSearches.filter(
        (item) => item.toLocaleLowerCase('pt-BR') !== searchTerm.toLocaleLowerCase('pt-BR'),
      ),
    ].slice(0, 8));
    setQuery(searchTerm);
    setSelectedCategory('Todos');
    setSelectedSearchFilter('Todo Oullin');
    setFilterApplied(false);
    setShowRestaurantFilter(false);
    setSearchOpen(false);
    Keyboard.dismiss();
  }

  function openCategory(category) {
    setSelectedCategory(category);
    setQuery('');
    setSelectedSearchFilter('Todo Oullin');
    setFilterApplied(false);
    setShowRestaurantFilter(false);
    setSearchOpen(false);
    Keyboard.dismiss();
  }

  function selectSaudavelFood(item) {
    const isSaudavelChicken = isSaudavelLifeChicken(item, saudavelLifeRestaurant.name);
    setSelectedProduct({
      ...item,
      category: 'Marmitas',
      features: isSaudavelChicken
        ? SAUDAVEL_LIFE_CHICKEN_FEATURES
        : PRODUCT_INFORMATION_FEATURES,
      filters: isSaudavelChicken
        ? SAUDAVEL_LIFE_CHICKEN_FILTERS
        : item.filters || [],
      recommendations: isSaudavelChicken
        ? item.recommendations || SAUDAVEL_LIFE_CHICKEN_RECOMMENDATIONS
        : compatibleMealItems.filter((meal) => meal.id !== item.id),
      restaurantName: saudavelLifeRestaurant.name,
    });
  }

  function selectRestaurantFood(restaurant, item) {
    const restaurantItems = restaurant.sections.flatMap((section) => section.items);
    const itemSection = restaurant.sections.find((section) =>
      section.items.some((candidate) => candidate === item),
    );
    const isSaudavelChicken = isSaudavelLifeChicken(item, restaurant.name);
    setSelectedProduct({
      ...item,
      category: item.category || itemSection?.title,
      features: isSaudavelChicken
        ? SAUDAVEL_LIFE_CHICKEN_FEATURES
        : PRODUCT_INFORMATION_FEATURES,
      filters: isSaudavelChicken
        ? SAUDAVEL_LIFE_CHICKEN_FILTERS
        : item.filters?.length
          ? item.filters
          : [itemSection?.title || 'Cardápio'],
      recommendations: isSaudavelChicken
        ? item.recommendations || SAUDAVEL_LIFE_CHICKEN_RECOMMENDATIONS
        : restaurantItems.filter((recommendation) => recommendation !== item),
      restaurantName: restaurant.name,
    });
  }

  function selectSearchResultProduct(item) {
    setSelectedProduct({
      ...item,
      features: PRODUCT_INFORMATION_FEATURES,
      filters: [],
      recommendations: [],
    });
  }

  const visibleFoods = useMemo(() => {
    const normalizedQuery = normalizeSearchTerm(query);
    const filteredFoods = FOOD_CARDS.filter((food) => {
      const matchesCategory =
        selectedCategory === 'Todos' || food.category === selectedCategory;
      const matchesSearch =
        !normalizedQuery ||
        normalizeSearchTerm(`${food.name} ${food.category}`).includes(normalizedQuery);
      return matchesCategory && matchesSearch;
    });
    return normalizeSearchTerm(selectedSearchFilter) === 'menor preco'
      ? filteredFoods.sort((first, second) => FOOD_CARD_PRICES[first.id] - FOOD_CARD_PRICES[second.id])
      : filteredFoods;
  }, [query, selectedCategory, selectedSearchFilter]);

  if (selectedProduct) {
    return (
      <FoodDetailsScreen
        item={selectedProduct}
        onBack={() => setSelectedProduct(null)}
        onChickenInfoScreenChange={onChickenInfoScreenChange}
        profileSelections={profileSelections}
        onSelectItem={(item) =>
          setSelectedProduct({
            ...item,
            features: isSaudavelLifeChicken(
              item,
              item.restaurantName || selectedProduct.restaurantName,
            )
              ? SAUDAVEL_LIFE_CHICKEN_FEATURES
              : PRODUCT_INFORMATION_FEATURES,
            filters: item.filters?.length
              ? item.filters
              : selectedProduct.filters || [],
            recommendations: item.recommendations || selectedProduct.recommendations,
            restaurantName: item.restaurantName || selectedProduct.restaurantName,
          })
        }
        screenWidth={screenWidth}
      />
    );
  }

  const selectedRestaurant = RESTAURANT_DIRECTORY.find(
    (restaurant) => restaurant.id === selectedRestaurantId,
  );

  if (selectedRestaurantId && !selectedRestaurant) {
    throw new Error(`Restaurante não encontrado: ${selectedRestaurantId}`);
  }

  if (selectedRestaurant) {
    return (
      <RestaurantDetailScreen
        onBack={() => {
          setSelectedRestaurantId(null);
        }}
        onStatusBarBackgroundChange={onStatusBarBackgroundChange}
        onCompactNavigationChange={onCompactNavigationChange}
        onChickenInfoScreenChange={onChickenInfoScreenChange}
        profileSelections={profileSelections}
        restaurant={selectedRestaurant}
        screenWidth={screenWidth}
      />
    );
  }

  return (
    <View style={styles.screen}>
      <View
        style={[
          styles.searchHeader,
          showSearchFilters && styles.searchHeaderExpanded,
          {
            paddingBottom: isWeb
              ? screenWidth * (showSearchFilters ? 26 : 18) / 608
              : isCompactScreen ? 10 : screenWidth * 22 / 608,
            paddingHorizontal: isCompactScreen
              ? screenWidth * 14 / 393
              : isWeb
                ? screenWidth * (showSearchFilters ? 10 : 18) / 608
                : screenWidth * (showSearchFilters ? 12 : 14) / 608,
            paddingTop: isWeb
              ? screenWidth * (showSearchFilters ? 91 : 102) / 608
              : isCompactScreen ? 48 : screenWidth * (showSearchFilters ? 85 : 97) / 608,
          },
        ]}
      >
        <View
          style={[
            styles.searchBox,
            {
              height: isWeb
                ? screenWidth * (showSearchFilters ? 66 : 63) / 608
                : isCompactScreen ? 48 : screenWidth * (showSearchFilters ? 60 : 64) / 608,
              paddingHorizontal: isWeb
                ? screenWidth * 34 / 608
                : isCompactScreen ? 18 : screenWidth * 26 / 608,
            },
          ]}
        >
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            accessibilityLabel="Buscar alimentos"
            autoCapitalize="none"
            onChangeText={(value) => {
              setQuery(value);
              setSearchOpen(value.trim().length === 0);
              setSelectedCategory('Todos');
              setSelectedSearchFilter('Todo Oullin');
              setFilterApplied(false);
              setShowRestaurantFilter(false);
            }}
            onFocus={() => {
              setSearchOpen(query.trim().length === 0);
              setSelectedSearchFilter('Todo Oullin');
              setFilterApplied(false);
              setSelectedCategory('Todos');
              setShowRestaurantFilter(false);
            }}
            onSubmitEditing={() => submitSearch()}
            placeholder="Peça na oullin"
            placeholderTextColor={COLORS.muted}
            returnKeyType="search"
            style={[
              styles.searchInput,
              isWeb && styles.searchInputWeb,
              {
                fontSize: isWeb
                  ? Math.min(screenWidth * 24 / 608, 15)
                  : isCompactScreen ? 15 : Math.min(screenWidth * 16 / 608, 16),
              },
            ]}
            value={query}
          />
          {!!query && (
            <Pressable
              accessibilityLabel="Limpar busca"
              onPress={() => {
                setQuery('');
                setSearchOpen(true);
                setSelectedSearchFilter('Todo Oullin');
                setFilterApplied(false);
                setSelectedCategory('Todos');
              }}
              style={styles.clearButton}
            >
              <Text style={styles.clearText}>×</Text>
            </Pressable>
          )}
        </View>
        {showSearchFilters && (
          <ScrollView
            contentContainerStyle={[
              styles.searchFilters,
              isCompactScreen && styles.searchFiltersCompact,
              isWeb && {
                paddingTop: screenWidth * 33 / 608,
                paddingRight: screenWidth * 12 / 608,
              },
            ]}
            horizontal
            keyboardShouldPersistTaps="handled"
            showsHorizontalScrollIndicator={false}
          >
            {SEARCH_FILTERS.map((filter) => {
              const active = selectedSearchFilter === filter;
              return (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Filtro ${filter}`}
                  key={filter}
                  onPress={() => {
                    const normalizedFilter = normalizeSearchTerm(filter);
                    setSelectedSearchFilter(filter);
                    setFilterApplied(true);
                    setQuery('');
                    setSearchOpen(false);
                    setShowRestaurantFilter(false);
                    Keyboard.dismiss();

                    if (normalizedFilter.startsWith('restaurantes') || normalizedFilter === 'regiao') {
                      setSelectedCategory('Todos');
                      setShowRestaurantFilter(true);
                    } else if (normalizedFilter === 'perfil alimentar') {
                      setSelectedCategory('Marmitas');
                    } else if (normalizedFilter === 'bebidas') {
                      setSelectedCategory('Bebidas');
                    } else {
                      setSelectedCategory('Todos');
                    }
                  }}
                  style={[
                    styles.searchFilterChip,
                    {
                      height: isWeb
                        ? screenWidth * 36 / 608
                        : isCompactScreen ? 30 : 22,
                      marginRight: isWeb
                        ? screenWidth * 12 / 608
                        : isCompactScreen ? 8 : screenWidth * 8 / 393,
                      paddingHorizontal: isWeb
                        ? screenWidth * 4 / 608
                        : isCompactScreen ? 12 : 0,
                      width: screenWidth * SEARCH_FILTER_WIDTHS[filter] / 393,
                    },
                    active && styles.searchFilterChipActive,
                  ]}
                >
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.searchFilterText,
                      isCompactScreen && styles.searchFilterTextCompact,
                      isWeb && {
                        fontSize: screenWidth * 18 / 608,
                        lineHeight: screenWidth * 22 / 608,
                      },
                      active && styles.searchFilterTextActive,
                    ]}
                  >
                    {filter}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        )}
      </View>

      {showRestaurantFilter ? (
        <RestaurantSearchResults
          onSelectRestaurant={setSelectedRestaurantId}
          onSelectFood={selectRestaurantFood}
          restaurants={RESTAURANT_DIRECTORY.filter((restaurant) => restaurant.verified)}
          screenWidth={screenWidth}
          heading={normalizedSelectedFilter === 'regiao' ? 'Lojas da região' : 'Restaurantes'}
          notice={
            normalizedSelectedFilter === 'regiao'
              ? 'A localização exata pode variar conforme o endereço informado.'
              : undefined
          }
        />
      ) : filterApplied && ['todo oullin', 'bebidas', 'menor preco'].includes(normalizedSelectedFilter) ? (
        <ProductSearchResults
          items={filteredCatalogProducts}
          onSelectProduct={selectSearchResultProduct}
          screenWidth={screenWidth}
          heading={
            normalizedSelectedFilter === 'menor preco'
              ? 'Opções do menor para o maior preço'
              : normalizedSelectedFilter === 'bebidas'
                ? 'Bebidas encontradas'
                : 'Opções encontradas'
          }
        />
      ) : isWeb && normalizedQuery ? (
        <ProductSearchResults
          items={productSearchResults}
          onSelectProduct={selectSearchResultProduct}
          screenWidth={screenWidth}
        />
      ) : searchOpen ? (
        <ScrollView
          contentContainerStyle={styles.searchLandingContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          style={styles.homeLandingScroll}
        >
          <Text style={styles.searchSectionTitle}>Lojas recentes</Text>
          <ScrollView
            contentContainerStyle={styles.recentStores}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.recentStoresScroller}
          >
            {RECENT_STORES.map((store) => (
              <Pressable
                accessibilityRole="button"
                key={store.name}
                onPress={() => {
                  setSelectedRestaurantId(store.id);
                  Keyboard.dismiss();
                }}
                style={styles.recentStore}
              >
                <Image source={store.image} style={styles.recentStoreCircle} />
              <Text
                ellipsizeMode="tail"
                numberOfLines={2}
                style={styles.recentStoreLabel}
              >
                {store.label}
              </Text>
              </Pressable>
            ))}
          </ScrollView>

          <Text style={[styles.searchSectionTitle, styles.recentSearchHeading]}>
            Buscas recentes
          </Text>
          {visibleRecentSearches.length ? (
            visibleRecentSearches.map((item) => (
              <Pressable
                accessibilityRole="button"
                key={item}
                onPress={() => submitSearch(item)}
                style={styles.recentSearchRow}
              >
                <Text style={styles.recentSearchIcon}>⌕</Text>
                <Text style={styles.recentSearchText}>{item}</Text>
              </Pressable>
            ))
          ) : (
            <Text style={styles.noRecentSearches}>Nenhuma busca encontrada.</Text>
          )}
        </ScrollView>
      ) : matchingRestaurants.length > 0 ? (
        <RestaurantSearchResults
          onSelectRestaurant={setSelectedRestaurantId}
          onSelectFood={selectRestaurantFood}
          restaurants={matchingRestaurants}
          screenWidth={screenWidth}
        />
      ) : normalizedQuery && visibleSearchResults.length > 0 ? (
        <ProductSearchResults
          items={visibleSearchResults}
          onSelectProduct={selectSearchResultProduct}
          screenWidth={screenWidth}
        />
      ) : showSaudavelLife ? (
        <MarmitaSearchResults
          items={compatibleMealItems}
          onBack={() => {
            setSelectedCategory('Todos');
            setQuery('');
          }}
          onOpenRestaurant={() => setSelectedRestaurantId('saudavel-life')}
          onSelectFood={selectSaudavelFood}
        />
      ) : normalizedQuery ? (
        <ProductSearchResults
          items={visibleSearchResults}
          onSelectProduct={selectSearchResultProduct}
          screenWidth={screenWidth}
        />
      ) : (
      <ScrollView
        key="search-landing"
        contentContainerStyle={[
          styles.homeLandingContent,
          {
            paddingHorizontal: screenWidth * 20 / 608,
            paddingTop: screenWidth * (isWeb ? 28 : 42) / 608,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={[
          styles.homeLandingScroll,
          {
            borderTopLeftRadius: screenWidth * 24 / 608,
            borderTopRightRadius: screenWidth * 24 / 608,
          },
        ]}
      >
        <Pressable
          accessibilityRole="button"
          onPress={() => openCategory('Marmitas')}
          style={({ pressed }) => [
            styles.banner,
            {
              height: bannerHeight,
              marginLeft: isWeb ? screenWidth * 18 / 608 : 0,
              marginRight: isWeb ? screenWidth * 9 / 608 : 0,
            },
            pressed && styles.pressed,
          ]}
        >
          <Image
            accessibilityLabel="Refeição fresca para sua rotina"
            resizeMode="cover"
            source={require('./assets/meal-banner-user.png')}
            style={styles.bannerImage}
          />
          <View style={styles.bannerShade} />
          <View
            style={[
              styles.bannerCopy,
              {
                left: screenWidth * 12 / 608,
                top: screenWidth * 16 / 608,
              },
            ]}
          >
            <Image
              accessibilityLabel="Mascote Oullin"
              source={require('./assets/search-banner-mascot.png')}
              style={[
                styles.bannerBadge,
                {
                  height: bannerBadgeSize,
                  marginRight: screenWidth * 16 / 608,
                  width: bannerBadgeSize,
                },
              ]}
            />
            <Text style={[styles.bannerText, { fontSize: bannerTextFontSize }]}>
              Marmitas para sua rotina
            </Text>
          </View>
        </Pressable>

        <Text
          style={[
            styles.profileSectionTitle,
            {
              fontSize: profileSectionFontSize,
              lineHeight: screenWidth * 36 / 608,
              marginBottom: screenWidth * 36 / 608,
              marginLeft: screenWidth * 12 / 608,
              marginTop: profileSectionMarginTop,
            },
          ]}
        >
          Seu perfil alimentar
        </Text>
        <View
          style={[
            styles.profilePromotionCarouselFrame,
            { width: profilePromotionWidth, height: profilePromotionHeight },
          ]}
        >
          <ScrollView
            contentContainerStyle={styles.profilePromotionCarouselContent}
            decelerationRate="fast"
            disableIntervalMomentum
            horizontal
            nestedScrollEnabled
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            snapToAlignment="start"
            style={[
              styles.profilePromotionCarousel,
              { width: profilePromotionWidth, height: profilePromotionHeight },
            ]}
          >
            {HOME_PROFILE_PROMOTION_PAGES.map((page) => {
              const imageOffset = page.start - 16;
              return (
                <View
                  key={page.start}
                  style={[
                    styles.profilePromotionPage,
                    { width: profilePromotionWidth, height: profilePromotionHeight },
                  ]}
                >
                  <View
                    style={[
                      styles.profilePromotionPageImage,
                      { width: profilePromotionPageImageWidth, height: profilePromotionHeight },
                    ]}
                  >
                    <Image
                      accessibilityLabel="Promoções de hambúrguer, pizza, saladas, sushi, doces e massas"
                      resizeMode="stretch"
                      source={require('./assets/search-profile-promotions-carousel.png')}
                      style={{
                        height: profilePromotionHeight,
                        left: -profilePromotionImageWidth * imageOffset / 1173,
                        position: 'absolute',
                        top: 0,
                        width: profilePromotionImageWidth,
                      }}
                    />
                    {page.promotions.map((promotion) => (
                      <Pressable
                        accessibilityLabel={`Ver opções de ${promotion.label}`}
                        accessibilityRole="button"
                        key={promotion.category}
                        onPress={() => openCategory(promotion.category)}
                        style={({ pressed }) => {
                          const left = profilePromotionImageWidth *
                            (promotion.start - imageOffset) / 1173;
                          return [
                            styles.profilePromotionHitArea,
                            { left, width: profilePromotionImageWidth * 181 / 1173 },
                            pressed && styles.pressed,
                          ];
                        }}
                      />
                    ))}
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>

        <Text
          style={[
            styles.categoryHeading,
            {
              fontSize: Math.min(screenWidth * 40 / 608, 14),
              marginBottom: screenWidth * 10 / 608,
              marginLeft: screenWidth * 12 / 608,
              marginTop: screenWidth * 68 / 608,
            },
          ]}
        >
          Filtre por comida
        </Text>
        <ScrollView
          contentContainerStyle={[
            styles.categoryList,
            {
              paddingLeft: categoryInset,
              paddingRight: categoryInset,
            },
          ]}
          horizontal
          nestedScrollEnabled
          showsHorizontalScrollIndicator={false}
          style={[
            styles.categoryScroll,
            {
              width: categoryRowWidth,
              height: categoryCircleSize,
              marginTop: categoryMarginTop,
            },
          ]}
        >
          {FOOD_CATEGORIES.map((category, index) => {
            const iconScale = 0.92;
            const iconSize = categoryCircleSize * iconScale;
            const iconInset = (categoryCircleSize - iconSize) / 2;

            return (
              <Pressable
                accessibilityLabel={`Buscar ${category.label}`}
                accessibilityRole="button"
                accessibilityState={{ selected: selectedCategory === category.label }}
                key={category.label}
                onPress={() => openCategory(category.label)}
                style={[
                  styles.categoryItem,
                  {
                    marginRight: index === FOOD_CATEGORIES.length - 1 ? 0 : categoryGap,
                    width: categoryCircleSize,
                  },
                ]}
              >
                <View
                  style={[
                    styles.categoryCircle,
                    {
                      borderRadius: categoryCircleSize / 2,
                      height: categoryCircleSize,
                      width: categoryCircleSize,
                    },
                    selectedCategory === category.label && styles.categoryCircleActive,
                  ]}
                >
                  <Image
                    resizeMode="stretch"
                    source={category.background}
                    style={[StyleSheet.absoluteFillObject, styles.categoryCircleBackground]}
                  />
                  <Image
                    resizeMode={index < 4 ? 'contain' : 'cover'}
                    source={category.image}
                    style={{
                      borderRadius: iconSize * 0.38,
                      height: iconSize,
                      left: iconInset,
                      position: 'absolute',
                      top: iconInset,
                      width: iconSize,
                      zIndex: 1,
                    }}
                  />
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: COLORS.white,
    flex: 1,
  },
  searchHeader: {
    backgroundColor: COLORS.orange,
    paddingBottom: 10,
    paddingHorizontal: 5,
    paddingTop: 0,
  },
  searchHeaderExpanded: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
  },
  searchBox: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 25,
    flexDirection: 'row',
    height: 40,
    paddingHorizontal: 26,
  },
  searchIcon: {
    color: COLORS.orange,
    fontSize: 19,
    lineHeight: 22,
    marginRight: 7,
  },
  searchInput: {
    color: COLORS.text,
    flex: 1,
    height: '100%',
    paddingVertical: 0,
  },
  searchInputWeb: {
    outlineStyle: 'none',
  },
  clearButton: {
    alignItems: 'center',
    height: 30,
    justifyContent: 'center',
    width: 28,
  },
  clearText: {
    color: COLORS.muted,
    fontSize: 21,
  },
  searchFilters: {
    alignItems: 'center',
    paddingTop: 10,
    paddingRight: 10,
  },
  searchFiltersCompact: {
    alignItems: 'center',
    minWidth: '100%',
  },
  searchFilterChip: {
    alignItems: 'center',
    backgroundColor: '#FFC477',
    borderRadius: 18,
    height: 22,
    justifyContent: 'center',
    paddingHorizontal: 0,
  },
  searchFilterChipActive: {
    backgroundColor: COLORS.white,
  },
  searchFilterText: {
    color: COLORS.text,
    fontSize: 8,
    lineHeight: 9,
    textAlign: 'center',
  },
  searchFilterTextCompact: {
    fontSize: 9,
    lineHeight: 11,
  },
  searchFilterTextActive: {
    fontWeight: '600',
  },
  searchLandingContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    flexGrow: 1,
    marginTop: -1,
    paddingBottom: 24,
    paddingHorizontal: 12,
    paddingTop: 18,
  },
  searchSectionTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 11,
  },
  recentStores: {
    paddingHorizontal: 2,
    paddingRight: 10,
  },
  recentStoresScroller: {
    flexGrow: 0,
    flexShrink: 0,
    height: 102,
  },
  recentStore: {
    alignItems: 'center',
    marginRight: 8,
    width: 84,
  },
  recentStoreCircle: {
    backgroundColor: '#D9D9D9',
    borderRadius: 30,
    height: 60,
    resizeMode: 'cover',
    width: 60,
  },
  recentStoreLabel: {
    color: COLORS.text,
    fontSize: 9,
    lineHeight: 11,
    marginTop: 6,
    textAlign: 'center',
    width: 84,
  },
  recentSearchHeading: {
    marginBottom: 10,
    marginTop: 12,
  },
  recentSearchRow: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 34,
  },
  recentSearchIcon: {
    color: COLORS.text,
    fontSize: 21,
    lineHeight: 25,
    marginRight: 8,
  },
  recentSearchText: {
    color: COLORS.text,
    fontSize: 14,
  },
  noRecentSearches: {
    color: COLORS.muted,
    fontSize: 14,
  },
  mealResultsContent: {
    flexGrow: 1,
    paddingBottom: 24,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  mealResultsTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  mealResultsHeading: { alignItems: 'center', flexDirection: 'row', marginBottom: 14 },
  mealResultsBack: { alignItems: 'center', height: 42, justifyContent: 'center', marginRight: 8, width: 30 },
  mealResultsBackText: { color: COLORS.orange, fontSize: 30, lineHeight: 34 },
  mealResultsSubtitle: { color: COLORS.muted, fontSize: 10, marginTop: -12 },
  mealStoreHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 12,
  },
  mealStoreSummary: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  mealStoreImage: {
    borderRadius: 21,
    height: 42,
    width: 42,
  },
  mealStoreArrow: {
    color: COLORS.orange,
    fontSize: 24,
    marginLeft: 8,
  },
  mealStoreInfo: {
    flex: 1,
    marginLeft: 9,
  },
  mealStoreName: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '700',
  },
  mealStoreDetails: {
    color: COLORS.muted,
    fontSize: 9,
    marginTop: 4,
  },
  restaurantSearchResult: {
    alignItems: 'center',
    borderBottomColor: '#EAEAEA',
    borderBottomWidth: 1,
    flexDirection: 'row',
    paddingVertical: 12,
  },
  restaurantSearchResultsContent: {
    backgroundColor: COLORS.white,
    flexGrow: 1,
  },
  restaurantSearchHeading: {
    color: COLORS.text,
    fontWeight: '700',
  },
  restaurantGenericResult: {
    backgroundColor: COLORS.white,
  },
  restaurantGenericHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 14,
    paddingHorizontal: 16,
  },
  restaurantGenericStore: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    minWidth: 0,
  },
  restaurantGenericLogo: {
    borderRadius: 21,
    height: 42,
    width: 42,
  },
  restaurantGenericStoreInfo: {
    flex: 1,
    marginLeft: 9,
    minWidth: 0,
  },
  restaurantGenericName: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '700',
  },
  restaurantGenericMetadata: {
    color: COLORS.muted,
    fontSize: 9,
    marginTop: 4,
  },
  restaurantGenericFavorite: {
    color: '#555555',
    fontSize: 23,
    lineHeight: 26,
    marginLeft: 8,
  },
  restaurantGenericProducts: {
    paddingHorizontal: 12,
  },
  restaurantGenericProduct: {
    marginRight: 10,
  },
  restaurantGenericProductImage: {
    borderRadius: 9,
    width: '100%',
  },
  restaurantGenericProductPrice: {
    color: COLORS.text,
    fontSize: 10,
    marginTop: 6,
  },
  restaurantGenericProductName: {
    color: COLORS.text,
    fontSize: 9,
    marginTop: 2,
  },
  mealFavoriteButton: {
    alignItems: 'center',
    height: 36,
    justifyContent: 'center',
    width: 32,
  },
  mealFavoriteIcon: {
    color: COLORS.text,
    fontSize: 24,
    lineHeight: 28,
  },
  mealProducts: {
    paddingRight: 8,
  },
  mealProduct: {
    marginRight: 8,
  },
  mealProductImage: {
    borderRadius: 8,
    width: '100%',
  },
  mealProductPrice: {
    color: COLORS.text,
    fontSize: 10,
    marginTop: 6,
  },
  mealProductName: {
    color: COLORS.text,
    fontSize: 9,
    marginTop: 2,
  },
  mealListItem: { backgroundColor: COLORS.white, borderColor: '#ECECEC', borderRadius: 10, borderWidth: 1, marginBottom: 10, padding: 10 },
  mealListItemContent: { alignItems: 'center', flexDirection: 'row' },
  mealListImage: { borderRadius: 8, height: 88, width: 96 },
  mealListDetails: { flex: 1, marginLeft: 10 },
  mealListName: { color: COLORS.text, fontSize: 13, fontWeight: '700' },
  mealListPrice: { color: COLORS.orange, fontSize: 12, fontWeight: '700', marginTop: 4 },
  mealListDescription: { color: COLORS.muted, fontSize: 10, lineHeight: 14, marginTop: 3 },
  mealListTags: { color: '#298A53', fontSize: 9, marginTop: 5 },
  mealEmptyState: { backgroundColor: COLORS.white, borderRadius: 10, padding: 18 },
  mealInfoButton: {
    alignItems: 'center',
    backgroundColor: '#FF8500',
    borderRadius: 4,
    height: 21,
    justifyContent: 'center',
    marginTop: 7,
    paddingHorizontal: 2,
  },
  mealInfoButtonText: {
    color: COLORS.white,
    fontSize: 8,
    fontWeight: '600',
  },
  restaurantScreen: {
    backgroundColor: COLORS.white,
    flex: 1,
  },
  restaurantScroll: {
    paddingBottom: 20,
  },
  restaurantHero: {
    backgroundColor: COLORS.text,
    height: 210,
    overflow: 'hidden',
    position: 'relative',
  },
  restaurantHeroImage: {
    height: '100%',
    position: 'absolute',
    width: '100%',
  },
  restaurantHeroShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  restaurantHeroHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 58,
    paddingHorizontal: 14,
  },
  restaurantBackButton: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  restaurantBackText: {
    color: COLORS.blue,
    fontSize: 30,
    lineHeight: 34,
    marginTop: -4,
  },
  restaurantSearchBox: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderColor: '#E8E8E8',
    borderRadius: 24,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    height: 48,
    marginLeft: 0,
    paddingHorizontal: 16,
  },
  restaurantSearchText: {
    color: COLORS.muted,
    fontSize: 12,
  },
  restaurantSearchInput: {
    color: COLORS.text,
    flex: 1,
    fontSize: 14,
    height: '100%',
    paddingVertical: 0,
  },
  restaurantSearchClear: {
    alignItems: 'center',
    height: 30,
    justifyContent: 'center',
    width: 28,
  },
  restaurantSearchClearText: {
    color: COLORS.muted,
    fontSize: 20,
  },
  restaurantSearchEmpty: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  restaurantSearchEmptyText: {
    color: COLORS.muted,
    fontSize: 13,
  },
  restaurantInfo: {
    backgroundColor: COLORS.white,
    paddingBottom: 0,
  },
  restaurantInfoRow: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 148,
    marginTop: -42,
    paddingHorizontal: 12,
    position: 'relative',
  },
  restaurantLogo: {
    borderColor: COLORS.white,
    alignSelf: 'flex-start',
    borderRadius: 42,
    borderWidth: 2,
    height: 84,
    resizeMode: 'cover',
    width: 84,
  },
  restaurantInfoText: {
    left: 12,
    position: 'absolute',
    right: 34,
    top: 96,
  },
  restaurantNameRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  restaurantName: {
    color: COLORS.text,
    fontSize: 17,
    lineHeight: 21,
    fontWeight: '700',
  },
  restaurantVerified: {
    backgroundColor: COLORS.blue,
    borderRadius: 7,
    color: COLORS.white,
    fontSize: 9,
    fontWeight: '700',
    height: 14,
    lineHeight: 14,
    marginLeft: 5,
    overflow: 'hidden',
    textAlign: 'center',
    width: 14,
  },
  restaurantVerifiedIcon: {
    height: 14,
    marginLeft: 5,
    resizeMode: 'contain',
    width: 14,
  },
  restaurantRatingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 2,
  },
  restaurantMetaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 7,
  },
  restaurantMetaIcon: {
    height: 14,
    resizeMode: 'contain',
    width: 14,
  },
  restaurantMetaIconSpaced: {
    marginLeft: 8,
  },
  restaurantRating: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 14,
    marginTop: 1,
  },
  restaurantMeta: {
    color: COLORS.text,
    fontSize: 11,
    lineHeight: 15,
    marginLeft: 3,
  },
  restaurantArrow: {
    color: COLORS.orange,
    fontSize: 26,
    marginLeft: 5,
    paddingTop: 25,
  },
  restaurantArrowIcon: {
    height: 18,
    position: 'absolute',
    right: 12,
    resizeMode: 'contain',
    top: 94,
    width: 18,
  },
  restaurantDescription: {
    color: COLORS.text,
    fontSize: 12,
    lineHeight: 18,
    marginHorizontal: 16,
    marginTop: 12,
  },
  restaurantCompatibility: {
    alignItems: 'center',
    backgroundColor: '#CFF7BE',
    borderRadius: 10,
    flexDirection: 'row',
    marginHorizontal: 12,
    marginTop: 34,
    minHeight: 52,
    paddingHorizontal: 12,
  },
  restaurantCompatibilityUnverified: {
    backgroundColor: '#F3F3F3',
    borderColor: '#E1E1E1',
    borderWidth: 1,
  },
  restaurantCompatibilityIcon: {
    alignItems: 'center',
    backgroundColor: '#55D58A',
    borderRadius: 17,
    height: 34,
    justifyContent: 'center',
    marginRight: 14,
    width: 34,
  },
  restaurantCompatibilityIconUnverified: {
    backgroundColor: '#D8D8D8',
  },
  restaurantCompatibilityCheck: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '700',
  },
  restaurantCompatibilityInfo: {
    color: '#555555',
  },
  restaurantCompatibilityText: {
    color: '#2E2E2E',
    flex: 1,
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 15,
  },
  restaurantFoodSafety: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
  },
  restaurantFoodSafetyRow: {
    alignItems: 'flex-start',
    borderBottomColor: '#ECECEC',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  restaurantFoodSafetyLabel: {
    color: COLORS.text,
    flex: 1,
    fontSize: 11,
    marginRight: 8,
  },
  restaurantFoodSafetyValue: {
    color: COLORS.muted,
    flex: 1,
    fontSize: 11,
    textAlign: 'right',
  },
  restaurantFoodSafetyNote: {
    color: COLORS.muted,
    fontSize: 10,
    lineHeight: 15,
    marginTop: 8,
  },
  preparationSection: {
    backgroundColor: COLORS.white,
    marginTop: 46,
    paddingBottom: 16,
    paddingHorizontal: 12,
  },
  restaurantSectionTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
  },
  preparationFeatures: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 14,
  },
  preparationFeatureSpacing: {
    marginRight: 10,
  },
  preparationFeature: {
    height: 76,
    width: 76,
  },
  restaurantFilters: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  restaurantFilter: {
    alignItems: 'center',
    backgroundColor: '#EAEAEA',
    borderRadius: 14,
    height: 27,
    justifyContent: 'center',
    marginRight: 6,
    paddingHorizontal: 11,
  },
  restaurantFilterActive: {
    backgroundColor: '#FFF5E8',
    borderColor: COLORS.orange,
    borderWidth: 1,
  },
  restaurantFilterText: {
    color: COLORS.text,
    fontSize: 9,
  },
  restaurantFilterTextActive: {
    color: COLORS.orange,
  },
  restaurantProductSection: {
    backgroundColor: COLORS.white,
    marginTop: 8,
    paddingBottom: 14,
    paddingTop: 10,
    paddingHorizontal: 12,
  },
  restaurantProductsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingTop: 9,
  },
  restaurantProduct: {
    marginBottom: 12,
    marginRight: 0,
  },
  restaurantProductImage: {
    borderRadius: 9,
    width: '100%',
  },
  restaurantProductPrice: {
    color: COLORS.text,
    fontSize: 10,
    marginTop: 6,
  },
  restaurantProductName: {
    color: COLORS.text,
    fontSize: 9,
    marginTop: 2,
  },
  foodDetailsScreen: {
    backgroundColor: COLORS.white,
    flex: 1,
  },
  foodDetailsScroll: {
    paddingBottom: 18,
  },
  foodReferenceDetailsScroll: {
    paddingBottom: 0,
  },
  foodReferenceHero: {
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  },
  foodReferenceHeroImage: {
    height: '100%',
    width: '100%',
  },
  foodReferenceHeroSearch: {
    position: 'absolute',
  },
  foodReferenceSummary: {
    paddingHorizontal: 16,
    paddingTop: 26,
  },
  foodReferenceTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
    marginBottom: 10,
  },
  foodReferenceTags: {
    marginTop: 0,
    paddingHorizontal: 18,
  },
  foodReferenceTag: {
    borderRadius: 9,
    marginBottom: 4,
    marginRight: 5,
    minHeight: 16,
    paddingHorizontal: 6,
  },
  foodReferenceTagText: {
    fontSize: 7,
    lineHeight: 9,
  },
  homeFoodInfoScreen: {
    backgroundColor: COLORS.white,
    flex: 1,
  },
  homeFoodInfoContent: {
    flexGrow: 1,
    paddingBottom: 28,
  },
  homeFoodInfoBack: {
    alignSelf: 'flex-start',
    justifyContent: 'center',
    minHeight: 44,
    marginBottom: 18,
  },
  homeFoodInfoBackText: {
    color: COLORS.orange,
    fontSize: 16,
    fontWeight: '600',
  },
  homeFoodInfoTitle: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 30,
  },
  homeFoodInfoProduct: {
    color: COLORS.muted,
    fontSize: 16,
    marginTop: 6,
  },
  homeFoodInfoCard: {
    backgroundColor: '#FFF9F1',
    borderColor: '#FFD18D',
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 24,
    padding: 18,
  },
  homeFoodInfoText: {
    color: COLORS.text,
    fontSize: 16,
    lineHeight: 24,
  },
  homeFoodInfoNote: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 16,
  },
  homeFoodInfoButton: {
    alignItems: 'center',
    backgroundColor: COLORS.orange,
    borderRadius: 10,
    justifyContent: 'center',
    marginTop: 24,
    minHeight: 48,
  },
  homeFoodInfoButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  homeAddToCartBar: {
    backgroundColor: COLORS.white,
    borderTopColor: '#E8E8E8',
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
  },
  homeAddToCartButton: {
    alignItems: 'center',
    backgroundColor: COLORS.orange,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 50,
    paddingHorizontal: 18,
  },
  homeAddToCartButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },
  homeAddToCartPrice: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 8,
  },
  homeAddToCartFeedback: {
    color: COLORS.text,
    fontSize: 12,
    marginTop: 6,
    textAlign: 'center',
  },
  chickenUtensilsScreen: {
    backgroundColor: COLORS.white,
    flex: 1,
  },
  chickenUtensilsContent: {
    backgroundColor: COLORS.white,
    flexGrow: 1,
  },
  chickenNutritionScreen: {
    backgroundColor: COLORS.white,
    flex: 1,
  },
  chickenNutritionContent: {
    backgroundColor: COLORS.white,
    flexGrow: 1,
    paddingBottom: 12,
  },
  chickenNutritionTopSpace: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  chickenNutritionBackButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  chickenNutritionBackText: {
    color: COLORS.text,
  },
  chickenNutritionTitleBar: {
    alignItems: 'center',
    backgroundColor: COLORS.amber,
    flexDirection: 'row',
  },
  chickenNutritionSource: {
    color: COLORS.text,
  },
  chickenNutritionTitle: {
    color: COLORS.text,
    flex: 1,
  },
  chickenNutritionTable: {
    width: '100%',
  },
  chickenNutritionHeaderRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  chickenNutritionHeaderComponent: {
    color: '#222222',
    flex: 4,
    fontWeight: '700',
  },
  chickenNutritionHeaderUnit: {
    color: '#222222',
    flex: 2.6,
    fontWeight: '700',
    textAlign: 'center',
  },
  chickenNutritionHeaderValue: {
    color: '#222222',
    flex: 3.4,
    fontWeight: '700',
    textAlign: 'right',
  },
  chickenNutritionDataRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  chickenNutritionComponent: {
    color: COLORS.text,
    flex: 4,
    paddingRight: 4,
  },
  chickenNutritionUnit: {
    color: COLORS.text,
    flex: 2.6,
    textAlign: 'center',
  },
  chickenNutritionValue: {
    color: COLORS.text,
    flex: 3.4,
    textAlign: 'right',
  },
  chickenNutritionInfoScreen: {
    backgroundColor: COLORS.white,
    flex: 1,
  },
  chickenNutritionInfoContent: {
    backgroundColor: COLORS.white,
    flexGrow: 1,
  },
  chickenNutritionInfoTitle: {
    color: COLORS.text,
    fontWeight: '700',
  },
  chickenNutritionInfoSubtitle: {
    color: COLORS.text,
  },
  chickenNutritionEnergyCard: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.orange,
    borderWidth: 1,
    justifyContent: 'center',
  },
  chickenNutritionEnergyLabel: {
    color: COLORS.text,
  },
  chickenNutritionEnergyValue: {
    color: COLORS.text,
    fontWeight: '700',
  },
  chickenNutritionServing: {
    color: COLORS.text,
  },
  chickenNutritionSummary: {
    flexDirection: 'row',
  },
  chickenNutritionSummaryCard: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.orange,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
  },
  chickenNutritionSummaryValue: {
    color: COLORS.text,
    fontWeight: '700',
  },
  chickenNutritionSummaryLabel: {
    color: COLORS.text,
  },
  chickenNutritionDetailCard: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.orange,
    borderWidth: 1,
  },
  chickenNutritionDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chickenNutritionDetailHeading: {
    color: COLORS.text,
    fontWeight: '700',
  },
  chickenNutritionDetailRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chickenNutritionDetailLabel: {
    color: COLORS.text,
  },
  chickenNutritionDetailAmount: {
    color: COLORS.text,
  },
  chickenNutritionDisclaimer: {
    color: COLORS.muted,
  },
  chickenIngredientsCard: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.orange,
    borderWidth: 1,
  },
  chickenIngredientsAllergenCard: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.orange,
    borderWidth: 1,
  },
  chickenIngredientsSectionTitle: {
    color: COLORS.text,
    fontWeight: '700',
  },
  chickenIngredientRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chickenIngredientCopy: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  chickenIngredientBullet: {
    backgroundColor: COLORS.orange,
    borderRadius: 2,
  },
  chickenIngredientName: {
    color: COLORS.text,
    flex: 1,
  },
  chickenIngredientMoreButton: {
    alignItems: 'center',
    backgroundColor: '#FFF5E8',
    justifyContent: 'center',
  },
  chickenIngredientMoreText: {
    color: COLORS.orange,
    fontWeight: '600',
  },
  chickenAllergenRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chickenAllergenName: {
    color: COLORS.text,
    flex: 1,
  },
  chickenIngredientsNoteText: {
    color: COLORS.text,
  },
  chickenIngredientsWarning: {
    color: COLORS.muted,
  },
  chickenUtensilsTitle: {
    color: COLORS.text,
    fontWeight: '700',
  },
  chickenUtensilsSubtitle: {
    color: COLORS.text,
  },
  chickenUtensilsList: {
    width: '100%',
  },
  chickenUtensilCard: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderColor: COLORS.orange,
    borderWidth: 1,
    flexDirection: 'row',
    width: '100%',
  },
  chickenUtensilTitle: {
    color: COLORS.text,
    fontWeight: '700',
  },
  chickenUtensilDescription: {
    color: COLORS.muted,
  },
  chickenPreparationCare: {
    borderColor: COLORS.orange,
    borderWidth: 1,
    width: '100%',
  },
  chickenPreparationCareTitle: {
    color: COLORS.text,
    fontWeight: '700',
  },
  chickenPreparationTip: {
    color: COLORS.text,
  },
  chickenUtensilsFooter: {
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    width: '100%',
  },
  chickenUtensilsButton: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  chickenUtensilsQuestionButton: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.orange,
    borderWidth: 1,
  },
  chickenUtensilsConfirmButton: {
    backgroundColor: COLORS.amber,
  },
  chickenUtensilsQuestionText: {
    color: COLORS.text,
  },
  chickenUtensilsConfirmText: {
    color: COLORS.white,
    fontWeight: '700',
  },
  chickenUtensilsPressed: {
    opacity: 0.75,
  },
  chickenQuestionModalBackdrop: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.42)',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  chickenQuestionModal: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    maxWidth: 360,
    padding: 20,
    width: '100%',
  },
  chickenQuestionModalTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
  },
  chickenQuestionModalText: {
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 10,
  },
  chickenQuestionModalClose: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: COLORS.amber,
    borderRadius: 10,
    justifyContent: 'center',
    marginTop: 18,
    minHeight: 36,
    minWidth: 90,
  },
  chickenQuestionModalCloseText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
  },
  foodReferenceFeatures: {
    justifyContent: 'flex-start',
    marginTop: 16,
    paddingHorizontal: 16,
  },
  foodReferenceFeatureSpacing: {
    marginRight: 16,
  },
  foodReferenceRecommendations: {
    marginTop: 30,
    paddingBottom: 10,
    paddingTop: 9,
  },
  foodReferenceRecommendationsTitle: {
    fontSize: 14,
    lineHeight: 17,
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  foodReferenceRecommendationList: {
    paddingHorizontal: 16,
  },
  foodReferenceRecommendationCard: {
    marginRight: 8,
  },
  foodReferenceRecommendationPrice: {
    fontSize: 8,
    marginTop: 8,
  },
  foodReferenceRecommendationName: {
    fontSize: 8,
    marginTop: 2,
  },
  foodReferenceRecommendationButton: {
    backgroundColor: '#FFB400',
    borderRadius: 4,
    marginTop: 8,
    minHeight: 14,
  },
  foodReferenceRecommendationButtonText: {
    fontSize: 6,
  },
  foodDetailsHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 18,
  },
  foodDetailsSearchBox: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderColor: '#FF8500',
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: 'row',
    height: 48,
    paddingHorizontal: 16,
    width: '100%',
  },
  foodDetailsSearchInput: {
    color: COLORS.text,
    flex: 1,
    fontSize: 14,
    height: '100%',
    paddingVertical: 0,
  },
  foodDetailsSearchClear: {
    color: COLORS.muted,
    fontSize: 20,
  },
  foodDetailsBackButton: {
    alignItems: 'center',
    height: 32,
    justifyContent: 'center',
    width: 24,
  },
  foodDetailsBackText: {
    color: COLORS.text,
    fontSize: 30,
    lineHeight: 34,
    marginTop: -4,
  },
  foodDetailsTitle: {
    color: COLORS.text,
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 4,
  },
  foodProductSummary: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  foodProductImage: {
    borderRadius: 12,
    width: '100%',
  },
  foodProductPrice: {
    color: COLORS.orange,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 10,
  },
  foodProductDescription: {
    color: COLORS.text,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },
  foodProductRestaurant: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 4,
  },
  foodDetailsTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    paddingHorizontal: 20,
  },
  foodProfileNote: { color: COLORS.muted, fontSize: 10, lineHeight: 15, marginTop: 2, paddingHorizontal: 20 },
  foodDetailTag: {
    alignItems: 'center',
    borderRadius: 8,
    justifyContent: 'center',
    marginBottom: 6,
    marginRight: 6,
    minHeight: 22,
    paddingHorizontal: 9,
  },
  foodDetailTagText: {
    color: COLORS.text,
    fontSize: 9,
    fontWeight: '600',
  },
  foodDetailFeatures: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 13,
    paddingHorizontal: 16,
  },
  productPreparation: { marginTop: 15, paddingHorizontal: 20 },
  productPreparationBlock: { marginBottom: 10 },
  productPreparationTitle: { color: COLORS.text, fontSize: 11, fontWeight: '700' },
  productPreparationText: { color: COLORS.muted, fontSize: 10, lineHeight: 15, marginTop: 3 },
  foodFeatureCard: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderColor: COLORS.orange,
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: 'center',
  },
  foodUpdatedIcon: {
    alignItems: 'center',
    borderColor: COLORS.text,
    borderRadius: 10,
    borderWidth: 1.5,
    height: 20,
    justifyContent: 'center',
    marginBottom: 4,
    width: 20,
  },
  foodUpdatedCheck: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 17,
  },
  foodReferenceCheckIcon: {
    height: 19,
    marginBottom: 4,
    width: 19,
  },
  foodReferenceSurveyIcon: {
    height: 24,
    marginBottom: 4,
    width: 25,
  },
  foodNutritionIcon: {
    borderColor: COLORS.text,
    borderRadius: 2,
    borderWidth: 1,
    height: 25,
    justifyContent: 'center',
    marginBottom: 4,
    paddingHorizontal: 3,
    width: 18,
  },
  foodNutritionLine: {
    backgroundColor: COLORS.text,
    height: 2,
    marginBottom: 2,
    width: 9,
  },
  foodNutritionRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 1,
  },
  foodNutritionBullet: {
    backgroundColor: COLORS.text,
    borderRadius: 2,
    height: 3,
    marginRight: 2,
    width: 3,
  },
  foodNutritionTextLine: {
    backgroundColor: COLORS.text,
    height: 1.5,
    width: 7,
  },
  foodNutritionShortLine: {
    width: 5,
  },
  foodCertificateIcon: {
    alignItems: 'center',
    height: 30,
    justifyContent: 'center',
    marginBottom: 4,
    width: 24,
  },
  foodCertificateStar: {
    color: COLORS.text,
    fontSize: 19,
    lineHeight: 22,
  },
  foodCertificateRibbons: {
    bottom: 0,
    flexDirection: 'row',
    position: 'absolute',
  },
  foodCertificateRibbon: {
    backgroundColor: COLORS.text,
    height: 6,
    marginHorizontal: 1,
    transform: [{ rotate: '12deg' }],
    width: 3,
  },
  foodFeatureLabel: {
    color: COLORS.text,
    fontSize: 7,
    lineHeight: 8,
    textAlign: 'center',
  },
  foodRecommendations: {
    backgroundColor: '#F3F3F5',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 28,
    paddingBottom: 18,
    paddingTop: 10,
  },
  foodRecommendationsTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 12,
    paddingHorizontal: 18,
  },
  foodRecommendationList: {
    paddingHorizontal: 18,
  },
  foodRecommendationCard: {
    marginRight: 10,
  },
  foodRecommendationImage: {
    borderRadius: 10,
    width: '100%',
  },
  foodRecommendationPrice: {
    color: COLORS.text,
    fontSize: 10,
    marginTop: 6,
  },
  foodRecommendationName: {
    color: COLORS.text,
    fontSize: 9,
    marginTop: 3,
  },
  foodRecommendationButton: {
    alignItems: 'center',
    backgroundColor: '#FF8500',
    borderRadius: 5,
    justifyContent: 'center',
    marginTop: 8,
    minHeight: 20,
  },
  foodRecommendationButtonText: {
    color: COLORS.white,
    fontSize: 7,
    fontWeight: '600',
  },
  content: {
    paddingBottom: 18,
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  homeLandingContent: {
    backgroundColor: COLORS.white,
    flexGrow: 1,
    paddingBottom: 18,
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  banner: {
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  bannerImage: {
    height: '100%',
    position: 'absolute',
    width: '100%',
  },
  bannerShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.28)',
  },
  bannerCopy: {
    alignItems: 'center',
    flexDirection: 'row',
    position: 'absolute',
  },
  bannerBadge: {
    height: 28,
    width: 28,
    marginRight: 16,
  },
  bannerText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowRadius: 4,
  },
  profileSectionTitle: {
    color: '#111111',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    marginTop: 45,
  },
  profilePromotionCarousel: {
    flexGrow: 0,
  },
  profilePromotionCarouselFrame: {
    overflow: 'hidden',
  },
  profilePromotionCarouselContent: {
    alignItems: 'flex-start',
  },
  profilePromotionPage: {
    alignItems: 'flex-start',
  },
  profilePromotionPageImage: {
    overflow: 'hidden',
    position: 'relative',
  },
  homeLandingScroll: {
    backgroundColor: COLORS.white,
    flex: 1,
    overflow: 'hidden',
  },
  profilePromotionHitArea: {
    bottom: 0,
    position: 'absolute',
    top: 0,
  },
  categoryScroll: {
    alignSelf: 'center',
    flexGrow: 0,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 11,
    marginTop: 17,
  },
  foodSectionTitle: {
    color: COLORS.text,
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
    marginTop: 1,
  },
  categoryHeading: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 11,
    marginTop: 6,
  },
  categoryList: {
    alignItems: 'center',
  },
  categoryItem: {
    alignItems: 'center',
    flexGrow: 0,
  },
  categoryCircle: {
    alignItems: 'center',
    backgroundColor: COLORS.orange,
    borderColor: 'transparent',
    borderWidth: 0,
    height: 56,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 56,
  },
  categoryCircleBackground: {
    zIndex: 0,
  },
  categoryCircleActive: {
    borderColor: COLORS.orange,
    borderWidth: 2,
  },
  foodHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productSearchResultsContent: {
    backgroundColor: COLORS.white,
    flexGrow: 1,
  },
  productSearchHeading: {
    color: COLORS.text,
    fontWeight: '700',
  },
  productSearchRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  productSearchText: {
    flex: 1,
    minWidth: 0,
  },
  productSearchName: {
    color: COLORS.text,
    fontWeight: '400',
  },
  productSearchPrice: {
    color: COLORS.text,
    fontWeight: '700',
    marginTop: 1,
  },
  productSearchRestaurant: {
    color: COLORS.muted,
    marginTop: 2,
    minWidth: 0,
    overflow: 'visible',
  },
  productSearchLogo: {
    flexShrink: 0,
  },
  productSearchEmpty: {
    color: COLORS.muted,
  },
  foodCount: {
    alignSelf: 'flex-start',
    backgroundColor: '#F1F1F1',
    borderRadius: 12,
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: '600',
    overflow: 'hidden',
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  foodResultList: {
    paddingBottom: 12,
  },
  foodResultCard: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderColor: '#E9E9E9',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 9,
    padding: 9,
  },
  foodResultImage: {
    backgroundColor: '#F1F1F1',
    borderRadius: 9,
    height: 64,
    width: 64,
  },
  foodResultInfo: {
    flex: 1,
    marginHorizontal: 10,
    minWidth: 0,
  },
  foodResultName: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '700',
  },
  foodResultCategory: {
    color: COLORS.muted,
    fontSize: 10,
    marginTop: 2,
  },
  foodResultPrice: {
    color: COLORS.blue,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4,
  },
  foodStoreButton: {
    alignItems: 'center',
    backgroundColor: '#FFB400',
    borderRadius: 7,
    justifyContent: 'center',
    minHeight: 32,
    paddingHorizontal: 9,
  },
  foodStoreButtonText: {
    color: COLORS.text,
    fontSize: 9,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '600',
  },
  emptyText: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 5,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
});
