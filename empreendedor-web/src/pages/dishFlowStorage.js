export const ingredientDraftStorageKey = 'oullin-ingredient-allergen-draft';
export const technicalSheetDraftStorageKey = 'oullin-technical-sheet-draft';

export const initialIngredients = [
  { id: 'chicken', name: 'Peito de frango grelhado', amount: '120' },
  { id: 'rice', name: 'Arroz cozido', amount: '120' },
  { id: 'potato', name: 'Purê de batata', amount: '100' },
  { id: 'herbs', name: 'Cebolinha e temperos', amount: '10' },
];

export const initialCustomerIngredients =
  'Peito de frango, arroz branco, batata, leite, manteiga, cebolinha, sal, alho e azeite.';

export function readIngredientDraft(dishName) {
  try {
    const saved = sessionStorage.getItem(ingredientDraftStorageKey);
    if (!saved) return null;

    const draft = JSON.parse(saved);
    if (
      draft?.dishName === dishName &&
      Array.isArray(draft.ingredients) &&
      draft.allergenStates &&
      typeof draft.customerIngredients === 'string'
    ) {
      return draft;
    }
    return null;
  } catch (error) {
    console.error('Não foi possível recuperar os ingredientes salvos.', error);
    return null;
  }
}

export function readTechnicalSheetDraft(dishName) {
  try {
    const saved = sessionStorage.getItem(technicalSheetDraftStorageKey);
    if (!saved) return null;

    const draft = JSON.parse(saved);
    if (
      draft?.dishName === dishName &&
      Array.isArray(draft.ingredients) &&
      draft.extraNutrients &&
      typeof draft.extraNutrients === 'object'
    ) {
      return draft;
    }
    return null;
  } catch (error) {
    console.error('Não foi possível recuperar a ficha técnica salva.', error);
    return null;
  }
}
