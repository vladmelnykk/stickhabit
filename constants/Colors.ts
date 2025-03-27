/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

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
