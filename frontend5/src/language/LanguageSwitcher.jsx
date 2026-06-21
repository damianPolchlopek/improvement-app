import React from 'react';
import { FormControlLabel, Switch } from '@mui/material';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  // Źródłem prawdy jest i18n.language (ustawiany przy starcie z localStorage),
  // dzięki czemu przełącznik nigdy nie rozjedzie się z faktycznym językiem.
  const checked = i18n.language === 'en';

  const handleChange = (event) => {
    const newLang = event.target.checked ? 'en' : 'pl';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  return (
    <FormControlLabel
      control={<Switch checked={checked} onChange={handleChange} />}
      label={checked ? '🇬🇧' : '🇵🇱'}
    />
  );
};

export default LanguageSwitcher;
