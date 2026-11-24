import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Image,
  Keyboard,
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

// Catálogo demonstrativo; a lista poderá ser substituída pela resposta do backend.
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
    name: 'Subway',
    restaurantName: 'Subway',
    restaurantLabel: 'Restaurante',
    image: require('./assets/subway-logo.png'),
  },
  {
    id: 'marmita-200g',
    name: 'Marmita 200g - Marmitas da jô',
    restaurantName: 'Marmitas da jô',
    restaurantLabel: 'restaurante',
    image: require('./assets/search-result-store-marmitas-ju.png'),
  },
  {
    id: 'batata-cozida',
    name: 'Batata Cozida - Potato House',
    restaurantName: 'Potato House',
    restaurantLabel: 'restaurante',
    image: require('./assets/search-result-store-potato-house.png'),
  },
  {
    id: 'sanduiche-frango',
    name: 'Sanduíche de Frango - KFC',
    restaurantName: 'KFC',
    restaurantLabel: 'restaurante',
    image: require('./assets/search-result-store-kfc.png'),
  },
  {
    id: 'suco-natural',
    name: 'Suco Natural - Saudavel Life',
    restaurantName: 'Saudavel Life',
    restaurantLabel: 'restaurante',
    image: require('./assets/search-result-store-saudavel-life.png'),
  },
  {
    id: 'brigadeiro',
    name: 'Brigadeiro - Doce Abraço',
    restaurantName: 'Doce Abraço',
    restaurantLabel: 'restaurante',
    image: require('./assets/search-result-store-doce-abraco.png'),
  },
  {
    id: 'bife-acebolado',
    name: 'Bife Acebolado - Outback',
    restaurantName: 'Outback',
    restaurantLabel: 'restaurante',
    image: require('./assets/search-result-store-outback.png'),
  },
  {
    id: 'cafe-da-manha',
    name: 'Cafés Da Manhã - Manhã Leve',
    restaurantName: 'Manhã Leve',
    restaurantLabel: 'restaurante',
    image: require('./assets/search-result-store-manha-leve.png'),
  },
  {
    id: 'bolo-de-milho',
    name: 'Bolo De Milho - Quintal Do Milho',
    restaurantName: 'Quintal Do Milho',
    restaurantLabel: 'restaurante',
    image: require('./assets/search-result-store-quintal-milho.png'),
  },
];

const SEARCH_FILTERS = [
  'Todo Oullin',
  'Perfil alimentar',
  'restaurantes verificados',
  'bebidas',
  'região',
  'menor preço',
];

