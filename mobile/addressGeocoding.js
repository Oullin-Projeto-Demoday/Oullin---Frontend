const BRAZIL_STATE_CODES = {
  acre: 'AC',
  alagoas: 'AL',
  amapa: 'AP',
  amazonas: 'AM',
  bahia: 'BA',
  ceara: 'CE',
  'distrito federal': 'DF',
  'espirito santo': 'ES',
  goias: 'GO',
  maranhao: 'MA',
  'mato grosso': 'MT',
  'mato grosso do sul': 'MS',
  'minas gerais': 'MG',
  para: 'PA',
  paraiba: 'PB',
  parana: 'PR',
  pernambuco: 'PE',
  piaui: 'PI',
  'rio de janeiro': 'RJ',
  'rio grande do norte': 'RN',
  'rio grande do sul': 'RS',
  rondonia: 'RO',
  roraima: 'RR',
  'santa catarina': 'SC',
  'sao paulo': 'SP',
  sergipe: 'SE',
  tocantins: 'TO',
};

const BRAZIL_REGIONS = new Set([
  'norte',
  'nordeste',
  'centro oeste',
  'sudeste',
  'sul',
  'north',
  'northeast',
  'central west',
  'southeast',
  'south',
]);

const GEOAPIFY_CACHE = new Map();

export function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getHouseNumberFromQuery(query) {
  const commaNumber = query.trim().match(/,\s*(\d+[a-z]?(?:[-/]\d+[a-z]?)?)(?=\s*(?:,|$))/i);
  if (commaNumber) return commaNumber[1];
  const trailingNumber = query.trim().match(/\s+(\d+[a-z]?(?:[-/]\d+[a-z]?)?)\s*$/i);
  return trailingNumber?.[1] || '';
}

function getApiKey(platform) {
  const apiKey =
    platform === 'web'
      ? process.env.EXPO_PUBLIC_GEOAPIFY_WEB_API_KEY
      : process.env.EXPO_PUBLIC_GEOAPIFY_MOBILE_API_KEY;

  if (!apiKey?.trim()) {
    const variableName =
      platform === 'web'
        ? 'EXPO_PUBLIC_GEOAPIFY_WEB_API_KEY'
        : 'EXPO_PUBLIC_GEOAPIFY_MOBILE_API_KEY';
    throw new Error(`Configure ${variableName} para usar a busca de endereços.`);
  }

  return apiKey.trim();
}

function mapGeoapifyAddress(result, fallbackQuery = '') {
  const latitude = Number(result.lat);
  const longitude = Number(result.lon);
  const street = result.street || '';
  const stateName = result.state || '';
  const stateCode = String(result.state_code || '').split('-').pop().toUpperCase();
  const stateCodeFromName =
    BRAZIL_STATE_CODES[normalizeText(stateName)] ||
    BRAZIL_STATE_CODES[normalizeText(result.state_district)] ||
    BRAZIL_STATE_CODES[normalizeText(result.county)];
  const placeName =
    street && result.name && normalizeText(result.name) !== normalizeText(street)
      ? result.name
      : '';

  return {
    id: `geoapify-${result.place_id || `${latitude}-${longitude}`}`,
    placeName,
    street: street || result.name || fallbackQuery,
    number: result.housenumber || '',
    neighborhood:
      result.suburb ||
      result.neighbourhood ||
      result.neighborhood ||
      result.district ||
      result.quarter ||
      result.city_district ||
      '',
    city:
      result.city ||
      result.town ||
      result.village ||
      result.municipality ||
      result.locality ||
      result.county ||
      '',
    state: stateCodeFromName ||
      (/^[A-Z]{2}$/.test(stateCode) ? stateCode : '') ||
      (BRAZIL_REGIONS.has(normalizeText(stateName)) ? '' : stateName),
    postalCode: result.postcode || '',
    reference: '',
    coordinates: { latitude, longitude },
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
    ]
      .map((part) => normalizeText(part))
      .join('|');
    if (addressKeys.has(key)) return;

    const nearbyDuplicate = unique.some((existing) => {
      if (
        normalizeText(existing.placeName) !== normalizeText(address.placeName) ||
        normalizeText(existing.street) !== normalizeText(address.street) ||
        normalizeText(existing.number) !== normalizeText(address.number)
      ) {
        return false;
      }

      const latitudeDelta =
        (existing.coordinates.latitude - address.coordinates.latitude) * 111320;
      const longitudeScale = Math.cos((address.coordinates.latitude * Math.PI) / 180);
      const longitudeDelta =
        (existing.coordinates.longitude - address.coordinates.longitude) *
        111320 *
        longitudeScale;
      return Math.hypot(latitudeDelta, longitudeDelta) < 30;
    });
    if (nearbyDuplicate) return;

    addressKeys.add(key);
    unique.push(address);
  });

  return unique;
}

