// Stałe kolory makroskładników używane w widoku posiłków.
// `bar` – wypełnienie paska proporcji, `text` – jaśniejszy odcień do liczb na ciemnym tle.
export const MACRO_COLORS = {
  kcal: { bar: '#D85A30', text: '#F0997B' },
  protein: { bar: '#378ADD', text: '#85B7EB' },
  carbohydrates: { bar: '#EF9F27', text: '#FAC775' },
  fat: { bar: '#1D9E75', text: '#5DCAA5' },
};

// Kolejność grup składników zwracanych przez /meal/{id}/ingredients.
export const INGREDIENT_CATEGORY_ORDER = [
  'MEAT',
  'DAIRY',
  'CARBS',
  'FAT',
  'FRUIT_VEGETABLES',
  'SPICES',
  'SWEETS',
  'OTHER',
];

export function formatMacro(value) {
  const number = Number(value) || 0;
  return Number.isInteger(number) ? number : Math.round(number * 10) / 10;
}