const SEARCH_FILTER_WIDTHS = {
  'Todo Oullin': 68,
  'Perfil alimentar': 88,
  'restaurantes verificados': 86,
  bebidas: 79,
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

const MEAL_FEATURES = [
  { type: 'utensils', label: 'Utensílios dedicados' },
  { type: 'ingredientCard', label: 'Ingredientes utilizados' },
  { type: 'nutrition', label: 'Ficha nutricional' },
  { type: 'certificate', label: 'Certificações' },
];

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

const RESTAURANT_MEALS = [
  {
    name: 'Marmita simples',
    detailName: 'Marmita de frango',
    price: 'R$ 15,99',
    description: 'Arroz, frango e legumes preparados no dia.',
    image: require('./assets/marmita-detail-frango.png'),
  },
  {
    name: 'Marmita de legumes',
    price: 'R$ 15,99',
    description: 'Legumes frescos com acompanhamento da casa.',
    image: require('./assets/marmita-card-salada.png'),
  },
  {
    name: 'Marmita caseira',
    price: 'R$ 18,99',
    description: 'Uma refeição completa feita com ingredientes selecionados.',
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
    searchCardImage: require('./assets/restaurant-result-marmitas-ju.png'),
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
          ...makeMenuItem('Marmita Simples', 'R$ 15,99', '', require('./assets/restaurant-search-marmitas-ju-1.png')),
        },
        {
          id: 'marmitas-da-jo-simples-2',
          ...makeMenuItem('Marmita Simples', 'R$ 15,99', '', require('./assets/restaurant-search-marmitas-ju-2.png')),
        },
        {
          id: 'marmitas-da-jo-simples-3',
          ...makeMenuItem('Marmita Simples', 'R$ 15,99', '', require('./assets/restaurant-search-marmitas-ju-3.png')),
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
    searchCardImage: require('./assets/restaurant-result-doce-abraco.png'),
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
          ...makeMenuItem('Brigadeiros Fit', 'R$ 24,99', '', require('./assets/restaurant-search-doce-abraco-1.png')),
        },
        {
          id: 'doce-abraco-fatia-bolo',
          ...makeMenuItem('Fatia de bolo', 'R$ 15,99', '', require('./assets/restaurant-search-doce-abraco-2.png')),
        },
        {
          id: 'doce-abraco-donuts',
          ...makeMenuItem('Donuts', 'R$ 15,99', '', require('./assets/restaurant-search-doce-abraco-3.png')),
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
      equipment: 'Utensílios dedicados (cadastro demonstrativo; confirme com a loja)',
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
      equipment: 'Forno especial (cadastro demonstrativo; confirme com a loja)',
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

function FoodFeatureCard({ label, type, size }) {
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
        <View style={styles.foodUpdatedIcon}>
          <Text style={styles.foodUpdatedCheck}>✓</Text>
        </View>
      ) : type === 'nutrition' ? (
        <View style={styles.foodNutritionIcon}>
          <View style={styles.foodNutritionLine} />
          {[0, 1, 2].map((row) => (
            <View key={row} style={styles.foodNutritionRow}>
              <View style={styles.foodNutritionBullet} />
              <View style={[styles.foodNutritionTextLine, row === 2 && styles.foodNutritionShortLine]} />
            </View>
          ))}
        </View>
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

export function FoodDetailsScreen({ item, onBack, onSelectItem, profileSelections = {}, screenWidth }) {
  const [detailSearchQuery, setDetailSearchQuery] = useState('');
  const featureSize = Math.min(76, (screenWidth - 72) / 4);
  const cardWidth = Math.min(116, (screenWidth - 64) / 3);
  const recommendations = item.recommendations || RESTAURANT_MEALS;
  const productFeatures = item.features || [];
  const productImageWidth = screenWidth - 32;
  const profileRules = getDietaryProfileRules(profileSelections);
  const profileTags = profileRules
    .filter((rule) => item.dietaryCompatibility?.[rule.key] === true)
    .map((rule) => rule.label);
  const productFilters = [...new Set([...(item.filters || []), ...profileTags])].filter(
    (filter) => !['todo oullin', 'perfil alimentar', 'menor preco'].includes(
      normalizeSearchTerm(filter),
    ),
  );
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

  return (
    <View style={styles.foodDetailsScreen}>
      <ScrollView
        contentContainerStyle={styles.foodDetailsScroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.foodDetailsHeader}>
          <View style={styles.foodDetailsSearchBox}>
            <Text style={styles.searchIcon}>⌕</Text>
            <TextInput
              accessibilityLabel="Buscar produtos relacionados"
              autoCapitalize="none"
              onChangeText={setDetailSearchQuery}
              placeholder="Peça na Oullin"
              placeholderTextColor={COLORS.muted}
              returnKeyType="search"
              style={styles.foodDetailsSearchInput}
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
        </View>

        <View style={styles.foodProductSummary}>
          <Image
            accessibilityLabel={item.detailName || item.name}
            resizeMode="cover"
            source={item.image}
            style={[styles.foodProductImage, { height: productImageWidth * 0.58 }]}
          />
          <Text style={styles.foodProductPrice}>{item.price}</Text>
          {!!item.description && (
            <Text style={styles.foodProductDescription}>{item.description}</Text>
          )}
          {!!item.restaurantName && (
            <Text style={styles.foodProductRestaurant}>{item.restaurantName}</Text>
          )}
        </View>

        {!!productFilters.length && (
          <View style={styles.foodDetailsTags}>
            {productFilters.map((filter) => (
              <View
                key={filter}
                style={[
                  styles.foodDetailTag,
                  { backgroundColor: getDietaryTagColors(filter).backgroundColor },
                ]}
              >
                <Text
                  style={[
                    styles.foodDetailTagText,
                    { color: getDietaryTagColors(filter).color },
                  ]}
                >
                  {filter}
                </Text>
              </View>
            ))}
          </View>
        )}
        {!!profileRules.length && (
          <Text style={styles.foodProfileNote}>
            Confirme ingredientes e risco de contaminação cruzada com a loja antes de pedir.
          </Text>
        )}

        {!!productFeatures.length && (
          <View style={styles.foodDetailFeatures}>
            {productFeatures.map((feature, index) => (
              <FoodFeatureCard
                key={`${feature.label}-${index}`}
                label={feature.label}
                size={featureSize}
                type={feature.type}
              />
            ))}
          </View>
        )}

        {!!(item.ingredients || item.utensils) && (
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
          <View style={styles.foodRecommendations}>
            <Text style={styles.foodRecommendationsTitle}>Seu perfil alimentar</Text>
            <ScrollView
              contentContainerStyle={styles.foodRecommendationList}
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {visibleRecommendations.map((recommendation) => (
                <View key={recommendation.id || recommendation.name} style={[styles.foodRecommendationCard, { width: cardWidth }]}>
                  <Pressable
                    accessibilityLabel={`Ver ${recommendation.detailName || recommendation.name}`}
                    accessibilityRole="button"
                    onPress={() => onSelectItem({ ...recommendation, recommendations })}
                  >
                    <Image
                      accessibilityLabel={recommendation.detailName || recommendation.name}
                      resizeMode="cover"
                      source={recommendation.image}
                      style={[styles.foodRecommendationImage, { height: cardWidth * 0.66 }]}
                    />
                    <Text style={styles.foodRecommendationPrice}>{recommendation.price}</Text>
                    <Text numberOfLines={1} style={styles.foodRecommendationName}>
                      {recommendation.name}
                    </Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => onSelectItem({ ...recommendation, recommendations })}
                    style={styles.foodRecommendationButton}
                  >
                    <Text style={styles.foodRecommendationButtonText}>Ver informações</Text>
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
              onPress={() => onSelectItem(item)}
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
              onPress={() => onSelectItem(item)}
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

export function RestaurantDetailScreen({ restaurant, screenWidth, onBack, onStatusBarBackgroundChange }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [restaurantSearchQuery, setRestaurantSearchQuery] = useState('');
  const scrollRef = useRef(null);
  const recommendations = restaurant.sections.flatMap((section) => section.items);
  const normalizedRestaurantQuery = normalizeSearchTerm(restaurantSearchQuery);
  const filteredSections = normalizedRestaurantQuery
    ? restaurant.sections.map((section) => ({
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
    : restaurant.sections;

  useEffect(() => {
    onStatusBarBackgroundChange?.(selectedItem ? COLORS.white : COLORS.orange);
  }, [onStatusBarBackgroundChange, selectedItem]);

  function selectProduct(item) {
    setSelectedItem({
      ...item,
      features: restaurant.features,
      filters: restaurant.filters,
      recommendations,
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
                <Text style={styles.restaurantMeta}>R$ 30,00</Text>
                <Image source={require('./assets/restaurant-cart.png')} style={[styles.restaurantMetaIcon, styles.restaurantMetaIconSpaced]} />
                <Text style={styles.restaurantMeta}>Min. {restaurant.minimumOrder}</Text>
              </View>
            </View>
            <Image
              accessibilityLabel="Abrir detalhes"
              source={require('./assets/restaurant-arrow.png')}
              style={styles.restaurantArrowIcon}
            />
          </View>
          {restaurant.compatibilityText ? (
            <View style={styles.restaurantCompatibility}>
              <View style={styles.restaurantCompatibilityIcon}>
                <Text style={styles.restaurantCompatibilityCheck}>✓</Text>
              </View>
              <Text style={styles.restaurantCompatibilityText}>{restaurant.compatibilityText}</Text>
            </View>
          ) : (
            <Text style={styles.restaurantDescription}>{restaurant.description}</Text>
          )}

          <View style={styles.preparationSection}>
            <Text style={styles.restaurantSectionTitle}>
              {restaurant.featuresTitle || 'Como preparamos seu prato'}
            </Text>
            <View style={styles.preparationFeatures}>
              {restaurant.features.map((feature, index) => (
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

  if (restaurant.searchCardImage) {
    return (
      <View
        style={[
          styles.restaurantSpriteResult,
          {
            height: 238 * scale,
            marginBottom: 60 * scale,
            width: screenWidth,
          },
        ]}
      >
        <Image
          accessibilityLabel={`Restaurante ${restaurant.name}, nota ${restaurant.rating}, entrega ${restaurant.deliveryTime}, taxa ${restaurant.deliveryFee || restaurant.minimumOrder}. Produtos: ${restaurantItems.map((item) => `${item.name}, ${item.price}`).join('; ')}`}
          resizeMode="stretch"
          source={restaurant.searchCardImage}
          style={StyleSheet.absoluteFillObject}
        />
        <Pressable
          accessibilityLabel={`Ver restaurante ${restaurant.name}`}
          accessibilityRole="button"
          onPress={() => onSelectRestaurant(restaurant.id)}
          style={[
            styles.restaurantSpriteHeaderButton,
            { height: 58 * scale, width: screenWidth * 0.84 },
          ]}
        />
        {restaurantItems.map((item, index) => (
          <Pressable
            accessibilityLabel={`Ver informações de ${item.name}`}
            accessibilityRole="button"
            key={item.id || item.name}
            onPress={() => onSelectFood(restaurant, item)}
            style={[
              styles.restaurantSpriteProductButton,
              {
                height: 20 * scale,
                left: (22 + index * 128) * scale,
                top: 218 * scale,
                width: 77 * scale,
              },
            ]}
          />
        ))}
      </View>
    );
  }

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
            <Pressable
              accessibilityRole="button"
              onPress={() => onSelectFood(restaurant, item)}
              style={styles.mealInfoButton}
            >
              <Text style={styles.mealInfoButtonText}>Ver informações</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function RestaurantSearchResults({ restaurants, onSelectRestaurant, onSelectFood, screenWidth }) {
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
        Opções encontradas
      </Text>
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

function ProductSearchResults({ items, screenWidth }) {
  const scale = screenWidth / 393;

  return (
    <ScrollView
      contentContainerStyle={[
        styles.productSearchResultsContent,
        {
          paddingBottom: 24 * scale,
          paddingHorizontal: 20 * scale,
          paddingTop: 14 * scale,
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
        Opções encontradas
      </Text>
      {items.length ? (
        items.map((item) => (
          <View
            key={item.id}
            style={[
              styles.productSearchRow,
              {
                minHeight: 72 * scale,
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
          </View>
        ))
      ) : (
        <Text style={[styles.productSearchEmpty, { fontSize: 13 * scale }]}>
          Nenhum produto encontrado.
        </Text>
      )}
    </ScrollView>
  );
}

export default function SearchScreen({ profileSelections = {}, onStatusBarBackgroundChange }) {
  const { width: screenWidth } = useWindowDimensions();
  const layoutWidth = Math.min(screenWidth, 430);
  const isCompactScreen = layoutWidth <= 430;
  const landingContentWidth = screenWidth * 568 / 608;
  const profilePromotionWidth = Math.min(landingContentWidth, 568);
  const profilePromotionCardWidth = Math.min(screenWidth * 255 / 608, 255);
  const profilePromotionHeight = profilePromotionCardWidth * 263 / 181;
  const profilePromotionImageWidth = profilePromotionHeight * 1173 / 263;
  const profilePromotionPageImageWidth = profilePromotionImageWidth * 387 / 1173;
  const bannerHeight = Math.min(screenWidth * 230 / 608, 230);
  const bannerBadgeSize = Math.min(screenWidth * 28 / 608, 28);
  const bannerTextFontSize = Math.min(screenWidth * 16 / 608, 16);
  const categoryRowWidth = Math.min(screenWidth * 568 / 608, 568);
  const categoryCircleSize = isCompactScreen
    ? Math.min(screenWidth * 0.17, 68)
    : Math.min(screenWidth * 92 / 608, 92);
  const categoryGap = isCompactScreen
    ? Math.max(12, (screenWidth - categoryCircleSize * 4 - 28) / 3)
    : screenWidth * 56 / 608;
  const categoryInset = isCompactScreen ? 14 : screenWidth * 14 / 608;
  const profileSectionMarginTop = Math.min(screenWidth * 52 / 608, 52);
  const profileSectionFontSize = Math.min(screenWidth * 30 / 608, 30);
  const categoryMarginTop = Math.min(screenWidth * 112 / 608, 112);
  const compactFilterWidths = {
    'Todo Oullin': 68,
    'Perfil alimentar': 88,
    'restaurantes verificados': 118,
    bebidas: 74,
    região: 68,
    'menor preço': 88,
  };
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedSearchFilter, setSelectedSearchFilter] = useState('Todo Oullin');
  const [recentSearches, setRecentSearches] = useState(INITIAL_RECENT_SEARCHES);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const [showRestaurantFilter, setShowRestaurantFilter] = useState(false);
  useEffect(() => {
    onStatusBarBackgroundChange?.(selectedProduct ? COLORS.white : COLORS.orange);
  }, [onStatusBarBackgroundChange, selectedProduct]);
  const profileRules = useMemo(() => getDietaryProfileRules(profileSelections), [profileSelections]);
  const compatibleMealItems = useMemo(
    () => filterMealsForProfile(MEAL_SEARCH_ITEMS, profileRules),
    [profileRules],
  );
  const visibleRecentSearches = recentSearches.filter((item) =>
    item.toLocaleLowerCase('pt-BR').includes(query.trim().toLocaleLowerCase('pt-BR')),
  );
  const showSearchFilters =
    searchOpen || query.trim().length > 0 || selectedSearchFilter !== 'Todo Oullin';
  const normalizedQuery = normalizeSearchTerm(query);
  const visibleSearchResults = useMemo(
    () => SEARCH_RESULT_PRODUCTS.filter((item) =>
      normalizeSearchTerm(`${item.name} ${item.restaurantName}`).includes(normalizedQuery),
    ),
    [normalizedQuery],
  );
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
    setShowRestaurantFilter(false);
    setSearchOpen(false);
    Keyboard.dismiss();
  }

  function openCategory(category) {
    setSelectedCategory(category);
    setQuery('');
    setShowRestaurantFilter(false);
    setSearchOpen(false);
    Keyboard.dismiss();
  }

  function selectSaudavelFood(item) {
    setSelectedProduct({
      ...item,
      features: item.features || saudavelLifeRestaurant.features,
      filters: item.filters || [],
      recommendations: compatibleMealItems.filter((meal) => meal.id !== item.id),
      restaurantName: saudavelLifeRestaurant.name,
    });
  }

  function selectRestaurantFood(restaurant, item) {
    const restaurantItems = restaurant.sections.flatMap((section) => section.items);
    setSelectedProduct({
      ...item,
      features: restaurant.features || [],
      filters: restaurant.filters || [],
      recommendations: restaurantItems.filter((recommendation) => recommendation !== item),
      restaurantName: restaurant.name,
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
        profileSelections={profileSelections}
        onSelectItem={(item) =>
          setSelectedProduct({
            ...item,
            features: selectedProduct.features,
            filters: selectedProduct.filters,
            recommendations: selectedProduct.recommendations,
            restaurantName: selectedProduct.restaurantName,
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
            paddingBottom: isCompactScreen ? 10 : screenWidth * 22 / 608,
            paddingHorizontal: isCompactScreen ? 16 : screenWidth * (showSearchFilters ? 12 : 14) / 608,
            paddingTop: isCompactScreen ? 48 : screenWidth * (showSearchFilters ? 85 : 97) / 608,
          },
        ]}
      >
        <View
          style={[
            styles.searchBox,
            {
              height: isCompactScreen ? 48 : screenWidth * (showSearchFilters ? 60 : 64) / 608,
              paddingHorizontal: isCompactScreen ? 18 : screenWidth * 26 / 608,
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
              if (value.trim()) setSelectedCategory('Todos');
              setShowRestaurantFilter(false);
            }}
            onFocus={() => {
              setSearchOpen(query.trim().length === 0);
              setShowRestaurantFilter(false);
            }}
            onSubmitEditing={() => submitSearch()}
            placeholder="Peça no oullin"
            placeholderTextColor={COLORS.muted}
            returnKeyType="search"
            style={[styles.searchInput, { fontSize: isCompactScreen ? 15 : Math.min(screenWidth * 16 / 608, 16) }]}
            value={query}
          />
          {!!query && (
            <Pressable
              accessibilityLabel="Limpar busca"
              onPress={() => {
                setQuery('');
                setSearchOpen(true);
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
                      height: isCompactScreen ? 30 : 22,
                      marginRight: isCompactScreen ? 8 : screenWidth * 8 / 393,
                      paddingHorizontal: isCompactScreen ? 12 : 0,
                      width: isCompactScreen
                        ? compactFilterWidths[filter]
                        : screenWidth * SEARCH_FILTER_WIDTHS[filter] / 393,
                    },
                    active && styles.searchFilterChipActive,
                  ]}
                >
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.searchFilterText,
                      isCompactScreen && styles.searchFilterTextCompact,
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
        <ProductSearchResults items={visibleSearchResults} screenWidth={screenWidth} />
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
        <ProductSearchResults items={visibleSearchResults} screenWidth={screenWidth} />
      ) : (
      <ScrollView
        key="search-landing"
        contentContainerStyle={[
          styles.homeLandingContent,
          {
            paddingHorizontal: screenWidth * 20 / 608,
            paddingTop: screenWidth * 42 / 608,
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
            { height: bannerHeight },
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
  restaurantSpriteResult: {
    position: 'relative',
  },
  restaurantSpriteHeaderButton: {
    left: 0,
    position: 'absolute',
    top: 0,
  },
  restaurantSpriteProductButton: {
    backgroundColor: 'transparent',
    position: 'absolute',
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
  restaurantCompatibilityIcon: {
    alignItems: 'center',
    backgroundColor: '#55D58A',
    borderRadius: 17,
    height: 34,
    justifyContent: 'center',
    marginRight: 14,
    width: 34,
  },
  restaurantCompatibilityCheck: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '700',
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
