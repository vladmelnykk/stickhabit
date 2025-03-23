import React from 'react'
import { Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native'
import Animated, {
  cancelAnimation,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated'

interface RoundPlusButtonProps extends PressableProps {
  targetScale?: number
  style?: StyleProp<ViewStyle>
}

const DEFAULT_TARGET_SCALE = 0.9
const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

const ScalePressable: React.FC<RoundPlusButtonProps> = ({
  onPressIn,
  onPressOut,
  targetScale = DEFAULT_TARGET_SCALE,
  style,
  children,
  ...rest
}) => {
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }))

  return (
    <AnimatedPressable
      onPressIn={e => {
        'worklet'
        if (onPressIn) runOnJS(onPressIn)(e)
        cancelAnimation(scale)
        scale.value = withTiming(targetScale, { duration: 100 })
      }}
      onPressOut={e => {
        'worklet'
        if (onPressOut) runOnJS(onPressOut)(e)
        cancelAnimation(scale)
        scale.value = withTiming(1, { duration: 100 })
      }}
      style={[animatedStyle, style]}
      {...rest}
    >
      {children}
    </AnimatedPressable>
  )
}

export default ScalePressable
