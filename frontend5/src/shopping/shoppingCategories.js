import { ACCENTS } from '../tokens';

// Kolory kategorii listy zakupów z palety akcentów.
const CATEGORY_COLORS = {
  GROCERY: ACCENTS.teal,
  CLOTHES: ACCENTS.purple,
  ELECTRONICS: ACCENTS.blue,
  PHARMACY: ACCENTS.coral,
  OTHER: ACCENTS.gray,
};

export const categoryColor = (category) => CATEGORY_COLORS[category] ?? CATEGORY_COLORS.OTHER;
