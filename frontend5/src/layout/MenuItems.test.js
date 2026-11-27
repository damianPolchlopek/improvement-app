import { describe, it, expect } from 'vitest';
import { MENU_ITEMS } from './MenuItems';
import { DailyViewUrl, ShoppingViewUrl, WeeklyViewUrl } from '../utils/URLHelper';

describe('MENU_ITEMS', () => {
  it('lists the "other" module as daily, weekly, shopping (the first one opens from the header)', () => {
    const other = MENU_ITEMS((key) => key).find((item) => item.category === 'menu.other');
    expect(other.subPages.map((page) => page.path)).toEqual([
      DailyViewUrl,
      WeeklyViewUrl,
      ShoppingViewUrl,
    ]);
  });
});
