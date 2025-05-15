import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withClamp,
  withSpring
} from 'react-native-reanimated'
import { ThemedText } from '../ui/ThemedText'

interface Props {
  date?: Date
  progress: number
}

const ProgressBar = ({ date = new Date(), progress }: Props) => {
  const theme = useColorScheme()
  const width = useSharedValue(0)
  const formattedDate = date.toLocaleString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  })

  const animatedStyle = useAnimatedStyle(() => {
    width.value = withClamp(
      { min: 0 },
      withSpring(progress, {
        stiffness: 200,
        damping: 20
      })
    )

    return {
      width: `${width.value}%`
    }
  })

  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
        <ThemedText>{formattedDate}</ThemedText>
        <ThemedText>{`Progress: ${progress.toFixed(0)}%`}</ThemedText>
      </View>
      <View
        style={[
          styles.container,
          { backgroundColor: Colors[theme].secondary, borderColor: Colors[theme].icon }
        ]}
      >
        <Animated.View
          style={[styles.flex, { backgroundColor: Colors[theme].tint }, animatedStyle]}
        />
      </View>
    </View>
  )
}

export default ProgressBar

const styles = StyleSheet.create({
  container: { height: 20, borderRadius: 20, borderWidth: 0.5, overflow: 'hidden' },
  flex: { flex: 1 }
})
