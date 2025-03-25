import Icon from '@/components/ui/Icon'
import { ThemedText } from '@/components/ui/ThemedText'
import { Colors } from '@/constants/Colors'
import { FontFamily } from '@/constants/FontFamily'
import { WINDOW_WIDTH } from '@/constants/global'
import { useColorScheme } from '@/hooks/useColorScheme'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const DAYS_OF_WEEK = [
  { id: 1, label: 'Mon' },
  { id: 2, label: 'Tue' },
  { id: 3, label: 'Wed' },
  { id: 4, label: 'Thu' },
  { id: 5, label: 'Fri' },
  { id: 6, label: 'Sat' },
  { id: 0, label: 'Sun' }
]

const CIRCLE_SIZE = WINDOW_WIDTH / 10
const ICON_COLOR = '#212121'
interface DayItemProps {
  color: string
  label: string
  theme: 'light' | 'dark'
  isActive: boolean
}
const DayItem: React.FC<DayItemProps> = ({ color, label, theme, isActive }) => {
  return (
    <View style={styles.dayItem}>
      <Text
        style={{
          // TODO: fontFamily: FontFamily.RobotoSemiBold,
          fontFamily: FontFamily.RobotoRegular,
          color: isActive ? Colors[theme].tint : Colors[theme].text,
          fontSize: CIRCLE_SIZE / 2.5
        }}
      >
        {label}
      </Text>
      <View
        style={{
          width: CIRCLE_SIZE,
          height: CIRCLE_SIZE,
          borderRadius: CIRCLE_SIZE / 2,
          borderWidth: 1,
          borderColor: isActive ? color : Colors[theme].textSecondary,
          backgroundColor: isActive ? color : Colors[theme].secondary,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {isActive && <Icon name="check" color={ICON_COLOR} size={CIRCLE_SIZE / 1.5} />}
      </View>
    </View>
  )
}

interface WeeklyHabitItemProps {
  habit: WeeklyHabit
}
const WeeklyHabitItem: React.FC<WeeklyHabitItemProps> = ({ habit }) => {
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
      <View style={styles.body}>
        {DAYS_OF_WEEK.map(day => {
          const isActive = habit.completedDaysThisWeek.includes(day.id)

          return (
            <DayItem
              key={day.id}
              color={habit.color}
              label={day.label}
              theme={theme}
              isActive={isActive}
            />
          )
        })}
      </View>
    </View>
  )
}

export default WeeklyHabitItem

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
  },
  dayItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  }
})
