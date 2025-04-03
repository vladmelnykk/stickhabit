import Header from '@/components/common/Header'
import DateTimePickerIOS from '@/components/HabitComponents/DateTimePickerIOS'
import ListColorItem from '@/components/HabitComponents/ListColorItem'
import ReminderCard from '@/components/HabitComponents/ReminderCard'
import WeekdaySelector from '@/components/HabitComponents/WeekdaySelector'
import Checkbox from '@/components/ui/Checkbox'
import Icon from '@/components/ui/Icon'
import Input from '@/components/ui/Input'
import ThemedButton from '@/components/ui/ThemedButton'
import { ThemedText } from '@/components/ui/ThemedText'
import { Colors } from '@/constants/Colors'
import { FontFamily } from '@/constants/FontFamily'
import { CONTAINER_PADDING } from '@/constants/global'
import { COLOR_WHEEL, HabitColors } from '@/constants/HabitColors'
import { habits } from '@/db/schema/habits'
import { useColorScheme } from '@/hooks/useColorScheme'
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types'
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker'
import * as Notifications from 'expo-notifications'
import { router } from 'expo-router'
import React, { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import {
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View
} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import Animated, { FadeInUp } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'
import { db } from './_layout'
const BottomSheetColorPicker = lazy(() => import('@/components/common/BottomSheetColorPicker'))

const COLORS = [...HabitColors, COLOR_WHEEL]
const DAYS = 7
const MAX_REMINDERS = 3

async function scheduleHabitNotification(
  title: string,
  body: string,
  time: Date,
  daysOfWeek: number[]
) {
  for (const day of daysOfWeek) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: 'default'
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: day + 1,
        hour: time.getHours(),
        minute: time.getMinutes()
      }
    })
  }
}

