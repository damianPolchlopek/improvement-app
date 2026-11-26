import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import i18n from '../../language/i18n';
import MacroBar from './MacroBar';

describe('MacroBar', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('pl');
  });

  it('splits the bar by grams, not by calories', () => {
    // 160 g + 250 g + 90 g = 500 g → 32% / 50% / 18%
    render(<MacroBar protein={160} carbohydrates={250} fat={90} />);

    const bar = screen.getByRole('img');
    expect(bar).toHaveAccessibleName(
      'Białko 160 g (32%) · Węglowodany 250 g (50%) · Tłuszcz 90 g (18%)'
    );
    const widths = [...bar.children].map((part) => window.getComputedStyle(part).width);
    expect(widths).toEqual(['32%', '50%', '18%']);
  });

  it('renders an empty track when there are no macros', () => {
    render(<MacroBar protein={0} carbohydrates={0} fat={0} />);
    expect(screen.getByRole('img').children).toHaveLength(0);
  });
});
