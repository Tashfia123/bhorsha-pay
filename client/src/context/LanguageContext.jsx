import React, { createContext, useContext, useState } from 'react';
import enTranslations from '../locales/en.json';
import bnTranslations from '../locales/bn.json';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en");

  // Translation function
  const t = (key) => {
    const translations = language === "bn" ? bnTranslations : enTranslations;
    const keys = key.split('.');
    let value = translations;
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  // Toggle language
  const toggleLanguage = () => {
    setLanguage(prev => prev === "en" ? "bn" : "en");
  };

  const value = {
    language,
    toggleLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
