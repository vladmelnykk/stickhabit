import { Theme } from '@/types/types'

const THEME_OPTIONS = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
  { label: 'System', value: 'system' }
] as const satisfies readonly { label: string; value: Theme }[]

export { THEME_OPTIONS }
