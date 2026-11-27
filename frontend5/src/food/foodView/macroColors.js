import { ACCENTS } from '../../tokens';

// Stałe kolory makroskładników używane w widoku posiłków.
// `bar` – wypełnienie paska proporcji, `text` – jaśniejszy odcień do liczb na ciemnym tle.
const macro = (accent) => ({ bar: accent.dot, text: accent.light });

// Wyjątek od zasady barw stanów (tokens.js): makro zostają przy swoich klasycznych kolorach.
export const MACRO_COLORS = {
  kcal: macro(ACCENTS.coral),
  protein: macro(ACCENTS.blue),
  carbohydrates: macro(ACCENTS.amber),
  fat: macro(ACCENTS.teal),
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
