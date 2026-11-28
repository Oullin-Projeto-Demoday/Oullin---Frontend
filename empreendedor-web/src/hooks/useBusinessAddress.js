import { useCallback, useRef, useState } from 'react';

const initialMapPlaceholder =
  'Preencha o endereço e selecione “Mostrar localização no mapa”.';
const addressFieldNames = [
  'state',
  'city',
  'neighborhood',
  'street',
  'streetNumber',
];
const geoapifyCache = new Map();
const viaCepCache = new Map();

function normalizeStreetName(value) {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .replace(/^(rua|r|avenida|av|alameda|al|travessa|tv|estrada|rodovia)\.?\s+/, '')
    .replace(/[^a-z0-9]/g, '');
}

function normalizeHouseNumber(value) {
  return String(value || '')
    .toLocaleLowerCase('pt-BR')
    .replace(/[^a-z0-9]/g, '');
}

function createGeoapifyParams(address, apiKey, useTextSearch = false) {
  const params = new URLSearchParams({
    apiKey,
    format: 'json',
    lang: 'pt',
    limit: '10',
    filter: 'countrycode:br',
  });

  if (useTextSearch) {
    params.set(
      'text',
      [
        [address.streetNumber, address.street].filter(Boolean).join(' '),
        address.neighborhood,
        address.city,
        address.state,
        address.postalCode,
        'Brasil',
      ]
        .filter(Boolean)
        .join(', '),
    );
    return params;
  }

  if (address.streetNumber) params.set('housenumber', address.streetNumber);
  if (address.street) params.set('street', address.street);
  if (address.postalCode) params.set('postcode', address.postalCode);
  if (address.city) params.set('city', address.city);
  if (address.state) params.set('state', address.state);
  params.set('country', 'Brasil');
  return params;
}

async function searchGeoapify(params, expectedStreet) {
  const cacheKey = params.toString();
  if (geoapifyCache.has(cacheKey)) return geoapifyCache.get(cacheKey);

  const response = await fetch(
    `https://api.geoapify.com/v1/geocode/search?${cacheKey}`,
    { headers: { Accept: 'application/json' } },
  );
  if (!response.ok) {
    throw new Error(`Geoapify respondeu com o status (${response.status}).`);
  }

  const data = await response.json();
  if (!data || !Array.isArray(data.results)) {
    throw new Error('A resposta da Geoapify está em um formato inválido.');
  }

  const normalizedExpectedStreet = normalizeStreetName(expectedStreet);
  const places = data.results.filter((result) => {
    const latitude = Number(result.lat);
    const longitude = Number(result.lon);
    const countryCode = String(result.country_code || '').toLowerCase();
    const road = result.street || result.address_line1 || result.name || '';
    const normalizedRoad = normalizeStreetName(road);

    return (
      Number.isFinite(latitude) &&
      Number.isFinite(longitude) &&
      countryCode === 'br' &&
      (!normalizedExpectedStreet ||
        !normalizedRoad ||
        normalizedRoad.includes(normalizedExpectedStreet) ||
        normalizedExpectedStreet.includes(normalizedRoad))
    );
  });

  geoapifyCache.set(cacheKey, places);
  return places;
}

async function findAddressOnMap(address, apiKey, requestVersion, versionRef, setStatus) {
  const queries = [
    createGeoapifyParams(address, apiKey),
    createGeoapifyParams(address, apiKey, true),
  ];
  const requestedNumber = normalizeHouseNumber(address.streetNumber);
  let approximateResult = null;

  for (let index = 0; index < queries.length; index += 1) {
    if (requestVersion !== versionRef.current) return null;
    if (index > 0) {
      setStatus('Ainda não encontramos. Tentando outra forma de busca...');
    }

    const params = queries[index];
    if (
      !params.get('text') &&
      !address.street &&
      !address.postalCode &&
      !address.city
    ) {
      continue;
    }

    const places = await searchGeoapify(params, address.street);
    if (!places.length) continue;

    if (requestedNumber && address.street) {
      const exactPlace = places.find(
        (place) =>
          normalizeHouseNumber(place.housenumber) === requestedNumber,
      );
      if (exactPlace) return { place: exactPlace, approximate: false };
    }

    const fallbackPlace = requestedNumber
      ? places.find((place) => !normalizeHouseNumber(place.housenumber)) ||
        places[0]
      : places[0];
    if (
      !approximateResult ||
      (requestedNumber &&
        approximateResult.place.housenumber &&
        !fallbackPlace.housenumber)
    ) {
      approximateResult = {
        place: fallbackPlace,
        approximate: !address.street || index > 0 || Boolean(requestedNumber),
      };
    }

    if (!requestedNumber && address.street) {
      return { place: fallbackPlace, approximate: false };
    }
  }

  return approximateResult;
}

