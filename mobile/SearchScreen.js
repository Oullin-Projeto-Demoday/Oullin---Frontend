import React, { useEffect, useMemo, useState } from 'react';
import {
  Image,
  Keyboard,
  Pressable,
  ScrollView,
  StatusBar,
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
  { label: 'Todos', image: require('./assets/burger-photo.jpg') },
  { label: 'Hambúrguer', image: require('./assets/burger-photo.jpg') },
  { label: 'Pizza', image: require('./assets/pizza-photo.jpg') },
  { label: 'Marmitas', image: require('./assets/meal-banner-user.png') },
  { label: 'Saladas', image: require('./assets/salad-photo.jpg') },
  { label: 'Massas', image: require('./assets/pasta-photo.jpg') },
  { label: 'Sushi', image: require('./assets/sushi-photo.jpg') },
  { label: 'Doces', image: require('./assets/dessert-photo.jpg') },
  { label: 'Bebidas', image: require('./assets/drink-photo.jpg') },
];

const FOOD_CARDS = [
  {
    id: 'burger',
    name: 'Hambúrguer artesanal',
    category: 'Hambúrguer',
    image: require('./assets/burger-photo.jpg'),
    backgroundColor: '#B43724',
  },
  {
    id: 'pizza',
    name: 'Pizza artesanal',
    category: 'Pizza',
    image: require('./assets/pizza-photo.jpg'),
    backgroundColor: '#8D1737',
  },
  {
    id: 'salad',
    name: 'Salada fresca',
    category: 'Saladas',
    image: require('./assets/salad-photo.jpg'),
    backgroundColor: '#387C4B',
  },
  {
    id: 'pasta',
    name: 'Massa da casa',
    category: 'Massas',
    image: require('./assets/pasta-photo.jpg'),
    backgroundColor: '#B76520',
  },
  {
    id: 'dessert',
    name: 'Doces especiais',
    category: 'Doces',
    image: require('./assets/dessert-photo.jpg'),
    backgroundColor: '#A74569',
  },
  {
    id: 'drink',
    name: 'Bebidas geladas',
    category: 'Bebidas',
    image: require('./assets/drink-photo.jpg'),
    backgroundColor: '#357C91',
  },
  {
    id: 'sushi',
    name: 'Sushi variado',
    category: 'Sushi',
    image: require('./assets/sushi-photo.jpg'),
    backgroundColor: '#624332',
  },
  {
    id: 'meal',
    name: 'Marmitas da semana',
    category: 'Marmitas',
    image: require('./assets/meal-banner-user.png'),
    backgroundColor: '#537344',
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

const RECENT_STORES = [
  { name: 'Burger House', image: require('./assets/burger-photo.jpg') },
  { name: 'Pizza da Vila', image: require('./assets/pizza-photo.jpg') },
  { name: 'Sushi Oullin', image: require('./assets/sushi-photo.jpg') },
  { name: 'Marmitas da Ana', image: require('./assets/meal-banner-user.png') },
  { name: 'Salada Viva', image: require('./assets/salad-photo.jpg') },
  { name: 'Doce Cantinho', image: require('./assets/dessert-photo.jpg') },
  { name: 'Massa da Casa', image: require('./assets/pasta-photo.jpg') },
  { name: 'Bebidas Geladas', image: require('./assets/drink-photo.jpg') },
];
const INITIAL_RECENT_SEARCHES = ['Pizza', 'Pastel', 'torta', 'filé a parmegiana'];
const SEARCH_HISTORY_STORAGE_KEY = '@oullin/search-history';

export default function SearchScreen() {
  const { width: screenWidth } = useWindowDimensions();
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedSearchFilter, setSelectedSearchFilter] = useState('Todo Oullin');
  const [recentSearches, setRecentSearches] = useState(INITIAL_RECENT_SEARCHES);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedFood, setSelectedFood] = useState(null);
  const foodCardWidth = (screenWidth - 32) / 2;
  const visibleRecentSearches = recentSearches.filter((item) =>
    item.toLocaleLowerCase('pt-BR').includes(query.trim().toLocaleLowerCase('pt-BR')),
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
    Keyboard.dismiss();
  }

  const visibleFoods = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('pt-BR');
    return FOOD_CARDS.filter((food) => {
      const matchesCategory =
        selectedCategory === 'Todos' || food.category === selectedCategory;
      const matchesSearch =
        !normalizedQuery ||
        `${food.name} ${food.category}`.toLocaleLowerCase('pt-BR').includes(normalizedQuery);
      return matchesCategory && matchesSearch;
    });
  }, [query, selectedCategory]);

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.orange} />
      <View style={[styles.searchHeader, searchOpen && styles.searchHeaderExpanded]}>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            accessibilityLabel="Buscar alimentos"
            autoCapitalize="none"
            onChangeText={setQuery}
            onFocus={() => setSearchOpen(true)}
            onSubmitEditing={() => submitSearch()}
            placeholder="Peça na Oullin"
            placeholderTextColor={COLORS.muted}
            returnKeyType="search"
            style={styles.searchInput}
            value={query}
          />
          {!!query && (
            <Pressable
              accessibilityLabel="Limpar busca"
              onPress={() => setQuery('')}
              style={styles.clearButton}
            >
              <Text style={styles.clearText}>×</Text>
            </Pressable>
          )}
        </View>
        {searchOpen && (
          <ScrollView
            contentContainerStyle={styles.searchFilters}
            horizontal
            keyboardShouldPersistTaps="handled"
            showsHorizontalScrollIndicator={false}
          >
            {SEARCH_FILTERS.map((filter) => {
              const active = selectedSearchFilter === filter;
              return (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  key={filter}
                  onPress={() => setSelectedSearchFilter(filter)}
                  style={[styles.searchFilterChip, active && styles.searchFilterChipActive]}
                >
                  <Text style={[styles.searchFilterText, active && styles.searchFilterTextActive]}>
                    {filter}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        )}
      </View>

      {searchOpen ? (
        <ScrollView
          contentContainerStyle={styles.searchLandingContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
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
                  setSelectedSearchFilter('restaurantes');
                  setQuery(store.name);
                  Keyboard.dismiss();
                }}
                style={styles.recentStore}
              >
                <Image source={store.image} style={styles.recentStoreCircle} />
                <Text numberOfLines={1} style={styles.recentStoreLabel}>{store.name}</Text>
              </Pressable>
            ))}
          </ScrollView>

          <Pressable
            accessibilityRole="button"
            onPress={() => setSelectedSearchFilter('Perfil alimentar')}
          >
            <Text style={styles.searchSectionTitle}>Seu perfil alimentar</Text>
          </Pressable>

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
      ) : (
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            setSelectedCategory('Todos');
            setQuery('');
          }}
          style={({ pressed }) => [styles.banner, pressed && styles.pressed]}
        >
          <Image
            accessibilityLabel="Refeição fresca para sua rotina"
            resizeMode="cover"
            source={require('./assets/meal-banner-user.png')}
            style={styles.bannerImage}
          />
          <View style={styles.bannerShade} />
          <View style={styles.bannerCopy}>
            <View style={styles.bannerBadge}>
              <Image source={require('./assets/koala-icon.png')} style={styles.bannerKoala} />
            </View>
            <Text style={styles.bannerText}>Marmitas para sua rotina</Text>
          </View>
        </Pressable>

        <Text style={styles.sectionTitle}>Seu perfil alimentar</Text>
        <View style={styles.foodHeading}>
          <Text style={styles.foodSectionTitle}>O que você está com vontade?</Text>
          {!!selectedFood && (
            <Pressable onPress={() => setSelectedFood(null)}>
              <Text style={styles.clearSelection}>Limpar</Text>
            </Pressable>
          )}
        </View>
        {visibleFoods.length ? (
          <ScrollView
            contentContainerStyle={styles.foodGrid}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {visibleFoods.map((food) => {
              const active = selectedFood === food.id;
              return (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  key={food.id}
                  onPress={() => setSelectedFood(active ? null : food.id)}
                  style={({ pressed }) => [
                    styles.foodCard,
                    { width: foodCardWidth },
                    { backgroundColor: food.backgroundColor },
                    active && styles.foodCardActive,
                    pressed && styles.pressed,
                  ]}
                >
                  <Image
                    accessibilityLabel={food.name}
                    resizeMode="cover"
                    source={food.image}
                    style={styles.foodImage}
                  />
                  <View style={styles.foodImageShade} />
                  <View style={styles.foodCardFooter}>
                    <Text numberOfLines={2} style={styles.foodName}>{food.name}</Text>
                    <View style={[styles.foodSelectMark, active && styles.foodSelectMarkActive]}>
                      {active && <Text style={styles.foodCheck}>✓</Text>}
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Nenhum alimento encontrado</Text>
            <Text style={styles.emptyText}>Tente outro nome ou escolha outra categoria.</Text>
          </View>
        )}
        <Text style={styles.categoryHeading}>Explore por categoria</Text>
        <ScrollView
          contentContainerStyle={styles.categoryList}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {FOOD_CATEGORIES.map((category) => {
            const active = selectedCategory === category.label;
            return (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                key={category.label}
                onPress={() => setSelectedCategory(category.label)}
                style={styles.categoryItem}
              >
                <View style={[styles.categoryCircle, active && styles.categoryCircleActive]}>
                  <Image
                    accessibilityLabel={category.label}
                    source={category.image}
                    style={styles.categoryImage}
                  />
                </View>
                <Text
                  numberOfLines={1}
                  style={[styles.categoryLabel, active && styles.categoryLabelActive]}
                >
                  {category.label}
                </Text>
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
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    paddingBottom: 10,
    paddingHorizontal: 14,
    paddingTop: 4,
  },
  searchHeaderExpanded: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingBottom: 9,
    paddingTop: 12,
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
    borderRadius: 20,
    flexDirection: 'row',
    height: 38,
    paddingHorizontal: 11,
  },
  searchIcon: {
    color: COLORS.orange,
    fontSize: 23,
    lineHeight: 27,
    marginRight: 7,
  },
  searchInput: {
    color: COLORS.text,
    flex: 1,
    fontSize: 12,
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
    paddingTop: 11,
    paddingRight: 8,
  },
  searchFilterChip: {
    alignItems: 'center',
    backgroundColor: '#FFC477',
    borderRadius: 16,
    height: 25,
    justifyContent: 'center',
    marginRight: 7,
    paddingHorizontal: 12,
  },
  searchFilterChipActive: {
    backgroundColor: COLORS.white,
  },
  searchFilterText: {
    color: COLORS.text,
    fontSize: 9,
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
    paddingBottom: 20,
    paddingHorizontal: 10,
    paddingTop: 12,
  },
  searchSectionTitle: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 9,
  },
  recentStores: {
    paddingRight: 8,
  },
  recentStoresScroller: {
    flexGrow: 0,
    flexShrink: 0,
    height: 54,
  },
  recentStore: {
    alignItems: 'center',
    marginRight: 13,
    width: 48,
  },
  recentStoreCircle: {
    backgroundColor: '#D9D9D9',
    borderRadius: 18,
    height: 36,
    resizeMode: 'cover',
    width: 36,
  },
  recentStoreLabel: {
    color: COLORS.text,
    fontSize: 7,
    marginTop: 5,
    textAlign: 'center',
    width: 48,
  },
  recentSearchHeading: {
    marginBottom: 8,
    marginTop: 9,
  },
  recentSearchRow: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 22,
  },
  recentSearchIcon: {
    color: COLORS.text,
    fontSize: 17,
    lineHeight: 20,
    marginRight: 6,
  },
  recentSearchText: {
    color: COLORS.text,
    fontSize: 10,
  },
  noRecentSearches: {
    color: COLORS.muted,
    fontSize: 11,
  },
  content: {
    paddingBottom: 18,
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  banner: {
    borderRadius: 12,
    height: 126,
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
    left: 10,
    position: 'absolute',
    top: 10,
  },
  bannerBadge: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    height: 25,
    justifyContent: 'center',
    marginRight: 6,
    width: 25,
  },
  bannerKoala: {
    height: 23,
    width: 23,
  },
  bannerText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowRadius: 4,
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
    paddingBottom: 8,
    paddingRight: 8,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 13,
    width: 64,
  },
  categoryCircle: {
    backgroundColor: '#E5E5E5',
    borderColor: 'transparent',
    borderRadius: 28,
    borderWidth: 2,
    height: 56,
    overflow: 'hidden',
    width: 56,
  },
  categoryCircleActive: {
    backgroundColor: '#FFF2DF',
    borderColor: COLORS.orange,
  },
  categoryImage: {
    height: '100%',
    width: '100%',
  },
  categoryLabel: {
    color: COLORS.muted,
    fontSize: 9,
    marginTop: 5,
    textAlign: 'center',
  },
  categoryLabelActive: {
    color: COLORS.text,
    fontWeight: '700',
  },
  foodHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  clearSelection: {
    color: COLORS.blue,
    fontSize: 11,
    marginTop: 6,
  },
  foodGrid: {
    flexDirection: 'row',
    paddingRight: 12,
  },
  foodCard: {
    borderColor: COLORS.white,
    borderRadius: 10,
    borderWidth: 2,
    height: 214,
    marginBottom: 10,
    marginRight: 8,
    overflow: 'hidden',
    position: 'relative',
    width: '49%',
  },
  foodCardActive: {
    borderColor: COLORS.amber,
  },
  foodImage: {
    height: '100%',
    position: 'absolute',
    width: '100%',
  },
  foodImageShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  foodCardFooter: {
    alignItems: 'center',
    borderTopColor: 'rgba(255,255,255,0.45)',
    borderTopWidth: 1,
    borderStyle: 'dashed',
    backgroundColor: 'rgba(35, 18, 18, 0.55)',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: 0,
    minHeight: 34,
    paddingHorizontal: 7,
    position: 'absolute',
    right: 0,
  },
  foodName: {
    color: COLORS.white,
    flex: 1,
    fontSize: 10,
    fontWeight: '600',
    marginRight: 4,
  },
  foodSelectMark: {
    alignItems: 'center',
    borderColor: COLORS.white,
    borderRadius: 9,
    borderWidth: 1,
    height: 17,
    justifyContent: 'center',
    width: 17,
  },
  foodSelectMarkActive: {
    backgroundColor: COLORS.amber,
    borderColor: COLORS.amber,
  },
  foodCheck: {
    color: COLORS.white,
    fontSize: 11,
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
