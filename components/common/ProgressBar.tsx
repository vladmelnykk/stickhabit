import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, { LinearTransition } from 'react-native-reanimated'
import { ThemedText } from '../ui/ThemedText'

interface Props {
  currentDate: Date
}

const ProgressBar = ({ currentDate }: Props) => {
  const theme = useColorScheme()

  const formattedDate = currentDate.toLocaleString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  })

  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
        <ThemedText>{formattedDate}</ThemedText>
        <ThemedText>{'Progress: ' + 0 + '%'}</ThemedText>
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
          layout={LinearTransition.duration(500)}
          style={{
            flex: 1,
            flexDirection: 'row',
            backgroundColor: Colors[theme].tint,
            width: '0%'
          }}
        />
      </View>
    </View>
  )
}

export default ProgressBar

const styles = StyleSheet.create({})
