import { LANGUAGES } from '@/constants/Language'
import i18n from '@/i18n'
import LocaleConfig from '@/locales/calendar'
import { useStore } from '@/store/store'
import { Language } from '@/types/global'
import { getLocales } from 'expo-localization'

const supportedLanguages: Language[] = LANGUAGES.map(l => l.code)

const getLocalLanguage = () => {
  const localLanguage = getLocales().find(l =>
    supportedLanguages.includes(l.languageCode as Language)
  )?.languageCode as Language

  return localLanguage || 'en'
}

const setAppLanguage = (currentLanguage: Language) => {
  useStore.setState({ language: currentLanguage })
  i18n.changeLanguage(currentLanguage)
  LocaleConfig.defaultLocale = currentLanguage
}

export { getLocalLanguage, setAppLanguage }
