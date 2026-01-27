// features/diet-audit/utils/auditFormatters.js

export const formatRevisionType = (type) => {
  const types = {
    ADD: { label: 'Dodano', color: 'green', icon: '➕' },
    MOD: { label: 'Zmodyfikowano', color: 'blue', icon: '✏️' },
    DEL: { label: 'Usunięto', color: 'red', icon: '🗑️' },
  };
  return types[type] || { label: type, color: 'gray', icon: '❓' };
};

export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return {
    date: date.toLocaleDateString('pl-PL'),
    time: date.toLocaleTimeString('pl-PL'),
    relative: getRelativeTime(date),
    full: date.toLocaleString('pl-PL'),
  };
};

const getRelativeTime = (date) => {
  const now = new Date();
  const diff = now - date;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Przed chwilą';
  if (minutes < 60) return `${minutes} min temu`;
  if (hours < 24) return `${hours} godz. temu`;
  if (days < 7) return `${days} dni temu`;
  return date.toLocaleDateString('pl-PL');
};

export const formatMacroChange = (value) => {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}`;
};

export const getMacroChangeColor = (value) => {
  if (value > 0) return 'green';
  if (value < 0) return 'red';
  return 'gray';
};