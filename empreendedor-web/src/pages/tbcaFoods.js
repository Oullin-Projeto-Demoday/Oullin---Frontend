function createComponents(values) {
  return [
    { name: 'Energia', unit: 'kJ', value: values.energyKj },
    { name: 'Energia', unit: 'kcal', value: values.energyKcal },
    { name: 'Umidade', unit: 'g', value: values.moisture },
    { name: 'Carboidrato total', unit: 'g', value: values.carbohydrates },
    { name: 'Carboidrato disponível', unit: 'g', value: values.availableCarbohydrates },
    { name: 'Proteína', unit: 'g', value: values.protein },
    { name: 'Lipídios', unit: 'g', value: values.fat },
    { name: 'Fibra alimentar', unit: 'g', value: values.fiber },
    { name: 'Álcool', unit: 'g', value: '0,00' },
    { name: 'Cinzas', unit: 'g', value: values.ashes },
    { name: 'Colesterol', unit: 'mg', value: values.cholesterol },
    { name: 'Ácidos graxos saturados', unit: 'g', value: values.saturatedFat },
    { name: 'Ácidos graxos monoinsaturados', unit: 'g', value: values.monounsaturatedFat },
    { name: 'Ácidos graxos poli-insaturados', unit: 'g', value: values.polyunsaturatedFat },
  ];
}

export const tbcaFoods = [
  {
    id: 'chicken',
    name: 'Peito de frango grelhado',
    aliases: ['frango', 'frango grelhado', 'peito de frango'],
    nutritionPer100Grams: { energy: 158.33333333333334, carbohydrates: 0, protein: 22.5, fat: 4.166666666666667 },
    components: createComponents({
      energyKj: '663',
      energyKcal: '158',
      moisture: '65,0',
      carbohydrates: '0,0',
      availableCarbohydrates: '0,0',
      protein: '22,5',
      fat: '4,2',
      fiber: '0,00',
      ashes: '1,10',
      cholesterol: '75,0',
      saturatedFat: '1,20',
      monounsaturatedFat: '1,60',
      polyunsaturatedFat: '0,90',
    }),
  },
  {
    id: 'rice',
    name: 'Arroz cozido',
    aliases: ['arroz', 'arroz branco'],
    nutritionPer100Grams: { energy: 130.83333333333334, carbohydrates: 30, protein: 2.5, fat: 2.5 },
    components: createComponents({
      energyKj: '555',
      energyKcal: '131',
      moisture: '66,9',
      carbohydrates: '30,0',
      availableCarbohydrates: '28,8',
      protein: '2,5',
      fat: '2,45',
      fiber: '0,00',
      ashes: '1,44',
      cholesterol: '0,00',
      saturatedFat: '0,89',
      monounsaturatedFat: '0,90',
      polyunsaturatedFat: '0,30',
    }),
  },
  {
    id: 'brown-rice',
    name: 'Arroz integral cozido',
    aliases: ['arroz integral'],
    nutritionPer100Grams: { energy: 123, carbohydrates: 25.8, protein: 2.6, fat: 1 },
    components: createComponents({
      energyKj: '515',
      energyKcal: '123',
      moisture: '70,1',
      carbohydrates: '25,8',
      availableCarbohydrates: '23,5',
      protein: '2,6',
      fat: '1,0',
      fiber: '2,3',
      ashes: '0,50',
      cholesterol: '0,00',
      saturatedFat: '0,30',
      monounsaturatedFat: '0,40',
      polyunsaturatedFat: '0,30',
    }),
  },
  {
    id: 'parboiled-rice',
    name: 'Arroz parboilizado cozido',
    aliases: ['arroz parboilizado'],
    nutritionPer100Grams: { energy: 123, carbohydrates: 26, protein: 2.6, fat: 0.5 },
    components: createComponents({
      energyKj: '515',
      energyKcal: '123',
      moisture: '70,0',
      carbohydrates: '26,0',
      availableCarbohydrates: '25,0',
      protein: '2,6',
      fat: '0,5',
      fiber: '1,0',
      ashes: '0,40',
      cholesterol: '0,00',
      saturatedFat: '0,10',
      monounsaturatedFat: '0,20',
      polyunsaturatedFat: '0,20',
    }),
  },
  {
    id: 'rice-beans',
    name: 'Arroz com feijão',
    aliases: ['arroz e feijão'],
    nutritionPer100Grams: { energy: 115, carbohydrates: 22, protein: 4.5, fat: 1 },
    components: createComponents({
      energyKj: '481',
      energyKcal: '115',
      moisture: '70,0',
      carbohydrates: '22,0',
      availableCarbohydrates: '19,0',
      protein: '4,5',
      fat: '1,0',
      fiber: '3,0',
      ashes: '0,60',
      cholesterol: '0,00',
      saturatedFat: '0,20',
      monounsaturatedFat: '0,30',
      polyunsaturatedFat: '0,30',
    }),
  },
  {
    id: 'potato',
    name: 'Purê de batata',
    aliases: ['purê', 'batata'],
    nutritionPer100Grams: { energy: 125, carbohydrates: 21, protein: 2, fat: 4 },
    components: createComponents({
      energyKj: '523',
      energyKcal: '125',
      moisture: '71,0',
      carbohydrates: '21,0',
      availableCarbohydrates: '20,0',
      protein: '2,0',
      fat: '4,0',
      fiber: '1,0',
      ashes: '1,00',
      cholesterol: '10,0',
      saturatedFat: '2,40',
      monounsaturatedFat: '1,10',
      polyunsaturatedFat: '0,20',
    }),
  },
  {
    id: 'herbs',
    name: 'Cebolinha e temperos',
    aliases: ['cebolinha', 'temperos'],
    nutritionPer100Grams: { energy: 80, carbohydrates: 10, protein: 0, fat: 0 },
    components: createComponents({
      energyKj: '335',
      energyKcal: '80',
      moisture: '78,0',
      carbohydrates: '10,0',
      availableCarbohydrates: '8,0',
      protein: '0,0',
      fat: '0,0',
      fiber: '2,0',
      ashes: '1,00',
      cholesterol: '0,00',
      saturatedFat: '0,00',
      monounsaturatedFat: '0,00',
      polyunsaturatedFat: '0,00',
    }),
  },
];

