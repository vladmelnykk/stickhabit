import { useStore } from '@/store/store'
import { WeeklyHabit } from '@/types/types'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { endOfISOWeek, startOfISOWeek } from 'date-fns'
import React, { useMemo } from 'react'
import { FlatList, StyleSheet } from 'react-native'
import WeeklyHabitItem from './WeeklyHabitItem'

interface WeeklyRouteProps {
  route: string
  setListRef: (key: string) => (ref: FlatList | null) => void
}
const WeeklyRoute: React.FC<WeeklyRouteProps> = ({ setListRef, route }) => {
  const habits = useStore(state => state.habits)
  const tabBarHeight = useBottomTabBarHeight()
  const weeklyHabits: WeeklyHabit[] = useMemo(() => {
    if (!habits) return []

    const today = new Date()

    const startOfWeek = startOfISOWeek(today)

    const endOfWeek = endOfISOWeek(today)

    const weeklyHabits = habits
      .filter(habit => habit.isArchived === false)
      .map(habit => {
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
      ref={setListRef(route)}
      style={styles.flatList}
      overScrollMode="never"
      bounces={false}
      contentContainerStyle={[styles.flatListContent, { paddingBottom: tabBarHeight * 2 }]}
      data={weeklyHabits}
      renderItem={({ item }) => <WeeklyHabitItem habit={item} />}
      showsVerticalScrollIndicator={false}
    />
  )
}

export default React.memo(WeeklyRoute)

const styles = StyleSheet.create({
  flatList: {
    flex: 1,
    marginTop: 12
  },
  flatListContent: {
    gap: 12
  }
})
