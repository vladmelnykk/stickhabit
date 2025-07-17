import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import { Habit } from '@/types/global'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { ThemedText } from '../ui/ThemedText'

interface HabitOverviewCardProps {
  children?: React.ReactNode
  habit: Habit
}
const HabitOverviewCard: React.FC<HabitOverviewCardProps> = ({ children, habit }) => {
  const theme = useColorScheme()
  const { t } = useTranslation()
  const frequency =
    habit &&
    (habit.daysOfWeek.length < 7
      ? `${habit.daysOfWeek.length} ${t('statistics.daysPerWeek')}`
      : t('statistics.everyday'))
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
