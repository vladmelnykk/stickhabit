/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */
import { DefaultTheme, DarkTheme as NavigationDarkTheme } from '@react-navigation/native'

export const DANGER_COLOR = '#F75656'

const tintColorLight = '#8a85ea'
const secondaryColorLight = '#f5f5f5'
const accentColorLight = '#e0e0e0'

const tintColorDark = '#8a85ea'
const secondaryColorDark = '#20222a'
const accentColorDark = '#363840'

export const Colors = {
  light: {
    text: '#11181C',
    textSecondary: '#9e9e9e',
    background: '#fff',
    tint: tintColorLight,
    secondary: secondaryColorLight,
    accent: accentColorLight,
    icon: '#9e9e9e',
    tabIconDefault: '#9e9e9e',
    tabIconSelected: tintColorLight
  },
  dark: {
    text: '#fff',
    textSecondary: '#9d9e9e',
    background: '#181a21',
    card: '#1E1E1E',
    tint: tintColorDark,
    secondary: secondaryColorDark,
    accent: accentColorDark,
    icon: '#a09fa0',
    tabIconDefault: '#a09fa0',
    tabIconSelected: tintColorDark
  }
}

export const DarkTheme: typeof NavigationDarkTheme = {
  ...NavigationDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    background: Colors.dark.background,
    card: Colors.dark.background,
    primary: Colors.dark.tint,
    text: Colors.dark.text
  }
}

export const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Colors.light.background,
    card: Colors.light.background,
    primary: Colors.light.tint,
    text: Colors.light.text
  }
}
