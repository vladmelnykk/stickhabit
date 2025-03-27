import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import React from 'react'
import { View } from 'react-native'
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
        style={{
          backgroundColor: Colors[theme].secondary,
          height: 20,
          borderRadius: 20,
          borderWidth: 0.5,
          borderColor: Colors[theme].icon,
          overflow: 'hidden'
        }}
      >
        <Animated.View
          // layout={LinearTransition.duration(500)}
          style={[
            {
              flex: 1,
              flexDirection: 'row',
              backgroundColor: Colors[theme].tint
              // width: 0
            },
            animatedStyle
          ]}
        />
      </View>
    </View>
  )
}

export default ProgressBar
