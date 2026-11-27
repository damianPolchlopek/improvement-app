// Kolory kategorii listy zakupów (spójne z paletą food/training).
const CATEGORY_COLORS = {
  GROCERY: { dot: '#1D9E75', bg: '#085041', text: '#9FE1CB' },
  CLOTHES: { dot: '#7F77DD', bg: '#3C3489', text: '#CECBF6' },
  ELECTRONICS: { dot: '#378ADD', bg: '#0C447C', text: '#B5D4F4' },
  PHARMACY: { dot: '#D85A30', bg: '#712B13', text: '#F5C4B3' },
  OTHER: { dot: '#888780', bg: '#444441', text: '#D3D1C7' },
};

export const categoryColor = (category) => CATEGORY_COLORS[category] ?? CATEGORY_COLORS.OTHER;
