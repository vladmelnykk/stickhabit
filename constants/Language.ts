export const LANGUAGES = [
  {
    code: 'en',
    label: 'language.en',
    locale: 'en-US'
  },
  {
    code: 'uk',
    label: 'language.uk',
    locale: 'uk-UA'
  }
] as const

export type Language = (typeof LANGUAGES)[number]['code']