export const nutritionPer100Grams = Object.fromEntries(
  tbcaFoods.map(({ id, nutritionPer100Grams: nutrition }) => [id, nutrition]),
);

function normalizeSearchValue(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function editDistance(left, right) {
  let previousRow = Array.from({ length: right.length + 1 }, (_, index) => index);

  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    const currentRow = [leftIndex];
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      const substitutionCost = left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1;
      currentRow[rightIndex] = Math.min(
        currentRow[rightIndex - 1] + 1,
        previousRow[rightIndex] + 1,
        previousRow[rightIndex - 1] + substitutionCost,
      );
    }
    previousRow = currentRow;
  }

  return previousRow[right.length];
}

export function findTbcaFood(id, name) {
  if (id) {
    const foodById = tbcaFoods.find((food) => food.id === id);
    if (foodById) return foodById;
  }

  const normalizedName = name ? normalizeSearchValue(name) : '';
  if (!normalizedName) return null;

  return tbcaFoods.find((food) => (
    normalizeSearchValue(food.name) === normalizedName ||
    food.aliases.some((alias) => normalizeSearchValue(alias) === normalizedName)
  )) || null;
}

export function searchTbcaFoods(query) {
  const searchTerm = normalizeSearchValue(query);
  if (!searchTerm) return tbcaFoods;

  const queryWords = searchTerm.split(' ');
  return tbcaFoods
    .map((food, index) => {
      const searchWords = normalizeSearchValue([food.name, ...food.aliases].join(' ')).split(' ');
      let score = 0;

      for (const queryWord of queryWords) {
        if (searchWords.some((word) => word.includes(queryWord))) continue;
        if (queryWord.length < 4) return null;

        const distance = Math.min(...searchWords.map((word) => editDistance(queryWord, word)));
        const allowedDistance = queryWord.length > 6 ? 2 : 1;
        if (distance > allowedDistance) return null;
        score += distance;
      }

      return { food, index, score };
    })
    .filter(Boolean)
    .sort((left, right) => left.score - right.score || left.index - right.index)
    .map(({ food }) => food);
}
