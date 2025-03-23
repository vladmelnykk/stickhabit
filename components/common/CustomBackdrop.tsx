import { BottomSheetBackdropProps, useBottomSheet } from '@gorhom/bottom-sheet'
import { Pressable, StyleSheet } from 'react-native'
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated'

const CustomBackdrop = ({ style, animatedIndex, animatedPosition }: BottomSheetBackdropProps) => {
  const { close } = useBottomSheet()

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(animatedIndex.value, [-1, 0, 1], [0, 0.4, 0.4])
    const display = animatedIndex.value === -1 ? 'none' : 'flex'
    return { opacity, display }
  })

  return (
    <Animated.View style={[style, { backgroundColor: 'rgba(0, 0, 0, 0.8)' }, animatedStyle]}>
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
