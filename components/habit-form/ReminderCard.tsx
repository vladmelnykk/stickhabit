import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import React from 'react'
import type { GestureResponderEvent } from 'react-native'
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native'
import Icon from '../ui/Icon'
import { ThemedText } from '../ui/ThemedText'

interface ReminderCardProps {
  time: Date
  style?: StyleProp<ViewStyle>
  onPress: (event: GestureResponderEvent) => void
}

const ReminderCard: React.FC<ReminderCardProps> = ({ time, style, onPress }) => {
  const theme = useColorScheme()

  const formattedDate = time.toLocaleString(undefined, {
    hour: 'numeric',
    minute: 'numeric'
  })

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: Colors[theme].secondary
        },
        style
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Icon name="clock" color={Colors[theme].tint} />
        <ThemedText>{formattedDate}</ThemedText>
      </View>

      <TouchableOpacity onPress={onPress}>
        <Icon name="minus-circle" color={Colors[theme].text} />
      </TouchableOpacity>
    </View>
  )
}

export default ReminderCard

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8
  }
})
