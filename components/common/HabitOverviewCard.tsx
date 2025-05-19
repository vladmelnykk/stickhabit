import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import { Habit } from '@/types/types'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { ThemedText } from '../ui/ThemedText'

interface HabitOverviewCardProps {
  children?: React.ReactNode
  habit: Habit
}
const HabitOverviewCard: React.FC<HabitOverviewCardProps> = ({ children, habit }) => {
  const theme = useColorScheme()

  const frequency =
    habit.daysOfWeek.length < 7 ? `${habit.daysOfWeek.length} days per week` : 'Everyday'

  return (
    <View style={[styles.container, { backgroundColor: Colors[theme].secondary }]}>
      <View style={styles.header}>
        <ThemedText type="subtitle">{habit.title}</ThemedText>
        <ThemedText
          type="default"
          lightColor={Colors['light'].textSecondary}
          darkColor={Colors['dark'].textSecondary}
        >
          {frequency}
        </ThemedText>
      </View>
      <View style={[styles.line, { backgroundColor: Colors[theme].textSecondary }]} />
      <View style={styles.body}>{children}</View>
    </View>
  )
}

export default HabitOverviewCard

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 12
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  line: {
    height: StyleSheet.hairlineWidth
  },
  body: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row'
  }
})
