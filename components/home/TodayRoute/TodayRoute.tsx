import { ThemedText } from '@/components/ui/ThemedText'
import { useStore } from '@/store/store'
import { TodayHabit } from '@/types/types'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { isToday } from 'date-fns'
import React, { useCallback } from 'react'
import { FlatList, ScrollView, StyleSheet, View } from 'react-native'
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated'
import TodayHabitItem from './TodayHabitItem'

interface TodayRouteProps {
  setProgress: React.Dispatch<React.SetStateAction<number>>
  route: string
  setListRef: (key: string) => (ref: FlatList | ScrollView | null) => void
}

const TodayRoute: React.FC<TodayRouteProps> = ({ setProgress, route, setListRef }) => {
  const data = useStore(state => state.habits)
  const tabBarHeight = useBottomTabBarHeight()

  const [todayUncompletedHabits, setTodayUncompletedHabits] = React.useState<TodayHabit[]>([])
  const [todayCompletedHabits, setTodayCompletedHabits] = React.useState<TodayHabit[]>([])
  const renderItem = useCallback(({ item }: { item: TodayHabit }) => {
    return (
      <Animated.View
        entering={FadeIn.duration(300)}
        //  exiting={FadeOut.duration(300)}
      >
        <TodayHabitItem habit={item} />
      </Animated.View>
    )
  }, [])

  React.useEffect(() => {
    const getTodayHabits = () => {
      const today = new Date()

      if (data === null || data.length === 0) return

      const todayHabits = data.filter(habit => {
        return habit.daysOfWeek.includes(today.getDay()) && habit.isArchived === false
      })

      const completedHabits: TodayHabit[] = []
      const uncompletedHabits: TodayHabit[] = []
      const currentProgress = { current: 0, goal: 0 }

      todayHabits.forEach(habit => {
        // check if habit is completed today
        const isHabitCompletedToday = habit.completedDates.some(date => {
          const dateObj = new Date(date.date)
          return isToday(dateObj)
        })

        // if habit is not completed today add it to uncompleted habits
        if (!isHabitCompletedToday) {
          uncompletedHabits.push({
            ...habit,
            currentDate: { date: today.getTime(), times: 0 }
          })
          currentProgress.goal += habit.timesPerDay
        } else {
          habit.completedDates.forEach(dateObj => {
            if (isToday(dateObj.date)) {
              if (dateObj.times === habit.timesPerDay) {
                completedHabits.push({
                  ...habit,
                  currentDate: dateObj
                })
              } else {
                uncompletedHabits.push({
                  ...habit,
                  currentDate: dateObj
                })
              }
              currentProgress.goal += habit.timesPerDay
              currentProgress.current += dateObj.times
            }
          })
        }
      })

      const percentage = (currentProgress.current / currentProgress.goal) * 100 || 0
      setProgress(percentage)
      setTodayUncompletedHabits(uncompletedHabits)
      setTodayCompletedHabits(completedHabits)
    }

    getTodayHabits()
  }, [data, setProgress])

  return (
    <Animated.ScrollView
      ref={setListRef(route)}
      style={styles.scrollView}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.listContainer, { paddingBottom: tabBarHeight * 2 }]}
      overScrollMode="never"
      bounces={false}
    >
      {/* TODO: temporary remove itemLayoutAnimation cause it doesn't work properly on Android [old architecture] */}
      <Animated.FlatList
        // itemLayoutAnimation={LinearTransition}
        scrollEnabled={false}
        // TODO: add sticky header when there is no completed habits
        // StickyHeaderComponent={() => <ThemedText type="subtitle">Uncompleted</ThemedText>}
        ListHeaderComponent={() => <ThemedText type="subtitle">Uncompleted</ThemedText>}
        overScrollMode="never"
        data={todayUncompletedHabits}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        style={styles.container}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyListContainer}>
            <ThemedText style={{ textAlign: 'center' }}>No uncompleted habits</ThemedText>
          </View>
        }
      />
      {todayCompletedHabits.length > 0 && (
        <Animated.View
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(300)}
          layout={LinearTransition.springify().stiffness(200).damping(20)}
        >
          <Animated.FlatList
            skipEnteringExitingAnimations
            // itemLayoutAnimation={LinearTransition}
            ListHeaderComponent={() => <ThemedText type="subtitle">Completed</ThemedText>}
            scrollEnabled={false}
            overScrollMode="never"
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
  scrollView: {
    flex: 1,
    marginTop: 12
  },
  container: {
    flex: 1,
    overflow: 'hidden'
  },
  listContainer: {
    gap: 12
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20
  }
})
