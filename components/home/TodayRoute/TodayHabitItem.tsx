import ProgressHabitCard from '@/components/home/TodayRoute/ProgressHabitCard'
import Icon from '@/components/ui/Icon'
import { ThemedText } from '@/components/ui/ThemedText'
import { CONTAINER_PADDING, WINDOW_WIDTH } from '@/constants/global'
import { habitSchema } from '@/db/schema/habits'
import { useDatabase } from '@/providers/DatabaseProvider'
import { TodayHabit } from '@/types/types'
import { eq } from 'drizzle-orm'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import ReanimatedSwipeable, {
  type SwipeableMethods
} from 'react-native-gesture-handler/ReanimatedSwipeable'
import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated'
import Toast from 'react-native-toast-message'
interface HabitItemProps {
  habit: TodayHabit
}

function LeftAction(prog: SharedValue<number>, drag: SharedValue<number>) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: drag.value - (WINDOW_WIDTH - CONTAINER_PADDING * 2) }]
    }
  })
  return (
    <Animated.View style={[styles.leftAction, animatedStyle]}>
      <Icon name="x" color="white" size={38} />
    </Animated.View>
  )
}

function RightAction(prog: SharedValue<number>, drag: SharedValue<number>) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: drag.value + WINDOW_WIDTH - CONTAINER_PADDING * 2 }]
    }
  })

  return (
    <Animated.View style={[styles.rightAction, animatedStyle]}>
      <Icon name="check" color="white" size={38} />
      <ThemedText type="defaultSemiBold" lightColor="#fff" darkColor="#fff">
        Swipe to complete
      </ThemedText>
    </Animated.View>
  )
}

const TodayHabitItem: React.FC<HabitItemProps> = ({ habit }) => {
  const swipeableRef = React.useRef<SwipeableMethods>(null)

  const { db } = useDatabase()
  const handleSwipe = async (direction: string) => {
    if (direction === 'left') {
      const updatedDates = habit.completedDates.find(el => el.date === habit.currentDate.date)

      if (updatedDates) {
        if (updatedDates.times < habit.timesPerDay) {
          updatedDates.times += 1
          if (updatedDates.times === habit.timesPerDay) {
            Toast.show({
              type: 'success',
              text1: 'Success!',
              text2: `You have completed ${habit.title}`
            })
          }
        } else {
          Toast.show({
            type: 'error',
            text1: 'Oops!',
            text2: 'You have already completed this habit today'
          })
          swipeableRef.current?.close()
          return
        }
      } else {
        habit.completedDates.push({ date: new Date().getTime(), times: 1 })
      }

      await db
        .update(habitSchema)
        .set({
          completedDates: habit.completedDates
        })
        .where(eq(habitSchema.id, habit.id))
    } else if (
      habit.completedDates.some(el => el.date === habit.currentDate.date && el.times > 0)
    ) {
      const updatedDates = habit.completedDates.find(el => el.date === habit.currentDate.date)!

      updatedDates.times -= 1
      if (updatedDates.times === 0) {
        habit.completedDates.splice(habit.completedDates.indexOf(updatedDates), 1)
      }

      await db
        .update(habitSchema)
        .set({
          completedDates: habit.completedDates
        })
        .where(eq(habitSchema.id, habit.id))
    }
    swipeableRef.current?.close()
  }

  return (
    <View style={styles.renderItemContainer}>
      <ProgressHabitCard
        color={habit.color}
        title={habit.title}
        progress={habit.currentDate.times}
        goal={habit.timesPerDay}
      />
      <ReanimatedSwipeable
        ref={swipeableRef}
        containerStyle={StyleSheet.absoluteFillObject}
        renderRightActions={RightAction}
        overshootRight={false}
        renderLeftActions={LeftAction}
        overshootLeft={false}
        friction={1}
        enableTrackpadTwoFingerGesture
        onSwipeableOpen={handleSwipe}
      />
      <View style={styles.cardOverlay} />
    </View>
  )
}

export default TodayHabitItem

const styles = StyleSheet.create({
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
