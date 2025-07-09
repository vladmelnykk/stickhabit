import { Theme } from '@/types/global'

const THEME_OPTIONS = [
  { label: 'theme.light', value: 'light' },
  { label: 'theme.dark', value: 'dark' },
  { label: 'theme.system', value: 'system' }
] as const satisfies readonly { label: string; value: Theme }[]

export { THEME_OPTIONS }
