import { ThemedText } from '@/components/ui/ThemedText'
import { useHabitStore } from '@/store/habitStore'
import React, { useCallback } from 'react'
import { StyleSheet } from 'react-native'
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated'
import TodayHabitItem from './TodayHabitItem'

interface TodayRouteProps {
  setProgress: React.Dispatch<React.SetStateAction<CurrentProgress>>
}

const TodayRoute: React.FC<TodayRouteProps> = ({ setProgress }) => {
  const data = useHabitStore(state => state.habits)
  console.log('todayRoute rendered')

  const [todayUncompletedHabits, setTodayUncompletedHabits] = React.useState<TodayHabit[]>([])
  const [todayCompletedHabits, setTodayCompletedHabits] = React.useState<TodayHabit[]>([])

  const renderItem = useCallback(({ item }: { item: TodayHabit }) => {
    return (
      <Animated.View entering={FadeIn.duration(300)} exiting={FadeOut.duration(300)}>
        <TodayHabitItem habit={item} />
      </Animated.View>
    )
  }, [])

  React.useEffect(() => {
    const getTodayHabits = () => {
      const today = new Date()

      if (data === null || data.length === 0) return
      const todayHabits = data.filter(habit => {
        return habit.daysOfWeek.includes(today.getDay())
      })

      const completedHabits: TodayHabit[] = []
      const uncompletedHabits: TodayHabit[] = []
      const currentProgress: CurrentProgress = { current: 0, goal: 0 }

      todayHabits.forEach(habit => {
        habit.completedDates.forEach(date => {
          const dateObj = new Date(date.date)

          // Проверяем, совпадает ли дата с сегодняшним днем
          const isToday =
            dateObj.getDate() === today.getDate() &&
            dateObj.getMonth() === today.getMonth() &&
            dateObj.getFullYear() === today.getFullYear()

          // Разделяем привычки на выполненные и не выполненные
          if (isToday) {
            if (date.times === habit.timesPerDay) {
              completedHabits.push({
                ...habit,
                currentDate: date
              })
            } else {
              uncompletedHabits.push({
                ...habit,
                currentDate: date
              })
            }
            currentProgress.goal += habit.timesPerDay
            currentProgress.current += date.times
          }
        })

        // Если для сегодняшнего дня ещё нет записи о выполнении, добавляем в невыполненные
        const isHabitCompletedToday = habit.completedDates.some(date => {
          const dateObj = new Date(date.date)
          return (
            dateObj.getDate() === today.getDate() &&
            dateObj.getMonth() === today.getMonth() &&
            dateObj.getFullYear() === today.getFullYear()
          )
        })

        if (!isHabitCompletedToday) {
          uncompletedHabits.push({
            ...habit,
            currentDate: { date: today.getTime(), times: 0 }
          })
          currentProgress.goal += habit.timesPerDay
        }
      })

      setProgress(currentProgress)
      setTodayUncompletedHabits(uncompletedHabits)
      setTodayCompletedHabits(completedHabits)
    }

    getTodayHabits()
  }, [data, setProgress])

  return (
    <Animated.ScrollView contentContainerStyle={{ gap: 12 }}>
      <Animated.FlatList
        // layout={LinearTransition}
        itemLayoutAnimation={LinearTransition}
        scrollEnabled={false}
        data={todayUncompletedHabits}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        style={styles.container}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
      {todayCompletedHabits.length > 0 && (
        <Animated.View
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(300)}
          layout={LinearTransition.springify().stiffness(200).damping(20)}
        >
          <ThemedText type="subtitle">Completed</ThemedText>
          <Animated.FlatList
            skipEnteringExitingAnimations
            // layout={LinearTransition}
            itemLayoutAnimation={LinearTransition}
            scrollEnabled={false}
            data={todayCompletedHabits}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            style={styles.container}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        </Animated.View>
      )}
    </Animated.ScrollView>
  )
}

export default React.memo(TodayRoute)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden'
  },
  listContainer: {
    gap: 12,
    paddingVertical: 12
  }
})
