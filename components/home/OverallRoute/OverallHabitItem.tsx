import HabitOverviewCard from '@/components/common/HabitOverviewCard'
import { Colors } from '@/constants/Colors'
import { FontFamily } from '@/constants/FontFamily'
import { CONTAINER_PADDING, WINDOW_WIDTH } from '@/constants/global'
import { useColorScheme } from '@/hooks/useColorScheme'
import { differenceInDays, startOfISOWeek, subWeeks } from 'date-fns'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const DAYS_OF_WEEK = [
  { id: 1, label: 'M' },
  { id: 2, label: 'T' },
  { id: 3, label: 'W' },
  { id: 4, label: 'T' },
  { id: 5, label: 'F' },
  { id: 6, label: 'S' },
  { id: 0, label: 'S' }
]

const CIRCLE_SIZE = (WINDOW_WIDTH - CONTAINER_PADDING * 2 - 16) / 22

interface OverallHabitItemProps {
  habit: Habit
}

const getGridData = (habit: Habit) => {
  const now = new Date()

  const currentMonday = startOfISOWeek(now)

  // define start date 17 weeks ago
  const startDate = subWeeks(currentMonday, 17)

  // console.log(differenceInDays(endOfISOWeek(now), startDate))

  // Create 18x7 grid
  const grid: boolean[][] = Array.from({ length: 18 }, () => Array(7).fill(false))

  habit.completedDates.forEach(({ date, times }) => {
    const habitDate = new Date(date)

    // calculate difference in days
    // TODO: in Sun check cause old diffDays returns value bigger on 1 than differenceInDays() *
    // const diffDays = Math.round((habitDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    const diffDays = differenceInDays(habitDate, startDate)
    // console.log(habit.title, diffDays, differenceInDays(habitDate, startDate))
    // console.log(habit.title, differenceInDays(habitDate, startDate))

    // if difference in days is between 0 and 126
    if (diffDays >= 0 && diffDays < 126) {
      const weekIndex = Math.floor(diffDays / 7)
      const dayIndex = (habitDate.getDay() + 6) % 7 // Пн = 0, ..., Нд = 6

      grid[weekIndex][dayIndex] = times >= habit.timesPerDay
    }
  })

  return grid
}

const OverallHabitItem: React.FC<OverallHabitItemProps> = ({ habit }) => {
  const monthlyData = getGridData(habit)
  const theme = useColorScheme()

  return (
    <HabitOverviewCard habit={habit}>
      <View style={styles.colContainer}>
        {DAYS_OF_WEEK.map(day => {
          return (
            <Text style={[styles.label, { color: Colors[theme].text }]} key={day.id}>
              {day.label}
            </Text>
          )
        })}
      </View>

      {monthlyData.map((month, monthIndex) => (
        <View key={monthIndex} style={styles.colContainer}>
          {month.map((isCompleted, dayIndex) => {
            return (
              <View
                key={dayIndex}
                style={[
                  styles.circle,
                  { backgroundColor: isCompleted ? habit.color : Colors[theme].accent }
                ]}
              />
            )
          })}
        </View>
      ))}
    </HabitOverviewCard>
  )
}

const styles = StyleSheet.create({
  colContainer: {
    gap: 8,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  label: {
    fontSize: CIRCLE_SIZE * 0.9,
    fontFamily: FontFamily.RobotoLight,
    lineHeight: CIRCLE_SIZE
  },
  circle: { width: CIRCLE_SIZE, height: CIRCLE_SIZE, borderRadius: CIRCLE_SIZE / 2 }
})

export default OverallHabitItem
