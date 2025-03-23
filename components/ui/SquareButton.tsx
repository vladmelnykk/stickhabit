import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import React from 'react'
import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native'

const SIZE = 50

interface SquareButtonProps {
  style?: StyleProp<ViewStyle>
  value?: boolean
  onValueChange?: (value: boolean) => void
  activeColor?: string
  inactiveColor?: string
  children?: React.ReactNode
}

const SquareButton: React.FC<SquareButtonProps> = ({
  style,
  value,
  onValueChange,
  children,
  activeColor,
  inactiveColor
}) => {
  const theme = useColorScheme()

  const backgroundColor = value
    ? activeColor || Colors[theme].tint
    : inactiveColor || Colors[theme].background

  const borderColor = value
    ? activeColor || Colors[theme].tint
    : inactiveColor || Colors[theme].secondary

  const handleChange = () => {
    onValueChange?.(!value)
  }

  return (
    <Pressable
      style={[styles.defaultStyle, { backgroundColor, borderColor }, style]}
      onPress={handleChange}
    >
      {children}
    </Pressable>
  )
}

export default SquareButton

const styles = StyleSheet.create({
  defaultStyle: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE * 0.1,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
