import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import MapView from './AddressMap';

const COLORS = {
  amber: '#FFB400',
  blue: '#124F8C',
  text: '#101010',
  muted: '#777777',
  border: '#D5D5D5',
  white: '#FFFFFF',
  background: '#F3F3F5',
  orange: '#F07800',
};

const ADDRESSES_KEY = '@oullin/delivery-addresses';
const SELECTED_ADDRESS_KEY = '@oullin/selected-delivery-address';
const DEFAULT_MAP_REGION = {
  latitude: -23.5505,
  longitude: -46.6333,
  latitudeDelta: 0.008,
  longitudeDelta: 0.008,
};

const EXAMPLE_ADDRESS_IDS = new Set(['address-1', 'address-2', 'address-3', 'address-4']);

const EMPTY_FORM = {
  street: '',
  number: '',
  neighborhood: '',
  city: '',
  state: '',
  complement: '',
  placeType: 'Casa',
  reference: '',
};

const BRAZIL_STATE_CODES = {
  acre: 'AC', alagoas: 'AL', amapa: 'AP', amazonas: 'AM', bahia: 'BA',
  ceara: 'CE', 'distrito federal': 'DF', 'espirito santo': 'ES', goias: 'GO',
  maranhao: 'MA', 'mato grosso': 'MT', 'mato grosso do sul': 'MS',
  'minas gerais': 'MG', para: 'PA', paraiba: 'PB', parana: 'PR',
  pernambuco: 'PE', piaui: 'PI', 'rio de janeiro': 'RJ', 'rio grande do norte': 'RN',
  'rio grande do sul': 'RS', rondonia: 'RO', roraima: 'RR', 'santa catarina': 'SC',
  'sao paulo': 'SP', sergipe: 'SE', tocantins: 'TO',
};

function normalizeText(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getAddressTitle(address) {
  return [address.street, address.number].filter(Boolean).join(', ');
}

function getHouseNumberFromQuery(query) {
  const commaNumber = query.trim().match(/,\s*(\d+[a-z]?(?:[-/]\d+[a-z]?)?)(?=\s*(?:,|$))/i);
  if (commaNumber) return commaNumber[1];
  const trailingNumber = query.trim().match(/\s+(\d+[a-z]?(?:[-/]\d+[a-z]?)?)\s*$/i);
  return trailingNumber?.[1] || '';
}

const NOMINATIM_CACHE = new Map();
let lastNominatimRequestAt = 0;
let nominatimRequestQueue = Promise.resolve();

async function waitForNominatimSlot() {
  const requestSlot = nominatimRequestQueue.then(async () => {
    const wait = Math.max(0, 1100 - (Date.now() - lastNominatimRequestAt));
    if (wait) await new Promise((resolve) => setTimeout(resolve, wait));
    lastNominatimRequestAt = Date.now();
  });
  nominatimRequestQueue = requestSlot.catch(() => {});
  await requestSlot;
}

function mapNominatimAddress(result, fallbackQuery = '') {
  const address = result.address || {};
  const stateName = address.state || '';
  const street = address.road || address.street || address.pedestrian || address.path ||
    address.residential || address.footway || address.cycleway || '';
  const placeName = street && result.name && normalizeText(result.name) !== normalizeText(street)
    ? result.name
    : '';
  return {
    id: `nominatim-${result.osm_type || 'place'}-${result.osm_id || result.place_id}`,
    placeName,
    street: street || result.name || fallbackQuery,
    number: address.house_number || '',
    neighborhood: address.suburb || address.neighbourhood || address.quarter || address.city_district || '',
    city: address.city || address.town || address.village || address.municipality || address.county || '',
    state: BRAZIL_STATE_CODES[normalizeText(stateName)] || stateName,
    postalCode: address.postcode || '',
    reference: '',
    coordinates: {
      latitude: Number(result.lat),
      longitude: Number(result.lon),
    },
  };
}

function deduplicateAddresses(addresses) {
  const unique = [];
  const addressKeys = new Set();
  const resultIds = new Set();

  addresses.forEach((address) => {
    if (resultIds.has(address.id)) return;
    resultIds.add(address.id);

    const key = [
      address.placeName,
      address.street,
      address.number,
      address.neighborhood,
      address.city,
      address.state,
    ].map((part) => normalizeText(part || '')).join('|');
    if (addressKeys.has(key)) return;

    const nearbyDuplicate = unique.some((existing) => {
      if (
        normalizeText(existing.placeName || '') !== normalizeText(address.placeName || '') ||
        normalizeText(existing.street || '') !== normalizeText(address.street || '') ||
        normalizeText(existing.number || '') !== normalizeText(address.number || '')
      ) return false;

      const latitudeDelta = (existing.coordinates.latitude - address.coordinates.latitude) * 111320;
      const longitudeScale = Math.cos((address.coordinates.latitude * Math.PI) / 180);
      const longitudeDelta =
        (existing.coordinates.longitude - address.coordinates.longitude) * 111320 * longitudeScale;
      return Math.hypot(latitudeDelta, longitudeDelta) < 30;
    });
    if (nearbyDuplicate) return;

    addressKeys.add(key);
    unique.push(address);
  });

  return unique;
}

async function searchNominatimAddresses(query) {
  const cacheKey = query.trim().toLocaleLowerCase('pt-BR');
  if (NOMINATIM_CACHE.has(cacheKey)) return NOMINATIM_CACHE.get(cacheKey);
  await waitForNominatimSlot();
  const params = new URLSearchParams({
    q: query,
    format: 'jsonv2',
    addressdetails: '1',
    limit: '40',
    countrycodes: 'br',
  });
  const response = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
    headers: {
      Accept: 'application/json',
      'Accept-Language': 'pt-BR,pt;q=0.9',
      'User-Agent': 'OullinMobile/1.0 (delivery address search)',
    },
  });
  if (!response.ok) throw new Error(`A busca falhou (${response.status}).`);
  const results = await response.json();
  const queryNumber = getHouseNumberFromQuery(query);
  const suggestions = results
    .filter((result) => result.address?.country_code === 'br')
    .map((result) => {
      const address = mapNominatimAddress(result, query);
      const requestedNumberMatches = Boolean(
        queryNumber && address.number &&
        normalizeText(address.number) === normalizeText(queryNumber),
      );
      return {
        ...address,
        numberNeedsConfirmation: Boolean(queryNumber && !requestedNumberMatches),
        requestedNumber: requestedNumberMatches ? '' : queryNumber,
        requestedNumberMatches,
      };
    })
    .filter((result) =>
      Number.isFinite(result.coordinates.latitude) &&
      Number.isFinite(result.coordinates.longitude) &&
      (!queryNumber || !result.number || result.requestedNumberMatches),
    )
    .sort((first, second) => Number(second.requestedNumberMatches) - Number(first.requestedNumberMatches));
  const uniqueSuggestions = deduplicateAddresses(suggestions);
  NOMINATIM_CACHE.set(cacheKey, uniqueSuggestions);
  return uniqueSuggestions;
}

