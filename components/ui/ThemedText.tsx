import { FontFamily } from '@/constants/FontFamily'
import { useThemeColor } from '@/hooks/useThemeColor'
import { StyleSheet, Text, type TextProps } from 'react-native'

export type ThemedTextProps = TextProps & {
  lightColor?: string
  darkColor?: string
  type?: keyof typeof styles
}

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text')

  return <Text style={[{ color }, styles[type], style]} {...rest} />
}

const styles = StyleSheet.create({
  default: {
    fontFamily: FontFamily.RobotoRegular,
    fontSize: 16,
    lineHeight: 24
  },
  defaultSemiBold: {
    fontFamily: FontFamily.RobotoSemiBold,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: FontFamily.RobotoBold
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: FontFamily.RobotoBold
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
    fontFamily: FontFamily.RobotoRegular
  },
  small: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: FontFamily.RobotoRegular
  }
})
