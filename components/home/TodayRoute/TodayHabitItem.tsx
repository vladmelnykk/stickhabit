import ProgressHabitCard from '@/components/home/TodayRoute/ProgressHabitCard'
import Icon from '@/components/ui/Icon'
import { ThemedText } from '@/components/ui/ThemedText'
import { DANGER_COLOR } from '@/constants/Colors'
import { CONTAINER_PADDING, WINDOW_WIDTH } from '@/constants/global'
import { habitSchema } from '@/db/schema/habits'
import { useDatabase } from '@/providers/DatabaseProvider'
import { TodayHabit } from '@/types/global'
import { eq } from 'drizzle-orm'
import { router } from 'expo-router'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, StyleSheet, View } from 'react-native'
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

  const { t } = useTranslation()
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
              text1: t('toast.success'),
              text2: t('home.toast.today.success', { title: habit.title })
            })
          }
        } else {
          Toast.show({
            type: 'error',
            text1: t('toast.oops'),
            text2: t('home.toast.today.error')
          })
          swipeableRef.current?.close()
          return
        }
      } else {
        habit.completedDates.push({ date: new Date().getTime(), times: 1 })
        if (habit.timesPerDay === 1) {
          Toast.show({
            type: 'success',
            text1: t('toast.success'),
            text2: t('home.toast.today.success', { title: habit.title })
          })
        }
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
      const updatedDates = habit.currentDate

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
    <Pressable
      style={styles.renderItemContainer}
      onLongPress={() => router.navigate(`/habit/${habit.id}`)}
    >
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
    </Pressable>
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
    backgroundColor: DANGER_COLOR,
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
