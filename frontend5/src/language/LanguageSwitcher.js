import React, { useContext } from 'react';
import { FormControlLabel, Switch } from '@mui/material';
import { LanguageContext } from '../language/LanguageContext';

const LanguageSwitcher = () => {
  const { language, changeLanguage } = useContext(LanguageContext);
  const checked = language === 'en';

  const handleChange = (event) => {
    const newLang = event.target.checked ? 'en' : 'pl';
    changeLanguage(newLang);
  };

  return (
    <FormControlLabel
      control={<Switch checked={checked} onChange={handleChange} />}
      label={checked ? '🇬🇧' : '🇵🇱'}
    />
  );
};

export default LanguageSwitcher;