import React, { createContext, useContext } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const { t, i18n } = useTranslation();

  // Aapka 'l' function jo template {{}} ko handle karta hy
  const l = (key) => {
    if (!key) return '';
    // l('{{user_name}}') ho ya l('user_name'), dono chalenge
    const cleanKey = typeof key === 'string' ? key.replace(/\{\{|\}\}/g, '').trim() : key;
    return t(cleanKey);
  };

  return (
    <LanguageContext.Provider value={{ l, t, i18n }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom Hook taake use karne mein asani ho
export const useAppLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useAppLanguage must be used within a LanguageProvider');
  }
  return context;
};