import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en/translation.json'
import uk from './locales/uk/translation.json'
import { Language } from './types/global'

export const resources: Record<Language, { translation: typeof en }> = {
  en: { translation: en },
  uk: { translation: uk }
} as const

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  fallbackLng: 'en',
  resources: { en: { translation: en }, uk: { translation: uk } },
  interpolation: { escapeValue: false }
})

export default i18n
