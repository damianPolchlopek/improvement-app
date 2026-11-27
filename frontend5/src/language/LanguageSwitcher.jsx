import React from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useTranslation } from 'react-i18next';

const LANGUAGES = ['pl', 'en'];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  // Źródłem prawdy jest i18n.language (ustawiany przy starcie z localStorage),
  // dzięki czemu przełącznik nigdy nie rozjedzie się z faktycznym językiem.
  const current = i18n.language === 'en' ? 'en' : 'pl';

  const handleChange = (_event, newLang) => {
    if (!newLang) return; // klik w już aktywny przycisk nie odznacza języka
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  return (
    <ToggleButtonGroup
      size="small"
      exclusive
      value={current}
      onChange={handleChange}
      aria-label="language"
      sx={{
        mr: 1,
        '& .MuiToggleButton-root': {
          px: 1,
          py: 0.25,
          fontSize: 11,
          fontWeight: 600,
          lineHeight: 1.6,
          color: 'toolbar.text',
          borderColor: 'line.strong',
        },
        '& .MuiToggleButton-root.Mui-selected, & .MuiToggleButton-root.Mui-selected:hover': {
          color: 'text.primary',
          bgcolor: 'toolbar.selected',
        },
      }}
    >
      {LANGUAGES.map((lang) => (
        <ToggleButton key={lang} value={lang}>
          {lang.toUpperCase()}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default LanguageSwitcher;
