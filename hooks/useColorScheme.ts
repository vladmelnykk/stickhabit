import { useColorScheme as useColorSchemeRN } from 'react-native'

export const useColorScheme = () => {
  const theme = useColorSchemeRN() ?? 'light'

  return theme
}
