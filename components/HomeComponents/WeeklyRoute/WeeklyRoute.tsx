import { useHabitStore } from '@/store/habitStore'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import React, { useMemo } from 'react'
import { FlatList, StyleSheet } from 'react-native'
import WeeklyHabitItem from './WeeklyHabitItem'

const WeeklyRoute = () => {
  const habits = useHabitStore(state => state.habits)
  const tabBarHeight = useBottomTabBarHeight()
  const weeklyHabits: WeeklyHabit[] = useMemo(() => {
    if (!habits) return []

    const today = new Date()
    const startOfWeek = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - today.getDay() + 1
    )
    const endOfWeek = new Date(startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000)

    const weeklyHabits = habits.map(habit => {
      const completedDaysThisWeek = habit.completedDates
        .filter(({ date, times }) => {
          const dateObj = new Date(date)
          return dateObj >= startOfWeek && dateObj <= endOfWeek && habit.timesPerDay === times
        })
        .map(({ date }) => new Date(date).getDay())

      return {
        ...habit,
        completedDaysThisWeek: completedDaysThisWeek
      }
    })

    return weeklyHabits
  }, [habits])

  return (
    <FlatList
      style={styles.flatList}
      contentContainerStyle={[styles.flatListContent, { paddingBottom: tabBarHeight + 10 }]}
      data={weeklyHabits}
      renderItem={({ item }) => <WeeklyHabitItem habit={item} />}
    />
  )
}

export default WeeklyRoute

const styles = StyleSheet.create({
  flatList: {
    flex: 1,
    marginTop: 12
  },
  flatListContent: {
    gap: 12
  }
})
