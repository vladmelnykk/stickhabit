import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import { BottomSheetBackdropProps, useBottomSheet } from '@gorhom/bottom-sheet'
import { useState } from 'react'
import { Pressable, StatusBar, StyleSheet } from 'react-native'
import Animated, {
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle
} from 'react-native-reanimated'

const CustomBackdrop = ({ style, animatedIndex }: BottomSheetBackdropProps) => {
  const { close } = useBottomSheet()
  const theme = useColorScheme()
  const [statusBarColor, setStatusBarColor] = useState(Colors[theme].background)

  useAnimatedReaction(
    () => {
      return animatedIndex.value
    },
    (currentValue, previousValue) => {
      if (currentValue !== previousValue) {
        const backgroundColor = interpolateColor(
          currentValue,
          [-1, 0, 1],
          [Colors[theme].background, 'rgba(0, 0, 0, 0.4)', 'rgba(0, 0, 0, 0.4)']
        )

        runOnJS(setStatusBarColor)(backgroundColor)
      }
    }
  )

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(animatedIndex.value, [-1, 0], [0, 0.4])
    const display = animatedIndex.value === -1 ? 'none' : 'flex'
    return { opacity, display }
  })

  return (
    <Animated.View style={[style, { backgroundColor: 'rgba(0, 0, 0, 0.8)' }, animatedStyle]}>
      <StatusBar backgroundColor={statusBarColor} />
      <Pressable style={styles.pressable} onPress={() => close()} />
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  pressable: {
    flex: 1
  }
})

export default CustomBackdrop