async function reverseNominatimAddress(coordinates) {
  await waitForNominatimSlot();
  const params = new URLSearchParams({
    lat: String(coordinates.latitude),
    lon: String(coordinates.longitude),
    format: 'jsonv2',
    addressdetails: '1',
    zoom: '18',
  });
  const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${params.toString()}`, {
    headers: {
      Accept: 'application/json',
      'Accept-Language': 'pt-BR,pt;q=0.9',
      'User-Agent': 'OullinMobile/1.0 (delivery address search)',
    },
  });
  if (!response.ok) throw new Error(`A confirmação do endereço falhou (${response.status}).`);
  const result = await response.json();
  return result.address ? mapNominatimAddress(result) : null;
}

function AddressFormField({ label, value, onChangeText, ...props }) {
  return (
    <View style={styles.formField}>
      <Text style={styles.formLabel}>{label}</Text>
      <TextInput
        onChangeText={onChangeText}
        placeholder={label}
        placeholderTextColor={COLORS.muted}
        style={styles.formInput}
        value={value}
        {...props}
      />
    </View>
  );
}

function AddressEditor({ address, onCancel, onSave }) {
  const [form, setForm] = useState(() => ({ ...EMPTY_FORM, ...address }));

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.modalScrim}
    >
      <Pressable onPress={onCancel} style={StyleSheet.absoluteFill} />
      <View style={styles.editor}>
        <Text style={styles.editorTitle}>
          {address ? 'Complementos da entrega' : 'Adicionar endereço de entrega'}
        </Text>
        <Text style={styles.editorDescription}>
          Confira o endereço e adicione detalhes para ajudar na entrega.
        </Text>
        <ScrollView keyboardShouldPersistTaps="handled">
          <AddressFormField
            autoCapitalize="words"
            label="Endereço"
            onChangeText={(value) => updateField('street', value)}
            value={form.street || ''}
          />
          <AddressFormField
            label="Número"
            onChangeText={(value) => updateField('number', value)}
            value={form.number || ''}
          />
          <AddressFormField
            autoCapitalize="words"
            label="Bairro"
            onChangeText={(value) => updateField('neighborhood', value)}
            value={form.neighborhood || ''}
          />
          <AddressFormField
            autoCapitalize="words"
            label="Cidade"
            onChangeText={(value) => updateField('city', value)}
            value={form.city || ''}
          />
          <AddressFormField
            autoCapitalize="characters"
            label="Estado"
            maxLength={2}
            onChangeText={(value) => updateField('state', value)}
            value={form.state || ''}
          />
          <Text style={styles.formLabel}>Tipo de local</Text>
          <View style={styles.placeTypeRow}>
            {['Casa', 'Apartamento', 'Trabalho', 'Outro'].map((placeType) => {
              const active = form.placeType === placeType;
              return (
                <Pressable
                  accessibilityRole="radio"
                  accessibilityState={{ checked: active }}
                  key={placeType}
                  onPress={() => updateField('placeType', placeType)}
                  style={[styles.placeTypeOption, active && styles.placeTypeOptionSelected]}
                >
                  <Text style={[styles.placeTypeText, active && styles.placeTypeTextSelected]}>
                    {placeType}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <AddressFormField
            autoCapitalize="words"
            label="Complemento (apto, bloco, casa)"
            onChangeText={(value) => updateField('complement', value)}
            value={form.complement || ''}
          />
          <AddressFormField
            autoCapitalize="sentences"
            label="Ponto de referência (opcional)"
            onChangeText={(value) => updateField('reference', value)}
            value={form.reference || ''}
          />
        </ScrollView>
        <View style={styles.editorActions}>
          <Pressable onPress={onCancel} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </Pressable>
          <Pressable onPress={() => onSave(form)} style={styles.saveButton}>
            <Text style={styles.saveText}>Salvar endereço</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

function AddressConfirmation({
  address,
  confirming,
  onAddressChange,
  onBack,
  onConfirm,
}) {
  const [region, setRegion] = useState(() => ({
    ...DEFAULT_MAP_REGION,
    ...address.coordinates,
  }));
  const details = [
    address.neighborhood,
    [address.city, address.state].filter(Boolean).join('/'),
  ].filter(Boolean);

  function updateMapRegion(nextRegion) {
    setRegion(nextRegion);
    onAddressChange({
      ...address,
      coordinates: {
        latitude: nextRegion.latitude,
        longitude: nextRegion.longitude,
      },
    });
  }

  return (
    <View style={styles.confirmationScreen}>
      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Voltar para os endereços"
          accessibilityRole="button"
          hitSlop={10}
          onPress={onBack}
          style={styles.backButton}
        >
          <Text style={styles.backArrow}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>ENDEREÇO DE ENTREGA</Text>
        <View style={styles.headerSpacer} />
      </View>
      <View style={styles.mapPreview}>
        <MapView
          accessibilityLabel="Mapa interativo: mova o mapa para ajustar a localização"
          initialRegion={region}
          loadingEnabled
          moveOnMarkerPress={false}
          onRegionChangeComplete={updateMapRegion}
          showsCompass
          style={StyleSheet.absoluteFill}
        />
        <View pointerEvents="none" style={styles.mapCenterMarker}>
          <View style={styles.mapMarker}>
            <View style={styles.mapMarkerDot} />
          </View>
        </View>
      </View>
      <View style={styles.confirmationFooter}>
        <Pressable
          accessibilityRole="button"
          disabled={confirming}
          onPress={onConfirm}
          style={({ pressed }) => [styles.confirmAddressButton, pressed && styles.cardPressed]}
        >
          <Text style={styles.confirmAddressText}>
            {confirming ? 'Confirmando endereço...' : 'Confirmar endereço de entrega'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function AddressDetailsScreen({ address, onBack, onSave, onAdjustMap }) {
  const [form, setForm] = useState(() => ({ ...EMPTY_FORM, ...address }));
  const [noComplement, setNoComplement] = useState(false);
  const placeTypes = [
    { label: 'Casa', icon: '⌂' },
    { label: 'Curso', icon: '▤' },
    { label: 'Trabalho', icon: '▣' },
  ];

  return (
    <View style={styles.confirmationScreen}>
      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Voltar para o mapa"
          accessibilityRole="button"
          onPress={onBack}
          style={styles.backButton}
        >
          <Text style={styles.backArrow}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>ENDEREÇO DE ENTREGA</Text>
        <View style={styles.headerSpacer} />
      </View>
      <View style={styles.detailsMap}>
        <MapView
          initialRegion={{ ...DEFAULT_MAP_REGION, ...address.coordinates }}
          loadingEnabled
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.detailsMarker}>
          <View pointerEvents="none" style={styles.detailsMarkerPin}>
            <View style={styles.mapMarkerDot} />
          </View>
          <Pressable onPress={onAdjustMap} style={styles.adjustPointerButton}>
            <Text style={styles.adjustPointerText}>Ajustar o ponteiro</Text>
          </Pressable>
        </View>
      </View>
      <ScrollView
        contentContainerStyle={styles.detailsContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.confirmationAddress}>{getAddressTitle(form)}</Text>
        <Text style={styles.confirmationSubtitle}>
          {[form.neighborhood, form.city, form.state].filter(Boolean).join(', ')}
        </Text>
        {!!form.postalCode && <Text style={styles.confirmationSubtitle}>CEP {form.postalCode}</Text>}
        {!form.number && (
          <TextInput
            keyboardType="number-pad"
            onChangeText={(number) => setForm((value) => ({ ...value, number }))}
            placeholder="Número"
            style={styles.detailsInput}
            value={form.number || ''}
          />
        )}
        <TextInput
          editable={!noComplement}
          onChangeText={(complement) => setForm((value) => ({ ...value, complement }))}
          placeholder="Complemento"
          style={[styles.detailsInput, !form.number && styles.detailsInputFollowingNumber]}
          value={noComplement ? '' : form.complement || ''}
        />
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: noComplement }}
          onPress={() => setNoComplement((value) => !value)}
          style={styles.detailsCheckRow}
        >
          <View style={[styles.detailsCheckbox, noComplement && styles.detailsCheckboxChecked]}>
            {noComplement && <Text style={styles.detailsCheckboxMark}>✓</Text>}
          </View>
          <Text style={styles.detailsCheckLabel}>Sem complemento</Text>
        </Pressable>
        <Text style={styles.detailsFavorite}>Favoritar endereço</Text>
        <View style={styles.favoriteRow}>
          {placeTypes.map(({ label, icon }) => (
            <Pressable
              accessibilityRole="radio"
              accessibilityState={{ selected: form.placeType === label }}
              key={label}
              onPress={() => setForm((value) => ({ ...value, placeType: label }))}
              style={[styles.favoriteChip, form.placeType === label && styles.favoriteChipActive]}
            >
              <Text style={styles.favoriteChipIcon}>{icon}</Text>
              <Text style={styles.favoriteChipText}>{label}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
      <View style={styles.detailsFooter}>
        <Pressable
          onPress={() => onSave({ ...form, complement: noComplement ? '' : form.complement })}
          style={styles.detailsSave}
        >
          <Text style={styles.confirmAddressText}>Salvar endereço</Text>
        </Pressable>
      </View>
    </View>
  );
}

function AddressSearchMap({
  error,
  loading,
  onBack,
  onChangeQuery,
  onSelect,
  query,
  suggestions,
}) {
  const mapRef = useRef(null);
  const [region, setRegion] = useState(DEFAULT_MAP_REGION);

  useEffect(() => {
    const first = suggestions[0];
    if (!first) return;
    const nextRegion = {
      ...DEFAULT_MAP_REGION,
      latitude: first.coordinates.latitude,
      longitude: first.coordinates.longitude,
    };
    setRegion(nextRegion);
    mapRef.current?.animateToRegion(nextRegion, 350);
  }, [suggestions]);

  return (
    <View style={styles.searchMapScreen}>
      <View style={styles.searchMapHeader}>
        <Pressable
          accessibilityLabel="Voltar para a lista de endereços"
          accessibilityRole="button"
          hitSlop={10}
          onPress={onBack}
          style={styles.backButton}
        >
          <Text style={styles.backArrow}>‹</Text>
        </Pressable>
        <View style={styles.mapSearchBox}>
          <TextInput
            accessibilityLabel="Buscar endereço no mapa"
            autoFocus
            autoCapitalize="words"
            onChangeText={onChangeQuery}
            placeholder="Pesquise endereço ou lugar"
            placeholderTextColor={COLORS.muted}
            returnKeyType="search"
            style={styles.mapSearchInput}
            value={query}
          />
          {!!query && (
            <Pressable
              accessibilityLabel="Limpar busca"
              onPress={() => onChangeQuery('')}
              style={styles.mapSearchClear}
            >
              <Text style={styles.mapSearchClearText}>×</Text>
            </Pressable>
          )}
        </View>
      </View>
      <View style={styles.searchMap}>
        <MapView
          ref={mapRef}
          accessibilityLabel="Mapa de resultados da pesquisa"
          initialRegion={region}
          loadingEnabled
          onRegionChangeComplete={setRegion}
          showsCompass
          style={StyleSheet.absoluteFill}
        >
          {suggestions.map((suggestion) => (
            <MapView.Marker
              coordinate={suggestion.coordinates}
              key={suggestion.id}
              onPress={() => onSelect(suggestion)}
              pinColor={COLORS.orange}
              title={getAddressTitle(suggestion)}
              description={suggestion.neighborhood || suggestion.city}
            />
          ))}
        </MapView>
      </View>
      <View style={styles.suggestionPanel}>
        <Text style={styles.suggestionHeading}>
          {loading
            ? 'Buscando endereços...'
            : suggestions.length
              ? 'Resultados próximos'
              : query.trim().replace(/\s/g, '').length < 3
                ? 'Digite ao menos 3 caracteres para buscar'
                : 'Endereços encontrados'}
        </Text>
        {error ? <Text style={styles.searchMapMessage}>{error}</Text> : null}
        {!loading && !suggestions.length && query.trim().length >= 3 ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => onSelect({
              id: `map-point-${Date.now()}`,
              street: query,
              number: '',
              neighborhood: '',
              city: '',
              state: '',
              reference: '',
              coordinates: { latitude: region.latitude, longitude: region.longitude },
            })}
            style={styles.manualMapButton}
          >
            <Text style={styles.manualMapButtonText}>Marcar este ponto no mapa</Text>
          </Pressable>
        ) : null}
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          style={styles.suggestionList}
        >
          {suggestions.map((suggestion) => (
            <Pressable
              accessibilityRole="button"
              key={suggestion.id}
              onPress={() => onSelect(suggestion)}
              style={styles.suggestionRow}
            >
              <View style={styles.suggestionPin}>
                <View style={styles.suggestionPinCenter} />
              </View>
              <View style={styles.suggestionDetails}>
                <Text numberOfLines={1} style={styles.suggestionTitle}>
                  {getAddressTitle(suggestion)}
                </Text>
                <Text numberOfLines={1} style={styles.suggestionSubtitle}>
                  {[suggestion.neighborhood, suggestion.city, suggestion.state]
                    .filter(Boolean)
                    .join(', ')}
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

function LocationPinIcon({ size = 16, style }) {
  return (
    <Image
      resizeMode="contain"
      source={require('./assets/location-on.png')}
      style={[{ height: size, width: size }, style]}
    />
  );
}

function AddressSearchIcon() {
  return (
    <View style={styles.addressSearchGlyph}>
      <View style={styles.addressSearchLens} />
      <View style={styles.addressSearchHandle} />
    </View>
  );
}

function AddressCard({ address, selected, onSelect, onOpenMenu, onRemove, showActions = true }) {
  const details = [
    address.placeName ? getAddressTitle(address) : '',
    address.numberNeedsConfirmation
      ? `Número ${address.requestedNumber} não localizado; confira no mapa`
      : '',
    address.neighborhood,
    [address.city, address.state].filter(Boolean).join('/'),
  ].filter(Boolean);

  function openActions() {
    Alert.alert(getAddressTitle(address), 'O que deseja fazer com este endereÃ§o?', [
      { text: 'Editar', onPress: onOpenMenu },
      { text: 'Remover', onPress: onRemove, style: 'destructive' },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  }

  return (
    <View style={styles.addressCard}>
      <Pressable
        accessibilityRole="radio"
        accessibilityState={{ checked: selected }}
        onPress={onSelect}
        style={({ pressed }) => [styles.addressCardContent, pressed && styles.cardPressed]}
      >
        <LocationPinIcon size={22} style={styles.addressPinPlacement} />
        <View style={styles.addressDetails}>
          <Text numberOfLines={1} style={styles.addressTitle}>
            {address.placeName || getAddressTitle(address)}
          </Text>
          {details.map((detail) => (
            <Text key={detail} numberOfLines={1} style={styles.addressSubtitle}>
              {detail}
            </Text>
          ))}
          {!!address.complement && (
            <Text numberOfLines={1} style={styles.addressSubtitle}>
              {address.complement}
            </Text>
          )}
          {!!address.reference && (
            <Text numberOfLines={1} style={styles.addressSubtitle}>
              {address.reference}
            </Text>
          )}
        </View>
        <View style={[styles.radio, selected && styles.radioSelected]}>
          {selected && <View style={styles.radioDot} />}
        </View>
      </Pressable>
      {showActions && (
        <Pressable
          accessibilityLabel={`Mais opÃ§Ãµes para ${getAddressTitle(address)}`}
          accessibilityRole="button"
          onPress={openActions}
          style={styles.addressActionButton}
        >
          <View style={styles.addressMoreIcon}>
            <View style={styles.addressMoreDot} />
            <View style={styles.addressMoreDot} />
            <View style={styles.addressMoreDot} />
          </View>
        </Pressable>
      )}
    </View>
  );
}

export default function AddressScreen({
  completeLabel = 'Concluir cadastro',
  onBack,
  onComplete,
}) {
  const searchInput = useRef(null);
  const searchRequestId = useRef(0);
  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState('');
  const [showStreetSuggestions, setShowStreetSuggestions] = useState(false);
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [editorVisible, setEditorVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [storageReady, setStorageReady] = useState(false);
  const [pendingAddress, setPendingAddress] = useState(null);
  const [detailsAddress, setDetailsAddress] = useState(null);
  const [confirmingAddress, setConfirmingAddress] = useState(false);
  async function runAddressSearch() {
    const query = search.trim();
    const requestId = ++searchRequestId.current;
    setShowStreetSuggestions(true);
    setSearchSubmitted(true);
    setSearchSuggestions([]);
    setSearchError('');
    if (normalizeText(query).length < 3) {
      setSearchLoading(false);
      setSearchError('Digite ao menos 3 caracteres para buscar ruas.');
      return;
    }

    setSearchLoading(true);
    try {
      const suggestions = await searchNominatimAddresses(query);
      if (requestId !== searchRequestId.current) return;
      setSearchSuggestions(suggestions);
      if (!suggestions.length) setSearchError('Nenhum endereço encontrado. Tente incluir a cidade e o estado.');
    } catch (error) {
      if (requestId !== searchRequestId.current) return;
      setSearchSuggestions([]);
      setSearchError(
        error?.message?.includes('(429)')
          ? 'A busca está temporariamente ocupada. Aguarde um instante e tente novamente.'
          : 'Não foi possível conectar à busca de endereços. Verifique a conexão e tente novamente.',
      );
    } finally {
      if (requestId === searchRequestId.current) setSearchLoading(false);
    }
  }

  useEffect(() => {
    let active = true;

    async function loadAddresses() {
      try {
        const savedValues = await AsyncStorage.multiGet([
          ADDRESSES_KEY,
          SELECTED_ADDRESS_KEY,
        ]);
        const storedAddresses = savedValues[0][1]
          ? JSON.parse(savedValues[0][1])
          : null;
        const savedSelectedId = savedValues[1][1];
        if (
          storedAddresses !== null &&
          (!Array.isArray(storedAddresses) ||
            storedAddresses.some(
              (address) =>
                !address ||
                typeof address.id !== 'string' ||
                typeof address.street !== 'string' ||
                typeof address.city !== 'string',
            ))
        ) {
          throw new Error('Os endereços salvos estão em um formato inválido.');
        }
        if (!active) return;
        const savedAddresses = storedAddresses?.filter(
          (address) => !EXAMPLE_ADDRESS_IDS.has(address.id),
        ) ?? null;
        if (savedAddresses !== null) {
          setAddresses(savedAddresses);
          const selectionExists = savedAddresses.some(
            (address) => address.id === savedSelectedId,
          );
          setSelectedId(
            selectionExists ? savedSelectedId : savedAddresses[0]?.id || null,
          );
        }
      } catch {
        if (active) {
          Alert.alert(
            'Não foi possível carregar os endereços',
            'Você ainda pode adicionar e salvar um novo endereço.',
          );
        }
      } finally {
        if (active) setStorageReady(true);
      }
    }

    loadAddresses();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    AsyncStorage.multiSet([
      [ADDRESSES_KEY, JSON.stringify(addresses)],
      [SELECTED_ADDRESS_KEY, selectedId || ''],
    ]).catch(() => {
      Alert.alert(
        'Não foi possível salvar',
        'A alteração ficou temporariamente nesta tela. Verifique o armazenamento do aparelho.',
      );
    });
  }, [addresses, selectedId, storageReady]);

  const filteredAddresses = useMemo(() => {
    const query = normalizeText(search);
    if (!query) return addresses;
    return addresses.filter((address) =>
      normalizeText(
        [
          address.street,
          address.number,
          address.neighborhood,
          address.city,
          address.state,
          address.complement,
          address.reference,
        ]
          .filter(Boolean)
          .join(' '),
      ).includes(query),
    );
  }, [addresses, search]);
  const selectedAddress = addresses.find((address) => address.id === selectedId);

  function openEditor(address = null) {
    setEditingAddress(address);
    setEditorVisible(true);
  }

  function saveAddress(form) {
    const addressFields = { ...form };
    delete addressFields.numberNeedsConfirmation;
    delete addressFields.requestedNumber;
    delete addressFields.requestedNumberMatches;
    const savedAddress = {
      ...addressFields,
      street: (form.street || '').trim(),
      number: (form.number || '').trim(),
      neighborhood: (form.neighborhood || '').trim(),
      city: (form.city || '').trim(),
      state: (form.state || '').trim().toLocaleUpperCase('pt-BR'),
      complement: (form.complement || '').trim(),
      placeType: form.placeType || 'Casa',
      reference: (form.reference || '').trim(),
      id: editingAddress?.id || `address-${Date.now()}`,
    };

    if (!savedAddress.street || !savedAddress.city) {
      Alert.alert('Confira os dados', 'Preencha pelo menos o endereço e a cidade.');
      return;
    }

    const isNewAddress = !addresses.some((item) => item.id === savedAddress.id);
    setAddresses((current) => {
      const alreadyExists = current.some((item) => item.id === savedAddress.id);
      return alreadyExists
        ? current.map((item) => (item.id === savedAddress.id ? savedAddress : item))
        : [savedAddress, ...current];
    });
    setSelectedId(savedAddress.id);
    setEditorVisible(false);
    setPendingAddress(null);
    setSearch('');
    if (isNewAddress) {
      Alert.alert('Endereço adicionado', 'O novo endereço foi salvo na sua lista.');
    }
  }

  async function confirmAddressOnMap() {
    setConfirmingAddress(true);
    try {
      const place = await reverseNominatimAddress(pendingAddress.coordinates);
      const confirmedAddress = place
        ? {
            ...pendingAddress,
            street: place.street || place.name || pendingAddress.street,
            number: pendingAddress.number || (
              pendingAddress.numberNeedsConfirmation ? '' : place.number
            ),
            neighborhood: place.neighborhood || pendingAddress.neighborhood,
            city: place.city || pendingAddress.city,
            state: place.state || pendingAddress.state,
          }
        : pendingAddress;
      setDetailsAddress(confirmedAddress);
    } catch (error) {
      Alert.alert(
        'Não foi possível atualizar o endereço pelo mapa',
        error?.message || 'Confira os dados do endereço antes de continuar.',
      );
      setDetailsAddress(pendingAddress);
    } finally {
      setConfirmingAddress(false);
    }
  }

  function selectSearchSuggestion(suggestion) {
    setPendingAddress({
      ...suggestion,
      id: `address-${Date.now()}`,
    });
    setShowStreetSuggestions(false);
    setSearch('');
    setSearchSubmitted(false);
    setSearchSuggestions([]);
  }

  function removeAddress(address) {
    Alert.alert(
      'Remover endereço?',
      `${getAddressTitle(address)} será removido dos seus endereços salvos.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => {
            const remaining = addresses.filter((item) => item.id !== address.id);
            setAddresses(remaining);
            if (selectedId === address.id) setSelectedId(remaining[0]?.id || null);
          },
        },
      ],
    );
  }

  function openAddressMenu(address) {
    openEditor(address);
  }

  async function useCurrentLocation() {
    setLocationLoading(true);
    try {
      let permission = await Location.getForegroundPermissionsAsync();
      if (permission.status !== 'granted' && permission.canAskAgain) {
        permission = await Location.requestForegroundPermissionsAsync();
      }
      if (permission.status !== 'granted') {
        Alert.alert(
          'Permissão de localização necessária',
          'Ative o acesso à localização nas configurações do aparelho para usar este recurso.',
        );
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const [place] = await Location.reverseGeocodeAsync(position.coords);
      if (!place) {
        throw new Error('Não foi possível encontrar um endereço para esta localização.');
      }

      const newAddress = {
        id: `address-${Date.now()}`,
        street: place.street || place.name || 'Minha localização atual',
        number: place.streetNumber || '',
        neighborhood: place.district || place.subregion || '',
        city: place.city || place.subregion || '',
        state: place.region || '',
        reference: 'Adicionado pela localização atual',
        coordinates: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
      };
      setPendingAddress(newAddress);
    } catch (error) {
      Alert.alert(
        'Não foi possível encontrar sua localização',
        error?.message || 'Verifique sua conexão e tente novamente.',
      );
    } finally {
      setLocationLoading(false);
    }
  }

  if (pendingAddress) {
    return (
      <>
        {detailsAddress ? (
          <AddressDetailsScreen
            address={detailsAddress}
            onBack={() => setDetailsAddress(null)}
            onAdjustMap={() => setDetailsAddress(null)}
            onSave={(form) => {
              setEditingAddress(null);
              saveAddress(form);
              setDetailsAddress(null);
            }}
          />
        ) : (
          <AddressConfirmation
            address={pendingAddress}
            confirming={confirmingAddress}
            onAddressChange={setPendingAddress}
            onBack={() => setPendingAddress(null)}
            onConfirm={confirmAddressOnMap}
          />
        )}
        <Modal
          animationType="slide"
          onRequestClose={() => setEditorVisible(false)}
          transparent
          visible={editorVisible}
        >
          {editorVisible && (
            <AddressEditor
              address={editingAddress}
              onCancel={() => setEditorVisible(false)}
              onSave={saveAddress}
            />
          )}
        </Modal>
      </>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Voltar"
          accessibilityRole="button"
          hitSlop={10}
          onPress={onBack}
          style={styles.backButton}
        >
          <Text style={styles.backArrow}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>ENDEREÇO DE ENTREGA</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.searchBar}>
        <TextInput
          ref={searchInput}
          accessibilityLabel="Pesquisar endereço"
          onChangeText={(value) => {
            searchRequestId.current += 1;
            setSearch(value);
            setSearchSubmitted(false);
            setSearchSuggestions([]);
            setSearchError('');
            setSearchLoading(false);
          }}
          onFocus={() => setShowStreetSuggestions(true)}
          onSubmitEditing={() => {
            searchInput.current?.blur();
            runAddressSearch();
          }}
          placeholder="Endereço e número"
          placeholderTextColor={COLORS.muted}
          returnKeyType="search"
          style={styles.searchInput}
          value={search}
        />
        {!!search && (
          <Pressable
            accessibilityLabel="Limpar pesquisa"
            accessibilityRole="button"
            onPress={() => {
              searchRequestId.current += 1;
              setSearch('');
              setSearchSubmitted(false);
              setSearchSuggestions([]);
              setSearchError('');
              setSearchLoading(false);
            }}
            style={styles.clearSearchAction}
          >
            <Text style={styles.searchIconText}>×</Text>
          </Pressable>
        )}
        <Pressable
          accessibilityLabel="Pesquisar endereço"
          accessibilityRole="button"
          onPress={() => {
            if (!search.trim()) searchInput.current?.focus();
            else runAddressSearch();
          }}
          style={styles.searchAction}
        >
          <AddressSearchIcon />
        </Pressable>
      </View>

      <View style={styles.actionRow}>
        <Pressable
          accessibilityRole="button"
          disabled={locationLoading}
          onPress={useCurrentLocation}
          style={styles.locationButton}
        >
          <LocationPinIcon size={20} style={styles.locationPinPlacement} />
          <Text style={styles.locationText}>
            {locationLoading ? 'Buscando localização...' : 'Usar minha localização'}
          </Text>
        </Pressable>
      </View>
      <ScrollView
        contentContainerStyle={styles.addressList}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {showStreetSuggestions && search.trim() ? (
          !searchSubmitted ? (
            <Text style={styles.addressSearchHint}>
              Digite a rua e o número, por exemplo: Rua Tito, 54.
            </Text>
          ) : searchLoading ? (
            <Text style={styles.addressSearchHint}>Buscando endereços no Brasil...</Text>
          ) : searchSuggestions.length ? (
            searchSuggestions.map((address) => (
              <AddressCard
                address={address}
                key={address.id}
                onSelect={() => selectSearchSuggestion(address)}
                selected={false}
                showActions={false}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Nenhuma rua encontrada</Text>
              <Text style={styles.emptyText}>
                {searchError || 'Tente informar também a cidade e o estado.'}
              </Text>
              <Pressable onPress={() => openEditor()} style={styles.emptyAddButton}>
                <Text style={styles.emptyAddText}>Adicionar endereço manualmente</Text>
              </Pressable>
            </View>
          )
        ) : filteredAddresses.length ? (
          filteredAddresses.map((address) => (
            <AddressCard
              address={address}
              key={address.id}
              onOpenMenu={() => openAddressMenu(address)}
              onSelect={() => setSelectedId(address.id)}
              onRemove={() => removeAddress(address)}
              selected={selectedId === address.id}
            />
          ))
        ) : null}
        {showStreetSuggestions && searchSubmitted && (
          <Text style={styles.searchAttribution}>Busca por © OpenStreetMap contributors</Text>
        )}
      </ScrollView>

      <View style={styles.completeFooter}>
        <Pressable
          accessibilityRole="button"
          disabled={!storageReady || !selectedAddress}
          onPress={() => selectedAddress && onComplete(selectedAddress)}
          style={({ pressed }) => [
            styles.completeAddressButton,
            (!storageReady || !selectedAddress) && styles.completeAddressButtonDisabled,
            pressed && styles.completeAddressButtonPressed,
          ]}
        >
          <Text style={styles.completeAddressButtonText}>{completeLabel}</Text>
        </Pressable>
      </View>

      <Modal
        animationType="slide"
        onRequestClose={() => setEditorVisible(false)}
        transparent
        visible={editorVisible}
      >
        {editorVisible && (
          <AddressEditor
            address={editingAddress}
            onCancel={() => setEditorVisible(false)}
            onSave={saveAddress}
          />
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: COLORS.white,
    flex: 1,
  },
  confirmationScreen: {
    backgroundColor: COLORS.white,
    flex: 1,
  },
  searchMapScreen: {
    backgroundColor: COLORS.white,
    flex: 1,
  },
  detailsMap: {
    height: 160,
    overflow: 'hidden',
    position: 'relative',
  },
  detailsMarker: {
    alignItems: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: '43%',
  },
  detailsMarkerPin: {
    alignItems: 'center',
    backgroundColor: COLORS.orange,
    borderColor: COLORS.white,
    borderRadius: 14,
    borderBottomLeftRadius: 3,
    borderWidth: 2,
    height: 28,
    justifyContent: 'center',
    transform: [{ rotate: '45deg' }],
    width: 28,
  },
  adjustPointerButton: {
    backgroundColor: COLORS.orange,
    borderRadius: 10,
    marginTop: 3,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  adjustPointerText: {
    color: COLORS.white,
    fontSize: 8,
    fontWeight: '600',
  },
  detailsContent: {
    paddingBottom: 18,
    paddingHorizontal: 18,
    paddingTop: 14,
  },
  detailsInput: {
    borderColor: COLORS.amber,
    borderRadius: 5,
    borderWidth: 1,
    color: COLORS.text,
    fontSize: 12,
    height: 38,
    marginTop: 41,
    paddingHorizontal: 11,
  },
  detailsInputFollowingNumber: {
    marginTop: 12,
  },
  detailsCheckRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 7,
    minHeight: 18,
  },
  detailsCheckbox: {
    alignItems: 'center',
    borderColor: COLORS.amber,
    borderRadius: 2,
    borderWidth: 1,
    height: 12,
    justifyContent: 'center',
    marginRight: 7,
    width: 12,
  },
  detailsCheckboxChecked: {
    backgroundColor: COLORS.amber,
  },
  detailsCheckboxMark: {
    color: COLORS.white,
    fontSize: 9,
    lineHeight: 10,
  },
  detailsCheckLabel: {
    color: COLORS.muted,
    fontSize: 8,
  },
  detailsFavorite: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 34,
  },
  favoriteRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  favoriteChip: {
    alignItems: 'center',
    borderColor: COLORS.amber,
    borderRadius: 5,
    borderWidth: 1,
    flexDirection: 'row',
    marginRight: 6,
    paddingHorizontal: 5,
    paddingVertical: 4,
  },
  favoriteChipActive: {
    backgroundColor: '#FFF5D9',
  },
  favoriteChipIcon: {
    color: COLORS.blue,
    fontSize: 9,
    marginRight: 3,
  },
  favoriteChipText: {
    color: COLORS.text,
    fontSize: 8,
  },
  detailsFooter: {
    backgroundColor: COLORS.white,
    paddingBottom: 18,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  detailsSave: {
    alignItems: 'center',
    backgroundColor: COLORS.amber,
    borderRadius: 8,
    height: 42,
    justifyContent: 'center',
  },
  searchMapHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: 58,
    paddingHorizontal: 12,
  },
  mapSearchBox: {
    alignItems: 'center',
    backgroundColor: '#F1F0F5',
    borderColor: '#D0CFD4',
    borderRadius: 9,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    height: 42,
    paddingLeft: 13,
  },
  mapSearchInput: {
    color: COLORS.text,
    flex: 1,
    fontSize: 13,
    height: '100%',
    paddingVertical: 0,
  },
  mapSearchClear: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    width: 38,
  },
  mapSearchClearText: {
    color: COLORS.muted,
    fontSize: 23,
  },
  searchMap: {
    flex: 1,
    minHeight: 180,
  },
  suggestionPanel: {
    backgroundColor: COLORS.white,
    maxHeight: 250,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  suggestionHeading: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 5,
  },
  searchMapMessage: {
    color: COLORS.muted,
    fontSize: 12,
    paddingVertical: 10,
  },
  manualMapButton: { alignItems: 'center', backgroundColor: COLORS.amber, borderRadius: 8, marginBottom: 8, paddingHorizontal: 12, paddingVertical: 11 },
  manualMapButtonText: { color: COLORS.white, fontSize: 12, fontWeight: '700' },
  suggestionList: {
    flexGrow: 0,
  },
  suggestionRow: {
    alignItems: 'center',
    borderBottomColor: '#EEEEEE',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    minHeight: 54,
    paddingVertical: 8,
  },
  suggestionPin: {
    alignItems: 'center',
    borderColor: COLORS.blue,
    borderRadius: 9,
    borderWidth: 1.5,
    height: 16,
    justifyContent: 'center',
    marginRight: 13,
    transform: [{ rotate: '45deg' }],
    width: 16,
  },
  suggestionPinCenter: {
    borderColor: COLORS.blue,
    borderRadius: 3,
    borderWidth: 1,
    height: 6,
    transform: [{ rotate: '-45deg' }],
    width: 6,
  },
  suggestionDetails: {
    flex: 1,
  },
  suggestionTitle: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '600',
  },
  suggestionSubtitle: {
    color: COLORS.muted,
    fontSize: 10,
    marginTop: 3,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 54,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: 40,
  },
  backArrow: {
    color: COLORS.amber,
    fontSize: 32,
    lineHeight: 36,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '700',
  },
  headerSpacer: {
    width: 40,
  },
  mapPreview: {
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  mapCenterMarker: {
    alignItems: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: '50%',
  },
  mapMarker: {
    alignItems: 'center',
    backgroundColor: '#F07800',
    borderColor: COLORS.white,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 17,
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
    borderWidth: 2,
    height: 34,
    justifyContent: 'center',
    marginTop: -30,
    transform: [{ rotate: '45deg' }],
    width: 34,
  },
  mapMarkerDot: {
    backgroundColor: COLORS.white,
    borderRadius: 5,
    height: 10,
    transform: [{ rotate: '-45deg' }],
    width: 10,
  },
  mapMoveHint: {
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: 14,
    color: COLORS.text,
    fontSize: 10,
    marginTop: 5,
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  confirmationDetails: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 18,
    paddingVertical: 13,
  },
  confirmationHint: {
    color: COLORS.muted,
    fontSize: 11,
    marginBottom: 5,
  },
  confirmationAddress: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '700',
  },
  confirmationSubtitle: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 2,
  },
  confirmationFooter: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 6,
    paddingTop: 7,
    paddingBottom: 8,
  },
  confirmAddressButton: {
    alignItems: 'center',
    backgroundColor: COLORS.amber,
    borderRadius: 6,
    height: 36,
    justifyContent: 'center',
  },
  confirmAddressText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
  },
  searchBar: {
    alignItems: 'center',
    backgroundColor: '#F1F0F5',
    borderColor: '#D0CFD4',
    borderRadius: 9,
    borderWidth: 1,
    flexDirection: 'row',
    height: 40,
    marginHorizontal: 11,
    marginTop: 4,
  },
  searchInput: {
    color: COLORS.text,
    flex: 1,
    fontSize: 12,
    height: '100%',
    paddingHorizontal: 16,
    paddingVertical: 0,
  },
  searchAction: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    width: 39,
  },
  clearSearchAction: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    width: 30,
  },
  searchIconText: {
    color: '#F07800',
    fontSize: 23,
    lineHeight: 28,
  },
  addressSearchGlyph: {
    height: 18,
    position: 'relative',
    width: 18,
  },
  addressSearchLens: {
    borderColor: '#F07800',
    borderRadius: 7,
    borderWidth: 1.5,
    height: 12,
    left: 1,
    position: 'absolute',
    top: 1,
    width: 12,
  },
  addressSearchHandle: {
    backgroundColor: '#F07800',
    borderRadius: 1,
    bottom: 1,
    height: 1.5,
    position: 'absolute',
    right: 0,
    transform: [{ rotate: '45deg' }],
    width: 7,
  },
  actionRow: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 43,
    justifyContent: 'flex-start',
    paddingHorizontal: 18,
  },
  locationButton: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
  },
  locationPinPlacement: {
    marginRight: 10,
  },
  locationText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '500',
  },
  addressList: {
    backgroundColor: COLORS.background,
    flexGrow: 1,
    paddingBottom: 14,
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  completeFooter: {
    backgroundColor: COLORS.white,
    borderTopColor: COLORS.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  completeAddressButton: {
    alignItems: 'center',
    backgroundColor: COLORS.amber,
    borderRadius: 9,
    justifyContent: 'center',
    minHeight: 48,
  },
  completeAddressButtonDisabled: {
    opacity: 0.5,
  },
  completeAddressButtonPressed: {
    opacity: 0.8,
  },
  completeAddressButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
  addressCard: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderColor: COLORS.amber,
    borderRadius: 9,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 14,
    minHeight: 104,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  addressCardContent: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    minHeight: 80,
  },
  cardPressed: {
    opacity: 0.8,
  },
  addressPinPlacement: {
    marginRight: 26,
  },
  addressDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  addressTitle: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  addressSubtitle: {
    color: COLORS.muted,
    fontSize: 9,
    lineHeight: 11,
  },
  radio: {
    alignItems: 'center',
    borderColor: COLORS.amber,
    borderRadius: 9,
    borderWidth: 1,
    height: 12,
    justifyContent: 'center',
    marginHorizontal: 8,
    width: 12,
  },
  radioSelected: {
    borderWidth: 1.5,
  },
  radioDot: {
    backgroundColor: COLORS.amber,
    borderRadius: 4,
    height: 6,
    width: 6,
  },
  addressActionButton: {
    alignItems: 'center',
    height: 36,
    justifyContent: 'center',
    marginLeft: 4,
    width: 20,
  },
  addressMoreIcon: {
    alignItems: 'center',
    gap: 3,
    justifyContent: 'center',
  },
  addressMoreDot: {
    backgroundColor: COLORS.orange,
    borderRadius: 2,
    height: 3,
    width: 3,
  },
  addressSearchHint: {
    color: COLORS.muted,
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 14,
  },
  searchAttribution: {
    color: COLORS.muted,
    fontSize: 9,
    paddingBottom: 8,
    paddingHorizontal: 8,
    paddingTop: 2,
    textAlign: 'right',
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 48,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '600',
  },
  emptyText: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  emptyAddButton: {
    backgroundColor: COLORS.amber,
    borderRadius: 8,
    marginTop: 18,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  emptyAddText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },
  modalScrim: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  editor: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    maxHeight: '90%',
    paddingBottom: Platform.OS === 'ios' ? 28 : 18,
    paddingHorizontal: 20,
    paddingTop: 22,
  },
  editorTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '700',
  },
  editorDescription: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 14,
    marginTop: 4,
  },
  placeTypeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    marginTop: 3,
  },
  placeTypeOption: {
    borderColor: COLORS.border,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 5,
    marginRight: 7,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  placeTypeOptionSelected: {
    backgroundColor: '#FFF5D9',
    borderColor: COLORS.amber,
  },
  placeTypeText: {
    color: COLORS.muted,
    fontSize: 11,
  },
  placeTypeTextSelected: {
    color: COLORS.text,
    fontWeight: '600',
  },
  formField: {
    marginBottom: 11,
  },
  formLabel: {
    color: COLORS.muted,
    fontSize: 11,
    marginBottom: 5,
  },
  formInput: {
    borderColor: COLORS.border,
    borderRadius: 7,
    borderWidth: 1,
    color: COLORS.text,
    fontSize: 13,
    height: 42,
    paddingHorizontal: 12,
  },
  editorActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelButton: {
    alignItems: 'center',
    borderColor: COLORS.border,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    marginRight: 8,
    minHeight: 44,
  },
  cancelText: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '600',
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: COLORS.amber,
    borderRadius: 8,
    flex: 1.4,
    justifyContent: 'center',
    minHeight: 44,
  },
  saveText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
  },
});
