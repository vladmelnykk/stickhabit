import { useStore } from '@/store/store'
import { useColorScheme as useColorSchemeRN } from 'react-native'

export const useColorScheme = () => {
  const selectedTheme = useStore(state => state.theme)
  const systemTheme = useColorSchemeRN() ?? 'light'

  const theme = selectedTheme === 'system' ? systemTheme : selectedTheme

  return theme
}