function makeOpenStreetMapUrl(latitude, longitude) {
  const margin = 0.003;
  const bounds = [
    longitude - margin,
    latitude - margin,
    longitude + margin,
    latitude + margin,
  ].join(',');
  const params = new URLSearchParams({
    bbox: bounds,
    layer: 'mapnik',
    marker: `${latitude},${longitude}`,
  });
  return `https://www.openstreetmap.org/export/embed.html?${params}`;
}

export default function useBusinessAddress() {
  const [fields, setFields] = useState({
    businessName: '',
    postalCode: '',
    state: '',
    city: '',
    neighborhood: '',
    street: '',
    streetNumber: '',
    complement: '',
  });
  const [cepStatus, setCepStatus] = useState('');
  const [mapStatus, setMapStatus] = useState('');
  const [mapPlaceholder, setMapPlaceholder] = useState(initialMapPlaceholder);
  const [mapUrl, setMapUrl] = useState('');
  const [mapLink, setMapLink] = useState('');
  const [isLookingUpCep, setIsLookingUpCep] = useState(false);
  const [isSearchingMap, setIsSearchingMap] = useState(false);

  const postalCodeRef = useRef('');
  const lastRequestedCepRef = useRef('');
  const lastAutoFilledCepRef = useRef('');
  const lastAutoFilledValuesRef = useRef(null);
  const cepRequestIdRef = useRef(0);
  const mapSearchVersionRef = useRef(0);
  const mapWasFoundRef = useRef(false);
  const apiKey = String(window.OULLIN_GEOAPIFY_API_KEY || '').trim();

  const invalidateMapPreview = useCallback(() => {
    mapSearchVersionRef.current += 1;
    setIsSearchingMap(false);
    setMapUrl('');
    setMapLink('');

    if (mapWasFoundRef.current) {
      setMapPlaceholder(
        'O endereço foi alterado. Busque novamente para atualizar o mapa.',
      );
      setMapStatus(
        'O endereço foi alterado. Busque novamente para atualizar o mapa.',
      );
    } else {
      setMapPlaceholder(initialMapPlaceholder);
      setMapStatus('');
    }

    mapWasFoundRef.current = false;
  }, []);

  const lookupAddressByCep = useCallback(
    async (value, force = false) => {
      const cep = value.replace(/\D/g, '');
      if (cep.length !== 8) {
        if (force) {
          setCepStatus('Digite um CEP com 8 números para buscar o endereço.');
        }
        return;
      }

      if (
        !force &&
        (cep === lastRequestedCepRef.current ||
          cep === lastAutoFilledCepRef.current)
      ) {
        return;
      }

      lastRequestedCepRef.current = cep;
      const requestId = ++cepRequestIdRef.current;
      setIsLookingUpCep(true);
      setCepStatus('Buscando endereço pelo CEP...');

      try {
        let address = viaCepCache.get(cep);
        if (!address) {
          const response = await fetch(
            `https://viacep.com.br/ws/${cep}/json/`,
            { headers: { Accept: 'application/json' } },
          );
          if (!response.ok) {
            throw new Error(`ViaCEP respondeu com o status ${response.status}.`);
          }

          address = await response.json();
          if (address.erro) {
            if (requestId === cepRequestIdRef.current) {
              setCepStatus(
                'CEP não encontrado. Confira os números e tente novamente.',
              );
            }
            return;
          }
          viaCepCache.set(cep, address);
        }

        if (
          requestId !== cepRequestIdRef.current ||
          postalCodeRef.current.replace(/\D/g, '') !== cep
        ) {
          return;
        }

        const autoFilledValues = {
          state: address.uf || '',
          city: address.localidade || '',
          neighborhood: address.bairro || '',
          street: address.logradouro || '',
        };
        setFields((current) => ({ ...current, ...autoFilledValues }));
        lastAutoFilledCepRef.current = cep;
        lastAutoFilledValuesRef.current = autoFilledValues;
        invalidateMapPreview();

        const hasCompleteAddress = Object.values(autoFilledValues).every(Boolean);
        setCepStatus(
          hasCompleteAddress
            ? 'Endereço preenchido pelo CEP. Informe o número e complemento, se houver.'
            : 'CEP encontrado, mas alguns dados não estão disponíveis. Confira o endereço.',
        );
      } catch (error) {
        if (requestId !== cepRequestIdRef.current) return;
        console.error('Não foi possível consultar o CEP na ViaCEP.', error);
        setCepStatus(
          'Não foi possível buscar o CEP agora. Confira sua conexão e tente novamente.',
        );
      } finally {
        if (requestId === cepRequestIdRef.current) {
          setIsLookingUpCep(false);
        }
      }
    },
    [invalidateMapPreview],
  );

  const updateField = useCallback(
    (name, value) => {
      if (name === 'postalCode') {
        postalCodeRef.current = value;
        const digits = value.replace(/\D/g, '');
        cepRequestIdRef.current += 1;
        lastRequestedCepRef.current = '';
        setIsLookingUpCep(false);
        setCepStatus('');

        const autoFilledValues = lastAutoFilledValuesRef.current;
        if (
          autoFilledValues &&
          digits !== lastAutoFilledCepRef.current
        ) {
          setFields((current) => {
            const next = { ...current, postalCode: value };
            for (const [field, autoValue] of Object.entries(autoFilledValues)) {
              if (next[field] === autoValue) next[field] = '';
            }
            return next;
          });
          lastAutoFilledCepRef.current = '';
          lastAutoFilledValuesRef.current = null;
        } else {
          setFields((current) => ({ ...current, postalCode: value }));
        }

        invalidateMapPreview();
        if (digits.length === 8) {
          void lookupAddressByCep(value);
        }
        return;
      }

      setFields((current) => ({ ...current, [name]: value }));
      invalidateMapPreview();
    },
    [invalidateMapPreview, lookupAddressByCep],
  );

  const searchMap = useCallback(async () => {
    const address = {
      street: fields.street.trim(),
      streetNumber: fields.streetNumber.trim(),
      neighborhood: fields.neighborhood.trim(),
      city: fields.city.trim(),
      state: fields.state.trim(),
      postalCode: fields.postalCode.trim(),
    };
    const hasPostalCode = Boolean(address.postalCode);
    const hasStreetAndCity = address.street && address.city;
    const hasCityAndState = address.city && address.state;

    if (!hasPostalCode && !hasStreetAndCity && !hasCityAndState) {
      setMapStatus(
        'Para localizar no mapa, informe o CEP, a rua e a cidade, ou a cidade e o estado.',
      );
      return;
    }

    if (!apiKey) {
      setMapStatus(
        'A busca do mapa ainda não foi configurada. O preenchimento do endereço pelo CEP continua disponível.',
      );
      return;
    }

    const requestVersion = mapSearchVersionRef.current;
    setIsSearchingMap(true);
    setMapStatus('Buscando endereço no mapa...');
    setMapPlaceholder('');
    setMapUrl('');
    setMapLink('');
    mapWasFoundRef.current = false;

    try {
      const searchResult = await findAddressOnMap(
        address,
        apiKey,
        requestVersion,
        mapSearchVersionRef,
        setMapStatus,
      );
      if (requestVersion !== mapSearchVersionRef.current) return;

      if (!searchResult) {
        setMapStatus(
          'Não encontramos esse endereço. Confira o CEP ou tente buscar pela rua, cidade e estado.',
        );
        setMapPlaceholder(
          'A Geoapify pode não ter esse endereço cadastrado. Revise os dados e tente uma busca mais ampla.',
        );
        return;
      }

      const { place, approximate } = searchResult;
      const latitude = Number(place.lat);
      const longitude = Number(place.lon);
      setMapUrl(makeOpenStreetMapUrl(latitude, longitude));
      setMapLink(
        `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=17/${latitude}/${longitude}`,
      );
      mapWasFoundRef.current = true;
      setMapStatus(
        approximate
          ? address.streetNumber
            ? 'Não foi possível confirmar o número da casa. O marcador pode ser aproximado; confira no mapa.'
            : 'Encontramos uma localização aproximada. Confira o marcador no mapa.'
          : 'Localização encontrada. Confira se o marcador corresponde ao endereço.',
      );
    } catch (error) {
      if (requestVersion !== mapSearchVersionRef.current) return;

      console.error('Não foi possível localizar o endereço na Geoapify.', error);
      if (error.message.includes('(429)')) {
        setMapStatus(
          'A busca está temporariamente ocupada. Aguarde um instante e tente novamente.',
        );
      } else if (
        error.message.includes('(401)') ||
        error.message.includes('(403)')
      ) {
        setMapStatus(
          'A chave da Geoapify não foi autorizada. Verifique a chave e as restrições de domínio.',
        );
      } else {
        setMapStatus(
          'Não foi possível buscar o endereço agora. Confira sua conexão e tente novamente.',
        );
      }
      setMapPlaceholder(
        'Não foi possível carregar o mapa. Confira sua conexão e tente novamente.',
      );
    } finally {
      if (requestVersion === mapSearchVersionRef.current) {
        window.setTimeout(() => setIsSearchingMap(false), 1100);
      }
    }
  }, [apiKey, fields]);

  return {
    fields,
    cepStatus,
    mapStatus,
    mapPlaceholder,
    mapUrl,
    mapLink,
    isLookingUpCep,
    isSearchingMap,
    updateField,
    lookupAddressByCep,
    searchMap,
  };
}
