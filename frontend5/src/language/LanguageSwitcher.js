import React, { useState } from 'react';
import { FormControlLabel, Switch } from '@mui/material';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const [ language, setLanguage ] = useState(localStorage.getItem('language') || 'en');
  const { i18n } = useTranslation();

  const checked = language === 'en';

  const handleChange = (event) => {
    const newLang = event.target.checked ? 'en' : 'pl';
    setLanguage(newLang);

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