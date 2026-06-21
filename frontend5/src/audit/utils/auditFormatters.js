// features/diet-audit/utils/auditFormatters.js

import i18n from '../../language/i18n';

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

export const formatRevisionType = (type) => {
  const types = {
    ADD: {
      label: i18n.t('audit.added'),
      color: '#4caf50',
      icon: '➕',
      bgColor: 'rgba(76, 175, 80, 0.1)',
    },
    MOD: {
      label: i18n.t('audit.modified'),
      color: '#2196f3',
      icon: '✏️',
      bgColor: 'rgba(33, 150, 243, 0.1)',
    },
    DEL: {
      label: i18n.t('audit.removed'),
      color: '#f44336',
      icon: '🗑️',
      bgColor: 'rgba(244, 67, 54, 0.1)',
    },
  };

  return (
    types[type] || {
      label: type,
      color: 'rgba(255, 255, 255, 0.7)',
      icon: '❓',
      bgColor: 'rgba(255, 255, 255, 0.05)',
    }
  );
};

export const formatMacroChange = (value) => {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}`;
};

export const getMacroChangeColor = (value) => {
  if (value > 0) return '#4caf50'; // green
  if (value < 0) return '#f44336'; // red
  return 'rgba(255, 255, 255, 0.7)'; // gray
};