async function requestGeoapify(url, action) {
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  });

  if (response.status === 401 || response.status === 403) {
    throw new Error('A chave da Geoapify não foi autorizada para o app.');
  }
  if (response.status === 429) {
    throw new Error('O limite de buscas da Geoapify foi atingido. Tente novamente mais tarde.');
  }
  if (!response.ok) {
    throw new Error(`${action} falhou (${response.status}).`);
  }

  const data = await response.json();
  if (!data || !Array.isArray(data.results)) {
    throw new Error('A resposta da Geoapify está em um formato inválido.');
  }
  return data.results;
}

export async function searchGeoapifyAddresses(query, platform) {
  const normalizedQuery = query.trim().toLocaleLowerCase('pt-BR');
  if (GEOAPIFY_CACHE.has(normalizedQuery)) {
    return GEOAPIFY_CACHE.get(normalizedQuery);
  }

  const params = new URLSearchParams({
    apiKey: getApiKey(platform),
    filter: 'countrycode:br',
    format: 'json',
    lang: 'pt',
    limit: '10',
    text: query,
  });
  const results = await requestGeoapify(
    `https://api.geoapify.com/v1/geocode/search?${params.toString()}`,
    'A busca de endereços',
  );
  const queryNumber = getHouseNumberFromQuery(query);
  const suggestions = results
    .filter((result) => String(result.country_code || '').toLowerCase() === 'br')
    .map((result) => {
      const address = mapGeoapifyAddress(result, query);
      const requestedNumberMatches = Boolean(
        queryNumber &&
          address.number &&
          normalizeText(address.number) === normalizeText(queryNumber),
      );
      return {
        ...address,
        numberNeedsConfirmation: Boolean(queryNumber && !requestedNumberMatches),
        requestedNumber: requestedNumberMatches ? '' : queryNumber,
        requestedNumberMatches,
      };
    })
    .filter(
      (result) =>
        Number.isFinite(result.coordinates.latitude) &&
        Number.isFinite(result.coordinates.longitude) &&
        (!queryNumber || !result.number || result.requestedNumberMatches),
    )
    .sort(
      (first, second) =>
        Number(second.requestedNumberMatches) -
        Number(first.requestedNumberMatches),
    );
  const uniqueSuggestions = deduplicateAddresses(suggestions);
  GEOAPIFY_CACHE.set(normalizedQuery, uniqueSuggestions);
  return uniqueSuggestions;
}

export async function reverseGeoapifyAddress(coordinates, platform) {
  const params = new URLSearchParams({
    apiKey: getApiKey(platform),
    format: 'json',
    lang: 'pt',
    lat: String(coordinates.latitude),
    lon: String(coordinates.longitude),
  });
  const [result] = await requestGeoapify(
    `https://api.geoapify.com/v1/geocode/reverse?${params.toString()}`,
    'A confirmação do endereço',
  );

  return String(result?.country_code || '').toLowerCase() === 'br'
    ? mapGeoapifyAddress(result)
    : null;
}
