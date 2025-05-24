import BottomSheet from '@/components/bottomSheet/BottomSheet'
import BottomSheetHeader from '@/components/bottomSheet/BottomSheetHeader'
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
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
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
      ? t('habit.toast.validation.name')
      : goal <= 0 || isNaN(goal)
      ? t('habit.toast.validation.goal')
      : !color
      ? t('habit.toast.validation.color')
      : !selectedDays.includes(true)
      ? t('habit.toast.validation.days')
      : null

    if (validationError) {
      Toast.show({
        type: 'error',
        text1: t('habit.toast.validation.error'),
        text2: validationError
      })
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

      Toast.show({
        type: 'success',
        text1: t('toast.success'),
        text2: t('habit.toast.create.success')
      })
      router.back()
    } catch {
      Toast.show({
        type: 'error',
        text1: t('toast.somethingWentWrong'),
        text2: t('habit.toast.create.error')
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
      <Header title={t('habit.add.title')} leftIcon="x" onLeftPress={handleLeftIconPress} />
      <ScrollView
        automaticallyAdjustKeyboardInsets
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContainer]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={styles.sectionContainer} entering={FadeInUp}>
          <ThemedText type="subtitle">{t('habit.name')}</ThemedText>
          <Input placeholder={t('habit.name')} onChangeText={text => (nameValue.current = text)} />
        </Animated.View>

        <Animated.View style={styles.sectionContainer} entering={FadeInUp}>
          <ThemedText type="subtitle">{t('habit.goal')}</ThemedText>
          <Input
            placeholder={t('habit.goalPlaceholder')}
            keyboardType="number-pad"
            onChangeText={text => (goalValue.current = text)}
          />
        </Animated.View>

        <ThemedText type="subtitle">{t('habit.color')}</ThemedText>

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
          <ThemedText type="subtitle">{t('habit.days')}</ThemedText>
          <View style={styles.rowContainer}>
            <ThemedText>{t('habit.add.allDay')}</ThemedText>
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

        <ThemedButton title={t('habit.add.create')} primary onPress={handleSave} />
      </ScrollView>

      <Suspense fallback={null}>
        <BottomSheet ref={bottomSheetRef}>
          <BottomSheetHeader title={t('bottomSheet.title.color')} />
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
