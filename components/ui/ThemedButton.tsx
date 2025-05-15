import { Colors } from '@/constants/Colors'
import { FontFamily } from '@/constants/FontFamily'
import { useColorScheme } from '@/hooks/useColorScheme'
import React from 'react'
import { GestureResponderEvent, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native'
import ScalePressable from './ScalePressable'

const HEIGHT = 50

interface ThemedButtonProps {
  style?: StyleProp<ViewStyle>
  primary?: boolean
  disabled?: boolean
  title: string
  targetScale?: number
  onPress: (event: GestureResponderEvent) => void
}

const SCALE = 0.98

const ThemedButton: React.FC<ThemedButtonProps> = ({
  style,
  primary = true,
  onPress,
  title,
  targetScale = SCALE,
  disabled = false
}) => {
  const theme = useColorScheme()

  const backgroundColor = primary ? Colors[theme].tint : Colors[theme].accent

  const color = primary
    ? theme === 'dark'
      ? Colors.dark.text
      : Colors.light.background
    : theme === 'dark'
    ? Colors.dark.text
    : Colors.light.tint

  return (
    <ScalePressable
      onPress={disabled ? undefined : onPress}
      targetScale={disabled ? 1 : targetScale}
      style={[styles.container, { backgroundColor, opacity: disabled ? 0.5 : 1 }, style]}
    >
      <Text style={[styles.text, { color }]}>{title}</Text>
    </ScalePressable>
  )
}

export default ThemedButton

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: HEIGHT,
    borderRadius: HEIGHT / 2,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },
  text: {
    fontSize: 16,
    fontFamily: FontFamily.RobotoSemiBold
  }
})
