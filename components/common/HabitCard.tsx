import React from 'react'
import { StyleSheet, View } from 'react-native'
import { ThemedText } from '../ui/ThemedText'

interface HabitCardProps {
  color: string
  title: string
  progress: number
  goal: number
}

const HabitCard: React.FC<HabitCardProps> = ({ title, color, goal, progress }) => {
  return (
    <View style={[styles.container, { backgroundColor: color || '#fff' }]}>
      <ThemedText type="subtitle">{title}</ThemedText>
      <ThemedText type="small">
        Progress {progress} / {goal}
      </ThemedText>
    </View>
  )
}
// TODO: is is okay to memo this?
export default React.memo(HabitCard)

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 18,
    gap: 4,
    borderRadius: 16
  }
})
