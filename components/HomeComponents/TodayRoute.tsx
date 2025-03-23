import { db } from '@/app/_layout'
import { CONTAINER_PADDING, WINDOW_WIDTH } from '@/constants/global'
import { habits } from '@/db/schema/habits'
import { eq } from 'drizzle-orm'
import { useLiveQuery } from 'drizzle-orm/expo-sqlite'
import React from 'react'
import { SectionList, StyleSheet, View } from 'react-native'
import ReanimatedSwipeable, {
  type SwipeableMethods
} from 'react-native-gesture-handler/ReanimatedSwipeable'
import Reanimated, { Easing, SharedValue, useAnimatedStyle } from 'react-native-reanimated'
import HabitCard from '../common/HabitCard'
import Icon from '../ui/Icon'
import { ThemedText } from '../ui/ThemedText'

// type TodayHabits = ((typeof data)[number] & {
//   completedDate: { date: number; times: number }
// })[]

function LeftAction(prog: SharedValue<number>, drag: SharedValue<number>) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: drag.value - (WINDOW_WIDTH - CONTAINER_PADDING * 2) }]
    }
  })
  return (
    <Reanimated.View style={[styles.leftAction, animatedStyle]}>
      <Icon name="x" color="white" size={38} />
    </Reanimated.View>
  )
}

function RightAction(prog: SharedValue<number>, drag: SharedValue<number>) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: drag.value + WINDOW_WIDTH - CONTAINER_PADDING * 2 }]
    }
  })
  return (
    <Reanimated.View style={[styles.rightAction, animatedStyle]}>
      <Icon name="check" color="white" size={38} />
      <ThemedText type="defaultSemiBold" lightColor="#fff" darkColor="#fff">
        Swipe to complete
      </ThemedText>
    </Reanimated.View>
  )
}

const TodayRoute = () => {
  // where
  const { data, error, updatedAt } = useLiveQuery(db.select().from(habits))
  type TodayHabit = ((typeof data)[number] & {
    currentDate: { date: number; times: number }
  })[]

  const [todayUncompletedHabits, setTodayUncompletedHabits] = React.useState<TodayHabit>([])
  const [todayCompletedHabits, setTodayCompletedHabits] = React.useState<TodayHabit>([])

  const sections = React.useMemo(() => {
    return [
      {
        title: '',
        data: todayUncompletedHabits
      },
      {
        title: todayCompletedHabits.length > 0 ? 'Completed' : '',
        data: todayCompletedHabits
      }
    ]
  }, [todayCompletedHabits, todayUncompletedHabits])

  const handleSwipe = async (
    direction: 'left' | 'right',
    swipeable: SwipeableMethods,
    habit: TodayHabit[number]
  ) => {
    if (direction === 'right') {
      const updatedDates = habit.completedDates.find(el => el.date === habit.currentDate.date)
      console.log(updatedDates)
      console.log(updatedDates === habit.currentDate)

      if (updatedDates) {
        if (updatedDates.times < habit.timesPerDay) updatedDates.times += 1
      } else {
        habit.completedDates.push({ date: new Date().getTime(), times: 1 })
      }

      await db
        .update(habits)
        .set({
          completedDates: habit.completedDates
        })
        .where(eq(habits.id, habit.id))

      swipeable.close()
    } else {
      const updatedDates = habit.completedDates.find(el => el.date === habit.currentDate.date)
      console.log(updatedDates)

      if (updatedDates && updatedDates.times > 0) {
        updatedDates.times -= 1
        console.log(updatedDates)
      }

      await db
        .update(habits)
        .set({
          completedDates: habit.completedDates
        })
        .where(eq(habits.id, habit.id))

      swipeable.close()
    }
  }

  React.useEffect(() => {
    console.log(data)

    const getTodayHabits = () => {
      const today = new Date()
      const currentDay = today.getDay()

      // Фильтруем привычки, которые относятся к сегодняшнему дню
      const todayHabits = data.filter(habit => habit.daysOfWeek.includes(currentDay))

      const completedHabits: TodayHabit = []
      const uncompletedHabits: TodayHabit = []

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
        }
      })

      setTodayUncompletedHabits(uncompletedHabits)
      setTodayCompletedHabits(completedHabits)
    }

    getTodayHabits()
  }, [data])

  return (
    <SectionList
      sections={sections}
      data={data}
      renderItem={({ item: habit, section }) => {
        return (
          <View key={habit.id} style={styles.renderItemContainer}>
            <HabitCard
              color={habit.color}
              title={habit.title}
              progress={habit.currentDate.times}
              goal={habit.timesPerDay}
            />
            <ReanimatedSwipeable
              containerStyle={StyleSheet.absoluteFillObject}
              renderRightActions={section.title === 'Completed' ? undefined : RightAction}
              overshootRight={false}
              renderLeftActions={LeftAction}
              overshootLeft={false}
              friction={2}
              animationOptions={{ duration: 600, easing: Easing.linear }}
              enableTrackpadTwoFingerGesture
              onSwipeableOpen={(direction: 'left' | 'right', swipeable: SwipeableMethods) =>
                handleSwipe(direction, swipeable, habit)
              }
            />
            <View style={styles.cardOverlay} />
          </View>
        )
      }}
      renderSectionHeader={({ section: { title } }) => (
        <ThemedText type="subtitle">{title}</ThemedText>
      )}
      style={styles.sectionList}
      contentContainerStyle={styles.sectionContainer}
      showsVerticalScrollIndicator={false}
    />
  )
}

export default TodayRoute

const styles = StyleSheet.create({
  sectionList: { flex: 1 },
  sectionContainer: {
    gap: 12,
    paddingVertical: 12,
    paddingBottom: 80
  },
  renderItemContainer: {
    width: '100%',
    overflow: 'hidden',
    borderRadius: 16,
    position: 'relative'
  },
  rightAction: {
    backgroundColor: '#15d18e',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    paddingLeft: 16,
    justifyContent: 'flex-start',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16
  },
  leftAction: {
    backgroundColor: '#f75555',
    height: '100%',
    width: '100%',
    alignItems: 'flex-end',
    paddingRight: 16,
    justifyContent: 'center',
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16
  },
  cardOverlay: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.001)',
    opacity: 0.1,
    zIndex: 100,
    top: 0,
    bottom: 0,
    left: '10%',
    right: '10%'
  }
})
