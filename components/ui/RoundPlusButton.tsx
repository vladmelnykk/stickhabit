import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import React from 'react'
import { PressableProps, StyleProp, StyleSheet, ViewStyle } from 'react-native'
import Icon from './Icon'
import ScalePressable from './ScalePressable'

interface RoundPlusButtonProps extends PressableProps {
  style?: StyleProp<ViewStyle>
}

const WIDTH = 50

const RoundPlusButton = ({ children, style, ...rest }: RoundPlusButtonProps) => {
  const theme = useColorScheme()

  return (
    <ScalePressable
      style={[styles.container, { backgroundColor: Colors[theme].tint }, style]}
      android_ripple={{ borderless: false, radius: WIDTH / 2, foreground: true }}
      {...rest}
    >
      <Icon color="#ffffff" name="plus" size={48} />
    </ScalePressable>
  )
}

export default RoundPlusButton

const styles = StyleSheet.create({
  container: {
    width: WIDTH,
    height: WIDTH,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84
  }
})
