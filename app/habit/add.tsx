import BottomSheet from '@/components/bottomSheet/BottomSheet'
import Header from '@/components/common/Header'
import ColorList from '@/components/habit-form/ColorList'
import ReminderControls from '@/components/habit-form/ReminderControls'
import WeekdaySelector from '@/components/habit-form/WeekdaySelector'
import Checkbox from '@/components/ui/Checkbox'
import Input from '@/components/ui/Input'
import ThemedButton from '@/components/ui/ThemedButton'
import { ThemedText } from '@/components/ui/ThemedText'
import { Colors } from '@/constants/Colors'
import { FontFamily } from '@/constants/FontFamily'
import { CONTAINER_PADDING } from '@/constants/global'
import { habitSchema } from '@/db/schema/habits'
import { useColorScheme } from '@/hooks/useColorScheme'
import { useDatabase } from '@/providers/DatabaseProvider'
import { useStore } from '@/store/store'
import { createHabit } from '@/utils/habit'
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types'
import { router } from 'expo-router'
import React, { lazy, Suspense, useCallback, useRef, useState } from 'react'
import { StatusBar, StyleSheet, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import Animated, { FadeInUp } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'
const ColorPicker = lazy(() => import('@/components/bottomSheet/ColorPicker'))

const DAYS = 7

const Page = () => {
  const habits = useStore(state => state.habits)
  const theme = useColorScheme()
  const { db } = useDatabase()
  const insets = useSafeAreaInsets()
  const bottomSheetRef = useRef<BottomSheetMethods>(null)

  const nameValue = useRef<string>('')
  const goalValue = useRef<string>('')
  const [color, setColor] = useState<string | null>(null)

  const [selectedDays, setSelectedDays] = useState<boolean[]>(Array(DAYS).fill(true))

  const [isReminderEnabled, setIsReminderEnabled] = useState(false)

  const [reminders, setReminders] = useState<Date[]>([])

  const isAllDaysSelected = selectedDays.every(day => day) ? true : false

  const handleCheckboxChange = (value: boolean) => {
    setSelectedDays(Array(DAYS).fill(value))
  }

  const handleLeftIconPress = () => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/')
    }
  }

  const handleSave = async () => {
    const habitName = nameValue.current?.trim() || ''
    const goal = Number(goalValue.current) || 0

    const validationError = !habitName
      ? 'Please enter a habit name'
      : goal <= 0 || isNaN(goal)
      ? 'Please enter a valid goal'
      : !color
      ? 'Please select a color'
      : !selectedDays.includes(true)
      ? 'Please select at least one day'
      : null

    if (validationError) {
      Toast.show({ type: 'error', text1: 'Validation Error', text2: validationError })
      return
    }

    // Convert selected days to array of numbers
    // Sun - 0, Mon - 1, Tue - 2, Wed - 3, Thu - 4, Fri - 5, Sat - 6
    const daysOfWeek = selectedDays
      .map((isSelected, index) => (isSelected ? index : null))
      .filter(day => day !== null)

    // Convert reminders to array of timestamps in milliseconds
    const notificationTime = reminders.map(reminder => reminder.getTime())

    const habitData = {
      title: habitName,
      timesPerDay: goal,
      color: color!,
      daysOfWeek: daysOfWeek,
      notificationTime: isReminderEnabled ? notificationTime : [],
      completedDates: [],
      createdAt: new Date().getTime(),
      position: habits.length
    } satisfies typeof habitSchema.$inferInsert

    try {
      await createHabit(db, habitData, isReminderEnabled ? reminders : [])

      Toast.show({ type: 'success', text1: 'Success', text2: 'Habit saved successfully!' })
      router.back()
    } catch {
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        text2: `Failed to save habit`
      })
    }
  }

  const handleColorSelect = useCallback((color: string | null) => {
    setColor(color)
    bottomSheetRef.current?.close()
  }, [])

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar backgroundColor={Colors[theme].background} />
      <Header title="Create Habit" leftIcon="x" onLeftPress={handleLeftIconPress} />
      <ScrollView
        automaticallyAdjustKeyboardInsets
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContainer]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={styles.sectionContainer} entering={FadeInUp}>
          <ThemedText type="subtitle">Habit Name</ThemedText>
          <Input placeholder="Habit Name" onChangeText={text => (nameValue.current = text)} />
        </Animated.View>

        <Animated.View style={styles.sectionContainer} entering={FadeInUp}>
          <ThemedText type="subtitle">How many times a day?</ThemedText>
          <Input
            placeholder="Your Goal"
            keyboardType="number-pad"
            onChangeText={text => (goalValue.current = text)}
          />
        </Animated.View>

        <ThemedText type="subtitle">Color</ThemedText>

        <View>
          <ColorList
            color={color}
            onColorWheelPress={() => {
              if (bottomSheetRef.current) {
                bottomSheetRef.current.expand()
              }
            }}
            onColorPress={item => {
              setColor(prev => (prev === item ? null : item))
            }}
          />
        </View>

        <View style={styles.rowContainer}>
          <ThemedText type="subtitle">Days</ThemedText>
          <View style={styles.rowContainer}>
            <ThemedText>All day</ThemedText>
            <Checkbox value={isAllDaysSelected} onValueChange={handleCheckboxChange} />
          </View>
        </View>
        <WeekdaySelector selectedDays={selectedDays} setSelectedDays={setSelectedDays} />

        <ReminderControls
          isReminderEnabled={isReminderEnabled}
          setIsReminderEnabled={setIsReminderEnabled}
          reminders={reminders}
          setReminders={setReminders}
        />

        <ThemedButton title="Create" primary onPress={handleSave} />
      </ScrollView>

      <Suspense fallback={null}>
        <BottomSheet ref={bottomSheetRef}>
          <ColorPicker onPickColor={handleColorSelect} />
        </BottomSheet>
      </Suspense>
    </View>
  )
}

export default Page

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 8,
    paddingHorizontal: CONTAINER_PADDING,
    paddingBottom: CONTAINER_PADDING
  },
  scrollView: { flex: 1 },
  scrollContainer: {
    gap: 18,
    paddingBottom: 20
  },
  sectionContainer: { gap: 8 },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8
  },
  list: { flexGrow: 0 },
  listContainer: { gap: 12, flexShrink: 1 },
  listColumnWrapper: { justifyContent: 'space-between' },
  addReminderText: {
    fontSize: 16,
    fontFamily: FontFamily.RobotoLight
  }
})
