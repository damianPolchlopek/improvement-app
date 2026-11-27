// features/diet-audit/utils/auditFormatters.js

import {
  Add as AddIcon,
  DeleteOutlined as DeleteIcon,
  Edit as EditIcon,
  HelpOutlined as HelpIcon,
} from '@mui/icons-material';

import i18n from '../../language/i18n';
import { ACCENTS } from '../../tokens';

const localeMap = { pl: 'pl-PL', en: 'en-US' };
const currentLocale = () => localeMap[i18n.language] || 'en-US';

export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const locale = currentLocale();

  return {
    date: date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    time: date.toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit',
    }),
    relative: getRelativeTime(date),
    full: date.toLocaleString(locale),
  };
};

const getRelativeTime = (date) => {
  const now = new Date();
  const diff = now - date;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (minutes < 1) return i18n.t('audit.justNow');
  if (minutes < 60) return i18n.t('audit.minutesAgo', { count: minutes });
  if (hours < 24) return i18n.t('audit.hoursAgo', { count: hours });
  if (days < 7) return i18n.t('audit.daysAgo', { count: days });
  if (weeks < 4) return i18n.t('audit.weeksAgo', { count: weeks });
  if (months < 12) return i18n.t('audit.monthsAgo', { count: months });

  return date.toLocaleDateString(currentLocale());
};

// Typy rewizji: kolor z palety akcentów (`accent.dot/bg/text/light`) i ikona MUI.
// Dodano = teal i usunięto = red (barwy stanów), zmieniono = blue.
export const REVISION_TYPES = {
  ADD: { labelKey: 'audit.added', accent: ACCENTS.teal, Icon: AddIcon },
  MOD: { labelKey: 'audit.modified', accent: ACCENTS.blue, Icon: EditIcon },
  DEL: { labelKey: 'audit.removed', accent: ACCENTS.red, Icon: DeleteIcon },
};

export const formatRevisionType = (type) => {
  const info = REVISION_TYPES[type];
  if (!info) return { label: type, accent: ACCENTS.gray, Icon: HelpIcon };
  return { label: i18n.t(info.labelKey), accent: info.accent, Icon: info.Icon };
};

export const formatMacroChange = (value) => {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}`;
};

// Ścieżka palety do `sx`: wzrost / spadek / bez zmian.
export const getMacroChangeColor = (value) => {
  if (value > 0) return 'status.up';
  if (value < 0) return 'status.down';
  return 'text.secondary';
};