const Page = () => {
  const theme = useColorScheme()
  const insets = useSafeAreaInsets()
  const bottomSheetRef = useRef<BottomSheetMethods>(null)

  const nameValue = useRef<string>('')
  const goalValue = useRef<string>('')
  const [color, setColor] = useState<string | null>(null)

  const [isAllDaysSelected, setIsAllDaysSelected] = useState(false)
  const [selectedDays, setSelectedDays] = useState<boolean[]>(Array(DAYS).fill(true))

  const [isReminderEnabled, setIsReminderEnabled] = useState(false)

  const [reminders, setReminders] = useState<Date[]>([])
  const [showIosDatePicker, setShowIosDatePicker] = useState(false)

  useEffect(() => {
    if (selectedDays.every(day => day)) {
      setIsAllDaysSelected(true)
    } else {
      setIsAllDaysSelected(false)
    }
  }, [selectedDays])

  const renderColorListItem = useCallback(
    ({ index, item }: { index: number; item: string }) => {
      return (
        <ListColorItem
          index={index}
          item={item}
          setColor={setColor}
          color={color}
          bottomSheetRef={bottomSheetRef}
        />
      )
    },
    [color]
  )

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

  const addReminder = (date: Date) => {
    const newTime = date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit'
    })

    const isDuplicate = reminders.some(reminder => {
      const existingTime = reminder.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
      return existingTime === newTime
    })

    if (!isDuplicate) {
      setReminders(prev => [...prev, date].sort((a, b) => a.getTime() - b.getTime()))
    } else {
      Toast.show({
        type: 'error',
        text1: 'Oops!',
        text2: 'Reminder already exists'
      })
    }
  }

  const handleDateChangeAndroid: React.ComponentProps<typeof DateTimePicker>['onChange'] = (
    { type },
    date
  ) => {
    if (type === 'set' && date) {
      addReminder(date)
    }
  }

  const handleAddReminder = () => {
    if (reminders.length >= MAX_REMINDERS) {
      Toast.show({
        type: 'error',
        text1: 'Oops!',
        text2: `You can only add up to ${MAX_REMINDERS} reminders`
      })
      return
    }

    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: new Date(),
        mode: 'time',
        onChange: handleDateChangeAndroid
      })
    } else {
      setShowIosDatePicker(true)
    }
  }

  const confirmDateIOS = (date: Date | null) => {
    if (date) {
      addReminder(date)
    }
    setShowIosDatePicker(false)
  }

  const toggleDatePicker = () => {
    setShowIosDatePicker(prev => !prev)
  }

  const handleRemoveReminder = (index: number) => {
    setReminders(prev => prev.filter((_, i) => i !== index))
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

    const notificationTime = reminders.map(reminder => reminder.getTime())
    const habitData = {
      title: habitName,
      timesPerDay: goal,
      color: color!,
      daysOfWeek: daysOfWeek,
      notificationTime: isReminderEnabled ? notificationTime : [],
      completedDates: [],
      createdAt: new Date().getTime()
    } satisfies typeof habits.$inferInsert

    console.log('Saving habit:', habitData)

    try {
      await db.insert(habits).values(habitData)

      Toast.show({ type: 'success', text1: 'Success', text2: 'Habit saved successfully!' })

      if (isReminderEnabled) {
        reminders.forEach(async reminder => {
          await scheduleHabitNotification(
            `Time for «${habitName}»`,
            'Stay consistent with your habit!',
            reminder,
            daysOfWeek
          )
        })
      }

      router.back()
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        text2: `Failed to save habit: ${error}`
      })
    }
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar backgroundColor={Colors[theme].background} />
      <ScrollView
        automaticallyAdjustKeyboardInsets
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContainer]}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
      >
        <Header title="Create Habit" leftIcon="x" onLeftPress={handleLeftIconPress} />

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
          <FlatList
            data={COLORS}
            extraData={color}
            scrollEnabled={false}
            keyExtractor={item => item}
            numColumns={5}
            getItemLayout={(data, index) => ({
              length: 50,
              offset: 50 * Math.floor(index / 5),
              index
            })}
            style={styles.list}
            contentContainerStyle={[styles.listContainer]}
            columnWrapperStyle={styles.listColumnWrapper}
            renderItem={renderColorListItem}
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

        {Platform.OS === 'ios' && showIosDatePicker ? null : (
          <View style={styles.rowContainer}>
            <ThemedText type="subtitle">Set Reminder</ThemedText>
            <Switch
              value={isReminderEnabled}
              trackColor={{ true: Colors[theme].tint }}
              thumbColor={Colors.dark.text}
              onValueChange={setIsReminderEnabled}
            />
          </View>
        )}

        {isReminderEnabled && !showIosDatePicker && (
          <View style={styles.sectionContainer}>
            <TouchableOpacity style={styles.rowContainer} onPress={handleAddReminder}>
              <ThemedText
                lightColor={
                  reminders.length >= MAX_REMINDERS ? Colors.light.textSecondary : Colors.light.tint
                }
                darkColor={
                  reminders.length >= MAX_REMINDERS ? Colors.dark.textSecondary : Colors.dark.tint
                }
                style={[styles.addReminderText]}
              >
                Add new reminder
              </ThemedText>
              <Icon
                name="plus-circle"
                color={
                  reminders.length >= MAX_REMINDERS
                    ? Colors.light.textSecondary
                    : Colors[theme].tint
                }
              />
            </TouchableOpacity>

            <View style={styles.sectionContainer}>
              {reminders.map((item, index) => (
                <ReminderCard key={index} time={item} onPress={() => handleRemoveReminder(index)} />
              ))}
            </View>
          </View>
        )}

        {isReminderEnabled && showIosDatePicker && (
          <DateTimePickerIOS
            // onChange={handleDateChangeIOS}
            toggleDatePicker={toggleDatePicker}
            confirmDate={confirmDateIOS}
          />
        )}
        <ThemedButton title="Create" onPress={handleSave} />
      </ScrollView>

      <Suspense fallback={null}>
        <BottomSheetColorPicker setColor={setColor} ref={bottomSheetRef} />
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
