// features/diet-audit/utils/auditFormatters.js

export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  
  return {
    date: date.toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    time: date.toLocaleTimeString('pl-PL', {
      hour: '2-digit',
      minute: '2-digit'
    }),
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
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (minutes < 1) return 'Przed chwilą';
  if (minutes < 60) return `${minutes} min temu`;
  if (hours < 24) return `${hours} godz. temu`;
  if (days < 7) return `${days} dni temu`;
  if (weeks < 4) return `${weeks} tyg. temu`;
  if (months < 12) return `${months} mies. temu`;
  
  return date.toLocaleDateString('pl-PL');
};

export const formatRevisionType = (type) => {
  const types = {
    ADD: { 
      label: 'Dodano', 
      color: '#4caf50', 
      icon: '➕',
      bgColor: 'rgba(76, 175, 80, 0.1)'
    },
    MOD: { 
      label: 'Zmodyfikowano', 
      color: '#2196f3', 
      icon: '✏️',
      bgColor: 'rgba(33, 150, 243, 0.1)'
    },
    DEL: { 
      label: 'Usunięto', 
      color: '#f44336', 
      icon: '🗑️',
      bgColor: 'rgba(244, 67, 54, 0.1)'
    },
  };
  
  return types[type] || { 
    label: type, 
    color: 'rgba(255, 255, 255, 0.7)', 
    icon: '❓',
    bgColor: 'rgba(255, 255, 255, 0.05)'
  };
};

export const formatMacroChange = (value) => {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}`;
};

export const getMacroChangeColor = (value) => {
  if (value > 0) return '#4caf50';  // green
  if (value < 0) return '#f44336';  // red
  return 'rgba(255, 255, 255, 0.7)'; // gray
};