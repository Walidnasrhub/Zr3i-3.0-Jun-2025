import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';

// Import translations
import en from './translations/en';
import ar from './translations/ar';

// Create i18n instance
const i18n = new I18n({
  en,
  ar,
});

// Set the locale
i18n.locale = Localization.locale.split('-')[0];
i18n.enableFallback = true;
i18n.defaultLocale = 'en';

export default i18n;

