import { Colors } from '@/constants/Colors'
import { FontFamily } from '@/constants/FontFamily'
import { useColorScheme } from '@/hooks/useColorScheme'
import React, { forwardRef } from 'react'
import { StyleProp, StyleSheet, TextInput, View, ViewStyle } from 'react-native'

interface InputProps extends React.ComponentProps<typeof TextInput> {
  containerViewStyle?: StyleProp<ViewStyle>
}

const INPUT_HEIGHT = 50

const Input = forwardRef<TextInput, InputProps>(function Input(
  { containerViewStyle, placeholderTextColor, cursorColor, style, ...rest },
  ref
) {
  const theme = useColorScheme()

  return (
    <View
      style={[styles.container, { backgroundColor: Colors[theme].secondary }, containerViewStyle]}
    >
      <TextInput
        ref={ref}
        style={[styles.input, { color: Colors[theme].text }, style]}
        placeholderTextColor={placeholderTextColor || Colors[theme].textSecondary}
        cursorColor={cursorColor || Colors[theme].tint}
        {...rest}
      />
    </View>
  )
})

export default Input

const styles = StyleSheet.create({
  container: {
    height: INPUT_HEIGHT,
    borderRadius: 8,
    paddingHorizontal: 20,
    justifyContent: 'center'
  },
  input: {
    fontFamily: FontFamily.RobotoMedium,
    fontSize: 16
  }
})
