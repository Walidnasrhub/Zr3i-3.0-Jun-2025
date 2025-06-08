import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Localization from 'expo-localization';
import i18n from '../i18n';
import * as SecureStore from 'expo-secure-store';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [locale, setLocale] = useState(Localization.locale.split('-')[0]);
  const [isRTL, setIsRTL] = useState(locale === 'ar');

  useEffect(() => {
    loadSavedLanguage();
  }, []);

  const loadSavedLanguage = async () => {
    try {
      const savedLocale = await SecureStore.getItemAsync('userLocale');
      if (savedLocale) {
        changeLanguage(savedLocale);
      }
    } catch (error) {
      console.error('Failed to load language preference:', error);
    }
  };

  const changeLanguage = async (newLocale) => {
    try {
      i18n.locale = newLocale;
      setLocale(newLocale);
      setIsRTL(newLocale === 'ar');
      await SecureStore.setItemAsync('userLocale', newLocale);
    } catch (error) {
      console.error('Failed to save language preference:', error);
    }
  };

  const value = {
    locale,
    isRTL,
    changeLanguage,
    t: (key, options) => i18n.t(key, options),
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

